import React from 'react';
import PropTypes from 'prop-types';
import PetCard from './PetCard';

const PetGrid = ({ pets, onPetSelect, selectedPetId }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '2rem',
      padding: '2rem'
    }}>
      {pets.map(pet => (
        <PetCard
          key={pet.id}
          pet={pet}
          onClick={() => onPetSelect(pet)}
          selected={selectedPetId === pet.id}
        />
      ))}
    </div>
  );
};

PetGrid.propTypes = {
  pets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    rarity: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    stats: PropTypes.object.isRequired
  })).isRequired,
  onPetSelect: PropTypes.func.isRequired,
  selectedPetId: PropTypes.string
};

export default PetGrid;
