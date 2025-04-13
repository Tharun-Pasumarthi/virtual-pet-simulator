import React, { useState } from 'react';
import MemoryGame from './MemoryGame';
import PuzzleGame from './PuzzleGame';
import RacingGame from './RacingGame';
import TrainingGame from './TrainingGame';

const GameCenter = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [showResults, setShowResults] = useState(false);
  const [lastGameResults, setLastGameResults] = useState(null);

  const games = [
    {
      id: 'memory',
      name: 'Memory Match',
      description: 'Match pet cards to earn rewards',
      icon: '🎴',
      color: '#4CAF50',
      component: MemoryGame
    },
    {
      id: 'puzzle',
      name: 'Sliding Puzzle',
      description: 'Arrange the numbers in order',
      icon: '🧩',
      color: '#2196F3',
      component: PuzzleGame
    },
    {
      id: 'racing',
      name: 'Pet Racing',
      description: 'Jump over obstacles and reach the finish line',
      icon: '🏃',
      color: '#FF9800',
      component: RacingGame
    },
    {
      id: 'training',
      name: 'Pet Training',
      description: 'Follow the commands to train your pet',
      icon: '🎯',
      color: '#9C27B0',
      component: TrainingGame
    }
  ];

  const handleGameComplete = (results) => {
    setLastGameResults(results);
    setShowResults(true);
    setSelectedGame(null);
  };

  const handlePlayAgain = () => {
    setShowResults(false);
    setSelectedGame(lastGameResults.gameId);
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: 'var(--text-color)',
        marginBottom: '2rem'
      }}>
        🎮 Game Center
      </h1>

      {!selectedGame && !showResults && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {games.map(game => (
            <div
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              style={{
                backgroundColor: 'var(--card-bg)',
                padding: '1.5rem',
                borderRadius: '1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                border: '2px solid var(--border-color)',
                ':hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {game.icon}
              </div>
              <h3 style={{
                margin: '0 0 0.5rem 0',
                color: 'var(--text-color)',
                textAlign: 'center'
              }}>
                {game.name}
              </h3>
              <p style={{
                margin: 0,
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                textAlign: 'center'
              }}>
                {game.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedGame && (
        <div>
          <div style={{
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setSelectedGame(null)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--border-color)',
                color: 'var(--text-color)',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              ← Back to Games
            </button>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{
                padding: '0.5rem',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem'
              }}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {React.createElement(
            games.find(g => g.id === selectedGame).component,
            {
              difficulty,
              onGameComplete: (results) => handleGameComplete({
                ...results,
                gameId: selectedGame
              })
            }
          )}
        </div>
      )}

      {showResults && (
        <div style={{
          backgroundColor: 'var(--card-bg)',
          padding: '2rem',
          borderRadius: '1rem',
          textAlign: 'center'
        }}>
          <h2 style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>
            Game Results
          </h2>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              Score: {lastGameResults.score}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Rewards:
              <div>🪙 {lastGameResults.rewards.coins} coins</div>
              <div>⭐ {lastGameResults.rewards.experience} experience</div>
            </div>
          </div>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <button
              onClick={handlePlayAgain}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Play Again
            </button>
            <button
              onClick={() => setShowResults(false)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--border-color)',
                color: 'var(--text-color)',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCenter;
