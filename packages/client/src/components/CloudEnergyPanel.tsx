import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface CloudEnergyPanelProps {
  cloud: string;
  pulseLevel: number;
  tier: string;
  nextUnlock: string;
  className?: string;
}

const cloudConfig = {
  zk: {
    name: 'ZK Dream Cloud',
    icon: '🛡️',
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    gradient: 'from-purple-600 to-indigo-600'
  },
  defi: {
    name: 'DeFi Dream Cloud',
    icon: '🌊',
    primary: '#06b6d4',
    secondary: '#0891b2',
    gradient: 'from-cyan-600 to-blue-600'
  },
  desci: {
    name: 'DeSci Dream Cloud',
    icon: '🧬',
    primary: '#10b981',
    secondary: '#059669',
    gradient: 'from-emerald-600 to-green-600'
  },
  gaming: {
    name: 'Gaming Dream Cloud',
    icon: '🎮',
    primary: '#f59e0b',
    secondary: '#d97706',
    gradient: 'from-amber-600 to-orange-600'
  },
  meme: {
    name: 'Meme Dream Cloud',
    icon: '🔥',
    primary: '#ef4444',
    secondary: '#dc2626',
    gradient: 'from-red-600 to-pink-600'
  },
  ai: {
    name: 'AI Dream Cloud',
    icon: '🤖',
    primary: '#a855f7',
    secondary: '#9333ea',
    gradient: 'from-violet-600 to-purple-600'
  }
};

const tierThresholds = {
  Dormant: { min: 0, max: 25, bonus: 'None' },
  Awakening: { min: 25, max: 50, bonus: 'Spawn Cost -25%' },
  Active: { min: 50, max: 75, bonus: 'XP Boost +50%' },
  Charged: { min: 75, max: 90, bonus: 'Fusion Cost -50%' },
  Transcendent: { min: 90, max: 100, bonus: 'All Bonuses +100%' }
};

export default function CloudEnergyPanel({ 
  cloud, 
  pulseLevel, 
  tier, 
  nextUnlock,
  className = "" 
}: CloudEnergyPanelProps) {
  const [pulseAnimation, setPulseAnimation] = useState(false);
  
  const config = cloudConfig[cloud as keyof typeof cloudConfig] || cloudConfig.zk;
  
  const { data: cloudStats } = useQuery({
    queryKey: ['/api/clouds', cloud, 'energy-stats'],
    queryFn: async () => {
      const response = await fetch(`/api/clouds/${cloud}/energy-stats`);
      return response.json();
    },
    refetchInterval: 30000 // Update every 30 seconds
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 1000);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const getTierColor = (currentTier: string) => {
    const colors = {
      'Dormant': 'text-gray-400',
      'Awakening': 'text-yellow-400',
      'Active': 'text-blue-400',
      'Charged': 'text-purple-400',
      'Transcendent': 'text-gold-400'
    };
    return colors[currentTier as keyof typeof colors] || 'text-gray-400';
  };

  const getPulseIntensity = (level: number) => {
    if (level >= 90) return 'transcendent';
    if (level >= 75) return 'charged';
    if (level >= 50) return 'active';
    if (level >= 25) return 'awakening';
    return 'dormant';
  };

  const getNextTierProgress = () => {
    const currentTierData = tierThresholds[tier as keyof typeof tierThresholds];
    if (!currentTierData) return 0;
    
    const progress = ((pulseLevel - currentTierData.min) / (currentTierData.max - currentTierData.min)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  return (
    <div className={`cloud-energy-panel bg-gradient-to-br from-gray-900/80 to-black/80 border-2 rounded-lg p-6 ${className}`}>
      <style>{`
        .cloud-energy-panel {
          border-color: ${config.primary};
          box-shadow: 0 0 25px ${config.primary}40;
          transition: all 0.3s ease;
        }
        .cloud-energy-panel:hover {
          box-shadow: 0 0 35px ${config.primary}60;
        }
        .pulse-bar {
          background: linear-gradient(90deg, ${config.secondary}, ${config.primary});
          height: 12px;
          border-radius: 6px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .pulse-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: pulse-sweep 2s infinite;
        }
        .pulse-bar.charged::after {
          animation: pulse-sweep 1.5s infinite;
        }
        .pulse-bar.transcendent::after {
          animation: pulse-sweep 1s infinite;
        }
        @keyframes pulse-sweep {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .energy-glow {
          filter: drop-shadow(0 0 8px ${config.primary});
        }
        .tier-badge {
          background: linear-gradient(45deg, ${config.primary}, ${config.secondary});
          border: 1px solid ${config.primary};
        }
        .stat-card {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid ${config.primary}40;
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          border-color: ${config.primary}80;
          background: rgba(0, 0, 0, 0.8);
        }
      `}</style>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`text-3xl energy-glow ${pulseAnimation ? 'animate-pulse' : ''}`}>
            {config.icon}
          </span>
          <div>
            <h3 className="text-xl font-bold text-white">{config.name}</h3>
            <div className="flex items-center gap-2">
              <span className={`tier-badge px-2 py-1 rounded text-xs font-semibold text-white`}>
                {tier}
              </span>
              <span className={`text-sm font-semibold ${getTierColor(tier)}`}>
                Pulse {pulseLevel}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Energy Level</span>
          <span>{pulseLevel}/100</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full p-1">
          <div 
            className={`pulse-bar ${getPulseIntensity(pulseLevel)}`}
            style={{ width: `${pulseLevel}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-4">
        <div className="stat-card p-3 rounded-lg">
          <div className="text-sm text-gray-400">Current Tier Bonus</div>
          <div className="text-white font-semibold">
            {tierThresholds[tier as keyof typeof tierThresholds]?.bonus || 'Unknown'}
          </div>
        </div>
        
        <div className="stat-card p-3 rounded-lg">
          <div className="text-sm text-gray-400">Next Unlock</div>
          <div className="text-cyan-400 font-semibold">{nextUnlock}</div>
        </div>
      </div>

      {cloudStats && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="stat-card p-3 rounded-lg text-center">
            <div className="text-lg font-bold" style={{ color: config.primary }}>
              {cloudStats.activeDreams}
            </div>
            <div className="text-xs text-gray-400">Active Dreams</div>
          </div>
          
          <div className="stat-card p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-green-400">
              {cloudStats.recentActivity}
            </div>
            <div className="text-xs text-gray-400">Recent Activity</div>
          </div>
        </div>
      )}

      <div className="text-center">
        <div className="text-xs text-gray-500 mb-2">
          Next tier in {Math.max(0, Math.ceil((tierThresholds[tier as keyof typeof tierThresholds]?.max || 100) - pulseLevel))} pulse points
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r"
            style={{ 
              width: `${getNextTierProgress()}%`,
              background: `linear-gradient(90deg, ${config.secondary}, ${config.primary})`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}