import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../../contexts/PetContext';
import './PetRoom.css';

const PetRoom = () => {
  const { pets, activePet, setActivePet } = usePet();
  const navigate = useNavigate();
  const [hoveredPet, setHoveredPet] = useState(null);

  const handlePetClick = (pet) => {
    setActivePet(pet);
    navigate(`/fun-zone/${pet._id}`);
  };

  const getPetEmotion = (pet) => {
    const { hunger, happiness, energy, playfulness } = pet.stats;
    
    if (hunger < 30) return 'hungry';
    if (energy < 30) return 'tired';
    if (happiness < 30) return 'sad';
    if (playfulness < 30) return 'bored';
    if (happiness > 70) return 'happy';
    return 'neutral';
  };

  return (
    <div className="pet-room">
      <div className="room-background">
        {/* Room background elements */}
        <div className="room-floor"></div>
        <div className="room-walls"></div>
        <div className="room-furniture">
          <div className="bed"></div>
          <div className="food-bowl"></div>
          <div className="toy-box"></div>
        </div>
      </div>

      <div className="pets-container">
        {pets.map(pet => (
          <div
            key={pet._id}
            className={`pet ${getPetEmotion(pet)} ${hoveredPet === pet._id ? 'hovered' : ''}`}
            style={{
              left: `${pet.position.x}%`,
              top: `${pet.position.y}%`,
              transform: `translate(-50%, -50%) scale(${hoveredPet === pet._id ? 1.1 : 1})`
            }}
            onClick={() => handlePetClick(pet)}
            onMouseEnter={() => setHoveredPet(pet._id)}
            onMouseLeave={() => setHoveredPet(null)}
          >
            <div className="pet-sprite">
              <img 
                src={`/assets/pets/${pet.species}/${getPetEmotion(pet)}.png`} 
                alt={pet.name}
                className="pet-image"
              />
            </div>
            <div className="pet-info">
              <span className="pet-name">{pet.name}</span>
              <span className="pet-level">Lvl {pet.level}</span>
            </div>
            <div className="pet-stats">
              <div className="stat-bar">
                <div 
                  className="stat-fill hunger" 
                  style={{ width: `${pet.stats.hunger}%` }}
                ></div>
              </div>
              <div className="stat-bar">
                <div 
                  className="stat-fill happiness" 
                  style={{ width: `${pet.stats.happiness}%` }}
                ></div>
              </div>
              <div className="stat-bar">
                <div 
                  className="stat-fill energy" 
                  style={{ width: `${pet.stats.energy}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetRoom; 