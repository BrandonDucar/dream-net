import React, { useState, useEffect, useCallback } from 'react';
import { useGameRegistry, GameType } from './hooks/useGameRegistry.js';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

export function JaggyStealthRun() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [jaggyPos, setJaggyPos] = useState<Position>({ x: 50, y: 50 });
  const [obstacles, setObstacles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [gameSpeed, setGameSpeed] = useState(1);
  const { address } = useAccount();
  const { submitScore, getBestScore, getTopPlayers, getPlayerRank } = useGameRegistry();
  
  // Get on-chain best score
  const { data: onChainBest } = getBestScore(GameType.JaggyStealthRun);
  const { data: playerRank } = getPlayerRank(GameType.JaggyStealthRun);
  const { data: topPlayers } = getTopPlayers(GameType.JaggyStealthRun, 10);
  
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('jaggyStealthBest');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 600;
  const JAGGY_SIZE = 40;
  const OBSTACLE_SIZE = 30;

  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
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
      setJaggyPos(prev => {
        let newX = prev.x;
        let newY = prev.y;
        const moveSpeed = 5;

        if (keys.has('ArrowLeft')) newX = Math.max(JAGGY_SIZE / 2, newX - moveSpeed);
        if (keys.has('ArrowRight')) newX = Math.min(GAME_WIDTH - JAGGY_SIZE / 2, newX + moveSpeed);
        if (keys.has('ArrowUp')) newY = Math.max(JAGGY_SIZE / 2, newY - moveSpeed);
        if (keys.has('ArrowDown')) newY = Math.min(GAME_HEIGHT - JAGGY_SIZE / 2, newY + moveSpeed);

        return { x: newX, y: newY };
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
    }, 2000 / gameSpeed);

    return () => clearInterval(spawnInterval);
  }, [gameState, gameSpeed]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const updateInterval = setInterval(() => {
      setObstacles(prev => {
        const updated = prev.map(obs => ({
          ...obs,
          y: obs.y + 3 * gameSpeed,
        })).filter(obs => obs.y < GAME_HEIGHT + OBSTACLE_SIZE);

        // Check collisions
        updated.forEach(obs => {
          const dist = Math.sqrt(
            Math.pow(obs.x + OBSTACLE_SIZE / 2 - jaggyPos.x, 2) +
            Math.pow(obs.y + OBSTACLE_SIZE / 2 - jaggyPos.y, 2)
          );
          if (dist < (JAGGY_SIZE + OBSTACLE_SIZE) / 2) {
            endGame();
          }
        });

        return updated;
      });

      setScore(prev => {
        const newScore = prev + 1;
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('jaggyStealthBest', newScore.toString());
        }
        return newScore;
      });

      if (score > 0 && score % 100 === 0) {
        setGameSpeed(prev => Math.min(prev + 0.2, 3));
      }
    }, 16);

    return () => clearInterval(updateInterval);
  }, [gameState, jaggyPos, gameSpeed, score, bestScore]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setJaggyPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 100 });
    setObstacles([]);
    setGameSpeed(1);
    setKeys(new Set());
  };

  const endGame = async () => {
    setGameState('gameover');
    
    // Submit score to blockchain if wallet connected
    if (address && score > 0 && submitScore.write) {
      try {
        await submitScore.write({
          args: [
            GameType.JaggyStealthRun,
            BigInt(score),
            JSON.stringify({ 
              timestamp: Date.now(),
              gameVersion: '1.0',
              finalSpeed: gameSpeed.toFixed(2)
            })
          ],
        });
        console.log('✅ Score submitted to blockchain!');
      } catch (error) {
        console.error('Failed to submit score:', error);
      }
    }
  };

  const handleButtonMove = (direction: string) => {
    if (gameState !== 'playing') return;
    setKeys(prev => new Set(prev).add(direction));
    setTimeout(() => {
      setKeys(prev => {
        const next = new Set(prev);
        next.delete(direction);
        return next;
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🐱 Jaggy Stealth Run
          </h1>
          <p className="text-gray-400 mb-6">Dodge obstacles and survive as long as possible!</p>

          {gameState === 'menu' && (
            <div className="text-center py-8">
              <div className="mb-6">
                <p className="text-gray-300 mb-2">
                  Best Score: {Math.max(bestScore, Number(onChainBest || 0))}
                  {onChainBest && Number(onChainBest) > bestScore && (
                    <span className="ml-2 text-cyan-400 text-sm">(On-chain)</span>
                  )}
                </p>
                {playerRank && Number(playerRank) > 0 && (
                  <p className="text-cyan-400 mb-2">
                    <Trophy className="inline h-4 w-4 mr-1" />
                    Rank #{playerRank}
                  </p>
                )}
                <p className="text-sm text-gray-500">Use arrow keys or on-screen buttons to move</p>
              </div>
              <div className="flex gap-4 justify-center mb-4">
                <button
                  onClick={startGame}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Start Game
                </button>
                <button
                  onClick={() => setShowLeaderboard(!showLeaderboard)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Leaderboard
                </button>
              </div>
              
              {showLeaderboard && topPlayers && (
                <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-cyan-500/20">
                  <h3 className="text-xl font-bold mb-4 text-cyan-400">🏆 Top Players</h3>
                  <div className="space-y-2">
                    {topPlayers.slice(0, 10).map((entry, idx) => (
                      <div
                        key={idx}
                        className={`flex justify-between items-center p-2 rounded ${
                          entry.player.toLowerCase() === address?.toLowerCase()
                            ? 'bg-cyan-500/20 border border-cyan-500'
                            : 'bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-cyan-400">#{entry.rank}</span>
                          <span className="text-sm font-mono">
                            {entry.player.slice(0, 6)}...{entry.player.slice(-4)}
                          </span>
                        </div>
                        <span className="font-bold">{entry.score.toString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {gameState === 'playing' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-bold text-cyan-400">Score: {score}</div>
                <div className="text-sm text-gray-400">Speed: {gameSpeed.toFixed(1)}x</div>
              </div>
              <div
                className="relative bg-gray-950 border-2 border-cyan-500/30 rounded-lg mx-auto"
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
              >
                {/* Jaggy */}
                <div
                  className="absolute bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full border-2 border-white"
                  style={{
                    width: JAGGY_SIZE,
                    height: JAGGY_SIZE,
                    left: jaggyPos.x - JAGGY_SIZE / 2,
                    top: jaggyPos.y - JAGGY_SIZE / 2,
                    transition: 'all 0.1s',
                  }}
                >
                  <div className="text-center text-xs pt-2">🐱</div>
                </div>

                {/* Obstacles */}
                {obstacles.map(obs => (
                  <div
                    key={obs.id}
                    className="absolute bg-red-500 rounded-lg border-2 border-red-700"
                    style={{
                      width: OBSTACLE_SIZE,
                      height: OBSTACLE_SIZE,
                      left: obs.x,
                      top: obs.y,
                    }}
                  />
                ))}
              </div>

              {/* Mobile Controls */}
              <div className="mt-4 grid grid-cols-3 gap-2 max-w-xs mx-auto">
                <div></div>
                <button
                  onTouchStart={() => handleButtonMove('ArrowUp')}
                  onMouseDown={() => handleButtonMove('ArrowUp')}
                  className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-xl"
                >
                  ↑
                </button>
                <div></div>
                <button
                  onTouchStart={() => handleButtonMove('ArrowLeft')}
                  onMouseDown={() => handleButtonMove('ArrowLeft')}
                  className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-xl"
                >
                  ←
                </button>
                <button
                  onTouchStart={() => handleButtonMove('ArrowDown')}
                  onMouseDown={() => handleButtonMove('ArrowDown')}
                  className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-xl"
                >
                  ↓
                </button>
                <button
                  onTouchStart={() => handleButtonMove('ArrowRight')}
                  onMouseDown={() => handleButtonMove('ArrowRight')}
                  className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-xl"
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
              <p className="text-gray-400">
                Best Score: {Math.max(bestScore, Number(onChainBest || 0))}
              </p>
              {address && (
                <p className="text-sm text-cyan-400 mt-2">
                  {submitScore.isSuccess ? '✅ Score saved to blockchain!' : 
                   submitScore.isError ? '⚠️ Score submission failed' :
                   submitScore.isPending ? '⏳ Saving to blockchain...' :
                   '💡 Connect wallet to save score on-chain'}
                </p>
              )}
              <div className="flex gap-4 justify-center mt-6">
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

