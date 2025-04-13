const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['pet', 'breeding', 'minigame', 'social', 'collection', 'event'],
    required: true
  },
  requirements: {
    type: {
      type: String,
      enum: ['count', 'score', 'level', 'collection', 'time'],
      required: true
    },
    target: {
      type: Number,
      required: true
    },
    additionalParams: mongoose.Schema.Types.Mixed
  },
  rewards: {
    coins: Number,
    items: [{
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShopItem'
      },
      quantity: Number
    }],
    unlocks: [{
      type: {
        type: String,
        enum: ['petType', 'color', 'pattern', 'ability']
      },
      id: String
    }]
  },
  tiers: [{
    level: Number,
    target: Number,
    rewards: {
      coins: Number,
      items: [{
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ShopItem'
        },
        quantity: Number
      }]
    }
  }],
  icon: String,
  isSecret: {
    type: Boolean,
    default: false
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
achievementSchema.index({ category: 1, rarity: 1 });
achievementSchema.index({ 'requirements.type': 1 });

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;