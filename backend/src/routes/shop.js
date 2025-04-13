const express = require('express');
const router = express.Router();
const shopItems = require('../data/shopItems');
const User = require('../models/User');
const Pet = require('../models/Pet');
const auth = require('../middleware/auth');

// Get all shop items
router.get('/items', auth, async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: {
        items: shopItems
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: 'Server error'
    });
  }
});

// Get available pet types
router.get('/pet-types', auth, async (req, res) => {
  try {
    const petTypes = await Pet.distinct('type');
    res.json({
      status: 'success',
      data: {
        petTypes
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: 'Server error'
    });
  }
});

// Purchase an item
router.post('/purchase', auth, async (req, res) => {
  try {
    const { itemId, petId, quantity = 1 } = req.body;
    const item = shopItems.find(i => i.id === itemId);

    if (!item) {
      return res.status(404).json({
        status: 'error',
        error: 'Item not found'
      });
    }

    const user = await User.findById(req.user.id);
    const totalCost = item.price * quantity;

    if (user.coins < totalCost) {
      return res.status(400).json({
        status: 'error',
        error: 'Insufficient coins'
      });
    }

    // Update user's coins
    user.coins -= totalCost;
    await user.save();

    // If item is to be used on a pet
    if (petId) {
      const pet = await Pet.findById(petId);
      if (!pet) {
        return res.status(404).json({
          status: 'error',
          error: 'Pet not found'
        });
      }

      // Add item to pet's inventory based on type
      if (item.type === 'food') {
        const foodItem = pet.inventory.food.find(f => f.item.toString() === itemId);
        if (foodItem) {
          foodItem.quantity += quantity;
        } else {
          pet.inventory.food.push({ item: itemId, quantity });
        }
      } else if (item.type === 'accessory') {
        const accessoryItem = pet.inventory.accessories.find(a => a.item.toString() === itemId);
        if (accessoryItem) {
          accessoryItem.quantity += quantity;
        } else {
          pet.inventory.accessories.push({ item: itemId, quantity });
        }
      }

      await pet.save();
    }

    res.json({
      status: 'success',
      data: {
        message: 'Purchase successful',
        user: {
          coins: user.coins
        },
        pet: petId ? await Pet.findById(petId).populate('inventory.food.item inventory.accessories.item') : null
      }
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({
      status: 'error',
      error: 'Server error'
    });
  }
});

module.exports = router;
