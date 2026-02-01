import React, { useState } from 'react';
import { CONTRACT_ADDRESSES } from './config.js';

export function SeasonalEventsHub() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Seasonal Events Hub</h1>
      
      <div className="mb-4 bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
        <p className="text-gray-400 text-sm">Contract:</p>
        <p className="text-cyan-400 font-mono text-sm">{CONTRACT_ADDRESSES.SeasonalEventsRegistry}</p>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-gray-400">No active seasonal events. Check back soon!</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
              <h3 className="text-lg font-semibold text-white">{event.name}</h3>
              <p className="text-gray-400 text-sm">
                {new Date(event.startTime * 1000).toLocaleDateString()} - {new Date(event.endTime * 1000).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

