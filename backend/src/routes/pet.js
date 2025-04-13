const express = require('express');
const auth = require('../middleware/auth');
const Pet = require('../models/Pet');
const PetType = require('../models/PetType');
const ShopItem = require('../models/Shop');
const { cacheMiddleware } = require('../utils/cache');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const router = express.Router();

// Get user's pets
router.get('/my-pets', auth, cacheMiddleware(60), catchAsync(async (req, res) => {
  const pets = await Pet.find({ owner: req.user._id })
    .populate('petType')
    .populate('inventory.accessories.item')
    .populate('inventory.food.item');
  
  res.json({
    status: 'success',
    data: { pets }
  });
}));

// Create new pet
router.post('/', auth, catchAsync(async (req, res) => {
  const { name, petTypeId } = req.body;

  const petType = await PetType.findById(petTypeId);
  if (!petType) {
    throw new AppError('Pet type not found', 404);
  }

  const pet = new Pet({
    owner: req.user._id,
    name,
    petType: petTypeId,
    genetics: {
      color: 'default',
      pattern: 'default',
      rarity: 'common'
    }
  });

  await pet.save();

  res.status(201).json({
    status: 'success',
    data: { pet }
  });
}));

// Feed pet
router.post('/:petId/feed', auth, catchAsync(async (req, res) => {
  const { foodItemId } = req.body;
  const pet = await Pet.findOne({ _id: req.params.petId, owner: req.user._id });
  
  if (!pet) {
    throw new AppError('Pet not found', 404);
  }

  const foodItem = pet.inventory.food.find(f => f.item.toString() === foodItemId);
  if (!foodItem || foodItem.quantity < 1) {
    throw new AppError('Food item not found in inventory', 404);
  }

  const shopItem = await ShopItem.findById(foodItemId);
  if (!shopItem || shopItem.type !== 'food') {
    throw new AppError('Invalid food item', 400);
  }

  // Apply food effects
  pet.stats.hunger = Math.min(100, pet.stats.hunger + (shopItem.effects.hunger || 0));
  pet.stats.happiness = Math.min(100, pet.stats.happiness + (shopItem.effects.happiness || 0));
  pet.stats.energy = Math.min(100, pet.stats.energy + (shopItem.effects.energy || 0));
  
  // Remove food from inventory
  foodItem.quantity -= 1;
  if (foodItem.quantity <= 0) {
    pet.inventory.food = pet.inventory.food.filter(f => f.item.toString() !== foodItemId);
  }

  pet.lastFed = new Date();
  await pet.save();

  res.json({
    status: 'success',
    data: { pet }
  });
}));

// Play with pet
router.post('/:petId/play', auth, catchAsync(async (req, res) => {
  const pet = await Pet.findOne({ _id: req.params.petId, owner: req.user._id });
  
  if (!pet) {
    throw new AppError('Pet not found', 404);
  }

  if (pet.stats.energy < 20) {
    throw new AppError('Pet is too tired to play', 400);
  }

  // Play effects
  pet.stats.happiness = Math.min(100, pet.stats.happiness + 15);
  pet.stats.playfulness = Math.min(100, pet.stats.playfulness + 20);
  pet.stats.energy = Math.max(0, pet.stats.energy - 10);
  
  pet.lastPlayed = new Date();
  await pet.addExperience(5);
  await pet.save();

  res.json({
    status: 'success',
    data: { pet }
  });
}));

// Put pet to sleep
router.post('/:petId/sleep', auth, catchAsync(async (req, res) => {
  const pet = await Pet.findOne({ _id: req.params.petId, owner: req.user._id });
  
  if (!pet) {
    throw new AppError('Pet not found', 404);
  }

  pet.stats.energy = 100;
  pet.lastSlept = new Date();
  await pet.save();

  res.json({
    status: 'success',
    data: { pet }
  });
}));

// Breed pets
router.post('/breed', auth, catchAsync(async (req, res) => {
  const { pet1Id, pet2Id } = req.body;
  
  const [pet1, pet2] = await Promise.all([
    Pet.findOne({ _id: pet1Id, owner: req.user._id }).populate('petType'),
    Pet.findOne({ _id: pet2Id, owner: req.user._id }).populate('petType')
  ]);

  if (!pet1 || !pet2) {
    throw new AppError('One or both pets not found', 404);
  }

  if (!pet1.canBreed() || !pet2.canBreed()) {
    throw new AppError('One or both pets are not ready to breed', 400);
  }

  // Create new pet with inherited traits
  const newPet = new Pet({
    owner: req.user._id,
    name: 'Baby Pet', // User can rename later
    petType: pet1.petType._id,
    parents: [pet1._id, pet2._id],
    genetics: {
      color: Math.random() > 0.5 ? pet1.genetics.color : pet2.genetics.color,
      pattern: Math.random() > 0.5 ? pet1.genetics.pattern : pet2.genetics.pattern,
      traits: [...new Set([...pet1.genetics.traits, ...pet2.genetics.traits])].slice(0, 3),
      rarity: calculateBreedingRarity(pet1.genetics.rarity, pet2.genetics.rarity)
    }
  });

  await newPet.save();

  // Update parent pets
  pet1.children.push(newPet._id);
  pet2.children.push(newPet._id);
  
  await Promise.all([
    pet1.startBreedingCooldown(pet1.petType.breedingCooldown),
    pet2.startBreedingCooldown(pet2.petType.breedingCooldown)
  ]);

  res.status(201).json({
    status: 'success',
    data: { pet: newPet }
  });
}));

// Helper function to calculate breeding rarity
function calculateBreedingRarity(rarity1, rarity2) {
  const rarityLevels = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  const r1 = rarityLevels.indexOf(rarity1);
  const r2 = rarityLevels.indexOf(rarity2);
  
  const chance = Math.random();
  if (chance < 0.1) {
    return rarityLevels[Math.min(4, Math.max(r1, r2) + 1)];
  } else if (chance < 0.4) {
    return rarityLevels[Math.max(r1, r2)];
  } else {
    return rarityLevels[Math.min(r1, r2)];
  }
}

module.exports = router;
