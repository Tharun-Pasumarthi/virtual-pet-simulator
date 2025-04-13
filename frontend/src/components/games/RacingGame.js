import React, { useState, useEffect, useCallback } from 'react';
import { usePet } from '../../context/PetContext';

const RacingGame = ({ difficulty = 'easy', onGameComplete }) => {
  const { activePet, updatePetStats } = usePet();
  const [gameStarted, setGameStarted] = useState(false);
  const [position, setPosition] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const difficultyConfig = {
    easy: { speed: 5, obstacleFrequency: 2000, scoreMultiplier: 1 },
    medium: { speed: 7, obstacleFrequency: 1500, scoreMultiplier: 1.5 },
    hard: { speed: 10, obstacleFrequency: 1000, scoreMultiplier: 2 }
  };

  const config = difficultyConfig[difficulty];
  const trackLength = 1000;

  const jump = useCallback(() => {
    if (!isJumping && gameStarted && !gameOver) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500);
    }
  }, [isJumping, gameStarted, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const gameLoop = setInterval(() => {
        setPosition(pos => {
          const newPos = pos + config.speed;
          if (newPos >= trackLength) {
            clearInterval(gameLoop);
            handleGameComplete(true);
            return trackLength;
          }
          return newPos;
        });
        setScore(s => s + 1);
        setTimeElapsed(t => t + 1);
      }, 100);

      const obstacleGenerator = setInterval(() => {
        setObstacles(obs => [...obs, { position: trackLength, passed: false }]);
      }, config.obstacleFrequency);

      return () => {
        clearInterval(gameLoop);
        clearInterval(obstacleGenerator);
      };
    }
  }, [gameStarted, gameOver, config.speed, config.obstacleFrequency]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      setObstacles(obs => {
        const newObs = obs
          .map(ob => ({
            ...ob,
            position: ob.position - config.speed * 2
          }))
          .filter(ob => ob.position > -50);

        // Check for collisions
        const playerHitbox = {
          left: 50,
          right: 100,
          top: isJumping ? 30 : 70,
          bottom: isJumping ? 80 : 120
        };

        const collision = newObs.some(ob => {
          const obstacleHitbox = {
            left: ob.position,
            right: ob.position + 30,
            top: 70,
            bottom: 120
          };

          return !(
            playerHitbox.left > obstacleHitbox.right ||
            playerHitbox.right < obstacleHitbox.left ||
            playerHitbox.top > obstacleHitbox.bottom ||
            playerHitbox.bottom < obstacleHitbox.top
          );
        });

        if (collision) {
          handleGameComplete(false);
        }

        return newObs;
      });
    }
  }, [gameStarted, gameOver, isJumping, config.speed]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setPosition(0);
    setObstacles([]);
    setScore(0);
    setTimeElapsed(0);
  };

  const handleGameComplete = (success) => {
    setGameOver(true);
    setGameStarted(false);

    const finalScore = Math.floor(score * config.scoreMultiplier);
    const timeBonus = Math.floor(timeElapsed / 10);
    const totalScore = finalScore + timeBonus;

    const rewards = {
      coins: Math.floor(totalScore / 2),
      experience: Math.floor(totalScore / 4),
      stats: {
        agility: success ? 3 : 1,
        energy: success ? 2 : 1
      }
    };

    if (onGameComplete) {
      onGameComplete({
        score: totalScore,
        time: timeElapsed,
        success,
        rewards
      });
    }

    if (activePet) {
      updatePetStats(activePet._id, rewards.stats);
    }
  };

  const progressPercentage = (position / trackLength) * 100;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '600px',
        marginBottom: '1rem'
      }}>
        <div>Score: {Math.floor(score * config.scoreMultiplier)}</div>
        <div>Time: {timeElapsed}s</div>
        <div>Progress: {Math.floor(progressPercentage)}%</div>
      </div>

      {!gameStarted && !gameOver ? (
        <button
          onClick={startGame}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Start Race
        </button>
      ) : (
        <div
          style={{
            width: '600px',
            height: '200px',
            border: '2px solid var(--border-color)',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'var(--background-color)'
          }}
        >
          {/* Pet character */}
          <div
            style={{
              position: 'absolute',
              left: '50px',
              bottom: isJumping ? '80px' : '30px',
              width: '50px',
              height: '50px',
              backgroundColor: 'var(--primary-color)',
              borderRadius: '50%',
              transition: 'bottom 0.5s',
              cursor: 'pointer'
            }}
            onClick={jump}
          >
            🐾
          </div>

          {/* Obstacles */}
          {obstacles.map((obstacle, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${obstacle.position}px`,
                bottom: '30px',
                width: '30px',
                height: '50px',
                backgroundColor: 'var(--error-color)',
                borderRadius: '4px'
              }}
            />
          ))}

          {/* Progress bar */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              right: '10px',
              height: '10px',
              backgroundColor: 'var(--border-color)',
              borderRadius: '5px'
            }}
          >
            <div
              style={{
                width: `${progressPercentage}%`,
                height: '100%',
                backgroundColor: 'var(--success-color)',
                borderRadius: '5px',
                transition: 'width 0.1s'
              }}
            />
          </div>
        </div>
      )}

      {gameOver && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: progressPercentage >= 100 ? 'var(--success-color)' : 'var(--error-color)',
          color: 'white',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          {progressPercentage >= 100 ? '🎉 Race Complete!' : '💥 Game Over!'}
        </div>
      )}

      <div style={{
        marginTop: '1rem',
        textAlign: 'center',
        color: 'var(--text-color)'
      }}>
        Press SPACE or tap the pet to jump!
      </div>
    </div>
  );
};

export default RacingGame;
