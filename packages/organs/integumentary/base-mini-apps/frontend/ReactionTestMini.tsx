import React, { useState, useEffect } from 'react';

export function ReactionTestMini() {
  const [gameState, setGameState] = useState<'ready' | 'waiting' | 'go' | 'result'>('ready');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('reactionTestBest');
    return saved ? parseFloat(saved) : null;
  });
  const [attempts, setAttempts] = useState(0);

  const startTest = () => {
    setGameState('ready');
    setReactionTime(null);
    setAttempts(prev => prev + 1);

    setTimeout(() => {
      setGameState('waiting');
      const delay = 1000 + Math.random() * 3000; // 1-4 second delay

      setTimeout(() => {
        setGameState('go');
        setStartTime(Date.now());
      }, delay);
    }, 500);
  };

  const handleTap = () => {
    if (gameState === 'go' && startTime) {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setGameState('result');

      if (!bestTime || time < bestTime) {
        setBestTime(time);
        localStorage.setItem('reactionTestBest', time.toString());
      }
    } else if (gameState === 'ready' || gameState === 'waiting') {
      // Too early - reset
      setGameState('ready');
      setReactionTime(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            ⚡ Reaction Test Mini
          </h1>
          <p className="text-gray-400 mb-6">Test your reaction speed!</p>

          <div className="mb-6 text-center">
            <div className="text-lg mb-2">Best Time: {bestTime ? `${bestTime}ms` : 'N/A'}</div>
            <div className="text-sm text-gray-400">Attempts: {attempts}</div>
          </div>

          <div className="py-12">
            {gameState === 'ready' && (
              <div className="text-center">
                <button
                  onClick={startTest}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-xl transition-colors"
                >
                  Start Test
                </button>
                <p className="mt-4 text-gray-400">Wait for "Ready..." then tap when you see "Tap NOW!"</p>
              </div>
            )}

            {gameState === 'waiting' && (
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-4 animate-pulse">
                  Ready...
                </div>
                <p className="text-gray-400">Wait for the signal...</p>
              </div>
            )}

            {gameState === 'go' && (
              <div className="text-center">
                <button
                  onClick={handleTap}
                  className="w-full h-64 bg-green-500 hover:bg-green-600 text-white text-4xl font-bold rounded-lg transition-all animate-pulse"
                >
                  TAP NOW!
                </button>
              </div>
            )}

            {gameState === 'result' && reactionTime !== null && (
              <div className="text-center">
                <div className="text-5xl font-bold text-cyan-400 mb-4">
                  {reactionTime}ms
                </div>
                {reactionTime === bestTime && (
                  <p className="text-green-400 text-xl mb-4">🎉 New Best Time!</p>
                )}
                <div className="mb-6">
                  {reactionTime < 200 && <p className="text-green-400">Lightning fast! ⚡</p>}
                  {reactionTime >= 200 && reactionTime < 300 && <p className="text-cyan-400">Great reaction! 🎯</p>}
                  {reactionTime >= 300 && reactionTime < 400 && <p className="text-yellow-400">Good! 👍</p>}
                  {reactionTime >= 400 && <p className="text-orange-400">Keep practicing! 💪</p>}
                </div>
                <button
                  onClick={startTest}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

