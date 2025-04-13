import React, { useState, useEffect } from 'react';
import { usePet } from '../../context/PetContext';

const MemoryGame = ({ difficulty = 'easy', onGameComplete }) => {
  const { activePet, updatePetStats } = usePet();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [powerUps, setPowerUps] = useState({
    reveal: { active: false, count: 1 },
    timeBonus: { active: false, count: 1 },
    matchAny: { active: false, count: 1 }
  });

  const difficultyConfig = {
    easy: { pairs: 6, time: 60, gridSize: '3x4' },
    medium: { pairs: 8, time: 90, gridSize: '4x4' },
    hard: { pairs: 12, time: 120, gridSize: '4x6' },
    expert: { pairs: 15, time: 150, gridSize: '5x6' }
  };

  const config = difficultyConfig[difficulty];

  const generateCards = () => {
    const petThemes = [
      '🐶', '🐱', '🐰', '🐼', '🦊', '🐨',
      '🐯', '🦁', '🐸', '🦉', '🦒', '🐘',
      '🦈', '🐬', '🦚', '🦜'
    ];

    const selectedThemes = petThemes.slice(0, config.pairs);
    const cardPairs = [...selectedThemes, ...selectedThemes];
    return cardPairs
      .sort(() => Math.random() - 0.5)
      .map((theme, index) => ({
        id: index,
        theme,
        isFlipped: false,
        isMatched: false
      }));
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameStarted) {
      handleGameOver();
    }
  }, [gameStarted, timeLeft]);

  const startGame = () => {
    setCards(generateCards());
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setMoves(0);
    setTimeLeft(config.time);
    setGameStarted(true);
  };

  const handleCardClick = (cardId) => {
    if (!gameStarted || flipped.length === 2) return;
    
    if (!flipped.includes(cardId) && !matched.includes(cardId)) {
      const newFlipped = [...flipped, cardId];
      setFlipped(newFlipped);
      
      if (newFlipped.length === 2) {
        const [first, second] = newFlipped;
        if (cards[first].theme === cards[second].theme) {
          setMatched([...matched, first, second]);
          setScore(score + 10);
          setFlipped([]);
        } else {
          setTimeout(() => setFlipped([]), 1000);
        }
        setMoves(moves + 1);
      }
    }
  };

  const usePowerUp = (type) => {
    if (!powerUps[type].count) return;

    setPowerUps({
      ...powerUps,
      [type]: {
        ...powerUps[type],
        count: powerUps[type].count - 1,
        active: true
      }
    });

    switch (type) {
      case 'reveal':
        const unmatched = cards.findIndex((card, index) => 
          !matched.includes(index) && !flipped.includes(index)
        );
        if (unmatched !== -1) {
          setFlipped([unmatched]);
          setTimeout(() => setFlipped([]), 2000);
        }
        break;
      case 'timeBonus':
        setTimeLeft(time => time + 30);
        break;
      case 'matchAny':
        // Next two cards will match regardless of theme
        // Implementation depends on game logic
        break;
      default:
        break;
    }
  };

  const handleGameOver = () => {
    const finalScore = score + (timeLeft * 2);
    const perfectGame = moves === config.pairs;
    const rewards = {
      coins: Math.floor(finalScore * (perfectGame ? 1.5 : 1)),
      experience: Math.floor(finalScore / 2),
      stats: {
        intelligence: 2,
        happiness: 1
      }
    };

    if (onGameComplete) {
      onGameComplete({
        score: finalScore,
        moves,
        timeLeft,
        perfect: perfectGame,
        rewards
      });
    }

    // Update pet stats
    if (activePet) {
      updatePetStats(activePet._id, rewards.stats);
    }
  };

  const [gridColumns, gridRows] = config.gridSize.split('x').map(Number);

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
        <div>Score: {score}</div>
        <div>Moves: {moves}</div>
        <div>Time: {timeLeft}s</div>
      </div>

      {!gameStarted ? (
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
          Start Game
        </button>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gap: '0.5rem',
            maxWidth: '600px',
            width: '100%'
          }}>
            {cards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(index)}
                style={{
                  aspectRatio: '1',
                  backgroundColor: matched.includes(index) || flipped.includes(index) 
                    ? 'var(--card-bg)' 
                    : 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  borderRadius: '0.5rem',
                  transition: 'transform 0.3s ease',
                  transform: flipped.includes(index) ? 'rotateY(180deg)' : '',
                }}
              >
                {(matched.includes(index) || flipped.includes(index)) && card.theme}
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            {Object.entries(powerUps).map(([type, { count, active }]) => (
              <button
                key={type}
                onClick={() => usePowerUp(type)}
                disabled={!count || active}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: count && !active ? 'var(--secondary-color)' : 'var(--border-color)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: count && !active ? 'pointer' : 'not-allowed',
                  opacity: count && !active ? 1 : 0.5
                }}
              >
                {type} ({count})
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MemoryGame;
