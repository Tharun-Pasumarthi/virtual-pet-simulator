const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['battle', 'show', 'race', 'talent', 'custom'],
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
  status: {
    type: String,
    enum: ['registration', 'active', 'judging', 'completed'],
    default: 'registration'
  },
  category: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'elite', 'all'],
    required: true
  },
  entryRequirements: {
    minLevel: Number,
    maxLevel: Number,
    allowedSpecies: [String],
    requiredTraits: [String],
    maxEntries: Number
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet'
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    score: {
      type: Number,
      default: 0
    },
    rank: Number,
    performance: mongoose.Schema.Types.Mixed
  }],
  rounds: [{
    number: Number,
    type: {
      type: String,
      enum: ['elimination', 'scoring', 'bracket']
    },
    startDate: Date,
    endDate: Date,
    matches: [{
      participant1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      participant2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      scores: {
        participant1: Number,
        participant2: Number
      },
      status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'completed', 'forfeit']
      }
    }]
  }],
  rewards: {
    participation: {
      coins: Number,
      experience: Number,
      items: [{
        item: {
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
        experience: Number,
        items: [{
          item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ShopItem'
          },
          quantity: Number
        }],
        title: String,
        badge: String
      }
    }]
  },
  judges: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['head', 'assistant', 'guest']
    }
  }],
  rules: [{
    title: String,
    description: String
  }],
  scoringCriteria: [{
    name: String,
    description: String,
    maxPoints: Number,
    weight: Number
  }]
}, {
  timestamps: true
});

// Create indexes for efficient querying
competitionSchema.index({ status: 1, startDate: 1, endDate: 1 });
competitionSchema.index({ type: 1, category: 1 });
competitionSchema.index({ 'participants.user': 1, 'participants.score': -1 });

const Competition = mongoose.model('Competition', competitionSchema);

module.exports = Competition;
