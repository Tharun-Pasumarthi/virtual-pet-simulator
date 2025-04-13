const express = require('express');
const auth = require('../middleware/auth');
const { MiniGame, GameProgress } = require('../models/MiniGame');
const Pet = require('../models/Pet');
const { cacheMiddleware } = require('../utils/cache');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const router = express.Router();

// Get available mini-games
router.get('/', auth, cacheMiddleware(300), catchAsync(async (req, res) => {
  const games = await MiniGame.find();
  res.json({
    status: 'success',
    data: { games }
  });
}));

// Get user's game progress
router.get('/progress', auth, catchAsync(async (req, res) => {
  const progress = await GameProgress.find({ user: req.user._id })
    .populate('game');
  
  res.json({
    status: 'success',
    data: { progress }
  });
}));

// Start mini-game
router.post('/start', auth, catchAsync(async (req, res) => {
  const { gameId, petId } = req.body;

  const [game, pet, lastProgress] = await Promise.all([
    MiniGame.findById(gameId),
    Pet.findOne({ _id: petId, owner: req.user._id }),
    GameProgress.findOne({ 
      user: req.user._id, 
      game: gameId 
    }).sort({ lastPlayed: -1 })
  ]);

  if (!game) {
    throw new AppError('Game not found', 404);
  }

  if (!pet) {
    throw new AppError('Pet not found', 404);
  }

  // Check cooldown
  if (lastProgress && game.cooldown > 0) {
    const cooldownEnd = new Date(lastProgress.lastPlayed.getTime() + game.cooldown * 60000);
    if (cooldownEnd > new Date()) {
      throw new AppError('Game is still on cooldown', 400);
    }
  }

  // Check pet energy
  if (pet.stats.energy < game.energyCost) {
    throw new AppError('Pet does not have enough energy', 400);
  }

  // Deduct energy
  pet.stats.energy -= game.energyCost;
  await pet.save();

  res.json({
    status: 'success',
    data: { 
      game,
      pet,
      gameSession: {
        startTime: new Date(),
        maxDuration: 300 // 5 minutes max per game
      }
    }
  });
}));

// Submit game result
router.post('/finish', auth, catchAsync(async (req, res) => {
  const { gameId, petId, score, duration } = req.body;

  if (duration > 300) {
    throw new AppError('Invalid game duration', 400);
  }

  const [game, pet] = await Promise.all([
    MiniGame.findById(gameId),
    Pet.findOne({ _id: petId, owner: req.user._id })
  ]);

  if (!game || !pet) {
    throw new AppError('Game or pet not found', 404);
  }

  // Calculate rewards based on score
  const scoreRatio = Math.min(1, score / 1000); // Normalize score to 0-1
  const coins = Math.floor(game.rewards.coins.min + 
    (game.rewards.coins.max - game.rewards.coins.min) * scoreRatio);
  const experience = Math.floor(game.rewards.experience.min + 
    (game.rewards.experience.max - game.rewards.experience.min) * scoreRatio);

  // Update pet stats
  Object.entries(game.rewards.statBoosts).forEach(([stat, boost]) => {
    if (pet.stats[stat] !== undefined) {
      pet.stats[stat] = Math.min(100, pet.stats[stat] + boost * scoreRatio);
    }
  });

  // Add rewards
  req.user.coins += coins;
  await pet.addExperience(experience);

  // Update game progress
  await GameProgress.findOneAndUpdate(
    { user: req.user._id, game: gameId },
    {
      $set: { lastPlayed: new Date() },
      $inc: { timesPlayed: 1, totalCoinsEarned: coins },
      $max: { highScore: score }
    },
    { upsert: true }
  );

  await Promise.all([pet.save(), req.user.save()]);

  res.json({
    status: 'success',
    data: {
      rewards: { coins, experience },
      pet,
      user: { coins: req.user.coins }
    }
  });
}));

module.exports = router;
