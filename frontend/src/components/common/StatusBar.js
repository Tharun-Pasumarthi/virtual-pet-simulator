import React, { useState, useEffect } from 'react';
import { usePet } from '../../contexts/PetContext';
import './StatusBar.css';

const StatusBar = () => {
  const { coins } = usePet();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="status-bar">
      <div className="time-display">
        <span className="clock-icon">⏰</span>
        {formatTime(currentTime)}
      </div>
      <div className="coin-display">
        <span className="coin-icon">🪙</span>
        {Number(coins).toFixed(1)} coins
      </div>
    </div>
  );
};

export default StatusBar; 