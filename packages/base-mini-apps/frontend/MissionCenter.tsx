import React, { useState } from 'react';
import { CONTRACT_ADDRESSES } from './config.js';

export function MissionCenter() {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const createMission = async () => {
    // Placeholder - would integrate with MissionRegistry contract
    alert('Mission creation coming soon! Contract: ' + CONTRACT_ADDRESSES.MissionRegistry);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Mission Center</h1>
      
      <div className="mb-6">
        <button
          onClick={createMission}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
        >
          Create Mission
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.length === 0 ? (
          <p className="text-gray-400 col-span-full">No active missions. Create your first mission!</p>
        ) : (
          missions.map((mission) => (
            <div key={mission.id} className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
              <h3 className="text-lg font-semibold text-white mb-2">{mission.name}</h3>
              <p className="text-gray-300 text-sm mb-2">{mission.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-cyan-400 text-sm">{mission.rewardHint} ETH reward</span>
                {mission.isActive ? (
                  <span className="text-green-400 text-xs">Active</span>
                ) : (
                  <span className="text-gray-400 text-xs">Completed</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

