/**
 * Dream Remix Arena - Bad Ass Game on Remix.gg
 * 
 * Competitive remix battles where players remix dreams in real-time.
 * Features:
 * - Real-time remix editing
 * - AI-powered quality scoring
 * - Community voting
 * - Tournament system
 * - On-chain achievements
 * - Token rewards
 */

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from './config';

interface RemixChallenge {
  id: string;
  dreamId: string;
  dreamText: string;
  infected: boolean;
  bounty: number;
  timeLimit: number; // seconds
  status: 'active' | 'completed' | 'expired';
}

interface RemixSubmission {
  challengeId: string;
  remixText: string;
  tags: string[];
  components: string[];
  score?: number;
  status?: 'pending' | 'scored' | 'voted';
}

interface BattleMatch {
  id: string;
  player1: string;
  player2: string;
  challenge: RemixChallenge;
  status: 'waiting' | 'active' | 'completed';
  winner?: string;
}

export function DreamRemixArena() {
  const { address, isConnected } = useAccount();
  const [challenges, setChallenges] = useState<RemixChallenge[]>([]);
  const [activeBattle, setActiveBattle] = useState<BattleMatch | null>(null);
  const [remixText, setRemixText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [score, setScore] = useState<number | null>(null);

  // Load challenges
  useEffect(() => {
    loadChallenges();
    loadLeaderboard();
  }, []);

  const loadChallenges = async () => {
    // TODO: Fetch from API
    const mockChallenges: RemixChallenge[] = [
      {
        id: 'challenge-1',
        dreamId: 'dream-7b3d',
        dreamText: 'A portal that connects all dreams...',
        infected: true,
        bounty: 250,
        timeLimit: 300,
        status: 'active',
      },
    ];
    setChallenges(mockChallenges);
  };

  const loadLeaderboard = async () => {
    // TODO: Fetch from GameRegistry contract
    setLeaderboard([]);
  };

  const startBattle = async () => {
    if (!isConnected) {
      alert('Please connect your wallet');
      return;
    }

    // TODO: Match with another player
    const battle: BattleMatch = {
      id: `battle-${Date.now()}`,
      player1: address!,
      player2: 'waiting...',
      challenge: challenges[0],
      status: 'active',
    };
    setActiveBattle(battle);
  };

  const submitRemix = async () => {
    if (!activeBattle || !remixText.trim()) {
      alert('Please enter a remix');
      return;
    }

    try {
      // Submit to API
      const response = await fetch(`/api/dreams/${activeBattle.challenge.dreamId}/remix`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: address,
          remixText,
          tags: selectedTags,
          components: ['canvas', 'lucid'],
          submitTime: Date.now(),
        }),
      });

      const result = await response.json();
      
      if (result.success && result.result) {
        setScore(result.result.score);
        
        // TODO: Record on-chain via GameRegistry
        // TODO: Update leaderboard
      }
    } catch (error) {
      console.error('Error submitting remix:', error);
      alert('Failed to submit remix');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        Dream Remix Arena
      </h1>

      {!isConnected && (
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-6">
          <p>Connect your wallet to start remixing!</p>
        </div>
      )}

      {!activeBattle ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={startBattle}
              disabled={!isConnected}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-4 rounded-lg text-lg font-semibold disabled:opacity-50"
            >
              Start Battle
            </button>
            <button
              onClick={loadChallenges}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-4 rounded-lg text-lg font-semibold"
            >
              View Challenges
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Active Challenges</h2>
            {challenges.length === 0 ? (
              <p className="text-gray-400">No active challenges. Check back soon!</p>
            ) : (
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">{challenge.dreamId}</h3>
                    <p className="text-gray-300 mb-2">{challenge.dreamText.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-400">Bounty: {challenge.bounty} SHEEP</span>
                      <span className="text-gray-400">Time: {challenge.timeLimit}s</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
            {leaderboard.length === 0 ? (
              <p className="text-gray-400">No scores yet. Be the first!</p>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-700 rounded p-2">
                    <span>#{index + 1} {entry.address}</span>
                    <span className="text-cyan-400">{entry.score} points</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Battle Active</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700 rounded p-4">
                <p className="text-sm text-gray-400">Player 1</p>
                <p className="font-semibold">{activeBattle.player1}</p>
              </div>
              <div className="bg-gray-700 rounded p-4">
                <p className="text-sm text-gray-400">Player 2</p>
                <p className="font-semibold">{activeBattle.player2}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Challenge</h3>
            <p className="text-gray-300 mb-4">{activeBattle.challenge.dreamText}</p>
            <div className="bg-yellow-500/20 border border-yellow-500 rounded p-2 mb-4">
              <p className="text-sm">Infected Dream - Needs Remixing!</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Your Remix</h3>
            <textarea
              value={remixText}
              onChange={(e) => setRemixText(e.target.value)}
              placeholder="Remix the dream to make it better..."
              className="w-full h-48 bg-gray-700 text-white rounded p-4 mb-4"
            />
            
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {['defi', 'ai', 'stability', 'security', 'optimization'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (selectedTags.includes(tag)) {
                        setSelectedTags(selectedTags.filter(t => t !== tag));
                      } else {
                        setSelectedTags([...selectedTags, tag]);
                      }
                    }}
                    className={`px-3 py-1 rounded ${
                      selectedTags.includes(tag)
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={submitRemix}
              disabled={!remixText.trim()}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 w-full"
            >
              Submit Remix
            </button>

            {score !== null && (
              <div className="mt-4 bg-green-500/20 border border-green-500 rounded p-4">
                <p className="text-lg font-semibold">Score: {score}/100</p>
                <p className="text-sm text-gray-300">Your remix has been scored!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

