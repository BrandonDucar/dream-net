import React, { useState, useEffect } from 'react';

interface Mole {
  id: number;
  position: number;
  isGood: boolean;
  showTime: number;
}

export function LabubuPopSmash() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [moles, setMoles] = useState<Mole[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('labubuPopSmashBest');
    return saved ? parseInt(saved, 10) : 0;
  });

  const GRID_SIZE = 3;
  const TOTAL_HOLES = GRID_SIZE * GRID_SIZE;

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      const availablePositions = Array.from({ length: TOTAL_HOLES }, (_, i) => i)
        .filter(pos => !moles.some(m => m.position === pos));

      if (availablePositions.length === 0) return;

      const position = availablePositions[Math.floor(Math.random() * availablePositions.length)];
      const isGood = Math.random() > 0.3; // 70% good, 30% bad

      const newMole: Mole = {
        id: Date.now(),
        position,
        isGood,
        showTime: Date.now(),
      };

      setMoles(prev => [...prev, newMole]);

      // Auto-hide after 2 seconds
      setTimeout(() => {
        setMoles(prev => prev.filter(m => m.id !== newMole.id));
      }, 2000);
    }, 1000);

    return () => clearInterval(spawnInterval);
  }, [gameState, moles]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    setMoles([]);
  };

  const endGame = () => {
    setGameState('gameover');
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('labubuPopSmashBest', score.toString());
    }
  };

  const handleMoleClick = (mole: Mole) => {
    if (gameState !== 'playing') return;

    if (mole.isGood) {
      setScore(prev => prev + 10);
    } else {
      setScore(prev => Math.max(0, prev - 5));
    }

    setMoles(prev => prev.filter(m => m.id !== mole.id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🎯 Labubu Pop Smash
          </h1>
          <p className="text-gray-400 mb-6">Tap the good Labubus, avoid the bad ones!</p>

          {gameState === 'menu' && (
            <div className="text-center py-8">
              <div className="mb-6">
                <p className="text-gray-300 mb-2">Best Score: {bestScore}</p>
                <p className="text-sm text-gray-500">Tap green Labubus (+10), avoid red ones (-5)</p>
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
              <div className="flex justify-between items-center mb-6">
                <div className="text-xl font-bold text-cyan-400">Score: {score}</div>
                <div className="text-lg text-yellow-400">Time: {timeLeft}s</div>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {Array.from({ length: TOTAL_HOLES }, (_, i) => {
                  const mole = moles.find(m => m.position === i);
                  return (
                    <button
                      key={i}
                      onClick={() => mole && handleMoleClick(mole)}
                      className="relative w-24 h-24 bg-gray-700 rounded-lg border-2 border-gray-600 hover:border-cyan-400 transition-colors overflow-hidden"
                    >
                      {mole ? (
                        <div
                          className={`absolute inset-0 flex items-center justify-center text-4xl ${
                            mole.isGood ? 'bg-green-500' : 'bg-red-500'
                          } animate-bounce`}
                        >
                          {mole.isGood ? '😊' : '😡'}
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-2xl text-gray-600">
                          🕳️
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-red-400 mb-4">Time's Up!</h2>
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

