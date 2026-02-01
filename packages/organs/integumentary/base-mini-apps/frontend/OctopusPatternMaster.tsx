import React, { useState, useEffect } from 'react';

const ARM_COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
const COLOR_CLASSES: Record<string, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
};

export function OctopusPatternMaster() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'showing' | 'input' | 'gameover'>('menu');
  const [pattern, setPattern] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(3);
  const [showingIndex, setShowingIndex] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('octopusPatternBest');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    if (gameState === 'showing') {
      if (showingIndex < pattern.length) {
        const timer = setTimeout(() => {
          setShowingIndex(prev => prev + 1);
        }, 600);
        return () => clearTimeout(timer);
      } else {
        setTimeout(() => {
          setGameState('input');
          setShowingIndex(0);
        }, 500);
      }
    }
  }, [gameState, showingIndex, pattern]);

  const startGame = () => {
    setGameState('playing');
    setRound(1);
    setScore(0);
    setDifficulty(3);
    generatePattern(3);
  };

  const generatePattern = (length: number) => {
    const newPattern = Array.from({ length }, () => 
      ARM_COLORS[Math.floor(Math.random() * ARM_COLORS.length)]
    );
    setPattern(newPattern);
    setUserInput([]);
    setGameState('showing');
    setShowingIndex(0);
  };

  const handleArmClick = (color: string) => {
    if (gameState !== 'input') return;

    const newInput = [...userInput, color];
    setUserInput(newInput);

    if (newInput.length === pattern.length) {
      checkPattern(newInput);
    }
  };

  const checkPattern = (input: string[]) => {
    const isCorrect = input.every((val, idx) => val === pattern[idx]);

    if (isCorrect) {
      const newScore = score + 10 * round;
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('octopusPatternBest', newScore.toString());
      }
      setRound(prev => prev + 1);
      setDifficulty(prev => Math.min(prev + 1, 8));
      setTimeout(() => {
        generatePattern(difficulty + 1);
      }, 1000);
    } else {
      setGameState('gameover');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🐙 Octopus Pattern Master
          </h1>
          <p className="text-gray-400 mb-6">Memorize the pattern and repeat it!</p>

          {gameState === 'menu' && (
            <div className="text-center py-8">
              <div className="mb-6">
                <p className="text-gray-300 mb-2">Best Score: {bestScore}</p>
                <p className="text-sm text-gray-500">Watch the colored arms light up, then click them in order</p>
              </div>
              <button
                onClick={startGame}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Game
              </button>
            </div>
          )}

          {(gameState === 'showing' || gameState === 'input') && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="text-xl font-bold text-cyan-400">Round: {round}</div>
                <div className="text-lg text-green-400">Score: {score}</div>
                <div className="text-sm text-gray-400">Difficulty: {difficulty}</div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg mb-4 text-center">
                  {gameState === 'showing' ? 'Watch the pattern...' : 'Now repeat it!'}
                </h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  {pattern.map((color, idx) => (
                    <div
                      key={idx}
                      className={`w-16 h-16 rounded-full border-4 transition-all ${
                        gameState === 'showing' && idx < showingIndex
                          ? `${COLOR_CLASSES[color]} border-white scale-125 shadow-lg`
                          : gameState === 'showing'
                          ? 'bg-gray-700 border-gray-600'
                          : `${COLOR_CLASSES[color]} border-gray-400`
                      }`}
                    />
                  ))}
                </div>
              </div>

              {gameState === 'input' && (
                <div>
                  <p className="text-center mb-4 text-gray-400">
                    Your input: {userInput.map(c => c).join(' → ')}
                  </p>
                  <div className="flex justify-center gap-4 flex-wrap">
                    {ARM_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => handleArmClick(color)}
                        className={`w-20 h-20 rounded-full border-4 ${COLOR_CLASSES[color]} border-white hover:scale-110 transition-transform`}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-red-400 mb-4">Game Over!</h2>
              <p className="text-xl mb-2">Final Score: {score}</p>
              <p className="text-lg mb-2">Round Reached: {round}</p>
              {score === bestScore && score > 0 && (
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

