import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './PetAnimations.css';

const PetSprite = ({ pet, currentAction, emotion }) => {
  const [particles, setParticles] = useState([]);
  const [animationState, setAnimationState] = useState('idle');

  // Handle action animations
  useEffect(() => {
    if (currentAction) {
      setAnimationState(currentAction);
      createParticles(currentAction);
      
      // Reset to idle after animation
      const timer = setTimeout(() => {
        setAnimationState(emotion || 'idle');
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setAnimationState(emotion || 'idle');
    }
  }, [currentAction, emotion]);

  // Create particle effects
  const createParticles = (action) => {
    const newParticles = [];
    const count = action === 'levelUp' ? 10 : 5;

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        type: getParticleType(action),
        style: getRandomParticleStyle()
      });
    }

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };

  // Get particle type based on action
  const getParticleType = (action) => {
    switch (action) {
      case 'feed': return 'food';
      case 'pet': return 'heart';
      case 'levelUp': return 'star';
      default: return 'star';
    }
  };

  // Generate random position for particles
  const getRandomParticleStyle = () => {
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      transform: `rotate(${Math.random() * 360}deg)`,
      animationDelay: `${Math.random() * 0.5}s`
    };
  };

  // Get emoji based on particle type
  const getParticleEmoji = (type) => {
    switch (type) {
      case 'heart': return '❤️';
      case 'star': return '⭐';
      case 'food': return '🍖';
      default: return '✨';
    }
  };

  return (
    <div className="pet-container">
      <div className={`pet-sprite ${animationState}`}>
        <img 
          src={`/assets/pets/${pet.species}/${animationState}.png`} 
          alt={`${pet.name} ${animationState}`}
          onError={(e) => {
            e.target.src = `/assets/pets/default/${animationState}.png`;
          }}
        />
      </div>
      
      <TransitionGroup className="particles">
        {particles.map(particle => (
          <CSSTransition
            key={particle.id}
            timeout={1000}
            classNames="fade"
          >
            <div
              className={`${particle.type}-particle`}
              style={particle.style}
            >
              {getParticleEmoji(particle.type)}
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

PetSprite.propTypes = {
  pet: PropTypes.shape({
    name: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired
  }).isRequired,
  currentAction: PropTypes.oneOf(['idle', 'eating', 'playing', 'sleeping', 'petting', 'levelUp']),
  emotion: PropTypes.oneOf(['happy', 'sad', 'tired', 'excited', 'idle'])
};

export default PetSprite;
