const mongoose = require('mongoose');
const Asset = require('../models/Asset');
const PetType = require('../models/PetType');

const sampleAssets = [
  // Cat assets
  {
    type: 'image',
    category: 'idle',
    filename: 'cat-idle.png',
    path: '/assets/images/cat-idle.png'
  },
  {
    type: 'image',
    category: 'happy',
    filename: 'cat-happy.png',
    path: '/assets/images/cat-happy.png'
  },
  {
    type: 'audio',
    category: 'happy',
    filename: 'cat-purr.mp3',
    path: '/assets/audio/cat-purr.mp3'
  },
  // Dog assets
  {
    type: 'image',
    category: 'idle',
    filename: 'dog-idle.png',
    path: '/assets/images/dog-idle.png'
  },
  {
    type: 'image',
    category: 'happy',
    filename: 'dog-happy.png',
    path: '/assets/images/dog-happy.png'
  },
  {
    type: 'audio',
    category: 'happy',
    filename: 'dog-bark.mp3',
    path: '/assets/audio/dog-bark.mp3'
  },
  // Common assets
  {
    type: 'animation',
    category: 'eating',
    filename: 'eating.json',
    path: '/assets/animations/eating.json'
  },
  {
    type: 'animation',
    category: 'sleeping',
    filename: 'sleeping.json',
    path: '/assets/animations/sleeping.json'
  }
];

async function seedAssets() {
  try {
    await mongoose.connect('mongodb://localhost:27017/virtual-pet-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Create pet types if they don't exist
    const catType = await PetType.findOneAndUpdate(
      { name: 'Cat' },
      { 
        name: 'Cat',
        description: 'A lovely feline companion',
        basePrice: 100,
        maxHealth: 100,
        maxHappiness: 100
      },
      { upsert: true, new: true }
    );

    const dogType = await PetType.findOneAndUpdate(
      { name: 'Dog' },
      {
        name: 'Dog',
        description: 'A loyal canine friend',
        basePrice: 120,
        maxHealth: 100,
        maxHappiness: 100
      },
      { upsert: true, new: true }
    );

    // Associate assets with pet types
    const catAssets = sampleAssets.slice(0, 3).map(asset => ({
      ...asset,
      petType: catType._id
    }));

    const dogAssets = sampleAssets.slice(3, 6).map(asset => ({
      ...asset,
      petType: dogType._id
    }));

    const commonAssets = sampleAssets.slice(6).map(asset => ({
      ...asset,
      petType: [catType._id, dogType._id]
    }));

    // Clear existing assets
    await Asset.deleteMany({});

    // Insert new assets
    await Asset.insertMany([...catAssets, ...dogAssets, ...commonAssets]);

    console.log('Sample assets seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding assets:', error);
    process.exit(1);
  }
}

seedAssets();
