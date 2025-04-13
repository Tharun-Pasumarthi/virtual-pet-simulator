import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const PetAnimation = ({ petType, state, onAnimationComplete }) => {
  const [currentSprite, setCurrentSprite] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        // Dynamically import the sprite based on pet type and state
        const spriteModule = await import(`../../assets/pets/${petType}_${state}.gif`);
        setCurrentSprite(spriteModule.default);

        // Load sound if the state requires it
        if (['eating', 'playing', 'happy'].includes(state)) {
          const soundModule = await import(
            `../../assets/pets/${petType}_${state === 'eating' ? 'eating' : 
              state === 'playing' ? (petType === 'cat' ? 'meow' : 'bark') : 
              petType === 'cat' ? 'purr' : 'pant'}.mp3`
          );
          setCurrentSound(new Audio(soundModule.default));
        }
      } catch (error) {
        console.error('Error loading pet assets:', error);
      }
    };

    loadAssets();

    // Cleanup function
    return () => {
      if (currentSound) {
        currentSound.pause();
        currentSound.currentTime = 0;
      }
    };
  }, [petType, state]);

  useEffect(() => {
    if (currentSound) {
      currentSound.play();
    }
  }, [currentSound]);

  return (
    <div className="pet-animation">
      {currentSprite && (
        <img 
          src={currentSprite} 
          alt={`${petType} ${state}`}
          style={{
            width: '200px',
            height: '200px',
            objectFit: 'contain'
          }}
        />
      )}
    </div>
  );
};

PetAnimation.propTypes = {
  petType: PropTypes.oneOf(['cat', 'dog']).isRequired,
  state: PropTypes.oneOf(['idle', 'eating', 'playing', 'sleeping', 'happy']).isRequired,
  onAnimationComplete: PropTypes.func
};

export default PetAnimation;
