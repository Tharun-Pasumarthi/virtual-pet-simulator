const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['seasonal', 'special', 'competition', 'community'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  rewards: {
    participation: {
      coins: Number,
      items: [{
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ShopItem'
        },
        quantity: Number
      }]
    },
    rankings: [{
      rank: {
        from: Number,
        to: Number
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
        specialUnlocks: [{
          type: {
            type: String,
            enum: ['petType', 'color', 'pattern', 'ability']
          },
          id: String
        }]
      }
    }]
  },
  specialFeatures: {
    petTypes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PetType'
    }],
    minigames: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MiniGame'
    }],
    shopItems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShopItem'
    }]
  },
  requirements: {
    minLevel: Number,
    minPets: Number,
    achievements: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    }]
  },
  leaderboard: {
    type: {
      type: String,
      enum: ['points', 'wins', 'collection', 'achievement'],
      required: true
    },
    sortOrder: {
      type: String,
      enum: ['asc', 'desc'],
      default: 'desc'
    }
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    rank: Number,
    joinDate: Date,
    progress: mongoose.Schema.Types.Mixed
  }],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming'
  },
  theme: {
    colors: {
      primary: String,
      secondary: String,
      accent: String
    },
    assets: {
      banner: String,
      icon: String,
      background: String
    }
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
eventSchema.index({ type: 1, status: 1 });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ 'participants.user': 1, 'participants.score': -1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
