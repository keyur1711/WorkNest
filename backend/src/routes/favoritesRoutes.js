const express = require('express');
const User = require('../models/User');
const Space = require('../models/Space');
const { auth } = require('../middleware/auth');
const router = express.Router();
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    return res.json({ favorites: user.favorites || [] });
  } catch (error) {
    console.error('Get favorites error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.post('/:spaceId', auth, async (req, res) => {
  try {
    const space = await Space.findById(req.params.spaceId);
    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }
    const user = await User.findById(req.user.id);
    if (user.favorites.includes(req.params.spaceId)) {
      return res.json({ message: 'Already in favorites', favorites: user.favorites });
    }
    user.favorites.push(req.params.spaceId);
    await user.save();
    const updatedUser = await User.findById(req.user.id).populate('favorites');
    return res.json({ favorites: updatedUser.favorites });
  } catch (error) {
    console.error('Add favorite error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.delete('/:spaceId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== req.params.spaceId
    );
    await user.save();
    const updatedUser = await User.findById(req.user.id).populate('favorites');
    return res.json({ favorites: updatedUser.favorites });
  } catch (error) {
    console.error('Remove favorite error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;