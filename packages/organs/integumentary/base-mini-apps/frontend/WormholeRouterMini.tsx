import React, { useState } from 'react';

interface Wormhole {
  id: string;
  sourcePort: string;
  targetPort: string;
  enabled: boolean;
  traffic: number;
  latency: number;
}

export function WormholeRouterMini() {
  const [wormholes, setWormholes] = useState<Wormhole[]>([
    {
      id: 'wh-001',
      sourcePort: 'dreamnet-core',
      targetPort: 'shield-core',
      enabled: true,
      traffic: 12450,
      latency: 12,
    },
    {
      id: 'wh-002',
      sourcePort: 'mesh-core',
      targetPort: 'travelnet-core',
      enabled: true,
      traffic: 8920,
      latency: 8,
    },
    {
      id: 'wh-003',
      sourcePort: 'shield-core',
      targetPort: 'milnet-core',
      enabled: false,
      traffic: 0,
      latency: 0,
    },
    {
      id: 'wh-004',
      sourcePort: 'dreamnet-core',
      targetPort: 'mesh-core',
      enabled: true,
      traffic: 15670,
      latency: 15,
    },
    {
      id: 'wh-005',
      sourcePort: 'travelnet-core',
      targetPort: 'dreamnet-core',
      enabled: false,
      traffic: 0,
      latency: 0,
    },
  ]);

  const toggleWormhole = (id: string) => {
    setWormholes(prev =>
      prev.map(wh =>
        wh.id === id
          ? { ...wh, enabled: !wh.enabled }
          : wh
      )
    );
    // TODO: Call /api/wormholes/{id}/toggle endpoint
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🌀 Wormhole Router Mini
          </h1>
          <p className="text-gray-400 mb-6">Manage cross-cluster wormhole connections</p>

          <div className="space-y-4">
            {wormholes.map(wormhole => (
              <div
                key={wormhole.id}
                className={`p-4 rounded-lg border-2 ${
                  wormhole.enabled
                    ? 'bg-gray-700/50 border-cyan-500/30'
                    : 'bg-gray-700/30 border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-cyan-400">{wormhole.sourcePort}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-semibold text-purple-400">{wormhole.targetPort}</span>
                    </div>
                    {wormhole.enabled && (
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>Traffic: {wormhole.traffic.toLocaleString()}</span>
                        <span>Latency: {wormhole.latency}ms</span>
                      </div>
                    )}
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wormhole.enabled}
                      onChange={() => toggleWormhole(wormhole.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-400">
              📝 TODO: Connect to /api/wormholes for real wormhole data
            </p>
            <p className="text-sm text-gray-400 mt-1">
              📝 TODO: Wire toggle switches to /api/wormholes/{'{id}'}/toggle endpoint
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

