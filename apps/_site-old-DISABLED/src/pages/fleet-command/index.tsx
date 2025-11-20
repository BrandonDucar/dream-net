import { useState, useEffect } from "react";
import { Ship, Shield, Plane, Tv, FlaskConical, Play, Pause, CheckCircle, AlertCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Fleet {
  id: string;
  type: "aegis" | "travel" | "ott" | "science";
  name: string;
  description: string;
  agents: Array<{
    id: string;
    agentKey: string;
    name: string;
    role: string;
    status: string;
  }>;
  mission: string | null;
  status: "active" | "standby" | "deployed";
}

interface FleetMission {
  id: string;
  fleetId: string;
  type: string;
  objective: string;
  status: string;
  startedAt: string;
}

export default function FleetCommand() {
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [activeMissions, setActiveMissions] = useState<FleetMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState<string | null>(null);

  useEffect(() => {
    fetchFleets();
    fetchActiveMissions();
    const interval = setInterval(() => {
      fetchFleets();
      fetchActiveMissions();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchFleets = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/fleets`);
      if (!res.ok) throw new Error("Failed to fetch fleets");
      const data = await res.json();
      setFleets(data.fleets || []);
    } catch (err) {
      console.error("Failed to fetch fleets:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveMissions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/fleets/missions/active`);
      if (!res.ok) return;
      const data = await res.json();
      setActiveMissions(data.missions || []);
    } catch (err) {
      console.error("Failed to fetch missions:", err);
    }
  };

  const deployFleet = async (type: string, objective: string) => {
    setDeploying(type);
    try {
      const res = await fetch(`${API_BASE}/api/fleets/${type}/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective }),
      });
      if (!res.ok) throw new Error("Failed to deploy fleet");
      await fetchFleets();
      await fetchActiveMissions();
    } catch (err) {
      console.error("Failed to deploy fleet:", err);
      alert(`Failed to deploy ${type} fleet: ${(err as Error).message}`);
    } finally {
      setDeploying(null);
    }
  };

  const getFleetIcon = (type: string) => {
    switch (type) {
      case "aegis": return <Shield className="h-8 w-8 text-blue-400" />;
      case "travel": return <Plane className="h-8 w-8 text-cyan-400" />;
      case "ott": return <Tv className="h-8 w-8 text-purple-400" />;
      case "science": return <FlaskConical className="h-8 w-8 text-emerald-400" />;
      default: return <Ship className="h-8 w-8 text-gray-400" />;
    }
  };

  const getFleetGradient = (type: string) => {
    switch (type) {
      case "aegis": return "from-blue-600 to-indigo-600";
      case "travel": return "from-cyan-600 to-blue-600";
      case "ott": return "from-purple-600 to-pink-600";
      case "science": return "from-emerald-600 to-teal-600";
      default: return "from-gray-600 to-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Ship className="h-10 w-10 text-cyan-400" />
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Fleet Command
            </h1>
          </div>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Command specialized agent fleets for defense, deployment, content, and research missions
          </p>
        </div>

        {/* Active Missions */}
        {activeMissions.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl border border-cyan-500/30 p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Play className="h-6 w-6 text-cyan-400" />
              Active Missions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMissions.map((mission) => (
                <div
                  key={mission.id}
                  className="bg-gray-900/50 rounded-xl border border-cyan-500/30 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-cyan-400 uppercase">
                      {mission.type} Fleet
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-300">
                      Active
                    </span>
                  </div>
                  <p className="text-white font-semibold mb-1">{mission.objective}</p>
                  <p className="text-xs text-gray-400">
                    Started {new Date(mission.startedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fleets Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading fleets...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fleets.map((fleet) => {
              const isDeployed = fleet.status === "deployed";
              const isDeploying = deploying === fleet.type;

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
                      {getFleetIcon(fleet.type)}
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                          {fleet.name}
                        </h3>
                        <p className="text-sm text-gray-400">{fleet.description}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isDeployed
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : fleet.status === "active"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                      }`}
                    >
                      {fleet.status}
                    </span>
                  </div>

                  {/* Active Mission */}
                  {fleet.mission && (
                    <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                      <p className="text-sm font-semibold text-cyan-400 mb-1">Active Mission</p>
                      <p className="text-white">{fleet.mission}</p>
                    </div>
                  )}

                  {/* Agents */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                      Fleet Agents ({fleet.agents.length})
                    </p>
                    <div className="space-y-2">
                      {fleet.agents.map((agent) => (
                        <div
                          key={agent.id}
                          className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">{agent.name}</p>
                            <p className="text-xs text-gray-400">{agent.role}</p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              agent.status === "deployed"
                                ? "bg-cyan-500/20 text-cyan-300"
                                : agent.status === "active"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {agent.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deploy Button */}
                  <button
                    onClick={() => {
                      const objective = prompt(`Enter mission objective for ${fleet.name}:`);
                      if (objective) {
                        deployFleet(fleet.type, objective);
                      }
                    }}
                    disabled={isDeployed || isDeploying}
                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                      isDeployed
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : `bg-gradient-to-r ${getFleetGradient(fleet.type)} hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]`
                    }`}
                  >
                    {isDeploying ? (
                      "Deploying..."
                    ) : isDeployed ? (
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

        {/* Fleet Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 rounded-xl border border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">{fleets.length}</div>
            <div className="text-sm text-gray-400">Total Fleets</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl border border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">
              {fleets.reduce((sum, f) => sum + f.agents.length, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Agents</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl border border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{activeMissions.length}</div>
            <div className="text-sm text-gray-400">Active Missions</div>
          </div>
          <div className="bg-gray-900/50 rounded-xl border border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {fleets.filter(f => f.status === "deployed").length}
            </div>
            <div className="text-sm text-gray-400">Deployed Fleets</div>
          </div>
        </div>
      </div>
    </div>
  );
}

