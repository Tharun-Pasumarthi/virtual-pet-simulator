const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  coins: {
    type: Number,
    default: 100, // Starting coins
    min: 0
  },
  lastCoinUpdate: {
    type: Date,
    default: Date.now
  },
  coinGenerationRate: {
    type: Number,
    default: 0.1, // 0.1% per second
    min: 0
  },
  activePetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet'
  },
  inventory: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],
  lastOnline: {
    type: Date,
    default: Date.now
  },
  loginStreak: {
    type: Number,
    default: 0
  },
  lastLoginDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to update coins based on time passed
userSchema.methods.updateCoins = async function() {
  const now = new Date();
  const timePassed = (now - this.lastCoinUpdate) / 1000; // in seconds
  
  // Calculate coins to add (0.1% per second)
  const coinsToAdd = this.coins * (this.coinGenerationRate / 100) * timePassed;
  
  // Update coins and timestamp
  this.coins += coinsToAdd;
  this.lastCoinUpdate = now;
  
  return this.save();
};

// Method to add coins
userSchema.methods.addCoins = async function(amount) {
  this.coins += amount;
  return this.save();
};

// Method to spend coins
userSchema.methods.spendCoins = async function(amount) {
  if (this.coins < amount) {
    throw new Error('Insufficient coins');
  }
  this.coins -= amount;
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
