const shopItems = [
  // Food Items
  {
    id: 'food_basic',
    name: 'Basic Pet Food',
    description: 'Standard nutritious food for your pet',
    type: 'food',
    price: 10,
    effects: {
      hunger: 20,
      happiness: 5
    },
    icon: '🍖',
    rarity: 'common'
  },
  {
    id: 'food_premium',
    name: 'Premium Pet Food',
    description: 'High-quality food that pets love',
    type: 'food',
    price: 25,
    effects: {
      hunger: 40,
      happiness: 15,
      energy: 10
    },
    icon: '🥩',
    rarity: 'rare'
  },
  {
    id: 'food_royal',
    name: 'Royal Feast',
    description: 'Luxurious meal fit for legendary pets',
    type: 'food',
    price: 50,
    effects: {
      hunger: 100,
      happiness: 30,
      energy: 25
    },
    icon: '👑',
    rarity: 'legendary'
  },

  // Toys
  {
    id: 'toy_ball',
    name: 'Bouncy Ball',
    description: 'A simple ball for playing fetch',
    type: 'toy',
    price: 15,
    effects: {
      happiness: 15,
      energy: -10
    },
    icon: '⚽',
    rarity: 'common'
  },
  {
    id: 'toy_puzzle',
    name: 'Pet Puzzle',
    description: 'Stimulating puzzle toy for smart pets',
    type: 'toy',
    price: 35,
    effects: {
      happiness: 25,
      intelligence: 10,
      energy: -15
    },
    icon: '🧩',
    rarity: 'rare'
  },
  {
    id: 'toy_robot',
    name: 'Interactive Robot',
    description: 'High-tech toy that plays with your pet',
    type: 'toy',
    price: 75,
    effects: {
      happiness: 40,
      intelligence: 20,
      energy: -20
    },
    icon: '🤖',
    rarity: 'legendary'
  },

  // Medicine
  {
    id: 'medicine_basic',
    name: 'Basic Medicine',
    description: 'Helps your pet recover from minor ailments',
    type: 'medicine',
    price: 30,
    effects: {
      health: 30
    },
    icon: '💊',
    rarity: 'common'
  },
  {
    id: 'medicine_advanced',
    name: 'Advanced Medicine',
    description: 'Powerful medicine for serious conditions',
    type: 'medicine',
    price: 60,
    effects: {
      health: 70
    },
    icon: '🏥',
    rarity: 'rare'
  },

  // Training Items
  {
    id: 'training_basic',
    name: 'Training Manual',
    description: 'Basic training guide for pets',
    type: 'training',
    price: 40,
    effects: {
      intelligence: 15,
      energy: -20
    },
    icon: '📖',
    rarity: 'common'
  },
  {
    id: 'training_advanced',
    name: 'Advanced Training Kit',
    description: 'Professional training equipment',
    type: 'training',
    price: 80,
    effects: {
      intelligence: 30,
      strength: 20,
      energy: -35
    },
    icon: '🎯',
    rarity: 'rare'
  }
];

module.exports = shopItems;
