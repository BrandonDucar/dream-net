import React, { useState } from 'react';
import { CONTRACT_ADDRESSES } from './config';

export function DreamDriftersDAO() {
  const [drifters, setDrifters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const joinAsDrifter = async () => {
    // Placeholder - would integrate with DreamDriftersRegistry contract
    alert('Join as drifter coming soon! Contract: ' + CONTRACT_ADDRESSES.DreamDriftersRegistry);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Dream Drifters DAO</h1>
      
      <div className="mb-6">
        <button
          onClick={joinAsDrifter}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
        >
          Join as Drifter
        </button>
      </div>

      <div className="mb-4 bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
        <p className="text-gray-400 text-sm">Total Drifters:</p>
        <p className="text-2xl font-bold text-white">{drifters.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drifters.length === 0 ? (
          <p className="text-gray-400 col-span-full">No drifters yet. Be the first to join!</p>
        ) : (
          drifters.map((drifter) => (
            <div key={drifter.address} className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
              <p className="text-white font-mono text-sm mb-2">{drifter.address}</p>
              <p className="text-gray-400 text-xs">
                Joined: {new Date(drifter.joinedAt * 1000).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

