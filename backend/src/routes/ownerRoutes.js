const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Space = require('../models/Space');
const User = require('../models/User');
const Booking = require('../models/Booking');
const TourBooking = require('../models/TourBooking');
const Agreement = require('../models/Agreement');
const Review = require('../models/Review');
const SupportTicket = require('../models/SupportTicket');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const router = express.Router();
router.use(auth);
router.use(requireRole(['workspace_owner', 'admin']));
const getOwnerId = (req) => {
  if (req.user.role === 'admin' && req.query.ownerId && mongoose.isValidObjectId(req.query.ownerId)) {
    return req.query.ownerId;
  }
  return req.user.id;
};
const ensureSpaceOwnership = async (spaceId, ownerId, isAdmin) => {
  const space = await Space.findById(spaceId);
  if (!space) {
    return { error: 'Space not found' };
  }
  if (!isAdmin && String(space.ownerUser) !== String(ownerId)) {
    return { error: 'You are not allowed to manage this space' };
  }
  return { space };
};
const fetchOwnerSpaceIds = async (ownerId) => {
  const spaces = await Space.find({ ownerUser: ownerId }).select('_id');
  return spaces.map((space) => space._id);
};
router.get('/dashboard/overview', async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const spaceIds = await fetchOwnerSpaceIds(ownerId);
    const [spaces, bookings, tourRequests] = await Promise.all([
      Space.find({ ownerUser: ownerId }).sort({ createdAt: -1 }),
      Booking.find({ space: { $in: spaceIds } }),
      TourBooking.find({ space: { $in: spaceIds } })
    ]);
    const totalRevenue = bookings
      .filter((booking) => booking.paymentStatus === 'paid')
      .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    const activeBookings = bookings.filter((booking) => ['pending', 'confirmed'].includes(booking.status));
    const bookingHistory = bookings.filter((booking) => ['completed', 'cancelled'].includes(booking.status));
    const earningsByMonth = await Booking.aggregate([
      {
        $match: {
          space: { $in: spaceIds },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$bookingDate' } },
          total: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    const topSpaces = await Booking.aggregate([
      {
        $match: {
          space: { $in: spaceIds },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: '$space',
          totalRevenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'spaces',
          localField: '_id',
          foreignField: '_id',
          as: 'space'
        }
      },
      { $unwind: '$space' },
      {
        $project: {
          _id: 0,
          spaceId: '$space._id',
          name: '$space.name',
          city: '$space.city',
          totalRevenue: 1,
          bookings: 1
        }
      }
    ]);
    return res.json({
      spaces,
      stats: {
        totalSpaces: spaces.length,
        totalBookings: bookings.length,
        activeBookings: activeBookings.length,
        bookingHistory: bookingHistory.length,
        tourRequests: tourRequests.length,
        totalRevenue
      },
      trends: {
        earningsByMonth,
        topSpaces
      }
    });
  } catch (error) {
    console.error('Owner overview error:', error);
    return res.status(500).json({ message: 'Failed to load owner dashboard' });
  }
});
router.get('/spaces', async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const spaces = await Space.find({ ownerUser: ownerId }).sort({ createdAt: -1 });
    return res.json({ spaces });
  } catch (error) {
    console.error('Get owner spaces error:', error);
    return res.status(500).json({ message: 'Failed to load spaces' });
  }
});
router.post(
  '/spaces',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('type').trim().notEmpty().withMessage('Type is required'),
    body('pricePerDay').isFloat({ min: 0 }).withMessage('Price per day must be positive')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const ownerId = getOwnerId(req);

      if (req.user.role === 'workspace_owner') {
        const ownerUser = await User.findById(ownerId).select(
          'subscriptionPlan subscriptionStatus subscriptionForRole'
        );

        const hasActiveSubscription =
          ownerUser &&
          ownerUser.subscriptionStatus === 'active' &&
          ownerUser.subscriptionForRole === 'workspace_owner';

        if (!hasActiveSubscription) {
          const existingCount = await Space.countDocuments({ ownerUser: ownerId });
          if (existingCount >= 1) {
            return res.status(403).json({
              message:
                'Free plan allows only one space. Please upgrade your workspace owner subscription to add more spaces.'
            });
          }
        }
      }

      const payload = {
        ...req.body,
        ownerUser: ownerId,
        owner: {
          name: req.user.fullName,
          phone: req.body.owner?.phone || ''
        }
      };

      const space = await Space.create(payload);
      return res.status(201).json({ space });
    } catch (error) {
      console.error('Create owner space error:', error);
      return res.status(500).json({ message: 'Failed to create space' });
    }
  }
);
router.patch(
  '/spaces/:id',
  [
    body('pricePerDay').optional().isFloat({ min: 0 }).withMessage('Price per day must be positive')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const ownerId = getOwnerId(req);
      const { space, error } = await ensureSpaceOwnership(req.params.id, ownerId, req.user.role === 'admin');
      if (error) {
        const status = error === 'Space not found' ? 404 : 403;
        return res.status(status).json({ message: error });
      }
      Object.assign(space, req.body);
      await space.save();
      return res.json({ space });
    } catch (err) {
      console.error('Update owner space error:', err);
      return res.status(500).json({ message: 'Failed to update space' });
    }
  }
);
router.delete('/spaces/:id', async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const { space, error } = await ensureSpaceOwnership(req.params.id, ownerId, req.user.role === 'admin');
    if (error) {
      const status = error === 'Space not found' ? 404 : 403;
      return res.status(status).json({ message: error });
    }
    await space.deleteOne();
    return res.json({ message: 'Space deleted' });
  } catch (err) {
    console.error('Delete owner space error:', err);
    return res.status(500).json({ message: 'Failed to delete space' });
  }
});
router.get('/bookings', async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const scope = req.query.scope === 'history' ? 'history' : 'active';
    const statuses = scope === 'history' ? ['cancelled', 'completed'] : ['pending', 'confirmed'];
    const spaceIds = await fetchOwnerSpaceIds(ownerId);
    const bookings = await Booking.find({
      space: { $in: spaceIds },
      status: { $in: statuses }
    })
      .sort({ bookingDate: -1 })
      .populate('space', 'name city pricePerDay images')
      .populate('user', 'fullName email phone');
    return res.json({ bookings });
  } catch (error) {
    console.error('Owner bookings error:', error);
    return res.status(500).json({ message: 'Failed to load bookings' });
  }
});
router.patch('/bookings/:id/complete', async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const spaceIds = await fetchOwnerSpaceIds(ownerId);
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const bookingSpaceId = booking.space.toString();
    const ownerSpaceIds = spaceIds.map(id => id.toString());
    if (!ownerSpaceIds.includes(bookingSpaceId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Booking is already completed' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot complete a cancelled booking' });
    }
    if (booking.paymentStatus !== 'paid') {
      return res.status(400).json({ message: 'Cannot complete unpaid booking' });
    }
    booking.status = 'completed';
    await booking.save();
    return res.json({
      message: 'Booking marked as completed',
      booking
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    return res.status(500).json({ message: 'Failed to complete booking' });
  }
});
router.get('/tour-requests', async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const spaceIds = await fetchOwnerSpaceIds(ownerId);
    const tourBookings = await TourBooking.find({
      space: { $in: spaceIds }
    })
      .sort({ tourDate: -1 })
      .populate('space', 'name city')
      .populate('user', 'fullName email');
    return res.json({ tourBookings });
  } catch (error) {
    console.error('Owner tours error:', error);
    return res.status(500).json({ message: 'Failed to load tour requests' });
  }
});
router.patch('/tour-requests/:id/status', async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const spaceIds = await fetchOwnerSpaceIds(ownerId);
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const tourBooking = await TourBooking.findById(req.params.id)
      .populate('space', 'name city');
    if (!tourBooking) {
      return res.status(404).json({ message: 'Tour booking not found' });
    }
    if (!tourBooking.space) {
      return res.status(404).json({ message: 'Space not found for this tour booking' });
    }
    const tourSpaceId = tourBooking.space._id.toString();
    const ownerSpaceIds = spaceIds.map(id => id.toString());
    if (!ownerSpaceIds.includes(tourSpaceId)) {
      return res.status(403).json({ message: 'Access denied. This tour does not belong to your spaces.' });
    }
    tourBooking.status = status;
    await tourBooking.save();
    const populatedTour = await TourBooking.findById(tourBooking._id)
      .populate('space', 'name city')
      .populate('user', 'fullName email');
    return res.json({ tourBooking: populatedTour });
  } catch (error) {
    console.error('Update tour status error:', error);
    return res.status(500).json({
      message: error.message || 'Failed to update tour status'
    });
  }
});
router.get('/agreements', async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const agreements = await Agreement.find({ owner: ownerId })
      .sort({ updatedAt: -1 })
      .populate('space', 'name city')
      .populate('booking', 'bookingDate status');
    return res.json({ agreements });
  } catch (error) {
    console.error('Owner agreements error:', error);
    return res.status(500).json({ message: 'Failed to load agreements' });
  }
});
router.post(
  '/agreements',
  [
    body('space').notEmpty().withMessage('Space is required'),
    body('title').notEmpty().withMessage('Agreement title is required'),
    body('documentUrl').isURL().withMessage('Document URL must be valid')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const ownerId = getOwnerId(req);
      const agreement = await Agreement.create({
        ...req.body,
        owner: ownerId
      });
      return res.status(201).json({ agreement });
    } catch (error) {
      console.error('Create agreement error:', error);
      return res.status(500).json({ message: 'Failed to create agreement' });
    }
  }
);
router.patch(
  '/agreements/:id',
  [
    body('status').optional().isIn(['draft', 'sent', 'signed', 'archived']).withMessage('Invalid agreement status')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const ownerId = getOwnerId(req);
      const agreement = await Agreement.findOne({ _id: req.params.id, owner: ownerId });
      if (!agreement) {
        return res.status(404).json({ message: 'Agreement not found' });
      }
      Object.assign(agreement, req.body);
      await agreement.save();
      return res.json({ agreement });
    } catch (error) {
      console.error('Update agreement error:', error);
      return res.status(500).json({ message: 'Failed to update agreement' });
    }
  }
);
router.get('/reviews', async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const reviews = await Review.find({ owner: ownerId })
      .sort({ createdAt: -1 })
      .populate('space', 'name city images');
    return res.json({ reviews });
  } catch (error) {
    console.error('Owner reviews error:', error);
    return res.status(500).json({ message: 'Failed to load reviews' });
  }
});
router.patch(
  '/reviews/:id',
  [
    body('status').optional().isIn(['published', 'hidden', 'flagged']).withMessage('Invalid review status')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const ownerId = getOwnerId(req);
      const review = await Review.findOne({ _id: req.params.id, owner: ownerId });
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
      Object.assign(review, req.body);
      await review.save();
      return res.json({ review });
    } catch (error) {
      console.error('Update review error:', error);
      return res.status(500).json({ message: 'Failed to update review' });
    }
  }
);
router.get('/reports/earnings', async (req, res) => {
  try {
    const ownerId = getOwnerId(req);
    const spaceIds = await fetchOwnerSpaceIds(ownerId);
    const earnings = await Booking.aggregate([
      {
        $match: {
          space: { $in: spaceIds },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: '$space',
          totalRevenue: { $sum: '$totalAmount' },
          paidRevenue: { $sum: '$totalAmount' },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'spaces',
          localField: '_id',
          foreignField: '_id',
          as: 'space'
        }
      },
      { $unwind: '$space' },
      {
        $project: {
          _id: 0,
          spaceId: '$space._id',
          name: '$space.name',
          city: '$space.city',
          totalRevenue: 1,
          paidRevenue: 1,
          completed: 1
        }
      }
    ]);
    return res.json({ earnings });
  } catch (error) {
    console.error('Owner earnings error:', error);
    return res.status(500).json({ message: 'Failed to load reports' });
  }
});
router.post(
  '/support',
  [
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('priority').optional().isIn(['low', 'normal', 'high']).withMessage('Invalid priority')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const ownerId = getOwnerId(req);
      const ticket = await SupportTicket.create({
        owner: ownerId,
        subject: req.body.subject,
        message: req.body.message,
        priority: req.body.priority || 'normal'
      });
      return res.status(201).json({ ticket });
    } catch (error) {
      console.error('Create support ticket error:', error);
      return res.status(500).json({ message: 'Failed to submit support request' });
    }
  }
);
module.exports = router;