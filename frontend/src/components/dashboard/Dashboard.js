import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../../contexts/PetContext';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { pets, coins = 0 } = usePet();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePetClick = (petId) => {
    navigate(`/fun-zone/${petId}`);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome, {user?.username || 'Pet Lover'}!</h1>
          <div className="coin-display">
            <span className="coin-icon">🪙</span>
            {Number(coins).toFixed(1)} coins
          </div>
        </div>
        <button 
          className="collection-button"
          onClick={() => navigate('/pet-collection')}
        >
          View Pet Collection
        </button>
      </div>

      <div className="dashboard-content">
        <div className="pets-section">
          <h2>Your Active Pets</h2>
          <div className="pets-grid">
            {!pets || pets.length === 0 ? (
              <div className="no-pets-message">
                <p>You don't have any pets yet!</p>
                <button 
                  className="get-started-button"
                  onClick={() => navigate('/pet-collection')}
                >
                  Get Started
                </button>
              </div>
            ) : (
              pets.map(pet => (
                <div
                  key={pet._id}
                  className="pet-card"
                  onClick={() => handlePetClick(pet._id)}
                >
                  <div className="pet-header">
                    <h3>{pet.name || pet.type}</h3>
                    <span className="pet-level">Level {pet.level || 1}</span>
                  </div>

                  <div className="pet-stats">
                    <StatBar 
                      label="Happiness" 
                      value={pet.stats?.happiness ?? 100} 
                      color="var(--happiness-color)" 
                    />
                    <StatBar 
                      label="Energy" 
                      value={pet.stats?.energy ?? 100} 
                      color="var(--energy-color)" 
                    />
                    <StatBar 
                      label="Hunger" 
                      value={pet.stats?.hunger ?? 100} 
                      color="var(--hunger-color)" 
                    />
                  </div>

                  <div className="pet-action-hint">
                    Click to play with your pet!
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button onClick={() => navigate('/pet-collection')}>
              🏠 Pet Collection
            </button>
            <button onClick={() => navigate('/shop')}>
              🛍️ Shop
            </button>
            <button onClick={() => navigate('/games')}>
              🎮 Mini Games
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBar = ({ label, value, color }) => (
  <div className="stat-bar">
    <div className="stat-header">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}%</span>
    </div>
    <div className="stat-progress">
      <div 
        className="stat-fill"
        style={{ 
          width: `${value}%`,
          backgroundColor: color
        }} 
      />
    </div>
  </div>
);

export default Dashboard;
