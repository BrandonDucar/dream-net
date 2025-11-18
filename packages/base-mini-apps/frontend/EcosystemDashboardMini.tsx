import React, { useState, useEffect } from 'react';

interface EcosystemData {
  dreams: any[];
  nodes: any[];
  agents: any[];
  bounties: any[];
  metadata: {
    totalEntities: number;
    operatorAccess: boolean;
    systemHealth: string;
    activeAgents: number;
  };
}

export function EcosystemDashboardMini() {
  const [data, setData] = useState<EcosystemData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEcosystem();
  }, []);

  const fetchEcosystem = async () => {
    try {
      const response = await fetch('/api/ecosystem');
      if (!response.ok) throw new Error('Failed to fetch ecosystem data');
      const result = await response.json();
      setData(result.ecosystem);
    } catch (err) {
      console.error('Failed to load ecosystem:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6"><p className="text-gray-400">Loading...</p></div>;
  if (!data) return <div className="p-6"><p className="text-red-400">Failed to load</p></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Ecosystem Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
          <p className="text-gray-400 text-sm">Total Dreams</p>
          <p className="text-2xl font-bold text-white">{data.dreams.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
          <p className="text-gray-400 text-sm">Active Nodes</p>
          <p className="text-2xl font-bold text-white">{data.nodes.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
          <p className="text-gray-400 text-sm">Active Agents</p>
          <p className="text-2xl font-bold text-white">{data.metadata.activeAgents}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
          <p className="text-gray-400 text-sm">Open Bounties</p>
          <p className="text-2xl font-bold text-white">{data.bounties.length}</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
        <p className="text-gray-400 text-sm mb-2">System Health</p>
        <p className={`text-lg font-semibold ${
          data.metadata.systemHealth === 'Healthy' ? 'text-green-400' : 'text-red-400'
        }`}>
          {data.metadata.systemHealth}
        </p>
      </div>
    </div>
  );
}

