const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const TourBooking = require('../models/TourBooking');
const Space = require('../models/Space');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create a booking
router.post(
  '/',
  auth,
  [
    body('spaceId').notEmpty().withMessage('Space ID is required'),
    body('type').isIn(['Hot Desk', 'Dedicated Desk', 'Private Office', 'Meeting Room']).withMessage('Invalid booking type'),
    body('bookingDate').notEmpty().withMessage('Valid booking date is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { spaceId, type, bookingDate } = req.body;

      // Validate date format (accepts both YYYY-MM-DD and ISO8601)
      const dateObj = new Date(bookingDate);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ message: 'Invalid booking date format' });
      }

      // Ensure date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const bookingDateOnly = new Date(dateObj);
      bookingDateOnly.setHours(0, 0, 0, 0);
      
      if (bookingDateOnly < today) {
        return res.status(400).json({ message: 'Booking date cannot be in the past' });
      }

      const space = await Space.findById(spaceId);
      if (!space) {
        return res.status(404).json({ message: 'Space not found' });
      }

      const booking = await Booking.create({
        user: req.user.id,
        space: spaceId,
        spaceName: space.name,
        spaceLocation: space.locationText || space.city,
        type,
        bookingDate: dateObj,
        pricePerDay: space.pricePerDay,
        totalAmount: space.pricePerDay,
        status: 'pending',
        paymentStatus: 'pending'
      });

      const populatedBooking = await Booking.findById(booking._id)
        .populate('space', 'name locationText pricePerDay')
        .populate('user', 'fullName email');

      return res.status(201).json({ booking: populatedBooking });
    } catch (error) {
      console.error('Create booking error:', error);
      
      // Provide more specific error messages
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ 
          message: validationErrors.join(', '),
          errors: validationErrors
        });
      }
      
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid space ID format' });
      }
      
      return res.status(500).json({ 
        message: error.message || 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
);

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('space', 'name locationText pricePerDay images')
      .sort({ bookingDate: -1 });

    return res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('space', 'name locationText pricePerDay images amenities')
      .populate('user', 'fullName email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    if (booking.paymentStatus === 'paid') {
      booking.paymentStatus = 'refunded';
    }
    await booking.save();

    return res.json({ booking });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create tour booking
router.post(
  '/tour',
  auth,
  [
    body('spaceId').notEmpty().withMessage('Space ID is required'),
    body('tourDate').isISO8601().withMessage('Valid tour date is required'),
    body('tourTime').notEmpty().withMessage('Tour time is required'),
    body('contactName').trim().notEmpty().withMessage('Contact name is required'),
    body('contactEmail').isEmail().withMessage('Valid email is required'),
    body('contactPhone').trim().notEmpty().withMessage('Contact phone is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { spaceId, tourDate, tourTime, contactName, contactEmail, contactPhone, notes } = req.body;

      const space = await Space.findById(spaceId);
      if (!space) {
        return res.status(404).json({ message: 'Space not found' });
      }

      const tourBooking = await TourBooking.create({
        user: req.user.id,
        space: spaceId,
        spaceName: space.name,
        spaceLocation: space.locationText,
        tourDate: new Date(tourDate),
        tourTime,
        contactName,
        contactEmail,
        contactPhone,
        notes,
        status: 'pending'
      });

      const populatedTour = await TourBooking.findById(tourBooking._id)
        .populate('space', 'name locationText')
        .populate('user', 'fullName email');

      return res.status(201).json({ tourBooking: populatedTour });
    } catch (error) {
      console.error('Create tour booking error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user's tour bookings
router.get('/tour/my-tours', auth, async (req, res) => {
  try {
    const tourBookings = await TourBooking.find({ user: req.user.id })
      .populate('space', 'name locationText images')
      .sort({ tourDate: -1 });

    return res.json({ tourBookings });
  } catch (error) {
    console.error('Get tour bookings error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;