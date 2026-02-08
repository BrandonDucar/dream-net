import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWallet } from "@/utils/wallet";
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Node {
  id: string;
  name: string;
  role: string;
  trust: number;
  status: 'ACTIVE' | 'IDLE' | 'EXECUTING';
  zone?: string;
  token?: string;
  lastAction?: number;
  nextAction?: string;
  type?: 'core' | 'remixable' | 'vault';
  state?: 'clean' | 'infected' | 'awake';
  claimed?: boolean;
}

interface WalletData {
  score: number;
  role: 'user' | 'dreamTeam' | 'admin';
}

interface NodeWebProps {
  swarmBots?: any[];
}

export default function NodeWeb({ swarmBots = [] }: NodeWebProps) {
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [walletData, setWalletData] = useState<WalletData>({ score: 85, role: 'dreamTeam' });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const w = getWallet();
    setWallet(w);
    // Simulate wallet data - in real app this would come from API
    setWalletData({ 
      score: 85 + Math.floor(Math.random() * 15), 
      role: Math.random() > 0.5 ? 'dreamTeam' : 'user' 
    });
  }, []);

  // Create enhanced nodes from swarm bots plus operator nodes
  const nodes: Node[] = [
    {
      id: 'operator-sutton',
      name: 'Sutton',
      role: 'Operator',
      trust: 91,
      status: 'ACTIVE',
      type: 'core',
      state: 'clean',
      claimed: false
    },
    {
      id: 'god-mode',
      name: 'You',
      role: 'God Mode',
      trust: 100,
      status: 'ACTIVE',
      type: 'core',
      state: 'clean',
      claimed: false
    },
    ...swarmBots.map((bot, index) => ({
      id: bot.id || `bot-${index}`,
      name: bot.id || `Bot ${index + 1}`,
      role: bot.zone || 'Builder',
      trust: 85 + Math.floor(Math.random() * 10),
      status: (bot.status || 'ACTIVE') as 'ACTIVE' | 'IDLE' | 'EXECUTING',
      zone: bot.zone,
      token: bot.token,
      lastAction: bot.lastAction,
      nextAction: bot.nextAction,
      type: (bot.id?.includes('remix') ? 'remixable' : 
            bot.id?.includes('vault') ? 'vault' : 'core') as 'core' | 'remixable' | 'vault',
      state: (bot.id?.includes('infected') ? 'infected' : 'awake') as 'clean' | 'infected' | 'awake',
      claimed: Math.random() > 0.7
    }))
  ];

  function handleNodeAction(actionType: string, nodeId: string) {
    console.log(`🔧 ${actionType} triggered on node: ${nodeId}`);

    fetch(`/api/nodes/${nodeId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: actionType }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(`✅ Action ${actionType} completed:`, data);
        // Optional: update UI or trigger animations
        toast({
          title: "Node Action Complete",
          description: `${actionType} executed on ${nodeId}`,
        });
        queryClient.invalidateQueries({ queryKey: ['/api/swarm/status'] });
      })
      .catch(err => {
        console.error(`❌ Action ${actionType} failed:`, err);
      });
  }

  const getTrustColor = (trust: number) => {
    if (trust >= 95) return 'from-green-500 to-emerald-600';
    if (trust >= 85) return 'from-blue-500 to-cyan-600';
    if (trust >= 75) return 'from-purple-500 to-violet-600';
    return 'from-yellow-500 to-orange-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400';
      case 'EXECUTING': return 'text-blue-400';
      case 'IDLE': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getGlowClass = (score: number) => {
    if (score >= 90) return "border-4 border-yellow-400 shadow-yellow-500/40";
    if (score >= 70) return "border-2 border-green-400 shadow-green-500/30";
    if (score >= 50) return "border border-blue-400 shadow-blue-500/20";
    return "border border-gray-600 opacity-60";
  };

  return (
    <div className="relative space-y-6">
      {/* Node Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`node ${getGlowClass(walletData.score)} relative p-4 bg-gradient-to-br ${getTrustColor(node.trust)} rounded-2xl shadow-xl cursor-pointer transition transform hover:scale-105`}
            onClick={() => setActiveNode(node)}
          >
            <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
              node.status === 'ACTIVE' ? 'bg-green-400 animate-ping' : 
              node.status === 'EXECUTING' ? 'bg-blue-400 animate-pulse' : 'bg-yellow-400'
            }`} />
            <div className={`node-header ${node.state}`}>
              <h2 className="text-xl font-bold text-white">{node.name}</h2>
              
              <div className="tags flex gap-1 mt-2">
                <span className={`tag type ${node.type}`}>
                  {node.type}
                </span>
                <span className={`tag state ${node.state}`}>
                  {node.state}
                </span>
                <span className={`tag trust t${walletData.score}`}>
                  {walletData.score >= 90 ? "GodMode" :
                   walletData.score >= 80 ? "Premium" :
                   walletData.score >= 70 ? "Trusted" : "Standard"}
                </span>
              </div>
            </div>
            
            <p className="text-white/90 mt-2">{node.role}</p>
            <p className="text-sm text-lime-200">Trust: {node.trust}%</p>
            {node.token && (
              <p className="text-xs text-white/70 mt-1">{node.token}</p>
            )}
          </div>
        ))}
      </div>

      {/* Active Node Panel */}
      {activeNode && (
        <div className="absolute right-4 top-4 bg-zinc-900 p-6 rounded-xl shadow-2xl w-72 z-50">
          <h3 className="text-lg font-bold text-pink-300">Node: {activeNode.name}</h3>
          <p className="text-sm text-white">Role: {activeNode.role}</p>
          <p className="text-xs text-lime-300">Trust Level: {activeNode.trust}%</p>
          <p className="text-xs text-cyan-300">Type: {activeNode.type}</p>
          <p className={`text-xs mb-4 ${activeNode.state === 'infected' ? 'text-red-400' : 'text-green-400'}`}>
            State: {activeNode.state}
          </p>
          
          <div className="mb-4 p-2 bg-zinc-800 rounded-lg">
            <p className="text-xs text-slate-400">Wallet Score: {walletData.score}</p>
            <p className="text-xs text-slate-400">Role: {walletData.role}</p>
          </div>

          {activeNode.nextAction && (
            <p className="text-xs text-slate-400 mb-4">Next: {activeNode.nextAction}</p>
          )}

          <div className="node-actions space-y-2">
            {walletData.score >= 70 && (
              <button 
                onClick={() => handleNodeAction('pulse', activeNode.id)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 py-2 px-4 rounded-xl text-white text-sm transition-colors"
              >
                ⚡️ Send Pulse
              </button>
            )}

            {activeNode.type === 'remixable' && !activeNode.claimed && (
              <button 
                onClick={() => handleNodeAction('claimRemix', activeNode.id)}
                className="w-full bg-pink-700 hover:bg-pink-800 py-2 px-4 rounded-xl text-white text-sm transition-colors"
              >
                💎 Claim Remix Bounty
              </button>
            )}

            {walletData.score >= 80 && activeNode.state !== 'infected' && (
              <button 
                onClick={() => handleNodeAction('activateBot', activeNode.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-xl text-white text-sm transition-colors"
              >
                🧠 Activate Bot
              </button>
            )}

            {activeNode.state === 'infected' && walletData.role === 'dreamTeam' && (
              <button 
                onClick={() => handleNodeAction('cleanseNightmare', activeNode.id)}
                className="w-full bg-red-600 hover:bg-red-700 py-2 px-4 rounded-xl text-white text-sm transition-colors"
              >
                🔥 Cleanse Nightmare
              </button>
            )}

            {walletData.score >= 90 && (
              <button 
                onClick={() => handleNodeAction('scoreTrust', activeNode.id)}
                className="w-full bg-green-600 hover:bg-green-700 py-2 px-4 rounded-xl text-white text-sm transition-colors"
              >
                🎯 Score Trust
              </button>
            )}

            <button 
              onClick={() => handleNodeAction('lineage', activeNode.id)}
              className="w-full bg-purple-700 hover:bg-purple-800 py-2 px-4 rounded-xl text-white text-sm transition-colors"
            >
              👁 View Lineage
            </button>
          </div>

          <button
            onClick={() => setActiveNode(null)}
            className="mt-4 text-sm text-gray-400 hover:text-white underline"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}