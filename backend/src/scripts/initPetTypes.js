const mongoose = require('mongoose');
const PetType = require('../models/PetType');
require('dotenv').config();

const petTypes = [
  {
    name: 'Common Dog',
    species: 'dog',
    rarity: 'common',
    baseStats: {
      hunger: 100,
      happiness: 100,
      energy: 100,
      intelligence: 50,
      strength: 50,
      agility: 50
    },
    traits: [
      {
        name: 'Loyal',
        description: 'Gains happiness faster from interactions',
        effect: {
          stat: 'happiness',
          value: 1.2
        }
      }
    ],
    animations: {
      idle: {
        frames: ['🐕'],
        duration: 1000
      },
      happy: {
        frames: ['🐕', '🐕‍🦺'],
        duration: 500
      },
      sleeping: {
        frames: ['💤', '🐕'],
        duration: 2000
      },
      eating: {
        frames: ['🐕', '🦴'],
        duration: 1000
      },
      playing: {
        frames: ['🐕', '🎾'],
        duration: 500
      }
    }
  },
  {
    name: 'Common Cat',
    species: 'cat',
    rarity: 'common',
    baseStats: {
      hunger: 100,
      happiness: 100,
      energy: 100,
      intelligence: 60,
      strength: 40,
      agility: 70
    },
    traits: [
      {
        name: 'Independent',
        description: 'Loses happiness slower when alone',
        effect: {
          stat: 'happiness',
          value: 0.8
        }
      }
    ],
    animations: {
      idle: {
        frames: ['🐱'],
        duration: 1000
      },
      happy: {
        frames: ['😺', '😸'],
        duration: 500
      },
      sleeping: {
        frames: ['💤', '🐱'],
        duration: 2000
      },
      eating: {
        frames: ['🐱', '🐟'],
        duration: 1000
      },
      playing: {
        frames: ['🐱', '🧶'],
        duration: 500
      }
    }
  },
  {
    name: 'Baby Dragon',
    species: 'dragon',
    rarity: 'rare',
    baseStats: {
      hunger: 150,
      happiness: 100,
      energy: 120,
      intelligence: 80,
      strength: 90,
      agility: 70
    },
    traits: [
      {
        name: 'Fire Breath',
        description: 'Special ability that generates more coins',
        effect: {
          stat: 'coins',
          value: 2
        }
      }
    ],
    animations: {
      idle: {
        frames: ['🐲'],
        duration: 1000
      },
      happy: {
        frames: ['🐲', '✨'],
        duration: 500
      },
      sleeping: {
        frames: ['💤', '🐲'],
        duration: 2000
      },
      eating: {
        frames: ['🐲', '🔥'],
        duration: 1000
      },
      playing: {
        frames: ['🐲', '⚡'],
        duration: 500
      }
    }
  }
];

async function initPetTypes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing pet types
    await PetType.deleteMany({});
    console.log('Cleared existing pet types');

    // Insert new pet types
    const result = await PetType.insertMany(petTypes);
    console.log(`Added ${result.length} pet types`);

    console.log('Pet types initialized successfully');
  } catch (error) {
    console.error('Error initializing pet types:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

initPetTypes();
