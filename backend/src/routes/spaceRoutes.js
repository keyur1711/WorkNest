const express = require('express');
const { body, validationResult } = require('express-validator');
const Space = require('../models/Space');
const { auth } = require('../middleware/auth');
const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const {
      city,
      type,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 20,
      sort = 'pricePerDay'
    } = req.query;
    const filters = {};
    if (city) {
      filters.city = city;
    }
    if (type) {
      filters.type = type;
    }
    if (minPrice || maxPrice) {
      filters.pricePerDay = {};
      if (minPrice) {
        filters.pricePerDay.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filters.pricePerDay.$lte = Number(maxPrice);
      }
    }
    if (search) {
      filters.$text = { $search: search };
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [spaces, total] = await Promise.all([
      Space.find(filters).sort(sort).skip(skip).limit(Number(limit)),
      Space.countDocuments(filters)
    ]);
    return res.json({
      data: spaces,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Fetch spaces error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.get('/filters', async (req, res) => {
  try {
    const [cities, types] = await Promise.all([
      Space.distinct('city'),
      Space.distinct('type')
    ]);
    return res.json({
      cities: cities.sort(),
      types: types.sort()
    });
  } catch (error) {
    console.error('Fetch filters error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const space = await Space.findById(req.params.id).populate('ownerUser', 'fullName phone email');
    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }
    return res.json(space);
  } catch (error) {
    console.error('Fetch space error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid space id' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});
router.get('/:id/reviews', async (req, res) => {
  try {
    const Review = require('../models/Review');
    const reviews = await Review.find({
      space: req.params.id,
      status: 'published'
    })
      .populate('user', 'fullName')
      .sort({ createdAt: -1 });
    return res.json({ reviews });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.post(
  '/',
  auth,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('type').notEmpty().withMessage('Type is required'),
    body('pricePerDay').isNumeric().withMessage('Price per day must be a number'),
    body('coordinates.lat').optional().isNumeric().withMessage('Latitude must be a number'),
    body('coordinates.lng').optional().isNumeric().withMessage('Longitude must be a number')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const space = await Space.create(req.body);
      return res.status(201).json(space);
    } catch (error) {
      console.error('Create space error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);
router.patch(
  '/:id',
  auth,
  [
    body('pricePerDay').optional().isNumeric().withMessage('Price per day must be a number'),
    body('coordinates.lat').optional().isNumeric().withMessage('Latitude must be a number'),
    body('coordinates.lng').optional().isNumeric().withMessage('Longitude must be a number')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const space = await Space.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!space) {
        return res.status(404).json({ message: 'Space not found' });
      }
      return res.json(space);
    } catch (error) {
      console.error('Update space error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);
router.delete('/:id', auth, async (req, res) => {
  try {
    const space = await Space.findByIdAndDelete(req.params.id);
    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }
    return res.json({ message: 'Space deleted' });
  } catch (error) {
    console.error('Delete space error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;