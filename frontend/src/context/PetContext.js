import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/axios';
import { useAuth } from '../contexts/AuthContext';

const PetContext = createContext();

export const usePet = () => {
  return useContext(PetContext);
};

export const PetProvider = ({ children }) => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [activePet, setActivePet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coins, setCoins] = useState(0);
  const [lastCoinUpdate, setLastCoinUpdate] = useState(Date.now());

  // Coin generation system
  useEffect(() => {
    const coinTimer = setInterval(() => {
      const now = Date.now();
      const secondsElapsed = (now - lastCoinUpdate) / 1000;
      const coinsToAdd = secondsElapsed * 0.1; // 0.1 coins per second
      setCoins(prevCoins => prevCoins + coinsToAdd);
      setLastCoinUpdate(now);
    }, 1000);

    return () => clearInterval(coinTimer);
  }, [lastCoinUpdate]);

  useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user]);

  const fetchPets = async () => {
    try {
      const response = await api.get('/api/pets/my-pets');
      let userPets = response.data.data.pets;
      
      // If no pets, give default dog pet
      if (userPets.length === 0) {
        const defaultDog = await buyPet('dog', true);
        userPets = [defaultDog];
      }
      
      setPets(userPets);
      if (userPets.length > 0 && !activePet) {
        setActivePet(userPets[0]);
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

  const buyPet = async (petTypeId, isFree = false) => {
    try {
      const petCosts = {
        dog: 0,    // Default unlocked
        cat: 100,
        hamster: 80
      };

      if (!isFree && coins < petCosts[petTypeId]) {
        throw new Error('Not enough coins');
      }

      const response = await api.post('/api/pets', {
        petTypeId,
        cost: isFree ? 0 : petCosts[petTypeId]
      });

      if (!isFree) {
        setCoins(prevCoins => prevCoins - petCosts[petTypeId]);
      }

      const newPet = response.data.data.pet;
      setPets(prevPets => [...prevPets, newPet]);
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
    coins,
    setActivePet,
    updatePetStats,
    buyPet,
    refreshPets: fetchPets
  };

  return (
    <PetContext.Provider value={value}>
      {children}
    </PetContext.Provider>
  );
};
