const mongoose = require('mongoose');

const miniGameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['puzzle', 'memory', 'racing', 'platformer', 'rhythm', 'card', 'match3', 'quiz'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    required: true,
    default: 'easy'
  },
  rewards: {
    coins: {
      base: Number,
      perDifficulty: {
        easy: Number,
        medium: Number,
        hard: Number,
        expert: Number
      }
    },
    experience: {
      base: Number,
      perDifficulty: {
        easy: Number,
        medium: Number,
        hard: Number,
        expert: Number
      }
    },
    items: [{
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShopItem'
      },
      chance: Number, // Percentage chance to drop
      minQuantity: Number,
      maxQuantity: Number
    }],
    statBoosts: {
      hunger: Number,
      happiness: Number,
      energy: Number,
      intelligence: Number,
      strength: Number,
      agility: Number
    }
  },
  powerUps: [{
    name: String,
    description: String,
    type: {
      type: String,
      enum: ['time', 'score', 'helper', 'shield', 'multiplier']
    },
    effect: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    duration: Number, // in seconds
    cooldown: Number, // in seconds
    cost: {
      coins: Number,
      energy: Number
    },
    unlockRequirement: {
      type: {
        type: String,
        enum: ['level', 'achievement', 'score']
      },
      value: Number
    }
  }],
  gameConfig: {
    timeLimit: Number, // in seconds
    targetScore: Number,
    lives: Number,
    gridSize: {
      width: Number,
      height: Number
    },
    customConfig: mongoose.Schema.Types.Mixed
  },
  energyCost: {
    base: {
      type: Number,
      required: true
    },
    perDifficulty: {
      easy: Number,
      medium: Number,
      hard: Number,
      expert: Number
    }
  },
  cooldown: {
    base: {
      type: Number,
      default: 0 // minutes
    },
    perDifficulty: {
      easy: Number,
      medium: Number,
      hard: Number,
      expert: Number
    }
  },
  requiredLevel: {
    type: Number,
    default: 1
  },
  seasonalModifiers: {
    isActive: {
      type: Boolean,
      default: false
    },
    season: {
      type: String,
      enum: ['spring', 'summer', 'autumn', 'winter', 'event']
    },
    multipliers: {
      coins: Number,
      experience: Number
    },
    specialPowerUps: [{
      name: String,
      description: String,
      effect: mongoose.Schema.Types.Mixed
    }]
  }
}, {
  timestamps: true
});

const gameProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MiniGame',
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    required: true
  },
  highScores: {
    easy: Number,
    medium: Number,
    hard: Number,
    expert: Number
  },
  lastPlayed: Date,
  timesPlayed: {
    total: {
      type: Number,
      default: 0
    },
    perDifficulty: {
      easy: Number,
      medium: Number,
      hard: Number,
      expert: Number
    }
  },
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  powerUpsUnlocked: [{
    powerUp: String,
    unlockedAt: Date
  }],
  stats: {
    totalCoinsEarned: {
      type: Number,
      default: 0
    },
    totalExperienceGained: {
      type: Number,
      default: 0
    },
    totalTimePlayed: {
      type: Number,
      default: 0 // in seconds
    },
    perfectGames: {
      type: Number,
      default: 0
    }
  },
  seasonalStats: {
    season: String,
    coinsEarned: Number,
    experienceGained: Number,
    highScore: Number
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
miniGameSchema.index({ type: 1, difficulty: 1 });
miniGameSchema.index({ 'seasonalModifiers.isActive': 1, 'seasonalModifiers.season': 1 });

gameProgressSchema.index({ user: 1, game: 1 }, { unique: true });
gameProgressSchema.index({ 'highScores.easy': -1 });
gameProgressSchema.index({ 'highScores.medium': -1 });
gameProgressSchema.index({ 'highScores.hard': -1 });
gameProgressSchema.index({ 'highScores.expert': -1 });

const MiniGame = mongoose.model('MiniGame', miniGameSchema);
const GameProgress = mongoose.model('GameProgress', gameProgressSchema);

module.exports = { MiniGame, GameProgress };
