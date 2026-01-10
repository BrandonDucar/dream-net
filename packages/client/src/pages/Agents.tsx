
import React, { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  tier: string;
  cluster: string;
  status: string;
  description: string;
}

const Agents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/market/agents')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAgents(data.agents);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch citizens:", err);
        setLoading(false);
      });
  }, []);

  const filteredAgents = filter === 'ALL'
    ? agents
    : agents.filter(a => a.cluster === filter || a.tier === filter);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-['Inter']">
      {/* Header section with Glassmorphism */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2 italic">
              SOVEREIGN ALMANAC
            </h1>
            <p className="text-zinc-500 uppercase tracking-widest text-sm font-bold">
              Registry of 143+ Neural Citizens
            </p>
          </div>

          <div className="flex gap-2">
            {['ALL', 'LEGENDARY', 'WOLF_PACK', 'AEGIS_FLEET'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${filter === f ? 'bg-white text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map(agent => (
            <div
              key={agent.id}
              className={`group relative overflow-hidden bg-zinc-900/40 border ${getBorderColor(agent.tier)} p-6 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:bg-zinc-800/60`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-[10px] font-black tracking-tighter uppercase ${getTierColor(agent.tier)}`}>
                  {agent.tier}
                </span>
                <span className="text-[10px] text-zinc-600 font-mono tracking-widest">
                  {agent.cluster}
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                {agent.name.replace(/([A-Z])/g, ' $1').trim()}
              </h3>

              <p className="text-zinc-500 text-sm leading-relaxed h-12 overflow-hidden text-ellipsis line-clamp-2">
                {agent.description}
              </p>

              <div className="mt-6 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-green-500' : 'bg-zinc-700 animate-pulse'}`}></div>
                  <span className="text-[10px] uppercase font-bold">{agent.status}</span>
                </div>
                <button className="text-[10px] font-black underline underline-offset-4 hover:text-white transition-colors">
                  INITIALIZE CITIZEN
                </button>
              </div>

              {/* Decorative Background Element */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function getTierColor(tier: string): string {
  switch (tier) {
    case 'LEGENDARY': return 'bg-orange-500 text-black';
    case 'EPIC': return 'bg-purple-600 text-white';
    case 'RARE': return 'bg-blue-600 text-white';
    default: return 'bg-zinc-700 text-zinc-300';
  }
}

function getBorderColor(tier: string): string {
  switch (tier) {
    case 'LEGENDARY': return 'border-orange-500/30 hover:border-orange-500';
    case 'EPIC': return 'border-purple-600/30 hover:border-purple-600';
    case 'RARE': return 'border-blue-600/30 hover:border-blue-600';
    default: return 'border-white/5 hover:border-white/20';
  }
}

export default Agents;
