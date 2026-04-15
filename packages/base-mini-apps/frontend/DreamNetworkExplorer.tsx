import React, { useState, useEffect } from 'react';

interface SystemGraph {
  ports: Array<{
    id: string;
    label: string;
    fiber: string;
    isDefault: boolean;
  }>;
  routes: Array<{
    fiber: string;
    type: string;
    targetPortId: string;
  }>;
  wormholes: Array<{
    id: string;
    label: string;
    fiber: string;
  }>;
}

export function DreamNetworkExplorer() {
  const [graph, setGraph] = useState<SystemGraph | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGraph();
  }, []);

  const fetchGraph = async () => {
    try {
      const response = await fetch('/api/system/graph');
      if (!response.ok) throw new Error('Failed to fetch system graph');
      const data = await response.json();
      setGraph(data);
    } catch (err) {
      console.error('Failed to load graph:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6"><p className="text-gray-400">Loading network...</p></div>;
  if (!graph) return <div className="p-6"><p className="text-red-400">Failed to load</p></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Dream Network Explorer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">Ports ({graph.ports.length})</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {graph.ports.map((port) => (
              <div key={port.id} className="text-sm">
                <p className="text-white font-medium">{port.label}</p>
                <p className="text-gray-400 text-xs">Fiber: {port.fiber}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">Routes ({graph.routes.length})</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {graph.routes.map((route, i) => (
              <div key={i} className="text-sm">
                <p className="text-white font-medium">{route.fiber}:{route.type}</p>
                <p className="text-gray-400 text-xs">→ {route.targetPortId}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">Wormholes ({graph.wormholes.length})</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {graph.wormholes.map((wormhole) => (
              <div key={wormhole.id} className="text-sm">
                <p className="text-white font-medium">{wormhole.label}</p>
                <p className="text-gray-400 text-xs">Fiber: {wormhole.fiber}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

