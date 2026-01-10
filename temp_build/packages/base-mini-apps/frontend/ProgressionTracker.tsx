import React, { useState } from 'react';
import { CONTRACT_ADDRESSES } from './config';

export function ProgressionTracker() {
  const [progression, setProgression] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Progression Tracker</h1>
      
      <div className="mb-4 bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
        <p className="text-gray-400 text-sm">Contract:</p>
        <p className="text-cyan-400 font-mono text-sm">{CONTRACT_ADDRESSES.ProgressionRegistry}</p>
      </div>

      {progression ? (
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-sm">XP</p>
              <p className="text-2xl font-bold text-white">{progression.xp}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Tier</p>
              <p className="text-2xl font-bold text-cyan-400">{progression.tier}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Last Updated</p>
              <p className="text-white">{new Date(progression.lastUpdated * 1000).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">No progression data found. Start earning XP!</p>
      )}
    </div>
  );
}

