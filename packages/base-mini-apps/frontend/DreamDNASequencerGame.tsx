import React, { useState, useEffect } from 'react';

const DNA_SEGMENTS = ['A', 'T', 'G', 'C'];
const COLORS: Record<string, string> = {
  A: 'bg-red-500',
  T: 'bg-blue-500',
  G: 'bg-green-500',
  C: 'bg-yellow-500',
};

export function DreamDNASequencerGame() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'showing' | 'input' | 'gameover'>('menu');
  const [sequence, setSequence] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [round, setRound] = useState(1);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => {
    const saved = localStorage.getItem('dnaSequencerBest');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showingIndex, setShowingIndex] = useState(0);

  useEffect(() => {
    if (gameState === 'showing') {
      if (showingIndex < sequence.length) {
        const timer = setTimeout(() => {
          setShowingIndex(prev => prev + 1);
        }, 800);
        return () => clearTimeout(timer);
      } else {
        setTimeout(() => {
          setGameState('input');
          setShowingIndex(0);
        }, 500);
      }
    }
  }, [gameState, showingIndex, sequence]);

  const startGame = () => {
    setGameState('playing');
    setRound(1);
    setStreak(0);
    generateSequence(3);
  };

  const generateSequence = (length: number) => {
    const newSeq = Array.from({ length }, () => 
      DNA_SEGMENTS[Math.floor(Math.random() * DNA_SEGMENTS.length)]
    );
    setSequence(newSeq);
    setUserInput([]);
    setGameState('showing');
    setShowingIndex(0);
  };

  const handleSegmentClick = (segment: string) => {
    if (gameState !== 'input') return;

    const newInput = [...userInput, segment];
    setUserInput(newInput);

    if (newInput.length === sequence.length) {
      checkSequence(newInput);
    }
  };

  const checkSequence = (input: string[]) => {
    const isCorrect = input.every((val, idx) => val === sequence[idx]);

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        localStorage.setItem('dnaSequencerBest', newStreak.toString());
      }
      setRound(prev => prev + 1);
      setTimeout(() => {
        generateSequence(3 + Math.floor(round / 2));
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
            🧬 Dream DNA Sequencer Game
          </h1>
          <p className="text-gray-400 mb-6">Memorize the sequence and repeat it!</p>

          {gameState === 'menu' && (
            <div className="text-center py-8">
              <div className="mb-6">
                <p className="text-gray-300 mb-2">Best Streak: {bestStreak}</p>
                <p className="text-sm text-gray-500">Watch the sequence, then click the segments in order</p>
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
                <div className="text-lg text-green-400">Streak: {streak}</div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg mb-4 text-center">
                  {gameState === 'showing' ? 'Watch the sequence...' : 'Now repeat it!'}
                </h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  {sequence.map((seg, idx) => (
                    <div
                      key={idx}
                      className={`w-20 h-20 rounded-lg border-4 flex items-center justify-center text-2xl font-bold transition-all ${
                        gameState === 'showing' && idx < showingIndex
                          ? `${COLORS[seg]} border-white scale-110`
                          : gameState === 'showing'
                          ? 'bg-gray-700 border-gray-600'
                          : `${COLORS[seg]} border-gray-400`
                      }`}
                    >
                      {gameState === 'showing' && idx < showingIndex ? seg : ''}
                    </div>
                  ))}
                </div>
              </div>

              {gameState === 'input' && (
                <div>
                  <p className="text-center mb-4 text-gray-400">
                    Your input: {userInput.join(' ')}
                  </p>
                  <div className="flex justify-center gap-4 flex-wrap">
                    {DNA_SEGMENTS.map(seg => (
                      <button
                        key={seg}
                        onClick={() => handleSegmentClick(seg)}
                        className={`w-24 h-24 rounded-lg border-4 ${COLORS[seg]} border-white text-2xl font-bold hover:scale-110 transition-transform`}
                      >
                        {seg}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-red-400 mb-4">Game Over!</h2>
              <p className="text-xl mb-2">Round Reached: {round}</p>
              <p className="text-lg mb-2">Final Streak: {streak}</p>
              {streak === bestStreak && streak > 0 && (
                <p className="text-green-400 mb-4">🎉 New Best Streak!</p>
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

