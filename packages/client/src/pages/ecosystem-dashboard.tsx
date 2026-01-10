import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface ScrollEntry {
  id: string;
  type: 'mint' | 'remix' | 'fossilize' | 'resurrect' | 'blessing';
  icon: string;
  description: string;
  timestamp: number;
  actor: string;
  target: string;
}

export default function EcosystemDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: scrollEntries, isLoading } = useQuery<ScrollEntry[]>({
    queryKey: ['/api/dream-clouds/ecosystem/scroll', refreshKey],
    queryFn: async () => {
      const response = await fetch('/api/dream-clouds/ecosystem/scroll');
      if (!response.ok) {
        throw new Error('Failed to fetch ecosystem scroll');
      }
      return response.json();
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'mint': 'text-green-400',
      'remix': 'text-blue-400',
      'fossilize': 'text-gray-400',
      'resurrect': 'text-gold-400',
      'blessing': 'text-purple-400'
    };
    return colors[type] || 'text-cyan-400';
  };

  const getTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading ecosystem dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gold-400">
          🌐 Ecosystem Dashboard
        </h1>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Dream Scroll of Record */}
          <div className="lg:col-span-2">
            <section className="ecosystem-scroll bg-gray-900 border border-cyan-500 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                📜 Dream Scroll of Record
              </h2>
              
              <ul className="space-y-4">
                {scrollEntries?.map((entry) => (
                  <li key={entry.id} className="bg-black border border-gray-600 rounded-lg p-4 hover:border-cyan-500 transition-colors">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0">{entry.icon}</span>
                      
                      <div className="flex-1">
                        <p className={`text-lg ${getTypeColor(entry.type)}`}>
                          {entry.description}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                          <span>By: <span className="text-purple-400 font-mono">{entry.actor}</span></span>
                          <span>Target: <span className="text-cyan-400">{entry.target}</span></span>
                          <span className="ml-auto">{getTimestamp(entry.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Refresh Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setRefreshKey(k => k + 1)}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-black font-semibold rounded-lg transition-colors"
                >
                  🔄 Refresh Scroll
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar - Quick Stats */}
          <div className="space-y-8">
            
            {/* Live Stats */}
            <div className="bg-gray-900 border border-purple-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4">⚡ Live Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Dreams:</span>
                  <span className="text-green-400 font-bold">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fossilized:</span>
                  <span className="text-gray-400 font-bold">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Teams:</span>
                  <span className="text-blue-400 font-bold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Agents:</span>
                  <span className="text-purple-400 font-bold">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Today's XP:</span>
                  <span className="text-gold-400 font-bold">12.5k</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 border border-gold-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gold-400 mb-4">🚀 Quick Actions</h3>
              
              <div className="space-y-3">
                <button 
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  onClick={() => window.location.href = '/dream-network-explorer'}
                >
                  🌐 Network Explorer
                </button>
                
                <button 
                  className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                  onClick={() => window.location.href = '/dream-team-manager'}
                >
                  👥 Team Manager
                </button>
                
                <button 
                  className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                  onClick={() => window.location.href = '/cloud-agent'}
                >
                  🤖 Agent Control
                </button>
                
                <button 
                  className="w-full px-4 py-3 bg-gold-600 hover:bg-gold-700 text-black font-semibold rounded-lg transition-colors"
                  onClick={() => window.location.href = '/badge-board'}
                >
                  🏅 Badge Board
                </button>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-gray-900 border border-green-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-400 mb-4">🏆 Recent Achievements</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔥</span>
                  <span className="text-gray-300">ZK Guardians unlocked "Phoenix Reviver"</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <span className="text-gray-300">0xabc earned "Dream Savior" badge</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎖️</span>
                  <span className="text-gray-300">Team milestone: 10k XP reached</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">💎</span>
                  <span className="text-gray-300">NullProof agent reached Level 5</span>
                </div>
              </div>
            </div>
          </div>
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
            onClick={() => window.location.href = '/god-terminal'}
          >
            👑 God Terminal
          </button>
        </div>
      </div>
    </div>
  );
}