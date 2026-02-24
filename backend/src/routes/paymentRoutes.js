const express = require('express');
const { body, validationResult } = require('express-validator');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Space = require('../models/Space');
const Payment = require('../models/Payment');
const { auth } = require('../middleware/auth');
const router = express.Router();
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
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      const space = await Space.findById(booking.space);
      if (!space) {
        return res.status(404).json({ message: 'Space not found for booking' });
      }
      if (
        booking.user.toString() !== req.user.id.toString() &&
        req.user.role !== 'admin'
      ) {
        console.warn('Payment create-order user mismatch', {
          bookingUser: booking.user.toString(),
          requester: req.user.id.toString(),
          role: req.user.role
        });
      }
      if (booking.paymentStatus === 'paid') {
        return res.status(400).json({ message: 'Booking is already paid' });
      }
      if (booking.status === 'cancelled') {
        return res.status(400).json({ message: 'Cannot pay for a cancelled booking' });
      }
      if (!booking.totalAmount || booking.totalAmount < 1) {
        return res.status(400).json({
          message: 'Invalid booking amount. Minimum amount is ₹1.'
        });
      }
      const amountInPaise = Math.max(Math.round(booking.totalAmount * 100), 100);
      const rawReceipt = `booking_${booking._id.toString()}`;
      const receipt = rawReceipt.slice(0, 40);
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt,
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
      let payment = await Payment.findOne({ booking: booking._id });
      if (!payment) {
        payment = await Payment.create({
          booking: booking._id,
          space: booking.space,
          user: booking.user,
          owner: space.ownerUser,
          amount: booking.totalAmount,
          currency: 'INR',
          razorpayOrderId: order.id,
          status: 'created',
          metadata: { receipt, notes: options.notes }
        });
      } else {
        payment.amount = booking.totalAmount;
        payment.currency = 'INR';
        payment.razorpayOrderId = order.id;
        payment.status = 'created';
        payment.metadata = { receipt, notes: options.notes };
        await payment.save();
      }
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
        description: error.error?.description,
        field: error.error?.field,
        source: error.error?.source,
        step: error.error?.step,
        reason: error.error?.reason,
        metadata: error.error?.metadata
      });
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
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      if (
        booking.user.toString() !== req.user.id.toString() &&
        req.user.role !== 'admin'
      ) {
        console.warn('Payment verify user mismatch (non-blocking)', {
          bookingUser: booking.user.toString(),
          requester: req.user.id.toString(),
          role: req.user.role,
          bookingId: bookingId,
          razorpay_order_id
        });
      }
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');
      if (generatedSignature !== razorpay_signature) {
        await Payment.findOneAndUpdate(
          { booking: booking._id, razorpayOrderId: razorpay_order_id },
          { status: 'failed', failureReason: 'Invalid signature', razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature }
        );
        return res.status(400).json({ message: 'Invalid payment signature' });
      }
      try {
        const paymentInfo = await razorpay.payments.fetch(razorpay_payment_id);
        if (paymentInfo.status !== 'captured' && paymentInfo.status !== 'authorized') {
          await Payment.findOneAndUpdate(
            { booking: booking._id, razorpayOrderId: razorpay_order_id },
            { status: 'failed', failureReason: `Gateway status: ${paymentInfo.status}`, razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature }
          );
          return res.status(400).json({ message: 'Payment not successful' });
        }
        booking.razorpayPaymentId = razorpay_payment_id;
        booking.razorpaySignature = razorpay_signature;
        booking.paymentStatus = 'paid';
        booking.status = booking.status === 'completed' ? booking.status : 'confirmed';
        booking.paidAt = new Date();
        await booking.save();
        await Payment.findOneAndUpdate(
          { booking: booking._id, razorpayOrderId: razorpay_order_id },
          {
            status: 'paid',
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature
          },
          { new: true }
        );
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
router.get('/status/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (
      booking.user.toString() !== req.user.id.toString() &&
      req.user.role !== 'admin'
    ) {
      console.warn('Status check user mismatch', {
        bookingUser: booking.user.toString(),
        requester: req.user.id.toString(),
        role: req.user.role
      });
    }
    let payment = await Payment.findOne({ booking: booking._id }).lean();
    if (booking.paymentStatus !== 'paid' && booking.razorpayOrderId && razorpay) {
      try {
        const orderPayments = await razorpay.orders.fetchPayments(booking.razorpayOrderId);
        const successful = (orderPayments?.items || []).find(
          (p) => p.status === 'captured' || p.status === 'authorized'
        );
        if (successful) {
          await Booking.findByIdAndUpdate(booking._id, {
            paymentStatus: 'paid',
            status: booking.status === 'completed' ? booking.status : 'confirmed',
            razorpayPaymentId: successful.id,
            paidAt: new Date()
          });
          await Payment.findOneAndUpdate(
            { booking: booking._id },
            {
              status: 'paid',
              razorpayPaymentId: successful.id,
              failureReason: null
            },
            { upsert: true }
          );
          payment = await Payment.findOne({ booking: booking._id }).lean();
          booking.paymentStatus = 'paid';
          booking.status = booking.status === 'completed' ? booking.status : 'confirmed';
          booking.razorpayPaymentId = successful.id;
          booking.paidAt = booking.paidAt || new Date();
        }
      } catch (reconErr) {
        console.error('Payment reconciliation error:', reconErr);
      }
    }
    return res.json({
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.status,
      razorpayOrderId: booking.razorpayOrderId,
      razorpayPaymentId: booking.razorpayPaymentId,
      payment
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    return res.status(500).json({ message: 'Failed to get payment status' });
  }
});
router.post('/reconcile', auth, async (req, res) => {
  const { bookingId, paymentId } = req.body || {};
  if (!bookingId || !paymentId) {
    return res.status(400).json({ message: 'bookingId and paymentId are required' });
  }
  if (!razorpay) {
    return res.status(500).json({
      message: 'Payment gateway not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables.'
    });
  }
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (
      booking.user.toString() !== req.user.id.toString() &&
      req.user.role !== 'admin'
    ) {
      console.warn('Manual reconcile user mismatch', {
        bookingUser: booking.user.toString(),
        requester: req.user.id.toString(),
        role: req.user.role
      });
    }
    const paymentInfo = await razorpay.payments.fetch(paymentId);
    if (!paymentInfo) {
      return res.status(404).json({ message: 'Payment not found on gateway' });
    }
    if (paymentInfo.status !== 'captured' && paymentInfo.status !== 'authorized') {
      return res.status(400).json({ message: `Payment not successful (status: ${paymentInfo.status})` });
    }
    if (paymentInfo.order_id) {
      booking.razorpayOrderId = booking.razorpayOrderId || paymentInfo.order_id;
    }
    booking.razorpayPaymentId = paymentId;
    booking.paymentStatus = 'paid';
    booking.status = booking.status === 'completed' ? booking.status : 'confirmed';
    booking.paidAt = booking.paidAt || new Date();
    await booking.save();
    await Payment.findOneAndUpdate(
      { booking: booking._id },
      {
        booking: booking._id,
        space: booking.space,
        user: booking.user,
        owner: booking.owner,
        amount: booking.totalAmount,
        currency: 'INR',
        razorpayOrderId: booking.razorpayOrderId || paymentInfo.order_id,
        razorpayPaymentId: paymentId,
        status: 'paid',
        failureReason: null,
        metadata: { gateway: paymentInfo }
      },
      { upsert: true, new: true }
    );
    return res.json({
      message: 'Reconciled successfully',
      bookingStatus: booking.status,
      paymentStatus: booking.paymentStatus,
      razorpayPaymentId: booking.razorpayPaymentId,
      razorpayOrderId: booking.razorpayOrderId
    });
  } catch (error) {
    console.error('Manual reconcile error:', error);
    return res.status(500).json({ message: 'Failed to reconcile payment', error: error.message });
  }
});
module.exports = router;