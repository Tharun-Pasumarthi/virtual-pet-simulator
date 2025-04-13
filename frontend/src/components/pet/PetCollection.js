import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../../contexts/PetContext';
import './PetCollection.css';

const PET_TYPES = [
  { id: 'dog', name: 'Dog', image: '/assets/pets/common/dog.png', cost: 0 },
  { id: 'cat', name: 'Cat', image: '/assets/pets/common/cat.png', cost: 100 },
  { id: 'hamster', name: 'Hamster', image: '/assets/pets/common/hamster.png', cost: 80 }
];

const PetCollection = () => {
  const { pets = [], buyPet, coins = 0 } = usePet() || {};
  const navigate = useNavigate();

  const isPetUnlocked = (petType) => {
    return pets.some(pet => pet.type === petType);
  };

  const handlePetClick = (petType) => {
    const pet = pets.find(p => p.type === petType);
    if (pet) {
      navigate(`/fun-zone/${pet._id}`);
    }
  };

  const handleBuyPet = async (petType) => {
    try {
      const newPet = await buyPet(petType);
      navigate(`/fun-zone/${newPet._id}`);
    } catch (error) {
      console.error('Failed to buy pet:', error);
    }
  };

  return (
    <div className="pet-collection">
      <div className="collection-header">
        <h2>Pet Collection</h2>
        <div className="coin-display">
          <span className="coin-icon">🪙</span>
          {Number(coins).toFixed(1)} coins
        </div>
      </div>
      <div className="pet-grid">
        {PET_TYPES.map(pet => {
          const isUnlocked = isPetUnlocked(pet.id);
          return (
            <div 
              key={pet.id} 
              className={`pet-item ${isUnlocked ? 'unlocked' : 'locked'}`}
              onClick={() => isUnlocked && handlePetClick(pet.id)}
            >
              <div className="pet-image-container">
                <img 
                  src={pet.image} 
                  alt={pet.name}
                  className="pet-image"
                />
                {!isUnlocked && (
                  <div className="pet-lock-overlay">
                    <span className="cost">{pet.cost} coins</span>
                    <button 
                      className={`unlock-button ${coins >= pet.cost ? 'can-afford' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyPet(pet.id);
                      }}
                      disabled={coins < pet.cost}
                    >
                      {coins >= pet.cost ? 'Unlock' : 'Not enough coins'}
                    </button>
                  </div>
                )}
              </div>
              <div className="pet-name">{pet.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PetCollection;
