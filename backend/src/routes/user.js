const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const router = express.Router();

// Get user profile
router.get('/profile', auth, catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('inventory.items.item');

  res.json({
    status: 'success',
    data: {
      user
    }
  });
}));

// Update user profile
router.patch('/profile', auth, catchAsync(async (req, res) => {
  const allowedUpdates = ['username', 'email', 'preferences'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    throw new AppError('Invalid updates', 400);
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    req.body,
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    status: 'success',
    data: {
      user
    }
  });
}));

// Get user stats
router.get('/stats', auth, catchAsync(async (req, res) => {
  const stats = await User.findById(req.user._id)
    .select('stats achievements')
    .populate('achievements');

  res.json({
    status: 'success',
    data: {
      stats
    }
  });
}));

module.exports = router;
