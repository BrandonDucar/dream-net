import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface AnalyticsCoreProps {
  className?: string;
}

interface AnalyticsData {
  dreamLifecycle: {
    active: number;
    nightmared: number;
    completed: number;
    total: number;
  };
  cloudActivity: Array<{
    cloud: string;
    dreamCount: number;
    avgXP: number;
    growth: number;
  }>;
  remixStats: {
    avgForksPerDream: number;
    topRemixer: string;
    totalRemixes: number;
    remixRate: number;
  };
  bountyData: {
    totalIssued: number;
    totalClaimed: number;
    activeBounties: number;
    avgBountySize: number;
  };
  trustMetrics: {
    topCreators: string[];
    avgTrustScore: number;
    totalXPDistributed: number;
    activeDreamers: number;
  };
}

export default function AnalyticsCore({ className = "" }: AnalyticsCoreProps) {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const { data: analytics } = useQuery({
    queryKey: ['/api/analytics/core', timeframe],
    queryFn: async (): Promise<AnalyticsData> => {
      try {
        const response = await fetch(`/api/analytics/core?timeframe=${timeframe}`);
        if (!response.ok) throw new Error('Network error');
        return response.json();
      } catch (error) {
        // Fallback analytics data
        return {
          dreamLifecycle: {
            active: 147,
            nightmared: 22,
            completed: 61,
            total: 230
          },
          cloudActivity: [
            { cloud: 'Meme', dreamCount: 43, avgXP: 285, growth: 12 },
            { cloud: 'ZK', dreamCount: 26, avgXP: 420, growth: 8 },
            { cloud: 'DeFi', dreamCount: 34, avgXP: 380, growth: -2 },
            { cloud: 'Gaming', dreamCount: 19, avgXP: 310, growth: 15 },
            { cloud: 'Nightmare', dreamCount: 22, avgXP: 50, growth: -5 }
          ],
          remixStats: {
            avgForksPerDream: 2.3,
            topRemixer: '0xABCD',
            totalRemixes: 156,
            remixRate: 0.68
          },
          bountyData: {
            totalIssued: 8100,
            totalClaimed: 5800,
            activeBounties: 23,
            avgBountySize: 350
          },
          trustMetrics: {
            topCreators: ['DreamWeaver', 'MemeShaman', '0xD34D'],
            avgTrustScore: 73.5,
            totalXPDistributed: 24680,
            activeDreamers: 89
          }
        };
      }
    },
    refetchInterval: 120000 // Update every 2 minutes
  });

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-400';
    if (growth < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  if (!analytics) {
    return (
      <div className={`analytics-core bg-gray-900/80 border border-gray-600 rounded-lg p-6 ${className}`}>
        <div className="text-center text-gray-400">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className={`analytics-core bg-gradient-to-br from-gray-900/90 to-black/90 border border-cyan-500 rounded-lg p-6 ${className}`}>
      <style>{`
        .analytics-core {
          box-shadow: 0 0 25px rgba(6, 182, 212, 0.3);
        }
        .metric-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .metric-card:hover {
          background: rgba(6, 182, 212, 0.1);
          border-color: #06b6d4;
          transform: translateY(-2px);
        }
        .metric-card.selected {
          background: rgba(6, 182, 212, 0.2);
          border-color: #0891b2;
        }
        .timeframe-tab {
          transition: all 0.3s ease;
        }
        .timeframe-tab.active {
          background: rgba(6, 182, 212, 0.3);
          border-color: #06b6d4;
          color: white;
        }
      `}</style>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-cyan-400">📊 Dream Analytics Core</h2>
          
          <div className="flex gap-1">
            {(['24h', '7d', '30d', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`timeframe-tab px-3 py-1 rounded border text-sm font-medium transition-colors ${
                  timeframe === period 
                    ? 'active' 
                    : 'border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="metric-card p-4 bg-black/50 border border-gray-600 rounded-lg">
          <h3 className="text-cyan-300 font-semibold mb-3">Dream Lifecycle</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-green-400">Active:</span>
              <span className="text-white font-semibold">{analytics.dreamLifecycle.active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-400">Nightmared:</span>
              <span className="text-white font-semibold">{analytics.dreamLifecycle.nightmared}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400">Completed:</span>
              <span className="text-white font-semibold">{analytics.dreamLifecycle.completed}</span>
            </div>
            <hr className="border-gray-700 my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total:</span>
              <span className="text-cyan-400 font-semibold">{analytics.dreamLifecycle.total}</span>
            </div>
          </div>
        </section>

        <section className="metric-card p-4 bg-black/50 border border-gray-600 rounded-lg">
          <h3 className="text-cyan-300 font-semibold mb-3">Cloud Activity</h3>
          <div className="space-y-2">
            {analytics.cloudActivity.slice(0, 4).map((cloud) => (
              <div key={cloud.cloud} className="flex items-center justify-between">
                <div>
                  <span className="text-white">{cloud.cloud}:</span>
                  <span className="text-gray-400 ml-1">{cloud.dreamCount} Dreams</span>
                </div>
                <span className={`text-sm font-semibold ${getGrowthColor(cloud.growth)}`}>
                  {cloud.growth > 0 ? '+' : ''}{cloud.growth}%
                </span>
              </div>
            ))}
            {analytics.cloudActivity.length > 4 && (
              <div className="text-xs text-gray-500 text-center pt-1">
                +{analytics.cloudActivity.length - 4} more clouds
              </div>
            )}
          </div>
        </section>

        <section className="metric-card p-4 bg-black/50 border border-gray-600 rounded-lg">
          <h3 className="text-cyan-300 font-semibold mb-3">Remix Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Forks per Dream:</span>
              <span className="text-white font-semibold">{analytics.remixStats.avgForksPerDream}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Remixes:</span>
              <span className="text-white font-semibold">{analytics.remixStats.totalRemixes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Remix Rate:</span>
              <span className="text-green-400 font-semibold">{(analytics.remixStats.remixRate * 100).toFixed(0)}%</span>
            </div>
            <div className="text-xs text-purple-400 pt-1">
              Top Remixer: {analytics.remixStats.topRemixer}
            </div>
          </div>
        </section>

        <section className="metric-card p-4 bg-black/50 border border-gray-600 rounded-lg">
          <h3 className="text-cyan-300 font-semibold mb-3">Bounty Data</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Issued:</span>
              <span className="text-gold-400 font-semibold">{formatNumber(analytics.bountyData.totalIssued)} SHEEP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Claimed:</span>
              <span className="text-green-400 font-semibold">{formatNumber(analytics.bountyData.totalClaimed)} SHEEP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Active Bounties:</span>
              <span className="text-white font-semibold">{analytics.bountyData.activeBounties}</span>
            </div>
            <div className="text-xs text-blue-400 pt-1">
              Avg Size: {analytics.bountyData.avgBountySize} SHEEP
            </div>
          </div>
        </section>

        <section className="metric-card p-4 bg-black/50 border border-gray-600 rounded-lg">
          <h3 className="text-cyan-300 font-semibold mb-3">XP & Trust</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Active Dreamers:</span>
              <span className="text-white font-semibold">{analytics.trustMetrics.activeDreamers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Trust Score:</span>
              <span className="text-purple-400 font-semibold">{analytics.trustMetrics.avgTrustScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total XP:</span>
              <span className="text-cyan-400 font-semibold">{formatNumber(analytics.trustMetrics.totalXPDistributed)}</span>
            </div>
            <div className="text-xs text-green-400 pt-1">
              Top Creators: {analytics.trustMetrics.topCreators.slice(0, 2).join(', ')}
            </div>
          </div>
        </section>

        <section className="metric-card p-4 bg-black/50 border border-gray-600 rounded-lg">
          <h3 className="text-cyan-300 font-semibold mb-3">Network Health</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Dream Success Rate:</span>
              <span className="text-green-400 font-semibold">
                {((analytics.dreamLifecycle.completed / analytics.dreamLifecycle.total) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Nightmare Rate:</span>
              <span className="text-red-400 font-semibold">
                {((analytics.dreamLifecycle.nightmared / analytics.dreamLifecycle.total) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bounty Claim Rate:</span>
              <span className="text-blue-400 font-semibold">
                {((analytics.bountyData.totalClaimed / analytics.bountyData.totalIssued) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="text-xs text-gray-500 pt-1">
              Updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 p-4 bg-black/60 rounded-lg border border-gray-700">
        <h4 className="text-cyan-300 font-semibold mb-2">System Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <strong>Network Growth:</strong> The dream network is experiencing {
              analytics.cloudActivity.filter(c => c.growth > 0).length > analytics.cloudActivity.filter(c => c.growth < 0).length 
                ? 'positive' : 'mixed'
            } growth across clouds.
          </div>
          <div>
            <strong>Engagement:</strong> With {analytics.trustMetrics.activeDreamers} active dreamers and {analytics.remixStats.totalRemixes} remixes, 
            community participation is {analytics.remixStats.remixRate > 0.5 ? 'strong' : 'moderate'}.
          </div>
        </div>
      </div>
    </div>
  );
}