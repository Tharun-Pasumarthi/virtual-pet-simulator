const express = require('express');
const auth = require('../middleware/auth');
const Pet = require('../models/Pet');
const PetType = require('../models/PetType');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const router = express.Router();

// Get available breeding pairs
router.get('/available', auth, catchAsync(async (req, res) => {
  const pets = await Pet.find({
    owner: req.user._id,
    canBreed: true,
    health: { $gte: 50 }
  }).populate('petType');

  // Group pets by type for breeding compatibility
  const breedingPairs = pets.reduce((acc, pet) => {
    const typeId = pet.petType._id.toString();
    if (!acc[typeId]) {
      acc[typeId] = [];
    }
    acc[typeId].push(pet);
    return acc;
  }, {});

  // Filter out types with less than 2 pets
  const availablePairs = Object.entries(breedingPairs)
    .filter(([_, pets]) => pets.length >= 2)
    .reduce((acc, [typeId, pets]) => {
      acc[typeId] = pets;
      return acc;
    }, {});

  res.json({
    status: 'success',
    data: {
      availablePairs
    }
  });
}));

// Breed two pets
router.post('/', auth, catchAsync(async (req, res) => {
  const { pet1Id, pet2Id } = req.body;

  // Validate input
  if (!pet1Id || !pet2Id) {
    throw new AppError('Both parent pets must be specified', 400);
  }

  // Get both parent pets
  const [pet1, pet2] = await Promise.all([
    Pet.findOne({ _id: pet1Id, owner: req.user._id }).populate('petType'),
    Pet.findOne({ _id: pet2Id, owner: req.user._id }).populate('petType')
  ]);

  // Validate pets exist and are owned by user
  if (!pet1 || !pet2) {
    throw new AppError('One or both pets not found or not owned by user', 404);
  }

  // Validate breeding compatibility
  if (pet1.petType._id.toString() !== pet2.petType._id.toString()) {
    throw new AppError('Pets must be of the same type to breed', 400);
  }

  if (!pet1.canBreed || !pet2.canBreed) {
    throw new AppError('One or both pets cannot breed at this time', 400);
  }

  if (pet1.health < 50 || pet2.health < 50) {
    throw new AppError('Both pets must have at least 50% health to breed', 400);
  }

  // Create offspring
  const offspring = await Pet.create({
    name: 'Baby ' + pet1.name,
    petType: pet1.petType._id,
    owner: req.user._id,
    health: 100,
    happiness: 100,
    parents: [pet1._id, pet2._id]
  });

  // Update parent pets
  await Promise.all([
    Pet.findByIdAndUpdate(pet1._id, {
      canBreed: false,
      health: Math.max(0, pet1.health - 30),
      happiness: Math.max(0, pet1.happiness - 20)
    }),
    Pet.findByIdAndUpdate(pet2._id, {
      canBreed: false,
      health: Math.max(0, pet2.health - 30),
      happiness: Math.max(0, pet2.happiness - 20)
    })
  ]);

  res.json({
    status: 'success',
    data: {
      offspring
    }
  });
}));

module.exports = router;
