const express = require('express');
const auth = require('../middleware/auth');
const Pet = require('../models/Pet');
const router = express.Router();

// Get all pets for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id });
    res.json({ success: true, data: pets });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get a specific pet
router.get('/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    res.json({ success: true, data: pet });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a new pet
router.post('/', auth, async (req, res) => {
  try {
    const { name, species, position } = req.body;
    
    const pet = new Pet({
      name,
      species,
      owner: req.user.id,
      position: position || { x: 50, y: 50 }
    });
    
    await pet.save();
    res.status(201).json({ success: true, data: pet });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update pet position
router.patch('/:id/position', auth, async (req, res) => {
  try {
    const { position } = req.body;
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    
    // Validate position values
    if (!position || 
        typeof position.x !== 'number' || 
        typeof position.y !== 'number' ||
        position.x < 0 || position.x > 100 ||
        position.y < 0 || position.y > 100) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid position values. Must be between 0 and 100.' 
      });
    }
    
    pet.position = position;
    await pet.save();
    
    res.json({ success: true, data: pet });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Pet interaction (feed, play, sleep, pet)
router.post('/:id/action', auth, async (req, res) => {
  try {
    const { action } = req.body;
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user.id });
    
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }
    
    // Update stats based on time passed
    await pet.updateStats();
    
    // Handle different actions
    switch (action) {
      case 'feed':
        pet.stats.hunger = Math.min(100, pet.stats.hunger + 30);
        pet.stats.happiness = Math.min(100, pet.stats.happiness + 10);
        break;
      case 'play':
        if (pet.stats.energy < 20) {
          return res.status(400).json({ success: false, message: 'Pet is too tired to play' });
        }
        pet.stats.playfulness = Math.min(100, pet.stats.playfulness + 30);
        pet.stats.happiness = Math.min(100, pet.stats.happiness + 20);
        pet.stats.energy = Math.max(0, pet.stats.energy - 20);
        break;
      case 'sleep':
        pet.stats.energy = Math.min(100, pet.stats.energy + 50);
        break;
      case 'pet':
        pet.stats.happiness = Math.min(100, pet.stats.happiness + 15);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid action' });
    }
    
    // Add experience for interaction
    const levelUp = await pet.addExperience(10);
    
    pet.lastInteraction = new Date();
    await pet.save();
    
    res.json({ 
      success: true, 
      data: { 
        pet,
        levelUp
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
