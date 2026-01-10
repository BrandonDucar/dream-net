import React, { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  status: string;
  capabilities?: string[];
}

export function AgentDashboardMini() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      // Try ecosystem endpoint first
      const response = await fetch('/api/ecosystem');
      if (response.ok) {
        const data = await response.json();
        setAgents(data.ecosystem?.agents || []);
      }
    } catch (err) {
      console.error('Failed to load agents:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6"><p className="text-gray-400">Loading agents...</p></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Agent Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.length === 0 ? (
          <p className="text-gray-400 col-span-full">No agents found</p>
        ) : (
          agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  agent.status === 'Active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {agent.status}
                </span>
              </div>
              {agent.capabilities && agent.capabilities.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400 mb-1">Capabilities:</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 3).map((cap, i) => (
                      <span key={i} className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

