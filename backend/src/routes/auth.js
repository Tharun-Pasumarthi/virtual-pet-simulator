const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Format user data for response
const formatUserResponse = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  coins: user.coins || 0,
  loginStreak: user.loginStreak || 0,
  lastLoginDate: user.lastLoginDate,
  createdAt: user.createdAt
});

// Register user
router.post('/register', [
  body('username').trim().isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        error: errors.array()[0].msg
      });
    }

    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        error: 'User already exists'
      });
    }

    const user = new User({
      username,
      email,
      password,
      coins: 100, // Starting coins
      loginStreak: 1,
      lastLoginDate: new Date()
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      status: 'success',
      data: {
        token,
        user: formatUserResponse(user)
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      error: 'Server error during registration'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        error: 'Invalid credentials'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        error: 'Invalid credentials'
      });
    }

    // Update login streak
    const now = new Date();
    const lastLogin = user.lastLoginDate;
    const daysSinceLastLogin = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));

    if (daysSinceLastLogin === 1) {
      user.loginStreak += 1;
      // Bonus coins for maintaining streak
      const streakBonus = Math.min(user.loginStreak * 10, 100);
      user.coins += streakBonus;
    } else if (daysSinceLastLogin > 1) {
      user.loginStreak = 1;
      // Base login reward
      user.coins += 10;
    }

    user.lastLoginDate = now;
    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      status: 'success',
      data: {
        token,
        user: formatUserResponse(user)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      error: 'Server error during login'
    });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        error: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        user: formatUserResponse(user)
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({
      status: 'error',
      error: 'Server error during auth check'
    });
  }
});

module.exports = router;
