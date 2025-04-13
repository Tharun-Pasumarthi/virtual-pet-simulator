import React from 'react';
import { useParams } from 'react-router-dom';
import { usePet } from '../../context/PetContext';
import PetDisplay from './PetDisplay';
import PetActions from './PetActions';
import './PetView.css';

const PetView = () => {
  const { id } = useParams();
  const { pets, updatePetStats } = usePet();
  const pet = pets.find(p => p._id === id);

  if (!pet) {
    return (
      <div className="pet-not-found">
        Pet not found
      </div>
    );
  }

  const handleAction = async (action) => {
    try {
      await updatePetStats(pet._id, action);
    } catch (error) {
      console.error('Failed to perform action:', error);
    }
  };

  const handlePositionChange = async (newPosition) => {
    try {
      // Position updates are handled by PetDisplay component
      console.log('Pet position updated:', newPosition);
    } catch (error) {
      console.error('Failed to update position:', error);
    }
  };

  return (
    <div className="pet-view">
      <div className="pet-header">
        <h2>
          {pet.name} <span className="level-badge">Level {pet.level}</span>
        </h2>
      </div>

      <div className="pet-container">
        <PetDisplay 
          pet={pet}
          onPositionChange={handlePositionChange}
        />
      </div>

      <div className="pet-actions">
        <PetActions 
          pet={pet}
          onActionComplete={handleAction}
        />
      </div>

      {pet.inventory && (
        <div className="pet-inventory">
          <h3>Inventory</h3>
          <div className="inventory-grid">
            {pet.inventory.accessories.map((acc, index) => (
              <div
                key={index}
                className={`inventory-item ${acc.equipped ? 'equipped' : ''}`}
              >
                {acc.item.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PetView;
