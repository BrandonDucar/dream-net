import { useState, useEffect } from "react";
import { useWallet } from "../../contexts/WalletContext";
import { Brain, Lock, Unlock, Zap, Shield, Code, Palette, Search, Filter } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Agent {
  id: string;
  agentKey: string;
  name: string;
  status: string;
  capabilities: string[];
  traits?: string[];
  metadata: {
    tier: "Standard" | "Premium" | "Nightmare";
    unlock: string;
    subscriptionRequired?: boolean;
    price?: {
      amount: number;
      currency: string;
      period: "monthly" | "yearly";
    };
  };
  health: {
    uptime: number;
    successRate: number;
    avgResponseTime: number;
  };
}

interface AgentAccess {
  hasAccess: boolean;
  reason?: string;
  requirements?: {
    trustScore?: number;
    completedDreams?: number;
    stakedSheep?: number;
    hasTokenBoost?: boolean;
  };
}

const capabilityIcons: Record<string, any> = {
  code: Code,
  design: Palette,
  analysis: Brain,
  communication: Zap,
  funding: Shield,
  deployment: Zap,
};

const tierColors: Record<string, string> = {
  Standard: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  Premium: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  Nightmare: "text-red-400 border-red-500/30 bg-red-500/10",
};

export default function AgentExplorer() {
  const { address } = useWallet();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterCapability, setFilterCapability] = useState<string>("all");
  const [accessMap, setAccessMap] = useState<Record<string, AgentAccess>>({});

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    if (address && agents.length > 0) {
      fetchAccessForAllAgents();
    }
  }, [address, agents]);

  const fetchAgents = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/super-spine/agents`);
      if (!res.ok) throw new Error("Failed to fetch agents");
      const data = await res.json();
      setAgents(data.agents || []);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccessForAllAgents = async () => {
    if (!address) return;

    const accessPromises = agents.map(async (agent) => {
      try {
        const res = await fetch(
          `${API_BASE}/api/super-spine/agent/${agent.agentKey}/access?userId=${address}`
        );
        if (res.ok) {
          const data = await res.json();
          return { key: agent.agentKey, access: data };
        }
      } catch (err) {
        console.error(`Failed to fetch access for ${agent.agentKey}:`, err);
      }
      return null;
    });

    const results = await Promise.all(accessPromises);
    const newAccessMap: Record<string, AgentAccess> = {};
    results.forEach((result) => {
      if (result) {
        newAccessMap[result.key] = result.access;
      }
    });
    setAccessMap(newAccessMap);
  };

  const filteredAgents = agents.filter((agent) => {
    if (searchQuery && !agent.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !agent.agentKey.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterTier !== "all" && agent.metadata.tier !== filterTier) {
      return false;
    }
    if (filterCapability !== "all" && !agent.capabilities.includes(filterCapability)) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-dream-black text-white pt-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            <p className="mt-4 text-gray-400">Loading agents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dream-black text-white pt-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
            Agent
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Explorer
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Discover and unlock {agents.length}+ agents in the DreamNet ecosystem. Each agent has unique capabilities
            and unlock requirements.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Tiers</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Nightmare">Nightmare</option>
            </select>
            <select
              value={filterCapability}
              onChange={(e) => setFilterCapability(e.target.value)}
              className="px-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Capabilities</option>
              <option value="code">Code</option>
              <option value="design">Design</option>
              <option value="analysis">Analysis</option>
              <option value="communication">Communication</option>
              <option value="funding">Funding</option>
              <option value="deployment">Deployment</option>
            </select>
          </div>
          {!address && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400">
              Connect your wallet to see unlock status and access requirements for each agent.
            </div>
          )}
        </div>

        {/* Agent Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => {
            const access = accessMap[agent.agentKey];
            const hasAccess = access?.hasAccess ?? (agent.metadata.tier === "Standard");
            const Icon = capabilityIcons[agent.capabilities[0]] || Brain;

            return (
              <div
                key={agent.id}
                className={`rounded-2xl border-2 p-6 transition-all ${
                  hasAccess
                    ? "border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 hover:border-cyan-400"
                    : "border-gray-700/50 bg-gray-900/20 opacity-75"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                      <Icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                      <p className="text-xs text-gray-400 font-mono">{agent.agentKey}</p>
                    </div>
                  </div>
                  {hasAccess ? (
                    <Unlock className="h-5 w-5 text-green-400" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-500" />
                  )}
                </div>

                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${tierColors[agent.metadata.tier]}`}
                  >
                    {agent.metadata.tier}
                  </span>
                </div>

                <p className="text-sm text-gray-300 mb-4">{agent.metadata.unlock}</p>

                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Capabilities:</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.map((cap) => {
                      const CapIcon = capabilityIcons[cap] || Brain;
                      return (
                        <span
                          key={cap}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-800/50 rounded text-xs text-gray-300"
                        >
                          <CapIcon className="h-3 w-3" />
                          {cap}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {agent.metadata.price && (
                  <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <p className="text-xs text-purple-400 font-semibold">
                      {agent.metadata.price.amount} {agent.metadata.price.currency} / {agent.metadata.price.period}
                    </p>
                  </div>
                )}

                {!hasAccess && access?.requirements && (
                  <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-xs text-gray-400">
                    <p className="font-semibold text-gray-300 mb-1">Requirements:</p>
                    <ul className="space-y-1">
                      {access.requirements.trustScore && (
                        <li>Trust Score: {access.requirements.trustScore}+</li>
                      )}
                      {access.requirements.completedDreams && (
                        <li>Completed Dreams: {access.requirements.completedDreams}+</li>
                      )}
                      {access.requirements.stakedSheep && (
                        <li>Staked SHEEP: {access.requirements.stakedSheep}+</li>
                      )}
                      {access.requirements.hasTokenBoost && <li>Token Boost Required</li>}
                    </ul>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Status: {agent.status}</span>
                    <span>Uptime: {agent.health.uptime}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400">No agents found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

