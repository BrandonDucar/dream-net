import React, { useState } from 'react';
import { CONTRACT_ADDRESSES } from './config';

export function RevenueSharingDashboard() {
  const [splits, setSplits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const releaseRevenue = async () => {
    // Placeholder - would integrate with RevenueSplitter contract
    alert('Revenue release coming soon! Contract: ' + CONTRACT_ADDRESSES.RevenueSplitter);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Revenue Sharing Dashboard</h1>
      
      <div className="mb-6">
        <button
          onClick={releaseRevenue}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
        >
          Release Revenue
        </button>
      </div>

      <div className="space-y-4">
        {splits.length === 0 ? (
          <p className="text-gray-400">No revenue splits configured. Add payees to start sharing revenue!</p>
        ) : (
          splits.map((split) => (
            <div key={split.address} className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-mono text-sm">{split.address}</p>
                  <p className="text-gray-400 text-sm">Shares: {split.shares}</p>
                </div>
                <div className="text-right">
                  <p className="text-cyan-400 font-semibold">{split.pendingPayment} ETH</p>
                  <p className="text-gray-400 text-xs">Pending</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

