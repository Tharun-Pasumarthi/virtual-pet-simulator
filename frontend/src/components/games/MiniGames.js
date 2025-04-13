import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { usePet } from '../../contexts/PetContext';
import { useAuth } from '../../contexts/AuthContext';

const MiniGames = () => {
  const [games, setGames] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [activeGame, setActiveGame] = useState(null);
  const [gameSession, setGameSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { pets, refreshPets } = usePet();
  const { user } = useAuth();

  useEffect(() => {
    if (pets && pets.length > 0 && !selectedPet) {
      setSelectedPet(pets[0]);
    }
  }, [pets]);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get('/api/minigames');
      setGames(response.data.data.games || []);
    } catch (error) {
      setError('Failed to fetch games');
    } finally {
      setLoading(false);
    }
  };

  const startGame = async (game) => {
    if (!selectedPet) {
      setError('Please select a pet first');
      return;
    }

    try {
      const response = await axios.post('/api/minigames/start', {
        gameId: game._id,
        petId: selectedPet._id
      });
      
      setActiveGame(game);
      setGameSession(response.data.data.gameSession);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to start game');
    }
  };

  const finishGame = async (score) => {
    try {
      const response = await axios.post('/api/minigames/finish', {
        gameId: activeGame._id,
        petId: selectedPet._id,
        score,
        duration: Math.floor((Date.now() - new Date(gameSession.startTime)) / 1000)
      });

      // Update pet and user data
      await refreshPets();
      const userResponse = await axios.get('/api/auth/me');
      user.coins = userResponse.data.data.user.coins;

      // Reset game state
      setActiveGame(null);
      setGameSession(null);
      setError(null);

      // Show rewards
      alert(`You earned ${response.data.data.rewards.coins} coins and ${response.data.data.rewards.experience} XP!`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit game results');
    }
  };

  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: 'var(--text-color)'
      }}>
        Loading games...
      </div>
    );
  }

  if (!pets || pets.length === 0) {
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
        <h2>No Pets Available</h2>
        <p>You need to adopt a pet from the shop before you can play mini-games!</p>
      </div>
    );
  }

  if (activeGame) {
    return (
      <div style={{
        backgroundColor: 'var(--card-bg)',
        borderRadius: '1rem',
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{
          color: 'var(--text-color)',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          {activeGame.name}
        </h2>

        {/* Simple click game example */}
        <SimpleClickGame
          onFinish={finishGame}
          duration={30}
          onError={setError}
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          color: 'var(--text-color)',
          margin: 0
        }}>Mini Games</h2>
        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          color: 'var(--text-color)'
        }}>
          {user?.coins || 0} coins
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <div style={{
        marginBottom: '2rem'
      }}>
        <label style={{
          color: 'var(--text-color)',
          marginBottom: '0.5rem',
          display: 'block'
        }}>
          Select Pet to Play With:
        </label>
        <select
          value={selectedPet?._id || ''}
          onChange={(e) => setSelectedPet(pets.find(p => p._id === e.target.value))}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-color)',
            color: 'var(--text-color)',
            marginBottom: '1rem'
          }}
        >
          {pets.map(pet => (
            <option key={pet._id} value={pet._id}>
              {pet.name} (Energy: {pet.stats.energy})
            </option>
          ))}
        </select>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {games.map(game => (
          <div
            key={game._id}
            style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '1rem',
              padding: '1.5rem'
            }}
          >
            <h3 style={{
              color: 'var(--text-color)',
              marginBottom: '1rem'
            }}>{game.name}</h3>
            
            <p style={{
              color: 'var(--text-color)',
              marginBottom: '1rem'
            }}>{game.description}</p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                backgroundColor: 'var(--bg-color)',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                color: 'var(--text-color)',
                fontSize: '0.9rem'
              }}>
                Energy Cost: {game.energyCost}
              </div>
              <div style={{
                backgroundColor: 'var(--bg-color)',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                color: 'var(--text-color)',
                fontSize: '0.9rem'
              }}>
                Max Coins: {game.rewards?.coins?.max || 0}
              </div>
            </div>

            <button
              onClick={() => startGame(game)}
              disabled={!selectedPet || selectedPet.stats.energy < game.energyCost}
              style={{
                width: '100%',
                backgroundColor: !selectedPet || selectedPet.stats.energy < game.energyCost ?
                  'var(--border-color)' : 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.75rem',
                cursor: !selectedPet || selectedPet.stats.energy < game.energyCost ?
                  'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {!selectedPet ? 'Select a pet first' :
                selectedPet.stats.energy < game.energyCost ? 'Not enough energy' :
                'Play'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SimpleClickGame = ({ onFinish, duration, onError }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    spawnTarget();

    return () => clearInterval(timer);
  }, []);

  const spawnTarget = () => {
    const size = Math.random() * 40 + 20;
    setTarget({
      x: Math.random() * (600 - size),
      y: Math.random() * (400 - size),
      size
    });
  };

  const handleClick = () => {
    setScore(prev => prev + 10);
    spawnTarget();
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        color: 'var(--text-color)'
      }}>
        <div>Score: {score}</div>
        <div>Time: {timeLeft}s</div>
      </div>

      <div style={{
        width: '600px',
        height: '400px',
        backgroundColor: 'var(--bg-color)',
        borderRadius: '1rem',
        position: 'relative',
        margin: '0 auto',
        overflow: 'hidden'
      }}>
        {target && (
          <div
            onClick={handleClick}
            style={{
              position: 'absolute',
              left: target.x,
              top: target.y,
              width: target.size,
              height: target.size,
              backgroundColor: 'var(--primary-color)',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'transform 0.1s'
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MiniGames;
