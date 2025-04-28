const User = require('../models/User');
const { cache } = require('../utils/cache');

class CoinService {
  constructor() {
    this.updateInterval = 1000; // Update every second
    this.activeUsers = new Map(); // Track active users
  }

  // Start coin generation for a user
  async startCoinGeneration(userId) {
    if (this.activeUsers.has(userId)) return;

    const user = await User.findById(userId);
    if (!user) return;

    // Add to active users
    this.activeUsers.set(userId, {
      lastUpdate: Date.now(),
      interval: setInterval(async () => {
        try {
          const updatedUser = await User.findById(userId);
          if (updatedUser) {
            await updatedUser.updateCoins();
            // Update cache
            cache.set(`user:${userId}:coins`, updatedUser.coins);
          }
        } catch (error) {
          console.error(`Error updating coins for user ${userId}:`, error);
        }
      }, this.updateInterval)
    });
  }

  // Stop coin generation for a user
  stopCoinGeneration(userId) {
    const userData = this.activeUsers.get(userId);
    if (userData) {
      clearInterval(userData.interval);
      this.activeUsers.delete(userId);
    }
  }

  // Get current coins for a user
  async getCurrentCoins(userId) {
    // Try to get from cache first
    const cachedCoins = cache.get(`user:${userId}:coins`);
    if (cachedCoins !== undefined) {
      return cachedCoins;
    }

    // If not in cache, get from database
    const user = await User.findById(userId);
    if (user) {
      // Update cache
      cache.set(`user:${userId}:coins`, user.coins);
      return user.coins;
    }
    return 0;
  }

  // Add coins to a user
  async addCoins(userId, amount) {
    const user = await User.findById(userId);
    if (user) {
      await user.addCoins(amount);
      // Update cache
      cache.set(`user:${userId}:coins`, user.coins);
      return user.coins;
    }
    return 0;
  }

  // Spend coins from a user
  async spendCoins(userId, amount) {
    const user = await User.findById(userId);
    if (user) {
      await user.spendCoins(amount);
      // Update cache
      cache.set(`user:${userId}:coins`, user.coins);
      return user.coins;
    }
    return 0;
  }
}

// Export singleton instance
module.exports = new CoinService(); 