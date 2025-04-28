import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/axios';
import { useAuth } from './AuthContext';
import { socket } from '../utils/socket';

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
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      // Connect socket when user is logged in
      socket.connect();

      // Listen for coin updates
      socket.on('coinsUpdated', ({ coins }) => {
        setCoins(coins);
      });

      // Fetch initial data
      fetchUserData();

      return () => {
        socket.off('coinsUpdated');
        socket.disconnect();
      };
    } else {
      setPets([]);
      setActivePet(null);
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Fetch user's pets and coins
      const response = await fetch('http://localhost:5001/api/user/data', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setPets(data.pets);
        setCoins(data.coins);
        if (data.pets.length > 0 && !activePet) {
          setActivePet(data.pets[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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
    coins,
    loading,
    error,
    setActivePet,
    updatePetStats,
    breedPets,
    buyPet,
    fetchUserData
  };

  return (
    <PetContext.Provider value={value}>
      {children}
    </PetContext.Provider>
  );
};
