import React, { useState, useEffect, useCallback } from 'react';

interface Obstacle {
  id: number;
  x: number;
  y: number;
}

export function DreamSnailDrift() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [snailX, setSnailX] = useState(200);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('dreamSnailDriftBest');
    return saved ? parseInt(saved, 10) : 0;
  });

  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 600;
  const SNAIL_SIZE = 50;
  const OBSTACLE_SIZE = 40;
  const MOVE_SPEED = 2;

  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
        setKeys(prev => new Set(prev).add(e.key));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const next = new Set(prev);
        next.delete(e.key);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveInterval = setInterval(() => {
      setSnailX(prev => {
        let newX = prev;
        if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) {
          newX = Math.max(SNAIL_SIZE / 2, newX - MOVE_SPEED);
        }
        if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) {
          newX = Math.min(GAME_WIDTH - SNAIL_SIZE / 2, newX + MOVE_SPEED);
        }
        return newX;
      });
    }, 16);

    return () => clearInterval(moveInterval);
  }, [gameState, keys]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      setObstacles(prev => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * (GAME_WIDTH - OBSTACLE_SIZE),
          y: -OBSTACLE_SIZE,
        },
      ]);
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const updateInterval = setInterval(() => {
      setObstacles(prev => {
        const updated = prev.map(obs => ({
          ...obs,
          y: obs.y + 1.5, // Slow movement
        })).filter(obs => obs.y < GAME_HEIGHT + OBSTACLE_SIZE);

        // Check collisions
        updated.forEach(obs => {
          const dist = Math.sqrt(
            Math.pow(obs.x + OBSTACLE_SIZE / 2 - snailX, 2) +
            Math.pow(obs.y + OBSTACLE_SIZE / 2 - (GAME_HEIGHT - SNAIL_SIZE - 20), 2)
          );
          if (dist < (SNAIL_SIZE + OBSTACLE_SIZE) / 2) {
            endGame();
          }
        });

        return updated;
      });

      setScore(prev => {
        const newScore = prev + 1;
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('dreamSnailDriftBest', newScore.toString());
        }
        return newScore;
      });
    }, 16);

    return () => clearInterval(updateInterval);
  }, [gameState, snailX, bestScore]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setSnailX(GAME_WIDTH / 2);
    setObstacles([]);
    setKeys(new Set());
  };

  const endGame = () => {
    setGameState('gameover');
  };

  const handleButtonMove = (direction: 'left' | 'right') => {
    if (gameState !== 'playing') return;
    const key = direction === 'left' ? 'ArrowLeft' : 'ArrowRight';
    setKeys(prev => new Set(prev).add(key));
    setTimeout(() => {
      setKeys(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🐌 Dream Snail Drift
          </h1>
          <p className="text-gray-400 mb-6">Calmly drift and avoid obstacles in this peaceful journey</p>

          {gameState === 'menu' && (
            <div className="text-center py-8">
              <div className="mb-6">
                <p className="text-gray-300 mb-2">Best Score: {bestScore}</p>
                <p className="text-sm text-gray-500">Use arrow keys or A/D to nudge left/right</p>
              </div>
              <button
                onClick={startGame}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Journey
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-bold text-cyan-400">Score: {score}</div>
                <div className="text-sm text-gray-400">Distance traveled</div>
              </div>
              <div
                className="relative bg-gradient-to-b from-green-950 via-blue-950 to-purple-950 border-2 border-cyan-500/30 rounded-lg mx-auto overflow-hidden"
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
              >
                {/* Snail */}
                <div
                  className="absolute transition-all"
                  style={{
                    left: snailX - SNAIL_SIZE / 2,
                    top: GAME_HEIGHT - SNAIL_SIZE - 20,
                  }}
                >
                  <div className="text-5xl">🐌</div>
                </div>

                {/* Obstacles */}
                {obstacles.map(obs => (
                  <div
                    key={obs.id}
                    className="absolute bg-gray-600 rounded-lg border-2 border-gray-500 opacity-70"
                    style={{
                      width: OBSTACLE_SIZE,
                      height: OBSTACLE_SIZE,
                      left: obs.x,
                      top: obs.y,
                    }}
                  >
                    <div className="text-center text-xl pt-1">🪨</div>
                  </div>
                ))}
              </div>

              {/* Mobile Controls */}
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onTouchStart={() => handleButtonMove('left')}
                  onMouseDown={() => handleButtonMove('left')}
                  className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-xl w-20"
                >
                  ←
                </button>
                <button
                  onTouchStart={() => handleButtonMove('right')}
                  onMouseDown={() => handleButtonMove('right')}
                  className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-xl w-20"
                >
                  →
                </button>
              </div>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-red-400 mb-4">Journey Ended</h2>
              <p className="text-xl mb-2">Final Score: {score}</p>
              {score === bestScore && (
                <p className="text-green-400 mb-4">🎉 New Best Score!</p>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setGameState('menu')}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Menu
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

