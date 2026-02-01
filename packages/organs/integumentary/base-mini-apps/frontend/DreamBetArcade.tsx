import React, { useState } from 'react';

export function DreamBetArcade() {
  const [activeGame, setActiveGame] = useState<'flip' | 'dice' | 'spinner'>('flip');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🎰 Dream Bet Arcade
          </h1>
          <p className="text-gray-400 mb-6">Three classic games of chance!</p>

          {/* Game Selector */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveGame('flip')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeGame === 'flip'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Flip Wars
            </button>
            <button
              onClick={() => setActiveGame('dice')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeGame === 'dice'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Dream Dice
            </button>
            <button
              onClick={() => setActiveGame('spinner')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeGame === 'spinner'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Wormhole Spinner
            </button>
          </div>

          {/* Game Components */}
          {activeGame === 'flip' && <FlipWars />}
          {activeGame === 'dice' && <DreamDice />}
          {activeGame === 'spinner' && <WormholeSpinner />}
        </div>
      </div>
    </div>
  );
}

function FlipWars() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => {
    const saved = localStorage.getItem('flipWarsBest');
    return saved ? parseInt(saved, 10) : 0;
  });

  const flip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);

    setTimeout(() => {
      const flipResult = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(flipResult);
      setIsFlipping(false);

      if (result && flipResult === result) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
          localStorage.setItem('flipWarsBest', newStreak.toString());
        }
      } else {
        setStreak(0);
      }
    }, 1500);
  };

  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold mb-4">🪙 Flip Wars</h2>
      <p className="text-gray-400 mb-6">Flip the coin and build your streak!</p>

      <div className="mb-6">
        <div className="text-xl mb-2">Current Streak: {streak}</div>
        <div className="text-sm text-gray-400">Best Streak: {bestStreak}</div>
      </div>

      <div className="mb-8">
        <div
          className={`mx-auto w-32 h-32 rounded-full border-4 border-cyan-400 flex items-center justify-center text-4xl transition-all ${
            isFlipping ? 'animate-spin bg-gradient-to-br from-cyan-400 to-purple-500' : 
            result === 'heads' ? 'bg-yellow-500' : 
            result === 'tails' ? 'bg-gray-600' : 'bg-gray-700'
          }`}
        >
          {isFlipping ? '🪙' : result === 'heads' ? '👑' : result === 'tails' ? '⚫' : '🪙'}
        </div>
        {result && !isFlipping && (
          <p className="mt-4 text-xl font-bold text-cyan-400">
            {result === 'heads' ? 'Heads!' : 'Tails!'}
          </p>
        )}
      </div>

      <button
        onClick={flip}
        disabled={isFlipping}
        className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors"
      >
        {isFlipping ? 'Flipping...' : 'Flip Coin'}
      </button>
    </div>
  );
}

function DreamDice() {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => {
    const saved = localStorage.getItem('dreamDiceBest');
    return saved ? parseInt(saved, 10) : 0;
  });

  const roll = () => {
    if (isRolling) return;
    setIsRolling(true);
    setResult(null);

    setTimeout(() => {
      const rollResult = Math.floor(Math.random() * 6) + 1;
      setResult(rollResult);
      setIsRolling(false);

      if (result && rollResult === result) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
          localStorage.setItem('dreamDiceBest', newStreak.toString());
        }
      } else {
        setStreak(0);
      }
    }, 1000);
  };

  const diceFaces: Record<number, string> = {
    1: '⚀',
    2: '⚁',
    3: '⚂',
    4: '⚃',
    5: '⚄',
    6: '⚅',
  };

  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold mb-4">🎲 Dream Dice</h2>
      <p className="text-gray-400 mb-6">Roll the dice and match numbers for streaks!</p>

      <div className="mb-6">
        <div className="text-xl mb-2">Current Streak: {streak}</div>
        <div className="text-sm text-gray-400">Best Streak: {bestStreak}</div>
      </div>

      <div className="mb-8">
        <div
          className={`mx-auto w-32 h-32 rounded-lg border-4 border-cyan-400 flex items-center justify-center text-6xl transition-all ${
            isRolling ? 'animate-bounce bg-gradient-to-br from-cyan-400 to-purple-500' : 
            'bg-gray-700'
          }`}
        >
          {isRolling ? '🎲' : result ? diceFaces[result] : '🎲'}
        </div>
        {result && !isRolling && (
          <p className="mt-4 text-xl font-bold text-cyan-400">Rolled: {result}</p>
        )}
      </div>

      <button
        onClick={roll}
        disabled={isRolling}
        className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors"
      >
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </button>
    </div>
  );
}

function WormholeSpinner() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const segments = ['🎁', '💎', '⭐', '🔥', '💫', '🌟', '✨', '🎯'];
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    const spins = 5 + Math.random() * 3;
    const segmentAngle = 360 / segments.length;
    const randomSegment = Math.floor(Math.random() * segments.length);
    const finalRotation = rotation + spins * 360 + (360 - randomSegment * segmentAngle);

    setRotation(finalRotation);

    setTimeout(() => {
      setResult(randomSegment);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold mb-4">🌀 Wormhole Spinner</h2>
      <p className="text-gray-400 mb-6">Spin the wheel and see what you win!</p>

      <div className="mb-8">
        <div className="relative mx-auto w-64 h-64">
          <div
            className="absolute inset-0 rounded-full border-4 border-cyan-400 transition-transform duration-3000"
            style={{
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(${segments.map((_, i) => {
                const color = i % 2 === 0 ? '#06b6d4' : '#8b5cf6';
                return `${color} ${(i / segments.length) * 360}deg ${((i + 1) / segments.length) * 360}deg`;
              }).join(', ')})`,
            }}
          >
            {segments.map((emoji, i) => {
              const angle = (i / segments.length) * 360;
              return (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center justify-start pl-4"
                  style={{
                    transform: `rotate(${angle + 360 / segments.length / 2}deg)`,
                  }}
                >
                  <span className="text-2xl">{emoji}</span>
                </div>
              );
            })}
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-3xl">
            ▼
          </div>
        </div>
        {result !== null && !isSpinning && (
          <p className="mt-4 text-xl font-bold text-cyan-400">
            You got: {segments[result]}!
          </p>
        )}
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors"
      >
        {isSpinning ? 'Spinning...' : 'Spin Wheel'}
      </button>
    </div>
  );
}

