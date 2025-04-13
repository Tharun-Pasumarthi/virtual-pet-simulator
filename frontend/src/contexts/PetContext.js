import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/axios';
import { useAuth } from './AuthContext';

const PetContext = createContext();

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet must be used within a PetProvider');
  }
  return context;
};

export const PetProvider = ({ children }) => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [activePet, setActivePet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchPets();
    } else {
      setPets([]);
      setActivePet(null);
    }
  }, [user]);

  const fetchPets = async () => {
    try {
      const response = await api.get('/api/pets/my-pets');
      setPets(response.data.data.pets);
      if (response.data.data.pets.length > 0 && !activePet) {
        setActivePet(response.data.data.pets[0]);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch pets');
    } finally {
      setLoading(false);
    }
  };

  const updatePetStats = async (petId, action) => {
    try {
      const response = await api.post(`/api/pets/${petId}/${action}`);
      const updatedPet = response.data.data.pet;
      setPets(pets.map(pet => pet._id === updatedPet._id ? updatedPet : pet));
      if (activePet?._id === updatedPet._id) {
        setActivePet(updatedPet);
      }
      return updatedPet;
    } catch (error) {
      setError(error.response?.data?.message || `Failed to ${action} pet`);
      throw error;
    }
  };

  const breedPets = async (pet1Id, pet2Id) => {
    try {
      const response = await api.post('/api/pets/breed', {
        pet1Id,
        pet2Id
      });
      const newPet = response.data.data.pet;
      setPets([...pets, newPet]);
      return newPet;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to breed pets');
      throw error;
    }
  };

  const buyPet = async (petTypeId) => {
    try {
      const response = await api.post('/api/pets', {
        petTypeId
      });
      const newPet = response.data.data.pet;
      setPets([...pets, newPet]);
      return newPet;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to buy pet');
      throw error;
    }
  };

  const value = {
    pets,
    activePet,
    loading,
    error,
    setActivePet,
    updatePetStats,
    breedPets,
    buyPet,
    refreshPets: fetchPets
  };

  return (
    <PetContext.Provider value={value}>
      {children}
    </PetContext.Provider>
  );
};
