const User = require('../models/User');

const updateUserCoins = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const now = new Date();
    const lastUpdate = user.lastCoinUpdate || now;
    const timeDiff = Math.floor((now - lastUpdate) / 1000); // difference in seconds
    
    // Calculate coins to add (1 coin per second)
    const coinsToAdd = timeDiff;
    
    // Update user's coins and last update time
    user.coins = (user.coins || 0) + coinsToAdd;
    user.lastCoinUpdate = now;
    
    await user.save();
    return coinsToAdd;
  } catch (error) {
    console.error('Error updating coins:', error);
  }
};

module.exports = { updateUserCoins };
