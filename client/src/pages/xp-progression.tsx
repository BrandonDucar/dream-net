import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface CloudXP {
  cloudId: string;
  xp: number;
  level: number;
  milestones: string[];
  nextLevelXP: number;
}

interface XPData {
  clouds: CloudXP[];
  totalXP: number;
  globalLevel: number;
}

export default function XPProgression() {
  const { data: xpData, isLoading, error } = useQuery<XPData>({
    queryKey: ['/api/xp/progression'],
    queryFn: async () => {
      const response = await fetch('/api/xp/progression');
      if (!response.ok) {
        throw new Error('Failed to fetch XP data');
      }
      return response.json();
    }
  });

  const calculateProgress = (current: number, next: number) => {
    const total = current + next;
    return (current / total) * 100;
  };

  const getNextUnlock = (cloudId: string, level: number) => {
    const unlocks: Record<string, Record<number, string>> = {
      'defi-vaults': {
        4: 'Visual Glow Upgrade',
        5: 'Advanced Trading Tools',
        6: 'Yield Farming Boost'
      },
      'ai-research': {
        4: 'Neural Network Access',
        5: 'Quantum Processing',
        6: 'AGI Integration'
      },
      'zk-privacy': {
        4: 'Enhanced Cryptography',
        5: 'Anonymous Transactions',
        6: 'Zero-Knowledge Proofs'
      },
      'meme-factory': {
        4: 'Viral Boost Algorithm',
        5: 'Trending Topic Access',
        6: 'Memetic Amplification'
      }
    };
    
    return unlocks[cloudId]?.[level + 1] || 'Mystery Reward';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading XP progression...</div>
        </div>
      </div>
    );
  }

  if (error || !xpData) {
    return (
      <div className="min-h-screen bg-black text-red-400 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Failed to load XP data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gold-400">
          ⚡ XP Progression System
        </h1>

        {/* Global XP Summary */}
        <div className="bg-gray-900 border border-gold-500 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gold-400 mb-4">🌟 Global Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{xpData.totalXP.toLocaleString()}</div>
              <div className="text-gray-400">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold-400">{xpData.globalLevel}</div>
              <div className="text-gray-400">Global Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{xpData.clouds.length}</div>
              <div className="text-gray-400">Active Clouds</div>
            </div>
          </div>
        </div>

        {/* Cloud XP Meters */}
        <div className="space-y-6">
          {xpData.clouds.map((cloud) => {
            const progress = calculateProgress(cloud.xp, cloud.nextLevelXP);
            const nextUnlock = getNextUnlock(cloud.cloudId, cloud.level);
            const totalXPForNextLevel = cloud.xp + cloud.nextLevelXP;

            return (
              <section key={cloud.cloudId} className="xp-meter bg-gray-900 border border-cyan-500 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-2">
                    ⚡ Cloud XP: {cloud.xp.toLocaleString()} / {totalXPForNextLevel.toLocaleString()}
                  </h3>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span className="capitalize">{cloud.cloudId.replace('-', ' ')} - Level {cloud.level}</span>
                    <span>{cloud.nextLevelXP.toLocaleString()} XP to next level</span>
                  </div>
                </div>

                {/* XP Progress Bar */}
                <div className="xp-bar mb-4">
                  <div className="w-full bg-gray-800 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 ease-out relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white opacity-20 animate-pulse rounded-full"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
                      {progress.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">
                  <span className="text-gold-400">Next Unlock:</span> {nextUnlock}
                </p>

                {/* Milestones */}
                {cloud.milestones.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">🏆 Milestones Achieved</h4>
                    <div className="flex flex-wrap gap-2">
                      {cloud.milestones.map((milestone, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-purple-900 text-purple-300 rounded-full text-sm capitalize"
                        >
                          {milestone.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Level Progress Indicator */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>Level {cloud.level}</span>
                  <span>Level {cloud.level + 1}</span>
                </div>
              </section>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-center gap-4">
          <button 
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-black font-semibold rounded-lg transition-colors"
            onClick={() => window.history.back()}
          >
            ← Back to Dashboard
          </button>
          <button 
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            onClick={() => window.location.href = '/badge-board'}
          >
            🏆 View Badges
          </button>
        </div>
      </div>
    </div>
  );
}