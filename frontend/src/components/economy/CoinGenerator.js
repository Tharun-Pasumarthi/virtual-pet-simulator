import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const CoinGenerator = () => {
  const { user, setUser } = useAuth();
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    // Generate coins every second when online
    const coinTimer = setInterval(async () => {
      const now = Date.now();
      const secondsElapsed = Math.floor((now - lastUpdate) / 1000);
      
      if (secondsElapsed > 0) {
        try {
          const response = await axios.post('/api/user/coins/generate', {
            amount: secondsElapsed // 1 coin per second when online
          });
          
          setUser(prevUser => ({
            ...prevUser,
            coins: response.data.coins
          }));
          
          setLastUpdate(now);
        } catch (error) {
          console.error('Error generating coins:', error);
        }
      }
    }, 1000);

    // Save last update time when component unmounts or user goes offline
    const handleVisibilityChange = () => {
      if (document.hidden) {
        localStorage.setItem('lastCoinUpdate', Date.now().toString());
      } else {
        const lastSaved = parseInt(localStorage.getItem('lastCoinUpdate') || Date.now());
        const offlineSeconds = Math.floor((Date.now() - lastSaved) / 1000);
        
        // Generate offline coins (0.5 coins per second)
        if (offlineSeconds > 0) {
          axios.post('/api/user/coins/generate', {
            amount: Math.floor(offlineSeconds * 0.5),
            offline: true
          })
          .then(response => {
            setUser(prevUser => ({
              ...prevUser,
              coins: response.data.coins
            }));
          })
          .catch(error => console.error('Error generating offline coins:', error));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(coinTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      localStorage.setItem('lastCoinUpdate', Date.now().toString());
    };
  }, [user, lastUpdate, setUser]);

  return (
    <div className="coin-display" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      padding: '8px 15px',
      backgroundColor: '#FFD700',
      borderRadius: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      color: '#333'
    }}>
      <span role="img" aria-label="coin">🪙</span>
      <span style={{ fontWeight: 'bold' }}>{user?.coins || 0}</span>
    </div>
  );
};

export default CoinGenerator;
