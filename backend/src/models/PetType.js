const mongoose = require('mongoose');

const petTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  species: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'dragon', 'unicorn', 'phoenix', 'robot']
  },
  rarity: {
    type: String,
    required: true,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  baseStats: {
    hunger: { type: Number, required: true },
    happiness: { type: Number, required: true },
    energy: { type: Number, required: true },
    intelligence: { type: Number, required: true },
    strength: { type: Number, required: true },
    agility: { type: Number, required: true }
  },
  traits: [{
    name: String,
    description: String,
    effect: {
      stat: String,
      value: Number
    }
  }],
  animations: {
    idle: {
      frames: [String],
      duration: Number
    },
    happy: {
      frames: [String],
      duration: Number
    },
    sleeping: {
      frames: [String],
      duration: Number
    },
    eating: {
      frames: [String],
      duration: Number
    },
    playing: {
      frames: [String],
      duration: Number
    }
  },
  customizationOptions: {
    colors: [{
      name: String,
      primary: String,
      secondary: String,
      unlockRequirement: {
        type: { type: String, enum: ['level', 'achievement', 'event'] },
        value: String
      }
    }],
    patterns: [{
      name: String,
      texture: String,
      unlockRequirement: {
        type: { type: String, enum: ['level', 'achievement', 'event'] },
        value: String
      }
    }]
  },
  specialAbilities: [{
    name: String,
    description: String,
    unlockLevel: Number,
    cooldown: Number,
    effect: {
      type: { type: String, enum: ['buff', 'game', 'interaction'] },
      value: mongoose.Schema.Types.Mixed
    }
  }],
  seasonalVariant: {
    isAvailable: { type: Boolean, default: false },
    season: {
      type: String,
      enum: ['spring', 'summer', 'autumn', 'winter', 'event']
    },
    startDate: Date,
    endDate: Date,
    specialTraits: [{
      name: String,
      description: String,
      effect: mongoose.Schema.Types.Mixed
    }]
  },
  breedingCompatibility: [{
    species: String,
    resultTypes: [String],
    traitInheritance: {
      dominant: [String],
      recessive: [String]
    }
  }]
}, {
  timestamps: true
});

// Add indexes for efficient querying
petTypeSchema.index({ species: 1, rarity: 1 });
petTypeSchema.index({ 'seasonalVariant.isAvailable': 1, 'seasonalVariant.season': 1 });

const PetType = mongoose.model('PetType', petTypeSchema);

module.exports = PetType;
