const express = require('express');
const { body, validationResult } = require('express-validator');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Initialize Razorpay instance
let razorpay = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('Razorpay initialized successfully');
  } else {
    console.warn('Razorpay keys not found in environment variables');
  }
} catch (error) {
  console.error('Failed to initialize Razorpay:', error.message);
}

// Create Razorpay order for a booking
router.post(
  '/create-order',
  auth,
  [
    body('bookingId').notEmpty().withMessage('Booking ID is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!razorpay) {
      return res.status(500).json({ 
        message: 'Payment gateway not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables.' 
      });
    }

    try {
      const { bookingId } = req.body;

      // Find the booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Verify booking belongs to the user
      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Check if booking is already paid
      if (booking.paymentStatus === 'paid') {
        return res.status(400).json({ message: 'Booking is already paid' });
      }

      // Validate amount (must be at least 1 rupee = 100 paise)
      if (!booking.totalAmount || booking.totalAmount < 1) {
        return res.status(400).json({ 
          message: 'Invalid booking amount. Minimum amount is ₹1.' 
        });
      }

      // Create Razorpay order
      // Ensure amount is at least 100 paise (₹1) and is an integer
      const amountInPaise = Math.max(Math.round(booking.totalAmount * 100), 100);
      
      const options = {
        amount: amountInPaise, // Convert to paise (Razorpay expects amount in smallest currency unit)
        currency: 'INR',
        receipt: `booking_${booking._id}_${Date.now()}`,
        notes: {
          bookingId: booking._id.toString(),
          userId: req.user.id.toString(),
          spaceName: booking.spaceName || 'Workspace',
          bookingDate: booking.bookingDate ? booking.bookingDate.toISOString() : new Date().toISOString()
        }
      };

      console.log('Creating Razorpay order:', {
        bookingId: booking._id.toString(),
        amount: options.amount,
        currency: options.currency
      });

      const order = await razorpay.orders.create(options);

      // Update booking with Razorpay order ID
      booking.razorpayOrderId = order.id;
      await booking.save();

      return res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      });
    } catch (error) {
      console.error('Create order error:', error);
      console.error('Error details:', {
        message: error.message,
        statusCode: error.statusCode,
        description: error.description,
        field: error.field,
        source: error.source,
        step: error.step,
        reason: error.reason,
        metadata: error.metadata
      });
      
      // Provide more specific error messages
      let errorMessage = 'Failed to create payment order';
      if (error.statusCode === 400) {
        errorMessage = error.description || 'Invalid payment request';
      } else if (error.statusCode === 401) {
        errorMessage = 'Invalid Razorpay API keys. Please check your configuration.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return res.status(500).json({ 
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// Verify payment and update booking
router.post(
  '/verify-payment',
  auth,
  [
    body('bookingId').notEmpty().withMessage('Booking ID is required'),
    body('razorpay_order_id').notEmpty().withMessage('Razorpay order ID is required'),
    body('razorpay_payment_id').notEmpty().withMessage('Razorpay payment ID is required'),
    body('razorpay_signature').notEmpty().withMessage('Razorpay signature is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!razorpay) {
      return res.status(500).json({ 
        message: 'Payment gateway not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables.' 
      });
    }

    try {
      const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      // Find the booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Verify booking belongs to the user
      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Verify the payment signature
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }

      // Verify payment with Razorpay API
      try {
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        
        if (payment.status !== 'captured' && payment.status !== 'authorized') {
          return res.status(400).json({ message: 'Payment not successful' });
        }

        // Update booking with payment details
        booking.razorpayPaymentId = razorpay_payment_id;
        booking.razorpaySignature = razorpay_signature;
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
        await booking.save();

        return res.json({
          success: true,
          message: 'Payment verified and booking confirmed',
          booking: booking
        });
      } catch (razorpayError) {
        console.error('Razorpay payment verification error:', razorpayError);
        return res.status(400).json({ 
          message: 'Payment verification failed',
          error: razorpayError.message 
        });
      }
    } catch (error) {
      console.error('Verify payment error:', error);
      return res.status(500).json({ 
        message: error.message || 'Failed to verify payment' 
      });
    }
  }
);

// Diagnostic endpoint to check Razorpay configuration (for debugging)
router.get('/check-config', (req, res) => {
  res.json({
    hasKeyId: !!process.env.RAZORPAY_KEY_ID,
    hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
    razorpayInitialized: !!razorpay,
    keyIdPrefix: process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.substring(0, 8) + '...' : 'not set',
    message: razorpay 
      ? 'Razorpay is configured correctly' 
      : 'Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file'
  });
});

// Get payment status for a booking
router.get('/status/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify booking belongs to the user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json({
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.status,
      razorpayOrderId: booking.razorpayOrderId,
      razorpayPaymentId: booking.razorpayPaymentId
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    return res.status(500).json({ message: 'Failed to get payment status' });
  }
});

module.exports = router;

