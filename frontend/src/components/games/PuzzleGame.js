import React, { useState, useEffect } from 'react';
import { usePet } from '../../context/PetContext';

const PuzzleGame = ({ difficulty = 'easy', onGameComplete }) => {
  const { activePet, updatePetStats } = usePet();
  const [grid, setGrid] = useState([]);
  const [emptyCell, setEmptyCell] = useState({ row: 0, col: 0 });
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  const difficultyConfig = {
    easy: { size: 3, time: 120 },
    medium: { size: 4, time: 180 },
    hard: { size: 5, time: 300 }
  };

  const config = difficultyConfig[difficulty];

  const generatePuzzle = () => {
    const size = config.size;
    const numbers = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
    numbers.push(0); // Empty cell

    // Shuffle the numbers
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // Create grid
    const newGrid = [];
    for (let i = 0; i < size; i++) {
      const row = numbers.slice(i * size, (i + 1) * size);
      newGrid.push(row);
      
      // Find empty cell position
      const emptyIndex = row.indexOf(0);
      if (emptyIndex !== -1) {
        setEmptyCell({ row: i, col: emptyIndex });
      }
    }

    return newGrid;
  };

  const startGame = () => {
    const newGrid = generatePuzzle();
    setGrid(newGrid);
    setMoves(0);
    setTimeLeft(config.time);
    setGameStarted(true);
    setIsSolved(false);
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

  const checkSolution = (newGrid) => {
    const size = config.size;
    const solution = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
    solution.push(0);
    
    const currentState = newGrid.flat();
    return solution.every((num, index) => num === currentState[index]);
  };

  const handleMove = (row, col) => {
    if (!gameStarted || isSolved) return;

    const isAdjacent = (
      (Math.abs(row - emptyCell.row) === 1 && col === emptyCell.col) ||
      (Math.abs(col - emptyCell.col) === 1 && row === emptyCell.row)
    );

    if (isAdjacent) {
      const newGrid = grid.map(row => [...row]);
      newGrid[emptyCell.row][emptyCell.col] = newGrid[row][col];
      newGrid[row][col] = 0;
      
      setGrid(newGrid);
      setEmptyCell({ row, col });
      setMoves(moves + 1);

      if (checkSolution(newGrid)) {
        setIsSolved(true);
        handleGameOver(true);
      }
    }
  };

  const handleGameOver = (solved = false) => {
    const timeBonus = timeLeft * 2;
    const movePenalty = moves * -0.5;
    const baseScore = solved ? 1000 : 0;
    const finalScore = Math.max(0, baseScore + timeBonus + movePenalty);

    const rewards = {
      coins: Math.floor(finalScore / 10),
      experience: Math.floor(finalScore / 20),
      stats: {
        intelligence: solved ? 3 : 1,
        happiness: solved ? 2 : 0
      }
    };

    if (onGameComplete) {
      onGameComplete({
        score: finalScore,
        moves,
        timeLeft,
        solved,
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
        maxWidth: '400px',
        marginBottom: '1rem'
      }}>
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${config.size}, 1fr)`,
          gap: '0.5rem',
          maxWidth: '400px',
          width: '100%'
        }}>
          {grid.map((row, rowIndex) => (
            row.map((number, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleMove(rowIndex, colIndex)}
                style={{
                  aspectRatio: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: number === 0 ? 'transparent' : 'var(--primary-color)',
                  color: 'white',
                  fontSize: '1.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  transform: isSolved ? 'scale(1.05)' : 'scale(1)',
                  userSelect: 'none'
                }}
              >
                {number !== 0 && number}
              </div>
            ))
          ))}
        </div>
      )}

      {isSolved && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'var(--success-color)',
          color: 'white',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          🎉 Puzzle Solved! Well done!
        </div>
      )}
    </div>
  );
};

export default PuzzleGame;
