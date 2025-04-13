const express = require('express');
const auth = require('../middleware/auth');
const Pet = require('../models/Pet');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const router = express.Router();

// Get all owned pets
router.get('/', auth, catchAsync(async (req, res) => {
  const pets = await Pet.find({ owner: req.user._id })
    .populate('petType')
    .populate('inventory.accessories.item')
    .populate('inventory.food.item');

  res.json({
    status: 'success',
    data: {
      pets
    }
  });
}));

// Get a specific owned pet
router.get('/:petId', auth, catchAsync(async (req, res) => {
  const pet = await Pet.findOne({ 
    _id: req.params.petId,
    owner: req.user._id 
  })
    .populate('petType')
    .populate('inventory.accessories.item')
    .populate('inventory.food.item');

  if (!pet) {
    throw new AppError('Pet not found or not owned by user', 404);
  }

  res.json({
    status: 'success',
    data: {
      pet
    }
  });
}));

// Update a pet's name
router.patch('/:petId/name', auth, catchAsync(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new AppError('Name is required', 400);
  }

  const pet = await Pet.findOneAndUpdate(
    { _id: req.params.petId, owner: req.user._id },
    { name },
    { new: true, runValidators: true }
  );

  if (!pet) {
    throw new AppError('Pet not found or not owned by user', 404);
  }

  res.json({
    status: 'success',
    data: {
      pet
    }
  });
}));

module.exports = router;
