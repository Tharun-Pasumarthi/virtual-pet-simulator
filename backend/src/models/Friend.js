const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  friend: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'pending'
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interactions: {
    lastInteraction: Date,
    visitCount: {
      type: Number,
      default: 0
    },
    giftsSent: {
      type: Number,
      default: 0
    },
    giftsReceived: {
      type: Number,
      default: 0
    },
    petPlayDates: {
      type: Number,
      default: 0
    }
  },
  permissions: {
    canVisitPets: {
      type: Boolean,
      default: true
    },
    canSendGifts: {
      type: Boolean,
      default: true
    },
    canTrade: {
      type: Boolean,
      default: true
    },
    canBreed: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Ensure unique friendships
friendSchema.index({ user: 1, friend: 1 }, { unique: true });
friendSchema.index({ status: 1 });

const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;
