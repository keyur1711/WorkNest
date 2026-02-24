const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const TourBooking = require('../models/TourBooking');
const Space = require('../models/Space');
const Agreement = require('../models/Agreement');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const router = express.Router();
router.post(
  '/',
  auth,
  requireRole(['user']),
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
      const dateObj = new Date(bookingDate);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ message: 'Invalid booking date format' });
      }
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
      const startOfDay = new Date(bookingDateOnly);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(bookingDateOnly);
      endOfDay.setHours(23, 59, 59, 999);
      const existingBooking = await Booking.findOne({
        space: spaceId,
        bookingDate: {
          $gte: startOfDay,
          $lte: endOfDay
        },
        paymentStatus: 'paid',
        status: { $ne: 'cancelled' }
      });
      if (existingBooking) {
        return res.status(400).json({
          message: 'This date is already booked. Please select another date.'
        });
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

router.get('/space/:spaceId/unavailable-dates', async (req, res) => {
  try {
    const { spaceId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({
      space: spaceId,
      bookingDate: { $gte: today },
      paymentStatus: 'paid',
      status: { $ne: 'cancelled' }
    }).select('bookingDate');

    const unavailableDates = bookings.map((b) =>
      b.bookingDate.toISOString().split('T')[0]
    );

    return res.json({ unavailableDates });
  } catch (error) {
    console.error('Get unavailable dates error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const includeCancelled = req.query.includeCancelled === 'true';
    const query = { user: req.user.id };
    if (!includeCancelled) {
      query.status = { $ne: 'cancelled' };
    }
    const bookings = await Booking.find(query)
      .populate('space', 'name locationText pricePerDay images')
      .sort({ bookingDate: -1 });
    return res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.get('/:id/agreement', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('space', 'name city ownerUser');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const agreement = await Agreement.findOne({ space: booking.space }).sort({ updatedAt: -1 });
    if (!agreement && !booking.agreementTextSnapshot) {
      return res.status(404).json({ message: 'No agreement available for this space' });
    }
    const responseAgreement = agreement
      ? {
          id: agreement._id,
          title: agreement.title,
          version: agreement.version,
          content: agreement.content,
          documentUrl: agreement.documentUrl,
          status: agreement.status,
          updatedAt: agreement.updatedAt
        }
      : null;
    return res.json({
      agreement: responseAgreement,
      bookingAgreement: {
        accepted: booking.agreementAccepted,
        acceptedAt: booking.agreementAcceptedAt,
        version: booking.agreementVersion,
        text: booking.agreementTextSnapshot,
        agreementId: booking.agreementId,
        agreementUrl: booking.agreementUrl
      }
    });
  } catch (error) {
    console.error('Get booking agreement error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.post(
  '/:id/agreement/accept',
  auth,
  requireRole(['user']),
  [
    body('agreementText').notEmpty().withMessage('Agreement text is required'),
    body('agreementVersion').optional().isString().withMessage('Agreement version must be a string'),
    body('agreementId').optional().isString().withMessage('Agreement ID must be a string')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      if (booking.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      if (booking.status === 'cancelled') {
        return res.status(400).json({ message: 'Cannot accept agreement for a cancelled booking' });
      }
      let agreement;
      if (req.body.agreementId) {
        agreement = await Agreement.findById(req.body.agreementId);
        if (!agreement) {
          return res.status(404).json({ message: 'Agreement not found' });
        }
        if (agreement.space.toString() !== booking.space.toString()) {
          return res.status(400).json({ message: 'Agreement does not belong to this space' });
        }
      } else {
        agreement = await Agreement.findOne({ space: booking.space }).sort({ updatedAt: -1 });
      }
      const agreementVersion = req.body.agreementVersion || agreement?.version || '1.0';
      const agreementText = req.body.agreementText;
      booking.agreementAccepted = true;
      booking.agreementAcceptedAt = new Date();
      booking.agreementVersion = agreementVersion;
      booking.agreementTextSnapshot = agreementText;
      booking.agreementId = agreement?._id || booking.agreementId;
      booking.agreementUrl = agreement?.documentUrl || booking.agreementUrl;
      await booking.save();
      return res.json({
        message: 'Agreement accepted',
        booking: {
          id: booking._id,
          agreementAccepted: booking.agreementAccepted,
          agreementAcceptedAt: booking.agreementAcceptedAt,
          agreementVersion: booking.agreementVersion,
          agreementTextSnapshot: booking.agreementTextSnapshot,
          agreementId: booking.agreementId,
          agreementUrl: booking.agreementUrl
        }
      });
    } catch (error) {
      console.error('Accept agreement error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.user.toString() !== req.user.id.toString()) {
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
router.post(
  '/tour',
  auth,
  requireRole(['user']),
  [
    body('spaceId').notEmpty().withMessage('Space ID is required'),
    body('tourDate')
      .notEmpty().withMessage('Tour date is required')
      .custom((value) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
        if (!dateRegex.test(value)) {
          throw new Error('Invalid date format');
        }
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date');
        }
        return true;
      }),
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
      if (!spaceId) {
        return res.status(400).json({ message: 'Space ID is required' });
      }
      const space = await Space.findById(spaceId);
      if (!space) {
        return res.status(404).json({ message: 'Space not found' });
      }
      let parsedTourDate;
      try {
        parsedTourDate = new Date(tourDate);
        if (isNaN(parsedTourDate.getTime())) {
          return res.status(400).json({ message: 'Invalid tour date format' });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (parsedTourDate < today) {
          return res.status(400).json({ message: 'Tour date cannot be in the past' });
        }
      } catch (dateError) {
        return res.status(400).json({ message: 'Invalid tour date format' });
      }
      const tourBooking = await TourBooking.create({
        user: req.user.id,
        space: spaceId,
        spaceName: space.name,
        spaceLocation: space.locationText || space.city || 'Location not specified',
        tourDate: parsedTourDate,
        tourTime,
        contactName,
        contactEmail,
        contactPhone,
        notes: notes || '',
        status: 'pending'
      });
      const populatedTour = await TourBooking.findById(tourBooking._id)
        .populate('space', 'name locationText')
        .populate('user', 'fullName email');
      return res.status(201).json({ tourBooking: populatedTour });
    } catch (error) {
      console.error('Create tour booking error:', error);
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          message: 'Validation failed',
          errors: validationErrors
        });
      }
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Duplicate tour booking' });
      }
      return res.status(500).json({
        message: error.message || 'Server error while creating tour booking'
      });
    }
  }
);
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
router.patch('/tour/:id/cancel', auth, requireRole(['user']), async (req, res) => {
  try {
    const tourBooking = await TourBooking.findById(req.params.id);
    if (!tourBooking) {
      return res.status(404).json({ message: 'Tour booking not found' });
    }
    if (tourBooking.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (tourBooking.status === 'cancelled') {
      return res.status(400).json({ message: 'Tour booking is already cancelled' });
    }
    if (tourBooking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed tour' });
    }
    tourBooking.status = 'cancelled';
    await tourBooking.save();
    const populatedTour = await TourBooking.findById(tourBooking._id)
      .populate('space', 'name locationText')
      .populate('user', 'fullName email');
    return res.json({ tourBooking: populatedTour });
  } catch (error) {
    console.error('Cancel tour booking error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('space', 'name locationText pricePerDay images amenities')
      .populate('user', 'fullName email phone');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.user._id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    return res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;