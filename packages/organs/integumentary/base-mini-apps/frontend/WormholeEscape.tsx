import React, { useState, useEffect, useCallback } from 'react';

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
}

export function WormholeEscape() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [shipX, setShipX] = useState(200);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('wormholeEscapeBest');
    return saved ? parseInt(saved, 10) : 0;
  });

  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 600;
  const SHIP_WIDTH = 50;
  const SHIP_HEIGHT = 40;
  const LANE_WIDTH = GAME_WIDTH / 3;

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
      setShipX(prev => {
        let newX = prev;
        const moveSpeed = 8;

        if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) {
          newX = Math.max(SHIP_WIDTH / 2, newX - moveSpeed);
        }
        if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) {
          newX = Math.min(GAME_WIDTH - SHIP_WIDTH / 2, newX + moveSpeed);
        }

        return newX;
      });
    }, 16);

    return () => clearInterval(moveInterval);
  }, [gameState, keys]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      const lane = Math.floor(Math.random() * 3);
      setObstacles(prev => [
        ...prev,
        {
          id: Date.now(),
          x: lane * LANE_WIDTH + LANE_WIDTH / 2,
          y: -50,
          width: LANE_WIDTH - 20,
        },
      ]);
    }, 1500 / speed);

    return () => clearInterval(spawnInterval);
  }, [gameState, speed]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const updateInterval = setInterval(() => {
      setObstacles(prev => {
        const updated = prev.map(obs => ({
          ...obs,
          y: obs.y + speed * 3,
        })).filter(obs => obs.y < GAME_HEIGHT + 100);

        // Check collisions
        updated.forEach(obs => {
          const shipLeft = shipX - SHIP_WIDTH / 2;
          const shipRight = shipX + SHIP_WIDTH / 2;
          const obsLeft = obs.x - obs.width / 2;
          const obsRight = obs.x + obs.width / 2;

          if (
            shipY < obs.y + 50 &&
            shipY + SHIP_HEIGHT > obs.y &&
            shipLeft < obsRight &&
            shipRight > obsLeft
          ) {
            endGame();
          }
        });

        return updated;
      });

      setScore(prev => {
        const newScore = prev + 1;
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('wormholeEscapeBest', newScore.toString());
        }
        return newScore;
      });

      if (score > 0 && score % 200 === 0) {
        setSpeed(prev => Math.min(prev + 0.3, 5));
      }
    }, 16);

    return () => clearInterval(updateInterval);
  }, [gameState, shipX, speed, score, bestScore]);

  const shipY = GAME_HEIGHT - SHIP_HEIGHT - 20;

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setShipX(GAME_WIDTH / 2);
    setObstacles([]);
    setSpeed(2);
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
            🌀 Wormhole Escape
          </h1>
          <p className="text-gray-400 mb-6">Navigate through the wormhole and avoid obstacles!</p>

          {gameState === 'menu' && (
            <div className="text-center py-8">
              <div className="mb-6">
                <p className="text-gray-300 mb-2">Best Score: {bestScore}</p>
                <p className="text-sm text-gray-500">Use arrow keys or A/D to move left/right</p>
              </div>
              <button
                onClick={startGame}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Game
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-bold text-cyan-400">Score: {score}</div>
                <div className="text-sm text-gray-400">Speed: {speed.toFixed(1)}x</div>
              </div>
              <div
                className="relative bg-gradient-to-b from-purple-950 to-gray-950 border-2 border-cyan-500/30 rounded-lg mx-auto overflow-hidden"
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
              >
                {/* Lanes */}
                <div className="absolute inset-0 flex">
                  <div className="w-1/3 border-r border-cyan-500/20"></div>
                  <div className="w-1/3 border-r border-cyan-500/20"></div>
                </div>

                {/* Ship */}
                <div
                  className="absolute bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg border-2 border-white transition-all"
                  style={{
                    width: SHIP_WIDTH,
                    height: SHIP_HEIGHT,
                    left: shipX - SHIP_WIDTH / 2,
                    top: shipY,
                  }}
                >
                  <div className="text-center text-xs pt-2">🚀</div>
                </div>

                {/* Obstacles */}
                {obstacles.map(obs => (
                  <div
                    key={obs.id}
                    className="absolute bg-red-500 rounded-lg border-2 border-red-700 opacity-80"
                    style={{
                      width: obs.width,
                      height: 50,
                      left: obs.x - obs.width / 2,
                      top: obs.y,
                    }}
                  />
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
              <h2 className="text-2xl font-bold text-red-400 mb-4">Game Over!</h2>
              <p className="text-xl mb-2">Final Score: {score}</p>
              {score === bestScore && (
                <p className="text-green-400 mb-4">🎉 New Best Score!</p>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Play Again
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

