const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  species: {
    type: String,
    required: true
  },
  position: {
    x: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    },
    y: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    }
  },
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  stats: {
    hunger: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    },
    happiness: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    },
    energy: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    },
    playfulness: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    }
  },
  lastInteraction: {
    type: Date,
    default: Date.now
  },
  accessories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset'
  }],
  appearance: {
    color: String,
    pattern: String,
    accessories: [String]
  },
  genetics: {
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
      default: 'common'
    },
    traits: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for pet's current emotion state
petSchema.virtual('emotionState').get(function() {
  const { hunger, happiness, energy, playfulness } = this.stats;
  
  if (hunger < 30) return 'hungry';
  if (energy < 30) return 'tired';
  if (happiness < 30) return 'sad';
  if (playfulness < 30) return 'bored';
  
  if (hunger > 80 && happiness > 80 && energy > 80) return 'ecstatic';
  if (happiness > 70) return 'happy';
  
  return 'neutral';
});

// Method to update stats based on time passed
petSchema.methods.updateStats = async function() {
  const now = new Date();
  const timePassed = (now - this.lastInteraction) / 1000; // in seconds
  
  // Decrease stats based on time (slower rate when offline)
  this.stats.hunger = Math.max(0, this.stats.hunger - (timePassed * 0.01));
  this.stats.happiness = Math.max(0, this.stats.happiness - (timePassed * 0.008));
  this.stats.energy = Math.max(0, this.stats.energy - (timePassed * 0.005));
  this.stats.playfulness = Math.max(0, this.stats.playfulness - (timePassed * 0.012));
  
  this.lastInteraction = now;
  return this.save();
};

// Method to add experience and handle leveling up
petSchema.methods.addExperience = async function(amount) {
  this.experience += amount;
  
  // Check for level up (each level requires more XP)
  const xpNeeded = this.level * 100;
  if (this.experience >= xpNeeded) {
    this.level += 1;
    this.experience -= xpNeeded;
    return true; // Indicates level up occurred
  }
  return false;
};

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;
