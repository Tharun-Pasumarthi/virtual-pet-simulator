import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const Clock = ({ onTimeUpdate }) => {
  const [time, setTime] = useState(new Date());
  const [isDaytime, setIsDaytime] = useState(true);
  const [coins, setCoins] = useState(0);
  const { user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date();
      setTime(newTime);
      
      // Check if it's daytime (6 AM to 6 PM)
      const hours = newTime.getHours();
      const newIsDaytime = hours >= 6 && hours < 18;
      setIsDaytime(newIsDaytime);

      // Update coins if user is logged in
      if (user && socket) {
        socket.emit('updateCoins', { userId: user._id });
      }

      if (onTimeUpdate) {
        onTimeUpdate({
          time: newTime,
          isDaytime: newIsDaytime
        });
      }
    }, 1000);

    // Listen for coin updates
    if (socket) {
      socket.on('coinsUpdated', (data) => {
        setCoins(data.coins);
      });
    }

    return () => {
      clearInterval(timer);
      if (socket) {
        socket.off('coinsUpdated');
      }
    };
  }, [onTimeUpdate, user, socket]);

  return (
    <div className="clock" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px',
      backgroundColor: isDaytime ? '#87CEEB' : '#1a1a2e',
      color: isDaytime ? '#333' : '#fff',
      borderRadius: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
        {time.toLocaleTimeString()}
      </div>
      <div style={{
        width: '24px',
        height: '24px',
        backgroundColor: isDaytime ? '#FFD700' : '#C0C0C0',
        borderRadius: '50%',
        boxShadow: isDaytime ? '0 0 15px #FFD700' : '0 0 10px #C0C0C0'
      }}>
        {isDaytime ? '☀️' : '🌙'}
      </div>
      {user && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          padding: '5px 10px',
          borderRadius: '15px'
        }}>
          <span role="img" aria-label="coins">🪙</span>
          <span>{coins}</span>
        </div>
      )}
    </div>
  );
};

Clock.propTypes = {
  onTimeUpdate: PropTypes.func
};

export default Clock;
