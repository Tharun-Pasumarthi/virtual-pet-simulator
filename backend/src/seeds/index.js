require('dotenv').config();
const mongoose = require('mongoose');
const PetType = require('../models/PetType');
const Item = require('../models/Item');
const Achievement = require('../models/Achievement');
const DailyTask = require('../models/DailyTask');

const petTypes = [
  {
    name: 'Cat',
    description: 'A playful and independent companion',
    baseStats: {
      maxHealth: 100,
      maxHappiness: 100,
      maxEnergy: 100,
      baseHunger: 100
    },
    traits: ['Agile', 'Independent'],
    unlockLevel: 1,
    price: 0 // Free starter pet
  },
  {
    name: 'Dog',
    description: 'A loyal and energetic friend',
    baseStats: {
      maxHealth: 120,
      maxHappiness: 120,
      maxEnergy: 110,
      baseHunger: 110
    },
    traits: ['Loyal', 'Energetic'],
    unlockLevel: 5,
    price: 1000
  },
  {
    name: 'Rabbit',
    description: 'A cute and gentle pet',
    baseStats: {
      maxHealth: 90,
      maxHappiness: 110,
      maxEnergy: 120,
      baseHunger: 90
    },
    traits: ['Quick', 'Gentle'],
    unlockLevel: 3,
    price: 750
  }
];

const items = [
  {
    name: 'Basic Food',
    type: 'food',
    description: 'Regular pet food',
    effects: {
      hunger: 20,
      happiness: 5
    },
    price: 50,
    unlockLevel: 1
  },
  {
    name: 'Premium Food',
    type: 'food',
    description: 'High-quality pet food',
    effects: {
      hunger: 40,
      happiness: 15,
      health: 5
    },
    price: 100,
    unlockLevel: 3
  },
  {
    name: 'Party Hat',
    type: 'accessory',
    description: 'A festive hat for your pet',
    effects: {
      happiness: 10
    },
    slot: 'head',
    price: 200,
    unlockLevel: 2
  },
  {
    name: 'Bow Tie',
    type: 'accessory',
    description: 'A stylish bow tie',
    effects: {
      happiness: 8
    },
    slot: 'neck',
    price: 150,
    unlockLevel: 1
  }
];

const achievements = [
  {
    name: 'New Friend',
    description: 'Adopt your first pet',
    reward: {
      coins: 100,
      experience: 50
    },
    criteria: {
      type: 'pets_owned',
      value: 1
    }
  },
  {
    name: 'Pet Collector',
    description: 'Own 3 different pets',
    reward: {
      coins: 500,
      experience: 200
    },
    criteria: {
      type: 'pets_owned',
      value: 3
    }
  },
  {
    name: 'Shopping Spree',
    description: 'Buy 5 items from the shop',
    reward: {
      coins: 300,
      experience: 100
    },
    criteria: {
      type: 'items_bought',
      value: 5
    }
  }
];

const dailyTasks = [
  {
    name: 'Feed Your Pets',
    description: 'Feed all your pets',
    reward: {
      coins: 100,
      experience: 50
    },
    requirements: {
      type: 'feed_pets',
      count: 1
    }
  },
  {
    name: 'Play Time',
    description: 'Play with your pets 3 times',
    reward: {
      coins: 150,
      experience: 75
    },
    requirements: {
      type: 'play_count',
      count: 3
    }
  },
  {
    name: 'Shopping',
    description: 'Buy an item from the shop',
    reward: {
      coins: 200,
      experience: 100
    },
    requirements: {
      type: 'buy_items',
      count: 1
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      PetType.deleteMany({}),
      Item.deleteMany({}),
      Achievement.deleteMany({}),
      DailyTask.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Insert new data
    await Promise.all([
      PetType.insertMany(petTypes),
      Item.insertMany(items),
      Achievement.insertMany(achievements),
      DailyTask.insertMany(dailyTasks)
    ]);
    console.log('Inserted seed data');

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
