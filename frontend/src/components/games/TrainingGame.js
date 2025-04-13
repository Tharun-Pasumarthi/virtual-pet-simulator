import React, { useState, useEffect } from 'react';
import { usePet } from '../../context/PetContext';

const TrainingGame = ({ difficulty = 'easy', onGameComplete }) => {
  const { activePet, updatePetStats } = usePet();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentCommand, setCurrentCommand] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [streak, setStreak] = useState(0);

  const difficultyConfig = {
    easy: { 
      time: 60, 
      sequenceLength: 3, 
      commandDuration: 2000,
      scoreMultiplier: 1 
    },
    medium: { 
      time: 90, 
      sequenceLength: 4, 
      commandDuration: 1500,
      scoreMultiplier: 1.5 
    },
    hard: { 
      time: 120, 
      sequenceLength: 5, 
      commandDuration: 1000,
      scoreMultiplier: 2 
    }
  };

  const config = difficultyConfig[difficulty];

  const commands = [
    { id: 'sit', icon: '⬇️', name: 'Sit', color: '#4CAF50' },
    { id: 'jump', icon: '⬆️', name: 'Jump', color: '#2196F3' },
    { id: 'roll', icon: '🔄', name: 'Roll', color: '#9C27B0' },
    { id: 'spin', icon: '💫', name: 'Spin', color: '#FF9800' },
    { id: 'stay', icon: '✋', name: 'Stay', color: '#F44336' }
  ];

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameStarted) {
      handleGameComplete();
    }
  }, [gameStarted, timeLeft]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(config.time);
    setStreak(0);
    generateNewSequence();
  };

  const generateNewSequence = () => {
    const newSequence = Array.from({ length: config.sequenceLength }, () => 
      commands[Math.floor(Math.random() * commands.length)]
    );
    setSequence(newSequence);
    setPlayerSequence([]);
    playSequence(newSequence);
  };

  const playSequence = async (seq) => {
    for (let command of seq) {
      setCurrentCommand(command);
      await new Promise(resolve => setTimeout(resolve, config.commandDuration));
    }
    setCurrentCommand(null);
  };

  const handleCommandClick = (command) => {
    if (!gameStarted || currentCommand) return;

    const newPlayerSequence = [...playerSequence, command];
    setPlayerSequence(newPlayerSequence);

    // Check if the command is correct
    if (command.id !== sequence[playerSequence.length].id) {
      handleGameComplete();
      return;
    }

    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      const points = 10 * config.scoreMultiplier * (1 + streak * 0.1);
      setScore(score + points);
      setStreak(streak + 1);
      setTimeout(generateNewSequence, 500);
    }
  };

  const handleGameComplete = () => {
    setGameStarted(false);
    setGameOver(true);

    const finalScore = Math.floor(score);
    const streakBonus = Math.floor(streak * 5);
    const timeBonus = Math.floor(timeLeft * 2);
    const totalScore = finalScore + streakBonus + timeBonus;

    const rewards = {
      coins: Math.floor(totalScore / 5),
      experience: Math.floor(totalScore / 10),
      stats: {
        intelligence: Math.min(5, Math.floor(streak / 2)),
        happiness: 2,
        energy: -1
      }
    };

    if (onGameComplete) {
      onGameComplete({
        score: totalScore,
        streak,
        timeLeft,
        rewards
      });
    }

    if (activePet) {
      updatePetStats(activePet._id, rewards.stats);
    }
  };

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
        <div>Score: {Math.floor(score)}</div>
        <div>Streak: {streak}</div>
        <div>Time: {timeLeft}s</div>
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
          Start Training
        </button>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem'
        }}>
          {/* Current command display */}
          <div style={{
            fontSize: '2rem',
            height: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {currentCommand && (
              <div style={{
                padding: '0.5rem 1rem',
                backgroundColor: currentCommand.color,
                color: 'white',
                borderRadius: '0.5rem',
                animation: 'pop 0.3s ease'
              }}>
                {currentCommand.icon} {currentCommand.name}
              </div>
            )}
          </div>

          {/* Command buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            maxWidth: '400px'
          }}>
            {commands.map((command) => (
              <button
                key={command.id}
                onClick={() => handleCommandClick(command)}
                disabled={!!currentCommand}
                style={{
                  padding: '1rem',
                  fontSize: '1.5rem',
                  backgroundColor: command.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: currentCommand ? 'not-allowed' : 'pointer',
                  opacity: currentCommand ? 0.7 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <div>{command.icon}</div>
                <div style={{ fontSize: '0.8rem' }}>{command.name}</div>
              </button>
            ))}
          </div>

          {/* Progress display */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '1rem'
          }}>
            {sequence.map((cmd, index) => (
              <div
                key={index}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: playerSequence[index]?.id === cmd.id
                    ? 'var(--success-color)'
                    : 'var(--border-color)',
                  transition: 'background-color 0.3s'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {gameOver && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: streak >= 10 ? 'var(--success-color)' : 'var(--error-color)',
          color: 'white',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          {streak >= 10 ? '🎉 Amazing Training!' : '💫 Training Complete!'}
          <div>Final Score: {Math.floor(score)}</div>
          <div>Max Streak: {streak}</div>
        </div>
      )}
    </div>
  );
};

export default TrainingGame;
