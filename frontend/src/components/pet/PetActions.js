import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ThemeToggle from '../common/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { playSound } from '../../utils/sounds';
import PetSprite from './PetSprite';
import './PetActions.css';

const PetActions = ({ pet, onActionComplete }) => {
  const { theme } = useTheme();
  const [activeAction, setActiveAction] = useState(null);

  const handleAction = async (action) => {
    try {
      setActiveAction(action);
      playSound(action);
      
      const response = await axios.post(`/api/pets/${pet._id}/action`, { action });
      
      if (onActionComplete) {
        onActionComplete(response.data);
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      playSound('error');
    } finally {
      // Reset action after animation completes
      setTimeout(() => setActiveAction(null), 1000);
    }
  };

  const getActionStatus = (action) => {
    switch (action) {
      case 'feed':
        return {
          disabled: pet.stats.hunger >= 100,
          tooltip: pet.stats.hunger >= 100 ? 'Pet is not hungry' : 'Feed your pet'
        };
      case 'play':
        return {
          disabled: pet.stats.energy <= 20,
          tooltip: pet.stats.energy <= 20 ? 'Pet is too tired to play' : 'Play with your pet'
        };
      case 'sleep':
        return {
          disabled: pet.stats.energy >= 100,
          tooltip: pet.stats.energy >= 100 ? 'Pet is not tired' : 'Put your pet to sleep'
        };
      case 'pet':
        return {
          disabled: false,
          tooltip: 'Show some love to your pet'
        };
      default:
        return { disabled: false, tooltip: '' };
    }
  };

  // Calculate pet's emotion based on stats
  const getPetEmotion = () => {
    const { hunger, happiness, energy, playfulness } = pet.stats;
    
    if (hunger < 30) return 'sad';
    if (energy < 30) return 'tired';
    if (happiness > 80 && playfulness > 80) return 'excited';
    if (happiness > 60) return 'happy';
    if (happiness < 30) return 'sad';
    
    return 'idle';
  };

  return (
    <div className={`pet-actions ${theme}`}>
      <PetSprite
        pet={pet}
        currentAction={activeAction}
        emotion={getPetEmotion()}
      />
      
      <div className="action-buttons">
        <ActionButton
          icon="🍽️"
          label="Feed"
          onClick={() => handleAction('feed')}
          isActive={activeAction === 'feed'}
          {...getActionStatus('feed')}
        />
        <ActionButton
          icon="🎮"
          label="Play"
          onClick={() => handleAction('play')}
          isActive={activeAction === 'play'}
          {...getActionStatus('play')}
        />
        <ActionButton
          icon="💤"
          label="Sleep"
          onClick={() => handleAction('sleep')}
          isActive={activeAction === 'sleep'}
          {...getActionStatus('sleep')}
        />
        <ActionButton
          icon="🐾"
          label="Pet"
          onClick={() => handleAction('pet')}
          isActive={activeAction === 'pet'}
          {...getActionStatus('pet')}
        />
      </div>
      
      <div className="pet-stats">
        <StatBar label="Hunger" value={pet.stats.hunger} icon="🍖" />
        <StatBar label="Energy" value={pet.stats.energy} icon="⚡" />
        <StatBar label="Happiness" value={pet.stats.happiness} icon="😊" />
        <StatBar label="Playfulness" value={pet.stats.playfulness} icon="🎯" />
      </div>

      <ThemeToggle />
    </div>
  );
};

const ActionButton = ({ icon, label, onClick, disabled, isActive, tooltip }) => (
  <button
    className={`action-button ${isActive ? 'active' : ''}`}
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={tooltip}
  >
    <span className="icon">{icon}</span>
    <span className="label">{label}</span>
  </button>
);

const StatBar = ({ label, value, icon }) => (
  <div className="stat-bar">
    <span className="stat-icon">{icon}</span>
    <div className="stat-progress">
      <div className="stat-fill" style={{ width: `${value}%` }} />
    </div>
    <span className="stat-value">{Math.round(value)}%</span>
  </div>
);

ActionButton.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isActive: PropTypes.bool,
  tooltip: PropTypes.string
};

StatBar.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired
};

PetActions.propTypes = {
  pet: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    stats: PropTypes.shape({
      hunger: PropTypes.number.isRequired,
      energy: PropTypes.number.isRequired,
      happiness: PropTypes.number.isRequired,
      playfulness: PropTypes.number.isRequired
    }).isRequired
  }).isRequired,
  onActionComplete: PropTypes.func
};

export default PetActions;
