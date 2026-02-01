import React, { useState } from 'react';
import { CONTRACT_ADDRESSES } from './config.js';

export function NightmareNetwork() {
  const [nightmares, setNightmares] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const logNightmare = async () => {
    // Placeholder - would integrate with NightmareRegistry contract
    alert('Nightmare logging coming soon! Contract: ' + CONTRACT_ADDRESSES.NightmareRegistry);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Nightmare Network</h1>
      
      <div className="mb-6">
        <button
          onClick={logNightmare}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Log Nightmare
        </button>
      </div>

      <div className="space-y-4">
        {nightmares.length === 0 ? (
          <p className="text-gray-400">No nightmares logged. All dreams are peaceful!</p>
        ) : (
          nightmares.map((nightmare) => (
            <div key={nightmare.id} className="bg-gray-800 rounded-lg p-4 border border-red-500/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-mono text-sm">{nightmare.contentHash}</p>
                  <p className="text-gray-400 text-xs">Reported: {new Date(nightmare.reportedAt * 1000).toLocaleDateString()}</p>
                </div>
                {nightmare.isResolved && (
                  <span className="text-green-400 text-sm">✓ Resolved</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

