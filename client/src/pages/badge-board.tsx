import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Badge {
  id: string;
  icon: string;
  title: string;
  description: string;
  earned: boolean;
  earnedAt?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Title {
  id: string;
  label: string;
  icon: string;
  unlockedVia: string[];
  unlocked: boolean;
}

interface CloudXP {
  cloudId: string;
  xp: number;
  level: number;
  milestones: string[];
  nextLevelXP: number;
  nextUnlock: string;
}

interface BadgeData {
  earnedBadges: Badge[];
  availableBadges: Badge[];
  earnedTitles: Title[];
  availableTitles: Title[];
  cloudXP: CloudXP[];
  totalEarned: number;
  completionRate: number;
}

export default function BadgeBoard() {
  const { data, isLoading } = useQuery<BadgeData>({
    queryKey: ['/api/badges/board'],
    queryFn: async () => {
      const response = await fetch('/api/badges/board');
      if (!response.ok) {
        throw new Error('Failed to fetch badge data');
      }
      return response.json();
    }
  });

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      'common': 'border-gray-500 text-gray-400',
      'rare': 'border-blue-500 text-blue-400',
      'epic': 'border-purple-500 text-purple-400',
      'legendary': 'border-gold-500 text-gold-400'
    };
    return colors[rarity] || 'border-gray-500 text-gray-400';
  };

  const getXPProgress = (current: number, next: number) => {
    return Math.min((current / (current + next)) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading badge board...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-red-400 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Failed to load badge data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-8">
      <div className="max-w-6xl mx-auto">
        <section className="badge-board">
          <h2 className="text-3xl font-bold text-center mb-8 text-gold-400">
            🏅 Earned Badges
          </h2>

          {/* Earned Badges */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {data.earnedBadges.map((badge) => (
              <div 
                key={badge.id} 
                className={`badge bg-gray-900 border-2 rounded-lg p-6 ${getRarityColor(badge.rarity)}`}
              >
                <span className="icon text-4xl mb-4 block text-center">
                  {badge.icon}
                </span>
                <p className="text-center font-semibold">
                  <span className="block text-lg mb-2">{badge.title}</span>
                  <span className="text-sm text-gray-400">— {badge.description}</span>
                </p>
                {badge.earnedAt && (
                  <div className="text-xs text-gray-500 text-center mt-3">
                    Earned: {new Date(badge.earnedAt * 1000).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Unlocked Titles */}
          {data.earnedTitles.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-purple-400 mb-6 text-center">🎖️ Unlocked Titles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.earnedTitles.map((title) => (
                  <div key={title.id} className="bg-purple-900 border border-purple-500 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-3xl">{title.icon}</span>
                      <h4 className="text-xl font-bold text-purple-300">{title.label}</h4>
                    </div>
                    <p className="text-sm text-gray-400">
                      Unlocked via: {title.unlockedVia.join(' + ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cloud XP Progress */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6 text-center">⚡ Cloud XP Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.cloudXP.map((cloud) => (
                <section key={cloud.cloudId} className="xp-meter bg-gray-900 border border-cyan-500 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4">
                    ⚡ Cloud XP: {cloud.xp} / {cloud.xp + cloud.nextLevelXP}
                  </h3>
                  
                  <div className="xp-bar relative bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ease-out"
                      style={{ width: `${getXPProgress(cloud.xp, cloud.nextLevelXP)}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-gold-400 font-semibold mb-3">
                    Next Unlock: {cloud.nextUnlock}
                  </p>
                  
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cloud:</span>
                      <span className="text-purple-400 capitalize">
                        {cloud.cloudId.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Level:</span>
                      <span className="text-green-400">{cloud.level}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block mb-1">Milestones:</span>
                      <div className="flex flex-wrap gap-1">
                        {cloud.milestones.map((milestone, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-purple-800 text-purple-300 rounded text-xs"
                          >
                            {milestone.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>

          {/* Available Badges */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-400 mb-6 text-center">🎯 Available Badges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.availableBadges.map((badge) => (
                <div 
                  key={badge.id} 
                  className="badge bg-gray-800 border-2 border-gray-600 rounded-lg p-6 opacity-60"
                >
                  <span className="icon text-4xl mb-4 block text-center text-gray-500">
                    {badge.icon}
                  </span>
                  <p className="text-center">
                    <span className="block text-lg mb-2 text-gray-400">{badge.title}</span>
                    <span className="text-sm text-gray-500">— {badge.description}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Available Titles */}
          {data.availableTitles.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-400 mb-6 text-center">🔒 Locked Titles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.availableTitles.map((title) => (
                  <div key={title.id} className="bg-gray-800 border border-gray-600 rounded-lg p-6 opacity-60">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-3xl text-gray-500">{title.icon}</span>
                      <h4 className="text-xl font-bold text-gray-400">{title.label}</h4>
                    </div>
                    <p className="text-sm text-gray-500">
                      Requires: {title.unlockedVia.join(' + ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Summary */}
          <div className="bg-gray-900 border border-gold-500 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-gold-400 mb-4">📊 Progress Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-purple-400">{data.totalEarned}</div>
                <div className="text-gray-400">Badges Earned</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400">
                  {Math.round(data.completionRate)}%
                </div>
                <div className="text-gray-400">Completion Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gold-400">
                  {data.earnedTitles.length}
                </div>
                <div className="text-gray-400">Titles Unlocked</div>
              </div>
            </div>
          </div>
        </section>

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
            onClick={() => window.location.href = '/xp-progression'}
          >
            ⚡ View XP Details
          </button>
        </div>
      </div>
    </div>
  );
}