const mongoose = require('mongoose');

const shopItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['food', 'accessory', 'background', 'toy'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  effects: {
    hunger: Number,
    happiness: Number,
    energy: Number,
    playfulness: Number
  },
  duration: {
    type: Number,
    default: 0 // permanent if 0, otherwise in hours
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  requiredLevel: {
    type: Number,
    default: 1
  },
  limitedTime: {
    isLimited: {
      type: Boolean,
      default: false
    },
    startDate: Date,
    endDate: Date
  },
  description: String,
  imageUrl: String
}, {
  timestamps: true
});

module.exports = mongoose.model('ShopItem', shopItemSchema);
