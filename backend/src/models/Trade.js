const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'expired'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    required: true
  },
  offer: {
    pets: [{
      pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
      },
      verified: {
        type: Boolean,
        default: false
      }
    }],
    items: [{
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShopItem'
      },
      quantity: Number,
      verified: {
        type: Boolean,
        default: false
      }
    }],
    coins: {
      amount: {
        type: Number,
        default: 0
      },
      verified: {
        type: Boolean,
        default: false
      }
    }
  },
  request: {
    pets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet'
    }],
    items: [{
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShopItem'
      },
      quantity: Number
    }],
    coins: {
      type: Number,
      default: 0
    }
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  verificationSteps: {
    senderConfirmed: {
      type: Boolean,
      default: false
    },
    receiverConfirmed: {
      type: Boolean,
      default: false
    },
    systemVerified: {
      type: Boolean,
      default: false
    }
  },
  completedAt: Date,
  cancelReason: String
}, {
  timestamps: true
});

// Create indexes for efficient querying
tradeSchema.index({ sender: 1, status: 1 });
tradeSchema.index({ receiver: 1, status: 1 });
tradeSchema.index({ status: 1, expiresAt: 1 });
tradeSchema.index({ 'offer.pets.pet': 1 });

// Add methods for trade verification
tradeSchema.methods.verifyTrade = async function() {
  // Verify sender has offered items/pets
  // Verify receiver has requested items/pets
  // Verify coin balances
  // Set systemVerified if all checks pass
};

// Add methods for trade completion
tradeSchema.methods.completeTrade = async function() {
  // Transfer pets
  // Transfer items
  // Transfer coins
  // Update trade status
  // Set completedAt timestamp
};

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
