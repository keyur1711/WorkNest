const express = require('express');
const Space = require('../models/Space');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const router = express.Router();

/**
 * Public marketing stats (no auth) — used by About page and similar.
 */
router.get('/stats', async (req, res) => {
  try {
    const [cityList, spacesCount, bookingsCompleted, avgAgg] = await Promise.all([
      Space.distinct('city'),
      Space.countDocuments(),
      Booking.countDocuments({
        $or: [{ status: 'completed' }, { paymentStatus: 'paid' }]
      }),
      Review.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: null, avg: { $avg: '$rating' } } }
      ])
    ]);

    const citiesCount = (cityList || []).filter(Boolean).length;
    const avgRating =
      avgAgg && avgAgg[0] && typeof avgAgg[0].avg === 'number'
        ? Math.round(avgAgg[0].avg * 10) / 10
        : null;

    return res.json({
      citiesCount,
      spacesCount,
      bookingsCompleted,
      avgRating
    });
  } catch (error) {
    console.error('Public stats error:', error);
    return res.status(500).json({ message: 'Failed to load stats' });
  }
});

module.exports = router;
