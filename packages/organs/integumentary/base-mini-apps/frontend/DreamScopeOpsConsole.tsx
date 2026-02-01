import React, { useState, useEffect } from 'react';

interface WhaleMetric {
  id: string;
  label: string;
  category: string;
  stats: Record<string, number>;
  health: 'healthy' | 'degraded' | 'unhealthy';
  updatedAt: number;
}

export function DreamScopeOpsConsole() {
  const [metrics, setMetrics] = useState<WhaleMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemGraph, setSystemGraph] = useState<any>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [metricsRes, graphRes] = await Promise.all([
        fetch('/api/whale/metrics'),
        fetch('/api/system/graph'),
      ]);

      if (!metricsRes.ok) throw new Error('Failed to load metrics');
      if (!graphRes.ok) throw new Error('Failed to load system graph');

      const metricsData = await metricsRes.json();
      const graphData = await graphRes.json();

      setMetrics(metricsData);
      setSystemGraph(graphData);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load ops data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-green-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'unhealthy':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getHealthBg = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'bg-green-500/20 border-green-500/50';
      case 'degraded':
        return 'bg-yellow-500/20 border-yellow-500/50';
      case 'unhealthy':
        return 'bg-red-500/20 border-red-500/50';
      default:
        return 'bg-gray-500/20 border-gray-500/50';
    }
  };

  if (loading && metrics.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-400">Loading operations data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">DreamScope Ops Console</h1>

      {error && (
        <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Overall Health Summary */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
          <p className="text-gray-400 text-sm mb-1">Total Apps</p>
          <p className="text-3xl font-bold text-cyan-400">{metrics.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-green-500/20">
          <p className="text-gray-400 text-sm mb-1">Healthy</p>
          <p className="text-3xl font-bold text-green-400">
            {metrics.filter(m => m.health === 'healthy').length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-yellow-500/20">
          <p className="text-gray-400 text-sm mb-1">Degraded</p>
          <p className="text-3xl font-bold text-yellow-400">
            {metrics.filter(m => m.health === 'degraded').length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-red-500/20">
          <p className="text-gray-400 text-sm mb-1">Unhealthy</p>
          <p className="text-3xl font-bold text-red-400">
            {metrics.filter(m => m.health === 'unhealthy').length}
          </p>
        </div>
      </div>

      {/* System Graph Stats */}
      {systemGraph && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-purple-500/20">
            <p className="text-gray-400 text-sm mb-1">Ports</p>
            <p className="text-2xl font-bold text-purple-400">{systemGraph.ports?.length || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-yellow-500/20">
            <p className="text-gray-400 text-sm mb-1">Routes</p>
            <p className="text-2xl font-bold text-yellow-400">{systemGraph.routes?.length || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
            <p className="text-gray-400 text-sm mb-1">Wormholes</p>
            <p className="text-2xl font-bold text-cyan-400">{systemGraph.wormholes?.length || 0}</p>
          </div>
        </div>
      )}

      {/* App Metrics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">App Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className={`bg-gray-800 rounded-lg p-4 border ${getHealthBg(metric.health)}`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-white">{metric.label}</h3>
                <span className={`text-sm font-semibold ${getHealthColor(metric.health)}`}>
                  {metric.health.toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-2">
                {Object.entries(metric.stats).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-white font-mono">
                      {typeof value === 'number' ? (value % 1 === 0 ? value : value.toFixed(2)) : value}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-gray-500 text-xs mt-3">
                Updated: {new Date(metric.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ops-Specific Metrics */}
      {metrics.find(m => m.id === 'dreamscopeOps') && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">System Health</h2>
          <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
            {(() => {
              const opsMetric = metrics.find(m => m.id === 'dreamscopeOps');
              if (!opsMetric) return null;

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">API Error Rate</p>
                    <p className="text-2xl font-bold text-white">
                      {(opsMetric.stats.apiErrorRate || 0).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Avg Latency</p>
                    <p className="text-2xl font-bold text-white">
                      {opsMetric.stats.avgLatencyMs || 0}ms
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">TX Success Rate</p>
                    <p className="text-2xl font-bold text-white">
                      {((opsMetric.stats.txSuccessRate || 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">System Health</p>
                    <p className="text-2xl font-bold text-white">
                      {((opsMetric.stats.systemHealth || 0) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

