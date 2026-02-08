import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface MetaCoreProps {
  coreId: string;
  name: string;
  spawnedAt: number;
  cloud: string;
  activityScore: number;
  pulse: string;
  status: string;
  className?: string;
}

interface CoreEdict {
  coreId: string;
  edictId: string;
  title: string;
  description: string;
  expires: number;
  reward: {
    xp: number;
    token: string;
    amount: number;
  };
  status: string;
}

const cloudStyles = {
  zk: {
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    bg: 'from-purple-900/40 to-indigo-900/40',
    border: 'border-purple-500',
    icon: '🛡️'
  },
  defi: {
    primary: '#06b6d4',
    secondary: '#0891b2',
    bg: 'from-cyan-900/40 to-blue-900/40',
    border: 'border-cyan-500',
    icon: '🌊'
  },
  ai: {
    primary: '#f59e0b',
    secondary: '#d97706',
    bg: 'from-amber-900/40 to-orange-900/40',
    border: 'border-amber-500',
    icon: '🤖'
  },
  gaming: {
    primary: '#10b981',
    secondary: '#059669',
    bg: 'from-emerald-900/40 to-green-900/40',
    border: 'border-emerald-500',
    icon: '🎮'
  }
};

export default function MetaCore({ 
  coreId, 
  name, 
  spawnedAt, 
  cloud, 
  activityScore, 
  pulse, 
  status,
  className = "" 
}: MetaCoreProps) {
  const [showIntelligence, setShowIntelligence] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'edicts' | 'analytics'>('overview');

  const { data: coreEdicts = [] } = useQuery({
    queryKey: ['/api/meta-cores', coreId, 'edicts'],
    queryFn: async (): Promise<CoreEdict[]> => {
      const response = await fetch(`/api/meta-cores/${coreId}/edicts`);
      return response.json();
    },
    enabled: showIntelligence
  });

  const { data: coreAnalytics } = useQuery({
    queryKey: ['/api/meta-cores', coreId, 'analytics'],
    queryFn: async () => {
      const response = await fetch(`/api/meta-cores/${coreId}/analytics`);
      return response.json();
    },
    enabled: showIntelligence && activeTab === 'analytics'
  });

  const cloudStyle = cloudStyles[cloud as keyof typeof cloudStyles] || cloudStyles.zk;

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Awakening': 'text-yellow-400',
      'Active': 'text-green-400',
      'Dormant': 'text-gray-400',
      'Corrupted': 'text-red-400',
      'Transcendent': 'text-purple-400'
    };
    return colors[status as keyof typeof colors] || 'text-gray-400';
  };

  const getPulseAnimation = (pulse: string) => {
    const intensity = pulse.split('🔥').length - 1;
    if (intensity >= 3) return 'animate-pulse';
    if (intensity >= 2) return 'animate-bounce';
    return '';
  };

  return (
    <div className={`meta-core ${cloud} bg-gradient-to-br ${cloudStyle.bg} ${cloudStyle.border} border-2 rounded-lg p-6 ${className}`}>
      <style>{`
        .meta-core {
          box-shadow: 0 0 25px ${cloudStyle.primary}40;
          transition: all 0.3s ease;
        }
        .meta-core:hover {
          box-shadow: 0 0 35px ${cloudStyle.primary}60;
          transform: translateY(-2px);
        }
        .core-tab {
          transition: all 0.3s ease;
        }
        .core-tab.active {
          background: ${cloudStyle.primary}30;
          border-color: ${cloudStyle.primary};
        }
        .intelligence-panel {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
        }
        .edict-card {
          background: linear-gradient(135deg, ${cloudStyle.primary}20, ${cloudStyle.secondary}10);
          border: 1px solid ${cloudStyle.primary}40;
          transition: all 0.3s ease;
        }
        .edict-card:hover {
          border-color: ${cloudStyle.primary};
          box-shadow: 0 0 15px ${cloudStyle.primary}30;
        }
      `}</style>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{cloudStyle.icon}</span>
          <div>
            <h2 className="text-xl font-bold text-white">{name}</h2>
            <p className={`text-sm font-semibold ${getStatusColor(status)}`}>
              Status: {status}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-400">Activity Score</div>
          <div className="text-2xl font-bold" style={{ color: cloudStyle.primary }}>
            {activityScore}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Core Pulse:</span>
          <span className="text-gray-400 text-xs">
            Spawned {formatTimeAgo(spawnedAt)}
          </span>
        </div>
        <div className={`text-2xl ${getPulseAnimation(pulse)}`}>
          {pulse}
        </div>
      </div>

      <button
        onClick={() => setShowIntelligence(!showIntelligence)}
        className="w-full py-3 px-4 bg-black/50 hover:bg-black/70 border border-gray-600 hover:border-gray-500 rounded-lg text-white font-semibold transition-colors"
      >
        {showIntelligence ? 'Hide Core Intelligence' : 'View Core Intelligence'}
      </button>

      {showIntelligence && (
        <div className="intelligence-panel mt-6 p-6 rounded-lg border border-gray-700">
          <div className="flex gap-2 mb-6">
            {['overview', 'edicts', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`core-tab px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? 'active text-white' 
                    : 'border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black/50 rounded-lg">
                  <div className="text-sm text-gray-400">Core ID</div>
                  <div className="font-mono text-cyan-400">{coreId}</div>
                </div>
                <div className="p-4 bg-black/50 rounded-lg">
                  <div className="text-sm text-gray-400">Cloud Domain</div>
                  <div className="text-white capitalize">{cloud}</div>
                </div>
              </div>
              
              <div className="p-4 bg-black/50 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Core Intelligence Profile</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Specialized in {cloud.toUpperCase()} domain operations</li>
                  <li>• Autonomous edict generation and management</li>
                  <li>• Dream network pattern recognition</li>
                  <li>• Community coordination protocols</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'edicts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold">Active Core Edicts</h4>
                <span className="text-sm text-gray-400">
                  {coreEdicts.filter(e => e.status === 'Active').length} active
                </span>
              </div>
              
              {coreEdicts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No edicts currently issued by this core
                </div>
              ) : (
                <div className="space-y-3">
                  {coreEdicts.map((edict) => (
                    <div key={edict.edictId} className="edict-card p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-white font-semibold">{edict.title}</h5>
                        <span className={`text-xs px-2 py-1 rounded ${
                          edict.status === 'Active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                        }`}>
                          {edict.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">{edict.description}</p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">
                          Expires: {new Date(edict.expires * 1000).toLocaleDateString()}
                        </span>
                        <span className="text-gold-400 font-semibold">
                          {edict.reward.amount} {edict.reward.token} + {edict.reward.xp} XP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Core Performance Analytics</h4>
              
              {coreAnalytics ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/50 rounded-lg">
                    <div className="text-sm text-gray-400">Dreams Influenced</div>
                    <div className="text-2xl font-bold text-cyan-400">
                      {coreAnalytics.dreamsInfluenced}
                    </div>
                  </div>
                  <div className="p-4 bg-black/50 rounded-lg">
                    <div className="text-sm text-gray-400">Edicts Completed</div>
                    <div className="text-2xl font-bold text-green-400">
                      {coreAnalytics.edictsCompleted}
                    </div>
                  </div>
                  <div className="p-4 bg-black/50 rounded-lg">
                    <div className="text-sm text-gray-400">Network Impact</div>
                    <div className="text-2xl font-bold text-purple-400">
                      {coreAnalytics.networkImpact}%
                    </div>
                  </div>
                  <div className="p-4 bg-black/50 rounded-lg">
                    <div className="text-sm text-gray-400">Pulse Frequency</div>
                    <div className="text-2xl font-bold text-orange-400">
                      {coreAnalytics.pulseFrequency}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  Loading analytics data...
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}