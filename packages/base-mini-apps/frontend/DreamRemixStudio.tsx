import React, { useState } from 'react';
import { CONTRACT_ADDRESSES } from './config';

export function DreamRemixStudio() {
  const [remixes, setRemixes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const registerRemix = async () => {
    // Placeholder - would integrate with RemixRegistry contract
    alert('Remix registration coming soon! Contract: ' + CONTRACT_ADDRESSES.DreamRemixRegistry);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Dream Remix Studio</h1>
      
      <div className="mb-6">
        <button
          onClick={registerRemix}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
        >
          Register Remix
        </button>
      </div>

      <div className="space-y-4">
        {remixes.length === 0 ? (
          <p className="text-gray-400">No remixes yet. Create your first remix!</p>
        ) : (
          remixes.map((remix) => (
            <div key={remix.id} className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
              <h3 className="text-lg font-semibold text-white">{remix.name}</h3>
              <p className="text-gray-400 text-sm">Parent: {remix.parentId}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

