import React, { useState, useEffect } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  connected: number[];
}

export function DreamLatticeGame() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover' | 'win'>('menu');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [targetSequence, setTargetSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const GRID_SIZE = 5;
  const NODE_SIZE = 40;
  const GRID_WIDTH = 400;

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('gameover');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft]);

  const generateGrid = () => {
    const newNodes: Node[] = [];
    const spacing = GRID_WIDTH / (GRID_SIZE + 1);
    
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;
      newNodes.push({
        id: i,
        x: spacing * (col + 1),
        y: spacing * (row + 1),
        connected: [],
      });
    }
    setNodes(newNodes);
  };

  const generateTargetSequence = () => {
    const seq: number[] = [];
    let current = Math.floor(Math.random() * nodes.length);
    seq.push(current);

    for (let i = 0; i < 3 + round; i++) {
      const neighbors = getNeighbors(current);
      if (neighbors.length === 0) break;
      current = neighbors[Math.floor(Math.random() * neighbors.length)];
      seq.push(current);
    }

    setTargetSequence(seq);
    setUserSequence([]);
  };

  const getNeighbors = (nodeId: number): number[] => {
    const row = Math.floor(nodeId / GRID_SIZE);
    const col = nodeId % GRID_SIZE;
    const neighbors: number[] = [];

    if (row > 0) neighbors.push(nodeId - GRID_SIZE);
    if (row < GRID_SIZE - 1) neighbors.push(nodeId + GRID_SIZE);
    if (col > 0) neighbors.push(nodeId - 1);
    if (col < GRID_SIZE - 1) neighbors.push(nodeId + 1);

    return neighbors;
  };

  const startGame = () => {
    setGameState('playing');
    setRound(1);
    setScore(0);
    setTimeLeft(30);
    generateGrid();
    setTimeout(() => {
      if (nodes.length > 0) {
        generateTargetSequence();
      }
    }, 100);
  };

  useEffect(() => {
    if (gameState === 'playing' && nodes.length > 0 && targetSequence.length === 0) {
      generateTargetSequence();
    }
  }, [gameState, nodes]);

  const handleNodeClick = (nodeId: number) => {
    if (gameState !== 'playing') return;
    if (userSequence.length === 0 && nodeId !== targetSequence[0]) return;
    if (userSequence.length > 0) {
      const lastNode = userSequence[userSequence.length - 1];
      const neighbors = getNeighbors(lastNode);
      if (!neighbors.includes(nodeId)) return;
    }

    const newSeq = [...userSequence, nodeId];
    setUserSequence(newSeq);

    if (newSeq.length === targetSequence.length) {
      const isCorrect = newSeq.every((val, idx) => val === targetSequence[idx]);
      if (isCorrect) {
        setScore(prev => prev + 10 * round);
        setRound(prev => prev + 1);
        setTimeLeft(prev => Math.min(prev + 5, 30));
        setTimeout(() => {
          generateTargetSequence();
        }, 1000);
      } else {
        setGameState('gameover');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🔗 Dream Lattice Game
          </h1>
          <p className="text-gray-400 mb-6">Connect nodes in the target sequence before time runs out!</p>

          {gameState === 'menu' && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 mb-6">
                Click nodes to connect them in the order shown. Each node must be adjacent to the previous one.
              </p>
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
                <div className="text-xl font-bold text-cyan-400">Round: {round}</div>
                <div className="text-lg text-yellow-400">Time: {timeLeft}s</div>
                <div className="text-lg text-green-400">Score: {score}</div>
              </div>

              <div className="mb-4">
                <p className="text-center mb-2 text-gray-300">
                  Target Sequence: {targetSequence.map(id => `Node ${id + 1}`).join(' → ')}
                </p>
                <p className="text-center text-sm text-gray-400">
                  Your Path: {userSequence.length > 0 ? userSequence.map(id => `Node ${id + 1}`).join(' → ') : 'None'}
                </p>
              </div>

              <div
                className="relative bg-gray-950 border-2 border-cyan-500/30 rounded-lg mx-auto"
                style={{ width: GRID_WIDTH, height: GRID_WIDTH }}
              >
                {/* Connection lines */}
                {userSequence.length > 1 && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {userSequence.map((nodeId, idx) => {
                      if (idx === 0) return null;
                      const prevNode = nodes[userSequence[idx - 1]];
                      const currNode = nodes[nodeId];
                      if (!prevNode || !currNode) return null;
                      return (
                        <line
                          key={`line-${idx}`}
                          x1={prevNode.x}
                          y1={prevNode.y}
                          x2={currNode.x}
                          y2={currNode.y}
                          stroke="#10b981"
                          strokeWidth="3"
                        />
                      );
                    })}
                  </svg>
                )}

                {/* Nodes */}
                {nodes.map(node => {
                  const isTarget = targetSequence.includes(node.id);
                  const isInUserSeq = userSequence.includes(node.id);
                  const isNext = userSequence.length < targetSequence.length && 
                                 node.id === targetSequence[userSequence.length];

                  return (
                    <button
                      key={node.id}
                      onClick={() => handleNodeClick(node.id)}
                      className={`absolute rounded-full border-4 transition-all ${
                        isInUserSeq
                          ? 'bg-green-500 border-green-300'
                          : isTarget
                          ? 'bg-purple-500 border-purple-300'
                          : isNext
                          ? 'bg-cyan-500 border-cyan-300 animate-pulse'
                          : 'bg-gray-700 border-gray-600'
                      } hover:scale-110`}
                      style={{
                        width: NODE_SIZE,
                        height: NODE_SIZE,
                        left: node.x - NODE_SIZE / 2,
                        top: node.y - NODE_SIZE / 2,
                      }}
                    >
                      <span className="text-xs font-bold">{node.id + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {(gameState === 'gameover' || gameState === 'win') && (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">
                {gameState === 'win' ? '🎉 You Win!' : 'Game Over!'}
              </h2>
              <p className="text-xl mb-2">Final Score: {score}</p>
              <p className="text-lg mb-2">Rounds Completed: {round - 1}</p>
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

