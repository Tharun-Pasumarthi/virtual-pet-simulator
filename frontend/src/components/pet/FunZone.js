import React from 'react';
import { useParams } from 'react-router-dom';
import { usePet } from '../../context/PetContext';
import './FunZone.css';

const FunZone = () => {
  const { petId } = useParams();
  const { pets, updatePetStats } = usePet();
  const pet = pets.find(p => p._id === petId);

  if (!pet) {
    return <div>Pet not found</div>;
  }

  const handleAction = async (action) => {
    try {
      await updatePetStats(pet._id, action);
    } catch (error) {
      console.error(`Failed to ${action}:`, error);
    }
  };

  return (
    <div className="fun-zone">
      <div className="pet-stats">
        <div className="stat-bar">
          <label>Happiness</label>
          <div className="bar-container">
            <div className="bar-fill" style={{ width: `${pet.stats.happiness}%` }}>
              {pet.stats.happiness}%
            </div>
          </div>
        </div>
        <div className="stat-bar">
          <label>Energy</label>
          <div className="bar-container">
            <div className="bar-fill" style={{ width: `${pet.stats.energy}%` }}>
              {pet.stats.energy}%
            </div>
          </div>
        </div>
        <div className="stat-bar">
          <label>Hunger</label>
          <div className="bar-container">
            <div className="bar-fill" style={{ width: `${pet.stats.hunger}%` }}>
              {pet.stats.hunger}%
            </div>
          </div>
        </div>
      </div>

      <div className="pet-actions">
        <button 
          className="action-button play"
          onClick={() => handleAction('play')}
          disabled={pet.stats.energy < 20}
        >
          Play
          {pet.stats.energy < 20 && <span className="tooltip">Not enough energy!</span>}
        </button>
        <button 
          className="action-button feed"
          onClick={() => handleAction('feed')}
        >
          Feed
        </button>
        <button 
          className="action-button sleep"
          onClick={() => handleAction('sleep')}
          disabled={pet.stats.energy > 80}
        >
          Sleep
          {pet.stats.energy > 80 && <span className="tooltip">Not tired!</span>}
        </button>
        <button 
          className="action-button pet"
          onClick={() => handleAction('pet')}
        >
          Pet
        </button>
      </div>
    </div>
  );
};

export default FunZone;
