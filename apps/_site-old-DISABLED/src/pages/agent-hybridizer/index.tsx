import { useState, useEffect } from "react";
import { Dna, Sparkles, Zap, Plus, X, CheckCircle, ArrowRight } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface AgentHybrid {
  id: string;
  name: string;
  parentAgents: string[];
  capabilities: string[];
  traits: string[];
  status: string;
  createdAt: string;
  evolvedFrom?: string;
}

const AVAILABLE_AGENTS = [
  { key: "lucid", name: "LUCID", description: "Logic & Routing" },
  { key: "canvas", name: "CANVAS", description: "Visual & UI" },
  { key: "root", name: "ROOT", description: "Architecture & Backend" },
  { key: "echo", name: "ECHO", description: "Analysis & Wallet" },
  { key: "cradle", name: "CRADLE", description: "Evolution & Minting" },
  { key: "wing", name: "WING", description: "Messaging & Mint" },
  { key: "wolf-pack", name: "Wolf Pack", description: "Funding & Outreach" },
  { key: "super-spine", name: "Super Spine", description: "Orchestration" },
];

export default function AgentHybridizer() {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [hybridName, setHybridName] = useState("");
  const [hybrids, setHybrids] = useState<AgentHybrid[]>([]);
  const [creating, setCreating] = useState(false);
  const [meshStatus, setMeshStatus] = useState<any>(null);

  useEffect(() => {
    fetchHybrids();
    fetchMeshStatus();
    const interval = setInterval(() => {
      fetchHybrids();
      fetchMeshStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchHybrids = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/mesh/hybrids`);
      if (!res.ok) return;
      const data = await res.json();
      setHybrids(data.hybrids || []);
    } catch (err) {
      console.error("Failed to fetch hybrids:", err);
    }
  };

  const fetchMeshStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/mesh/instant/status`);
      if (!res.ok) return;
      const data = await res.json();
      setMeshStatus(data.status);
    } catch (err) {
      console.error("Failed to fetch mesh status:", err);
    }
  };

  const toggleAgent = (agentKey: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agentKey)
        ? prev.filter((a) => a !== agentKey)
        : [...prev, agentKey]
    );
  };

  const createHybrid = async () => {
    if (selectedAgents.length < 2) {
      alert("Select at least 2 agents to hybridize");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch(`${API_BASE}/api/mesh/hybrids/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: hybridName || undefined,
          parentAgents: selectedAgents,
        }),
      });

      if (!res.ok) throw new Error("Failed to create hybrid");
      const data = await res.json();
      
      // Reset form
      setSelectedAgents([]);
      setHybridName("");
      await fetchHybrids();
    } catch (err) {
      console.error("Failed to create hybrid:", err);
      alert(`Failed to create hybrid: ${(err as Error).message}`);
    } finally {
      setCreating(false);
    }
  };

  const crossAgents = async (agent1: string, agent2: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/mesh/hybrids/cross`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent1, agent2 }),
      });

      if (!res.ok) throw new Error("Failed to cross agents");
      await fetchHybrids();
    } catch (err) {
      console.error("Failed to cross agents:", err);
      alert(`Failed to cross agents: ${(err as Error).message}`);
    }
  };

  const evolveHybrid = async (parentId: string) => {
    const name = prompt("Enter name for evolved hybrid:");
    if (!name) return;

    try {
      const res = await fetch(`${API_BASE}/api/mesh/hybrids/evolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentHybridId: parentId,
          name,
        }),
      });

      if (!res.ok) throw new Error("Failed to evolve hybrid");
      await fetchHybrids();
    } catch (err) {
      console.error("Failed to evolve hybrid:", err);
      alert(`Failed to evolve hybrid: ${(err as Error).message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dna className="h-10 w-10 text-purple-400" />
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Agent Hybridizer
            </h1>
          </div>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Cross agents, build hybrids, evolve new capabilities. Agents building agents - instant and seamless.
          </p>
        </div>

        {/* Mesh Status */}
        {meshStatus && (
          <div className="mb-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl border border-purple-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-purple-400" />
                  Instant Mesh Status
                </h2>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{meshStatus.eventCount}</div>
                    <div className="text-sm text-gray-400">Events</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-pink-400">{meshStatus.hybridCount}</div>
                    <div className="text-sm text-gray-400">Hybrids</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">{meshStatus.subscriptions}</div>
                    <div className="text-sm text-gray-400">Subscriptions</div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                <span className="text-sm font-semibold text-purple-300">⚡ Instant Mode</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hybridizer Panel */}
          <div className="bg-gray-900/50 rounded-2xl border-2 border-purple-500/30 p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-purple-400" />
              Create Hybrid
            </h2>

            {/* Agent Selection */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3">Select 2+ agents to hybridize:</p>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_AGENTS.map((agent) => (
                  <button
                    key={agent.key}
                    onClick={() => toggleAgent(agent.key)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedAgents.includes(agent.key)
                        ? "border-purple-500 bg-purple-500/20 text-purple-300"
                        : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-purple-500/50"
                    }`}
                  >
                    <div className="text-sm font-semibold">{agent.name}</div>
                    <div className="text-xs text-gray-500">{agent.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hybrid Name */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Hybrid Name (optional)</label>
              <input
                type="text"
                value={hybridName}
                onChange={(e) => setHybridName(e.target.value)}
                placeholder="Auto-generated if empty"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Create Button */}
            <button
              onClick={createHybrid}
              disabled={creating || selectedAgents.length < 2}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(192,38,211,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? "Creating..." : `🧬 Hybridize ${selectedAgents.length} Agents`}
            </button>

            {/* Quick Cross */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-3">Quick Cross (2 agents):</p>
              <div className="flex gap-2">
                {AVAILABLE_AGENTS.slice(0, 4).map((agent1) =>
                  AVAILABLE_AGENTS.slice(4, 8).map((agent2) => (
                    <button
                      key={`${agent1.key}×${agent2.key}`}
                      onClick={() => crossAgents(agent1.key, agent2.key)}
                      className="flex-1 px-3 py-2 text-xs bg-gray-800 border border-gray-700 rounded-lg hover:border-purple-500/50 transition-colors"
                    >
                      {agent1.name} × {agent2.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Hybrids List */}
          <div className="bg-gray-900/50 rounded-2xl border-2 border-purple-500/30 p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Dna className="h-6 w-6 text-pink-400" />
              Active Hybrids ({hybrids.length})
            </h2>

            {hybrids.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Dna className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hybrids yet. Create your first hybrid!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {hybrids.map((hybrid) => (
                  <div
                    key={hybrid.id}
                    className="bg-gray-800/50 rounded-xl border border-purple-500/20 p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-purple-300">{hybrid.name}</h3>
                        {hybrid.evolvedFrom && (
                          <p className="text-xs text-gray-500">Evolved from hybrid</p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          hybrid.status === "active"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {hybrid.status}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Parents:</p>
                      <div className="flex flex-wrap gap-2">
                        {hybrid.parentAgents.map((agent) => (
                          <span
                            key={agent}
                            className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300"
                          >
                            {agent}
                          </span>
                        ))}
                      </div>
                    </div>

                    {hybrid.capabilities.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Capabilities:</p>
                        <div className="flex flex-wrap gap-2">
                          {hybrid.capabilities.map((cap, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs text-cyan-300"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => evolveHybrid(hybrid.id)}
                        className="flex-1 px-3 py-2 text-xs bg-pink-500/20 border border-pink-500/30 rounded-lg hover:bg-pink-500/30 transition-colors"
                      >
                        Evolve
                      </button>
                      <button
                        onClick={async () => {
                          const agentName = prompt(`Enter name for agent built by ${hybrid.name}:`);
                          if (!agentName) return;
                          try {
                            const res = await fetch(`${API_BASE}/api/foundry/hybrid/build`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                hybridId: hybrid.id,
                                agentName,
                              }),
                            });
                            if (!res.ok) throw new Error("Failed to build agent");
                            alert(`Agent build requested from ${hybrid.name}!`);
                          } catch (err) {
                            console.error("Failed to build agent:", err);
                            alert(`Failed to build agent: ${(err as Error).message}`);
                          }
                        }}
                        className="flex-1 px-3 py-2 text-xs bg-cyan-500/20 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-colors"
                      >
                        🔨 Build Agent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

