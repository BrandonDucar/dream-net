import React, { useState, useEffect } from 'react';
import { MINI_APPS } from './index';
import { CONTRACT_ADDRESSES, BASE_CHAIN_ID } from './config';

interface SystemGraph {
  ports: Array<{
    id: string;
    label: string;
    direction: string;
    fiber: string;
    isDefault?: boolean;
  }>;
  routes: Array<{
    fiber: string;
    type: string;
    targetPortId: string;
    description?: string;
  }>;
  wormholes: Array<{
    id: string;
    label: string;
    direction: string;
    fiber: string;
    stats?: {
      buffered: number;
      enqueued: number;
      dropped: number;
    };
  }>;
}

interface ContractInfo {
  name: string;
  address: string;
}

interface WhaleMetric {
  id: string;
  label: string;
  category: string;
  stats: Record<string, number>;
  health: 'healthy' | 'degraded' | 'unhealthy';
  updatedAt: number;
}

export function DreamNetHub({ onSelectApp }: { onSelectApp: (appId: string) => void }) {
  const [systemGraph, setSystemGraph] = useState<SystemGraph | null>(null);
  const [whaleMetrics, setWhaleMetrics] = useState<WhaleMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/system/graph').then(res => res.json()),
      fetch('/api/whale/metrics').then(res => res.json()).catch(() => []),
    ])
      .then(([graphData, metricsData]) => {
        setSystemGraph(graphData);
        setWhaleMetrics(metricsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch data:', err);
        setLoading(false);
      });
  }, []);

  // Get all contracts from CONTRACT_ADDRESSES
  const contracts: ContractInfo[] = Object.entries(CONTRACT_ADDRESSES)
    .filter(([_, address]) => address && address !== '')
    .map(([name, address]) => ({
      name: name.replace(/([A-Z])/g, ' $1').trim(),
      address: address as string,
    }));

  // Get unique categories
  const categories = Array.from(new Set(Object.values(MINI_APPS).map(app => app.category)));

  // Filter apps by category
  const filteredApps = selectedCategory
    ? Object.entries(MINI_APPS).filter(([_, app]) => app.category === selectedCategory)
    : Object.entries(MINI_APPS);

  // Get core ports (default ports)
  const corePorts = systemGraph?.ports.filter(p => p.isDefault) || [];

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getBaseScanUrl = (address: string) => {
    return `https://basescan.org/address/${address}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            DreamNet Hub
          </h1>
          <p className="text-gray-400">
            Explore all mini-apps, contracts, and system topology
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* System Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
            <p className="text-gray-400 text-sm mb-1">Mini-Apps</p>
            <p className="text-3xl font-bold text-cyan-400">{Object.keys(MINI_APPS).length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
            <p className="text-gray-400 text-sm mb-1">Contracts</p>
            <p className="text-3xl font-bold text-green-400">{contracts.length}</p>
          </div>
          {systemGraph && (
            <>
              <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
                <p className="text-gray-400 text-sm mb-1">Ports</p>
                <p className="text-3xl font-bold text-purple-400">{systemGraph.ports.length}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
                <p className="text-gray-400 text-sm mb-1">Routes</p>
                <p className="text-3xl font-bold text-yellow-400">{systemGraph.routes.length}</p>
              </div>
            </>
          )}
        </div>

        {/* Core Ports */}
        {corePorts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Core Ports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {corePorts.map((port) => (
                <div key={port.id} className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">{port.label}</h3>
                    <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                      {port.fiber}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">ID: {port.id}</p>
                  <p className="text-gray-400 text-xs capitalize">{port.direction}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mini-Apps Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Mini-Apps</h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded text-sm ${
                  selectedCategory === null
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded text-sm capitalize ${
                    selectedCategory === cat
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredApps.map(([appId, app]) => {
              const metric = whaleMetrics.find(m => m.id === appId);
              const healthColor = metric?.health === 'healthy' ? 'green' : metric?.health === 'degraded' ? 'yellow' : 'red';
              
              return (
                <div
                  key={appId}
                  className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">{app.name}</h3>
                    <div className="flex gap-1">
                      {metric && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          healthColor === 'green' ? 'bg-green-500/20 text-green-300' :
                          healthColor === 'yellow' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {metric.health}
                        </span>
                      )}
                      {app.requiresPassport && (
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                          Passport
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs mb-3 capitalize">{app.category}</p>
                  {app.minTier && (
                    <p className="text-gray-500 text-xs mb-3">Tier: {app.minTier}</p>
                  )}
                  {metric && Object.keys(metric.stats).length > 0 && (
                    <div className="mb-3 text-xs text-gray-400">
                      {Object.entries(metric.stats).slice(0, 1).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="text-white font-mono">
                            {typeof value === 'number' ? (value % 1 === 0 ? value : value.toFixed(2)) : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => onSelectApp(appId)}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded text-sm transition-colors"
                  >
                    Open
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contracts Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Deployed Contracts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contracts.map((contract) => (
              <div
                key={contract.address}
                className="bg-gray-800 rounded-lg p-4 border border-green-500/20 hover:border-green-500/40 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{contract.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-green-400 text-sm font-mono">
                    {shortenAddress(contract.address)}
                  </code>
                  <a
                    href={getBaseScanUrl(contract.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 text-xs"
                  >
                    View →
                  </a>
                </div>
                <p className="text-gray-400 text-xs">Base Mainnet (Chain ID: {BASE_CHAIN_ID})</p>
              </div>
            ))}
          </div>
        </div>

        {/* System Graph Details */}
        {systemGraph && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">System Topology</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-purple-500/20">
                <h3 className="text-lg font-semibold mb-2">Ports ({systemGraph.ports.length})</h3>
                <p className="text-gray-400 text-sm">
                  {systemGraph.ports.filter(p => p.isDefault).length} default ports
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-yellow-500/20">
                <h3 className="text-lg font-semibold mb-2">Routes ({systemGraph.routes.length})</h3>
                <p className="text-gray-400 text-sm">
                  Active routing paths
                </p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
                <h3 className="text-lg font-semibold mb-2">Wormholes ({systemGraph.wormholes.length})</h3>
                <p className="text-gray-400 text-sm">
                  Cross-cluster channels
                </p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading system graph...</p>
          </div>
        )}
      </div>
    </div>
  );
}

