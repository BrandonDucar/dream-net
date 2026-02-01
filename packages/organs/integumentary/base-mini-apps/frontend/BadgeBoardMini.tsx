import React, { useState, useEffect } from 'react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  earned: boolean;
}

export function BadgeBoardMini() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock badges for now - can be replaced with API call
    const mockBadges: Badge[] = [
      { id: '1', name: 'First Dream', description: 'Submit your first dream', earned: true },
      { id: '2', name: 'Dream Explorer', description: 'Browse 10 dreams', earned: true },
      { id: '3', name: 'Remix Master', description: 'Create 5 remixes', earned: false },
      { id: '4', name: 'Citizen', description: 'Reach Citizen tier', earned: false },
    ];
    setBadges(mockBadges);
    setLoading(false);
  }, []);

  if (loading) return <div className="p-6"><p className="text-gray-400">Loading badges...</p></div>;

  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Badge Board</h1>
      
      <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20 mb-6">
        <p className="text-gray-400 text-sm">Progress</p>
        <p className="text-2xl font-bold text-white">{earnedCount} / {badges.length} Badges Earned</p>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div 
            className="bg-cyan-500 h-2 rounded-full transition-all"
            style={{ width: `${(earnedCount / badges.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`bg-gray-800 rounded-lg p-4 border transition ${
              badge.earned 
                ? 'border-cyan-500/50' 
                : 'border-gray-700/50 opacity-60'
            }`}
          >
            <div className="text-4xl mb-2">{badge.icon || '🏆'}</div>
            <h3 className="text-lg font-semibold text-white mb-1">{badge.name}</h3>
            <p className="text-sm text-gray-400">{badge.description}</p>
            {badge.earned && (
              <p className="text-xs text-cyan-400 mt-2">✓ Earned</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

