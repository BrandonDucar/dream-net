import { useState, useEffect } from "react";
import { Zap, Bot, Shield, Eye, Cloud, Train, Dna, Brain, Network, Settings } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface BiomimeticSystem {
  id: string;
  name: string;
  description: string;
  status: "active" | "documented" | "pending";
  endpoints: string[];
  ui: string | null;
}

export default function BiomimeticSystemsHub() {
  const [systems, setSystems] = useState<BiomimeticSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/biomimetic/systems`);
      if (!res.ok) throw new Error("Failed to fetch systems");
      const data = await res.json();
      setSystems(data.systems || []);
    } catch (error) {
      console.error("Failed to fetch systems:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSystemIcon = (id: string) => {
    const icons: Record<string, JSX.Element> = {
      swarm: <Network className="h-6 w-6" />,
      connector: <Bot className="h-6 w-6" />,
      nano: <Zap className="h-6 w-6" />,
      snail: <Shield className="h-6 w-6" />,
      octopus: <Brain className="h-6 w-6" />,
      chameleon: <Settings className="h-6 w-6" />,
      "wolf-pack": <Eye className="h-6 w-6" />,
      "falcon-eye": <Eye className="h-6 w-6" />,
      "zen-garden": <Cloud className="h-6 w-6" />,
      "dream-clouds": <Cloud className="h-6 w-6" />,
      "magnetic-rail": <Train className="h-6 w-6" />,
      "triple-helix": <Dna className="h-6 w-6" />,
    };
    return icons[id] || <Bot className="h-6 w-6" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "documented":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading biomimetic systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Biomimetic Systems Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            DreamNet models organizational behavior after living organisms. Each system maps to active modules in the ecosystem.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <span className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {systems.filter(s => s.status === "active").length} Active
            </span>
            <span className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {systems.filter(s => s.status === "documented").length} Documented
            </span>
            <span className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
              {systems.length} Total Systems
            </span>
          </div>
        </div>

        {/* Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((system) => (
            <div
              key={system.id}
              className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-black/10 p-6 hover:border-cyan-500/50 transition-all cursor-pointer"
              onClick={() => system.ui && (window.location.href = system.ui)}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                    system.status
                  )}`}
                >
                  {system.status}
                </span>
              </div>

              {/* Icon */}
              <div className="mb-4 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                {getSystemIcon(system.id)}
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold mb-2">{system.name}</h3>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{system.description}</p>

              {/* Endpoints */}
              {system.endpoints.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Endpoints:</p>
                  <div className="space-y-1">
                    {system.endpoints.slice(0, 2).map((endpoint, idx) => (
                      <code
                        key={idx}
                        className="block text-xs text-cyan-400/80 bg-black/30 px-2 py-1 rounded truncate"
                      >
                        {endpoint}
                      </code>
                    ))}
                    {system.endpoints.length > 2 && (
                      <p className="text-xs text-gray-500">+{system.endpoints.length - 2} more</p>
                    )}
                  </div>
                </div>
              )}

              {/* Action */}
              {system.ui ? (
                <div className="flex items-center gap-2 text-sm text-cyan-400 group-hover:text-cyan-300">
                  <span>Open Dashboard</span>
                  <span>→</span>
                </div>
              ) : (
                <div className="text-sm text-gray-500">UI coming soon</div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/snail"
            className="rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6 hover:border-cyan-400 transition-all"
          >
            <Shield className="h-8 w-8 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Dream Snail</h3>
            <p className="text-sm text-gray-300">
              Know-all win-all privacy layer with verifiable provenance trails
            </p>
          </a>

          <a
            href="/biomimetic/swarm"
            className="rounded-2xl border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 hover:border-purple-400 transition-all"
          >
            <Network className="h-8 w-8 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold text-purple-400 mb-2">Swarm Coordinator</h3>
            <p className="text-sm text-gray-300">
              Distributed foraging, division of labor, adaptive routing
            </p>
          </a>

          <a
            href="/biomimetic/connector"
            className="rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 hover:border-blue-400 transition-all"
          >
            <Bot className="h-8 w-8 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-blue-400 mb-2">Connector Bot</h3>
            <p className="text-sm text-gray-300">
              Intelligent task routing and bot orchestration
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}






