require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Pet = require('../models/Pet');
const Shop = require('../models/Shop');
const MiniGame = require('../models/MiniGame');
const DailyTask = require('../models/DailyTask');

const connectDB = require('../config/database');

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Pet.deleteMany({});
    await Shop.deleteMany({});
    await MiniGame.deleteMany({});
    await DailyTask.deleteMany({});

    // Create sample users
    const users = await User.create([
      {
        username: 'testuser1',
        email: 'test1@example.com',
        password: 'password123',
        coins: 1000,
        loginStreak: 1
      },
      {
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123',
        coins: 500,
        loginStreak: 3
      }
    ]);

    // Create sample pets
    const pets = await Pet.create([
      {
        name: 'Fluffy',
        type: 'cat',
        owner: users[0]._id,
        happiness: 80,
        hunger: 70,
        energy: 90,
        lastFed: new Date(),
        lastPlayed: new Date()
      },
      {
        name: 'Rex',
        type: 'dog',
        owner: users[1]._id,
        happiness: 90,
        hunger: 85,
        energy: 95,
        lastFed: new Date(),
        lastPlayed: new Date()
      }
    ]);

    // Create shop items
    const shopItems = await Shop.create([
      {
        name: 'Premium Food',
        description: 'High-quality pet food that increases happiness and energy',
        price: 100,
        type: 'food',
        effect: {
          happiness: 20,
          energy: 30,
          hunger: 40
        }
      },
      {
        name: 'Toy Ball',
        description: 'A fun ball for your pet to play with',
        price: 50,
        type: 'toy',
        effect: {
          happiness: 15,
          energy: -10
        }
      },
      {
        name: 'Party Hat',
        description: 'A festive hat for your pet',
        price: 200,
        type: 'accessory',
        effect: {
          happiness: 10
        }
      },
      {
        name: 'Cozy Bed',
        description: 'A comfortable bed for better sleep',
        price: 300,
        type: 'furniture',
        effect: {
          energy: 20,
          happiness: 10
        }
      },
      {
        name: 'Beach Background',
        description: 'A sunny beach background',
        price: 500,
        type: 'background',
        imageUrl: '/backgrounds/beach.jpg'
      },
      {
        name: 'Park Background',
        description: 'A peaceful park background',
        price: 500,
        type: 'background',
        imageUrl: '/backgrounds/park.jpg'
      },
      {
        name: 'Gourmet Treats',
        description: 'Delicious treats for your pet',
        price: 150,
        type: 'food',
        effect: {
          happiness: 25,
          hunger: 20
        }
      },
      {
        name: 'Interactive Puzzle',
        description: 'A puzzle toy that keeps your pet entertained',
        price: 250,
        type: 'toy',
        effect: {
          happiness: 30,
          energy: -15,
          experience: 20
        }
      }
    ]);

    // Create mini games
    const miniGames = await MiniGame.create([
      {
        name: 'Fetch',
        description: 'Play fetch with your pet',
        rewardCoins: 50,
        energyCost: 20,
        minHappinessGain: 10,
        maxHappinessGain: 25
      },
      {
        name: 'Hide and Seek',
        description: 'Play hide and seek with your pet',
        rewardCoins: 75,
        energyCost: 30,
        minHappinessGain: 15,
        maxHappinessGain: 35
      }
    ]);

    // Create daily tasks
    const dailyTasks = await DailyTask.create([
      {
        title: 'Feed your pet',
        description: 'Feed your pet 3 times today',
        rewardCoins: 100,
        requiredActions: 3,
        type: 'feeding'
      },
      {
        title: 'Play mini games',
        description: 'Play 2 mini games with your pet',
        rewardCoins: 150,
        requiredActions: 2,
        type: 'minigame'
      }
    ]);

    console.log('Sample data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
