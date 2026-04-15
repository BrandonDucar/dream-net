import { useState, useEffect } from "react";
import { Brain, Shield, Plane, Tv, FlaskConical, Sparkles, Play, CheckCircle, ExternalLink } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface CustomGPT {
  name: string;
  link: string | null;
  category: string;
  purpose: string;
  status: "Active" | "Draft";
}

interface GPTFleet {
  id: string;
  category: string;
  name: string;
  description: string;
  gpts: CustomGPT[];
  status: string;
  mission: string | null;
}

export default function GPTFleetCommand() {
  const [fleets, setFleets] = useState<GPTFleet[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFleet, setSelectedFleet] = useState<string | null>(null);

  useEffect(() => {
    fetchFleets();
    fetchStats();
  }, []);

  const fetchFleets = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/custom-gpt-fleets`);
      if (!res.ok) throw new Error("Failed to fetch fleets");
      const data = await res.json();
      setFleets(data.fleets || []);
    } catch (err) {
      console.error("Failed to fetch fleets:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/custom-gpt-fleets/stats`);
      if (!res.ok) return;
      const data = await res.json();
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const deployFleet = async (category: string, objective: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/custom-gpt-fleets/${category}/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective }),
      });
      if (!res.ok) throw new Error("Failed to deploy fleet");
      await fetchFleets();
    } catch (err) {
      console.error("Failed to deploy fleet:", err);
      alert(`Failed to deploy fleet: ${(err as Error).message}`);
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("aegis")) return <Shield className="h-6 w-6 text-blue-400" />;
    if (cat.includes("travel")) return <Plane className="h-6 w-6 text-cyan-400" />;
    if (cat.includes("creative")) return <Sparkles className="h-6 w-6 text-purple-400" />;
    if (cat.includes("commerce")) return <Tv className="h-6 w-6 text-emerald-400" />;
    if (cat.includes("atlas")) return <Brain className="h-6 w-6 text-indigo-400" />;
    return <FlaskConical className="h-6 w-6 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-10 w-10 text-cyan-400" />
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Custom GPT Fleet Command
            </h1>
          </div>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Command your 30-40 custom GPTs organized by vertical ecosystems
          </p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900/50 rounded-xl border border-white/10 p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{stats.totalGPTs}</div>
              <div className="text-sm text-gray-400">Total GPTs</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-white/10 p-6 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">{stats.activeGPTs}</div>
              <div className="text-sm text-gray-400">Active GPTs</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-white/10 p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{stats.totalFleets}</div>
              <div className="text-sm text-gray-400">Fleets</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl border border-white/10 p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {Object.keys(stats.fleetsByCategory || {}).length}
              </div>
              <div className="text-sm text-gray-400">Categories</div>
            </div>
          </div>
        )}

        {/* Fleets Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading GPT fleets...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fleets.map((fleet) => {
              const isDeployed = fleet.status === "deployed";

              return (
                <div
                  key={fleet.id}
                  className={`bg-gray-900/50 rounded-2xl border-2 p-6 transition-all ${
                    isDeployed
                      ? "border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                      : "border-white/10 hover:border-cyan-500/30"
                  }`}
                >
                  {/* Fleet Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(fleet.category)}
                      <div>
                        <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                          {fleet.name}
                        </h3>
                        <p className="text-sm text-gray-400">{fleet.description}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isDeployed
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {fleet.status}
                    </span>
                  </div>

                  {/* Active Mission */}
                  {fleet.mission && (
                    <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                      <p className="text-sm font-semibold text-cyan-400 mb-1">Active Mission</p>
                      <p className="text-white text-sm">{fleet.mission}</p>
                    </div>
                  )}

                  {/* GPTs List */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                      GPTs ({fleet.gpts.length})
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {fleet.gpts.slice(0, 5).map((gpt, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{gpt.name}</p>
                            <p className="text-xs text-gray-400 truncate">{gpt.purpose}</p>
                          </div>
                          {gpt.link && (
                            <a
                              href={gpt.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 p-1 hover:bg-gray-700 rounded transition-colors"
                            >
                              <ExternalLink className="h-4 w-4 text-cyan-400" />
                            </a>
                          )}
                        </div>
                      ))}
                      {fleet.gpts.length > 5 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{fleet.gpts.length - 5} more GPTs
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Deploy Button */}
                  <button
                    onClick={() => {
                      const objective = prompt(`Enter mission objective for ${fleet.name}:`);
                      if (objective) {
                        deployFleet(fleet.category, objective);
                      }
                    }}
                    disabled={isDeployed}
                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                      isDeployed
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                    }`}
                  >
                    {isDeployed ? (
                      <>
                        <CheckCircle className="inline-block h-4 w-4 mr-2" />
                        Deployed
                      </>
                    ) : (
                      <>
                        <Play className="inline-block h-4 w-4 mr-2" />
                        Deploy Fleet
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

