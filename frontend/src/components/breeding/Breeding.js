import React, { useState } from 'react';
import { usePet } from '../../contexts/PetContext';

const Breeding = () => {
  const { pets = [], breedPets, error: petError } = usePet();
  const [selectedPet1, setSelectedPet1] = useState(null);
  const [selectedPet2, setSelectedPet2] = useState(null);
  const [breeding, setBreeding] = useState(false);
  const [breedingResult, setBreedingResult] = useState(null);
  const [error, setError] = useState(null);

  const handleBreed = async () => {
    if (!selectedPet1 || !selectedPet2) {
      setError('Please select two pets to breed');
      return;
    }

    setBreeding(true);
    setError(null);
    try {
      const newPet = await breedPets(selectedPet1._id, selectedPet2._id);
      setBreedingResult(newPet);
      // Reset selections
      setSelectedPet1(null);
      setSelectedPet2(null);
    } catch (err) {
      setError(err.message || 'Failed to breed pets');
      console.error('Breeding failed:', err);
    } finally {
      setBreeding(false);
    }
  };

  const canBreed = selectedPet1 && selectedPet2 && 
    selectedPet1._id !== selectedPet2._id &&
    selectedPet1.canBreed && selectedPet2.canBreed;

  if (pets.length < 2) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--text-color)',
        backgroundColor: 'var(--card-bg)',
        borderRadius: '1rem',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2>Not Enough Pets</h2>
        <p>You need at least two pets to use the breeding feature. Visit the shop to adopt more pets!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{
        color: 'var(--text-color)',
        marginBottom: '2rem'
      }}>Pet Breeding</h2>

      {(error || petError) && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          {error || petError}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h3 style={{
            color: 'var(--text-color)',
            marginBottom: '1rem'
          }}>First Parent</h3>
          <select
            value={selectedPet1?._id || ''}
            onChange={(e) => setSelectedPet1(pets.find(p => p._id === e.target.value))}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-color)',
              color: 'var(--text-color)'
            }}
          >
            <option value="">Select first parent</option>
            {pets.map(pet => (
              <option 
                key={pet._id} 
                value={pet._id}
                disabled={!pet.canBreed}
              >
                {pet.name} {!pet.canBreed ? '(Not ready)' : ''}
              </option>
            ))}
          </select>

          {selectedPet1 && (
            <PetCard pet={selectedPet1} />
          )}
        </div>

        <div>
          <h3 style={{
            color: 'var(--text-color)',
            marginBottom: '1rem'
          }}>Second Parent</h3>
          <select
            value={selectedPet2?._id || ''}
            onChange={(e) => setSelectedPet2(pets.find(p => p._id === e.target.value))}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-color)',
              color: 'var(--text-color)'
            }}
          >
            <option value="">Select second parent</option>
            {pets.map(pet => (
              <option 
                key={pet._id} 
                value={pet._id}
                disabled={!pet.canBreed || pet._id === selectedPet1?._id}
              >
                {pet.name} {!pet.canBreed ? '(Not ready)' : ''}
              </option>
            ))}
          </select>

          {selectedPet2 && (
            <PetCard pet={selectedPet2} />
          )}
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem'
      }}>
        <button
          onClick={handleBreed}
          disabled={!canBreed || breeding}
          style={{
            backgroundColor: !canBreed || breeding ? 
              'var(--border-color)' : 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '1rem 2rem',
            cursor: !canBreed || breeding ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {breeding ? 'Breeding...' : 'Breed Pets'}
        </button>
      </div>

      {breedingResult && (
        <div style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: 'var(--text-color)',
            marginBottom: '1rem'
          }}>
            Congratulations! A new pet was born!
          </h3>
          <PetCard pet={breedingResult} />
        </div>
      )}
    </div>
  );
};

const PetCard = ({ pet }) => (
  <div style={{
    backgroundColor: 'var(--card-bg)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginTop: '1rem'
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem'
    }}>
      <h4 style={{
        color: 'var(--text-color)',
        margin: 0
      }}>
        {pet.name}
      </h4>
      <span style={{
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        padding: '0.25rem 0.75rem',
        borderRadius: '1rem',
        fontSize: '0.9rem'
      }}>
        Level {pet.level}
      </span>
    </div>

    <div style={{
      display: 'grid',
      gap: '0.5rem'
    }}>
      {Object.entries(pet.stats).map(([stat, value]) => (
        <div
          key={stat}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: 'var(--text-color)',
            fontSize: '0.9rem'
          }}
        >
          <span style={{ textTransform: 'capitalize' }}>{stat}</span>
          <span>{Math.round(value)}</span>
        </div>
      ))}
    </div>

    {pet.breeding && (
      <div style={{
        marginTop: '1rem',
        padding: '0.5rem',
        backgroundColor: 'var(--bg-color)',
        borderRadius: '0.5rem',
        color: 'var(--text-color)',
        fontSize: '0.9rem'
      }}>
        {pet.breeding.cooldownUntil ? (
          `Ready to breed in ${new Date(pet.breeding.cooldownUntil).toLocaleString()}`
        ) : (
          'Ready to breed'
        )}
      </div>
    )}
  </div>
);

export default Breeding;
