const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Space = require('../models/Space');
const { auth } = require('../middleware/auth');
const router = express.Router();
const updateSpaceRating = async (spaceId) => {
  if (!mongoose.Types.ObjectId.isValid(spaceId)) {
    return;
  }
  const stats = await Review.aggregate([
    {
      $match: {
        space: new mongoose.Types.ObjectId(spaceId),
        status: 'published'
      }
    },
    {
      $group: {
        _id: '$space',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);
  const avgRating = stats.length ? Number(stats[0].avgRating.toFixed(1)) : 0;
  const ratingCount = stats.length ? stats[0].count : 0;
  await Space.findByIdAndUpdate(spaceId, {
    rating: avgRating,
    ratingCount
  });
};
router.post(
  '/',
  auth,
  [
    body('bookingId').notEmpty().withMessage('Booking ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isString().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { bookingId, rating, comment } = req.body;
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      if (booking.user.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      if (booking.paymentStatus !== 'paid' && booking.status !== 'completed') {
        return res.status(400).json({ message: 'You can only review paid or completed bookings' });
      }
      if (booking.userRating || booking.userReviewId) {
        return res.status(400).json({ message: 'You have already reviewed this booking' });
      }
      const spaceId = booking.space && booking.space._id ? booking.space._id : booking.space;
      const space = await Space.findById(spaceId);
      if (!space) {
        return res.status(404).json({ message: 'Space not found' });
      }
      if (!space.ownerUser) {
        return res.status(400).json({ message: 'Space has no owner; cannot submit review' });
      }
      const review = await Review.create({
        space: space._id,
        booking: booking._id,
        owner: space.ownerUser,
        user: req.user.id,
        reviewerName: (req.user.fullName || req.user.email || 'Guest').trim(),
        rating: Number(rating),
        comment: (comment && String(comment).trim()) ? String(comment).trim() : 'No comment provided',
        status: 'published'
      });
      booking.userRating = Number(rating);
      booking.userReviewComment = comment != null ? String(comment).trim() : '';
      booking.userReviewId = review._id;
      await booking.save();
      await updateSpaceRating(space._id);
      return res.status(201).json({ review });
    } catch (error) {
      console.error('Create review error:', error);
      const message = error.message || 'Failed to submit review';
      return res.status(500).json({
        message: 'Failed to submit review',
        detail: message
      });
    }
  }
);
router.get('/booking/:bookingId', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (
      booking.user.toString() !== req.user.id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (!booking.userReviewId) {
      return res.json({
        review: null,
        userRating: booking.userRating || null,
        userReviewComment: booking.userReviewComment || ''
      });
    }
    const review = await Review.findById(booking.userReviewId).populate('user', 'fullName');
    return res.json({ review });
  } catch (error) {
    console.error('Fetch review error:', error);
    return res.status(500).json({ message: 'Failed to fetch review' });
  }
});
module.exports = router;