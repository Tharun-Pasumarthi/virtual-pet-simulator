const defaultPets = [
  {
    name: 'Dragon',
    species: 'dragon',
    description: 'A magical dragon that breathes fire',
    baseStats: {
      hunger: 100,
      happiness: 100,
      energy: 100,
      playfulness: 100,
      strength: 80,
      agility: 70,
      intelligence: 90
    },
    rarity: 'legendary',
    price: 1000,
    sprites: {
      idle: '/assets/pets/dragon/idle.png',
      happy: '/assets/pets/dragon/happy.png',
      sad: '/assets/pets/dragon/sad.png',
      sleeping: '/assets/pets/dragon/sleeping.png'
    }
  },
  {
    name: 'Cat',
    species: 'cat',
    description: 'A cute and playful kitty',
    baseStats: {
      hunger: 100,
      happiness: 100,
      energy: 100,
      playfulness: 100,
      strength: 50,
      agility: 90,
      intelligence: 70
    },
    rarity: 'common',
    price: 100,
    sprites: {
      idle: '/assets/pets/cat/idle.png',
      happy: '/assets/pets/cat/happy.png',
      sad: '/assets/pets/cat/sad.png',
      sleeping: '/assets/pets/cat/sleeping.png'
    }
  },
  {
    name: 'Robot',
    species: 'robot',
    description: 'A mechanical companion',
    baseStats: {
      hunger: 100,
      happiness: 100,
      energy: 100,
      playfulness: 100,
      strength: 100,
      agility: 60,
      intelligence: 100
    },
    rarity: 'rare',
    price: 500,
    sprites: {
      idle: '/assets/pets/robot/idle.png',
      happy: '/assets/pets/robot/happy.png',
      sad: '/assets/pets/robot/sad.png',
      sleeping: '/assets/pets/robot/sleeping.png'
    }
  }
];

module.exports = defaultPets;
