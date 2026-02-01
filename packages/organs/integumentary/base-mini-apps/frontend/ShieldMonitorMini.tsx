import React, { useState } from 'react';

type PolicyPreset = 'Normal' | 'Strict' | 'Open';

export function ShieldMonitorMini() {
  const [threatCount, setThreatCount] = useState(12);
  const [blockedCount, setBlockedCount] = useState(1247);
  const [rateLimitStats, setRateLimitStats] = useState({
    requests: 45230,
    limit: 50000,
    resetAt: Date.now() + 3600000,
  });
  const [policyPreset, setPolicyPreset] = useState<PolicyPreset>('Normal');

  // TODO: Replace with actual ShieldCore.status() call
  const handlePolicyChange = (preset: PolicyPreset) => {
    setPolicyPreset(preset);
    // TODO: Call /api/shield/policy with new preset
    console.log(`Policy changed to: ${preset}`);
  };

  const rateLimitPercent = (rateLimitStats.requests / rateLimitStats.limit) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🛡️ Shield Monitor Mini
          </h1>
          <p className="text-gray-400 mb-6">Monitor threats and security policies</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <h3 className="font-semibold mb-2">Threats Detected</h3>
              <div className="text-3xl font-bold text-yellow-400">{threatCount}</div>
              <p className="text-xs text-gray-400 mt-2">Last 24 hours</p>
            </div>

            <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <h3 className="font-semibold mb-2">Threats Blocked</h3>
              <div className="text-3xl font-bold text-green-400">{blockedCount.toLocaleString()}</div>
              <p className="text-xs text-gray-400 mt-2">All time</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <h3 className="font-semibold mb-3">Rate Limit Status</h3>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{rateLimitStats.requests.toLocaleString()} / {rateLimitStats.limit.toLocaleString()}</span>
                <span>{rateLimitPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    rateLimitPercent > 80 ? 'bg-red-500' : rateLimitPercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${rateLimitPercent}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Resets in {Math.floor((rateLimitStats.resetAt - Date.now()) / 60000)} minutes
            </p>
          </div>

          <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <h3 className="font-semibold mb-3">Current Policy Preset</h3>
            <select
              value={policyPreset}
              onChange={(e) => handlePolicyChange(e.target.value as PolicyPreset)}
              className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-2 text-white"
            >
              <option value="Normal">Normal</option>
              <option value="Strict">Strict</option>
              <option value="Open">Open</option>
            </select>
            <p className="text-xs text-gray-400 mt-2">
              {policyPreset === 'Normal' && 'Balanced security and performance'}
              {policyPreset === 'Strict' && 'Maximum security, may impact performance'}
              {policyPreset === 'Open' && 'Minimal restrictions, fastest performance'}
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-400">
              📝 TODO: Connect to ShieldCore.status() for real-time threat data
            </p>
            <p className="text-sm text-gray-400 mt-1">
              📝 TODO: Wire policy change to /api/shield/policy endpoint
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

