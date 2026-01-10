import React, { useState, useEffect } from 'react';

interface SystemMetric {
  id: string;
  label: string;
  value: number | string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  trend?: 'up' | 'down' | 'stable';
}

export function DreamScopeOpsConsoleMini() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call to /api/system/graph
    const loadMetrics = () => {
      const mockMetrics: SystemMetric[] = [
        {
          id: 'api-uptime',
          label: 'API Uptime',
          value: '99.8%',
          status: 'healthy',
          trend: 'stable',
        },
        {
          id: 'error-rate',
          label: 'Error Rate',
          value: '0.2%',
          status: 'healthy',
          trend: 'down',
        },
        {
          id: 'active-agents',
          label: 'Active Agents',
          value: '143',
          status: 'healthy',
          trend: 'up',
        },
        {
          id: 'mini-app-health',
          label: 'Mini-App Health',
          value: '37/37',
          status: 'healthy',
          trend: 'stable',
        },
        {
          id: 'request-latency',
          label: 'Avg Request Latency',
          value: '45ms',
          status: 'healthy',
          trend: 'stable',
        },
        {
          id: 'active-users',
          label: 'Active Users',
          value: '1,234',
          status: 'healthy',
          trend: 'up',
        },
      ];
      setMetrics(mockMetrics);
      setLoading(false);
    };

    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'degraded':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'unhealthy':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'stable':
        return '→';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🔭 DreamScope Ops Console
          </h1>
          <p className="text-gray-400 mb-6">System health and performance metrics</p>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading metrics...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.map(metric => (
                <div
                  key={metric.id}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(metric.status)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm">{metric.label}</h3>
                    {metric.trend && (
                      <span className="text-xs">{getTrendIcon(metric.trend)}</span>
                    )}
                  </div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-xs mt-2 opacity-70 capitalize">{metric.status}</div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-400">
              📝 TODO: Connect to /api/system/graph for real-time metrics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

