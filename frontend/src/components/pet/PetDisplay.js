import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../../config/axios';
import PetSprite from './PetSprite';
import './PetDisplay.css';

const PetDisplay = ({ pet, onPositionChange }) => {
  const [position, setPosition] = useState(pet.position || { x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (pet.position) {
      setPosition(pet.position);
    }
  }, [pet.position]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    e.preventDefault(); // Prevent text selection
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    
    // Calculate position as percentage of container
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    
    setPosition({ x, y });
  };

  const handleMouseUp = async () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    try {
      // Save position to backend
      await axios.patch(`/api/pets/${pet._id}/position`, {
        position: position
      });
      
      if (onPositionChange) {
        onPositionChange(position);
      }
    } catch (error) {
      console.error('Failed to update pet position:', error);
    }
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    
    const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    
    setPosition({ x, y });
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  return (
    <div 
      className="pet-display"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className={`pet-container ${isDragging ? 'dragging' : ''}`}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`
        }}
      >
        <PetSprite 
          pet={pet}
          scale={isDragging ? 1.1 : 1}
        />
      </div>
    </div>
  );
};

PetDisplay.propTypes = {
  pet: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    position: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    stats: PropTypes.shape({
      hunger: PropTypes.number.isRequired,
      energy: PropTypes.number.isRequired,
      happiness: PropTypes.number.isRequired,
      playfulness: PropTypes.number.isRequired
    }).isRequired
  }).isRequired,
  onPositionChange: PropTypes.func
};

export default PetDisplay;
