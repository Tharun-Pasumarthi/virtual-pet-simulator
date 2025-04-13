import React from 'react';
import PropTypes from 'prop-types';
import { useAssetLoader } from '../common/AssetLoader';

const PetCard = ({ pet, onClick, selected }) => {
  const { loaded, images } = useAssetLoader();

  if (!loaded || !pet) return null;

  const petImage = images[pet.rarity]?.[pet.species];
  
  return (
    <div 
      onClick={onClick}
      style={{
        position: 'relative',
        width: '200px',
        padding: '1rem',
        backgroundColor: selected ? 'var(--primary-color-light)' : 'var(--card-bg)',
        borderRadius: '1rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: selected ? '2px solid var(--primary-color)' : '2px solid var(--border-color)',
        ':hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }
      }}
    >
      {/* Rarity Badge */}
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        padding: '0.25rem 0.5rem',
        backgroundColor: 
          pet.rarity === 'legendary' ? '#FFD700' :
          pet.rarity === 'rare' ? '#9C27B0' :
          '#4CAF50',
        color: 'white',
        borderRadius: '0.25rem',
        fontSize: '0.8rem',
        textTransform: 'capitalize'
      }}>
        {pet.rarity}
      </div>

      {/* Pet Image */}
      <div style={{
        width: '100%',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <img
          src={petImage?.src}
          alt={pet.name}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            filter: pet.sleeping ? 'brightness(0.7)' : 'none',
            transition: 'filter 0.3s ease'
          }}
        />
      </div>

      {/* Pet Info */}
      <div style={{ textAlign: 'center' }}>
        <h3 style={{
          margin: '0 0 0.5rem 0',
          color: 'var(--text-color)'
        }}>
          {pet.name}
        </h3>
        <p style={{
          margin: '0',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem'
        }}>
          Level {pet.level}
        </p>
      </div>

      {/* Stats */}
      <div style={{
        marginTop: '1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.5rem'
      }}>
        {Object.entries(pet.stats).map(([stat, value]) => (
          <div key={stat} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <span style={{ opacity: 0.7 }}>
              {stat === 'happiness' ? '😊' :
               stat === 'hunger' ? '🍖' :
               stat === 'energy' ? '⚡' :
               stat === 'intelligence' ? '🧠' :
               stat === 'strength' ? '💪' :
               '✨'}
            </span>
            <div style={{
              flex: 1,
              height: '4px',
              backgroundColor: 'var(--border-color)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${value}%`,
                height: '100%',
                backgroundColor: value > 70 ? '#4CAF50' :
                              value > 30 ? '#FFC107' :
                              '#F44336',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Status Effects */}
      {pet.sleeping && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '2rem'
        }}>
          💤
        </div>
      )}
    </div>
  );
};

PetCard.propTypes = {
  pet: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    rarity: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    stats: PropTypes.object.isRequired,
    sleeping: PropTypes.bool
  }).isRequired,
  onClick: PropTypes.func,
  selected: PropTypes.bool
};

export default PetCard;
