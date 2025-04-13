const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Calculate offline earnings
const calculateOfflineEarnings = (lastLoginTime) => {
  const now = Date.now();
  const offlineTime = now - lastLoginTime;
  const maxOfflineTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const actualOfflineTime = Math.min(offlineTime, maxOfflineTime);
  return Math.floor((actualOfflineTime / 1000) * 0.5); // 0.5 coins per second
};

// Get current coins
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ coins: user.coins });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Collect offline earnings
router.post('/collect-offline', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const offlineEarnings = calculateOfflineEarnings(user.lastLoginTime);
    
    user.coins += offlineEarnings;
    user.lastLoginTime = Date.now();
    await user.save();

    res.json({
      coins: user.coins,
      offlineEarnings,
      message: `Collected ${offlineEarnings} coins from offline earnings!`
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update daily streak
router.post('/daily-streak', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const now = new Date();
    const lastLogin = new Date(user.lastDailyStreak);
    
    // Check if it's a new day
    if (now.toDateString() !== lastLogin.toDateString()) {
      // Check if streak is maintained
      const dayDiff = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        user.dailyStreak += 1;
        const bonus = Math.min(user.dailyStreak * 100, 1000); // Cap bonus at 1000
        user.coins += bonus;
        user.lastDailyStreak = now;
        await user.save();
        
        res.json({
          streak: user.dailyStreak,
          bonus,
          coins: user.coins,
          message: `Daily streak: ${user.dailyStreak}! Bonus: ${bonus} coins!`
        });
      } else {
        // Reset streak if more than one day passed
        user.dailyStreak = 1;
        user.lastDailyStreak = now;
        user.coins += 100; // Base daily reward
        await user.save();
        
        res.json({
          streak: 1,
          bonus: 100,
          coins: user.coins,
          message: 'New streak started! +100 coins'
        });
      }
    } else {
      res.status(400).json({ message: 'Daily reward already claimed' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
