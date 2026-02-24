const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Space = require('../models/Space');
const Booking = require('../models/Booking');
const TourBooking = require('../models/TourBooking');
const { auth, admin } = require('../middleware/auth');
const router = express.Router();
router.use(auth, admin);
router.get('/stats', async (req, res) => {
  try {
    console.log('Admin: Fetching statistics...');
    const [
      totalUsers,
      totalSpaces,
      totalBookings,
      totalTourBookings,
      activeBookings,
      pendingBookings,
      workspaceOwners
    ] = await Promise.all([
      User.countDocuments(),
      Space.countDocuments(),
      Booking.countDocuments(),
      TourBooking.countDocuments(),
      Booking.countDocuments({ status: { $in: ['confirmed', 'pending'] } }),
      Booking.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'workspace_owner' })
    ]);
    const revenueResult = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentBookings = await Booking.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    const stats = {
      totalUsers,
      totalSpaces,
      totalBookings,
      totalTourBookings,
      activeBookings,
      pendingBookings,
      workspaceOwners,
      totalRevenue,
      recentBookings
    };
    console.log('Admin: Statistics retrieved:', stats);
    return res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    const role = req.query.role;
    const query = role ? { role } : {};
    const [users, total] = await Promise.all([
      User.find(query).select('-password -__v').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(query)
    ]);
    console.log(`Admin: Retrieved ${users.length} users out of ${total} total`);
    return res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.patch(
  '/users/:id',
  [
    body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('role').optional().isIn(['user', 'admin', 'workspace_owner']).withMessage('Invalid role'),
    body('phone').optional().trim()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { fullName, email, role, phone } = req.body;
      const updateData = {};
      if (fullName) updateData.fullName = fullName;
      if (email) updateData.email = email;
      if (role) updateData.role = role;
      if (phone !== undefined) updateData.phone = phone;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password -__v');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json({ user });
    } catch (error) {
      console.error('Update user error:', error);
      if (error.code === 11000) {
        return res.status(409).json({ message: 'Email already in use' });
      }
      return res.status(500).json({ message: 'Server error' });
    }
  }
);
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.get('/spaces', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    const city = req.query.city;
    const type = req.query.type;
    const query = {};
    if (city) query.city = city;
    if (type) query.type = type;
    const [spaces, total] = await Promise.all([
      Space.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Space.countDocuments(query)
    ]);
    console.log(`Admin: Retrieved ${spaces.length} spaces out of ${total} total`);
    return res.json({
      spaces,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get spaces error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.get('/spaces/:id', async (req, res) => {
  try {
    const space = await Space.findById(req.params.id);
    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }
    return res.json({ space });
  } catch (error) {
    console.error('Get space error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.post(
  '/spaces',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('type').trim().notEmpty().withMessage('Type is required'),
    body('pricePerDay').isNumeric().withMessage('Price per day must be a number'),
    body('coordinates.lat').isNumeric().withMessage('Latitude is required'),
    body('coordinates.lng').isNumeric().withMessage('Longitude is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const space = await Space.create(req.body);
      return res.status(201).json({ space });
    } catch (error) {
      console.error('Create space error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);
router.patch(
  '/spaces/:id',
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('pricePerDay').optional().isNumeric().withMessage('Price per day must be a number'),
    body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const space = await Space.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!space) {
        return res.status(404).json({ message: 'Space not found' });
      }
      return res.json({ space });
    } catch (error) {
      console.error('Update space error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);
router.delete('/spaces/:id', async (req, res) => {
  try {
    const space = await Space.findByIdAndDelete(req.params.id);
    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }
    return res.json({ message: 'Space deleted successfully' });
  } catch (error) {
    console.error('Delete space error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.get('/bookings', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const query = status ? { status } : {};
    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('user', 'fullName email')
        .populate('space', 'name city locationText')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments(query)
    ]);
    const formattedBookings = bookings.map(booking => ({
      ...booking,
      spaceName: booking.spaceName || booking.space?.name || 'Unknown Space',
      space: booking.space ? {
        name: booking.space.name,
        city: booking.space.city,
        locationText: booking.space.locationText
      } : null
    }));
    console.log(`Admin: Retrieved ${formattedBookings.length} bookings out of ${total} total`);
    return res.json({
      bookings: formattedBookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'fullName email phone')
      .populate('space', 'name city locationText pricePerDay');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.patch(
  '/bookings/:id/status',
  [body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Invalid status')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      )
        .populate('user', 'fullName email')
        .populate('space', 'name city');
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      return res.json({ booking });
    } catch (error) {
      console.error('Update booking error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);
router.get('/tour-bookings', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const query = status ? { status } : {};
    const [tourBookings, total] = await Promise.all([
      TourBooking.find(query)
        .populate('user', 'fullName email')
        .populate('space', 'name city locationText')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      TourBooking.countDocuments(query)
    ]);
    const formattedTourBookings = tourBookings.map(tour => ({
      ...tour,
      spaceName: tour.spaceName || tour.space?.name || 'Unknown Space',
      contactName: tour.contactName || tour.user?.fullName || 'Unknown',
      contactEmail: tour.contactEmail || tour.user?.email || 'Unknown',
      space: tour.space ? {
        name: tour.space.name,
        city: tour.space.city,
        locationText: tour.space.locationText
      } : null
    }));
    console.log(`Admin: Retrieved ${formattedTourBookings.length} tour bookings out of ${total} total`);
    return res.json({
      tourBookings: formattedTourBookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get tour bookings error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.patch(
  '/tour-bookings/:id/status',
  [body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Invalid status')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const tourBooking = await TourBooking.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      )
        .populate('user', 'fullName email')
        .populate('space', 'name city');
      if (!tourBooking) {
        return res.status(404).json({ message: 'Tour booking not found' });
      }
      return res.json({ tourBooking });
    } catch (error) {
      console.error('Update tour booking error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);
module.exports = router;