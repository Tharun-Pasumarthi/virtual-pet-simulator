const mongoose = require('mongoose');
const defaultPets = require('../data/defaultPets');
const PetType = require('../models/PetType');
const User = require('../models/User');
const Pet = require('../models/Pet');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      PetType.deleteMany({}),
      Pet.deleteMany({}),
      User.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create pet types
    const petTypes = await PetType.insertMany(defaultPets);
    console.log('Created pet types');

    // Create test user
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      coins: 1000
    });
    console.log('Created test user');

    // Create sample pets for test user
    const samplePets = petTypes.map(petType => ({
      name: `My ${petType.name}`,
      owner: testUser._id,
      species: petType.name,
      stats: petType.baseStats,
      level: 1,
      experience: 0,
      genetics: {
        rarity: petType.rarity,
        traits: []
      }
    }));

    await Pet.insertMany(samplePets);
    console.log('Created sample pets');

    console.log('Database seeded successfully!');
    console.log('Test user credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
