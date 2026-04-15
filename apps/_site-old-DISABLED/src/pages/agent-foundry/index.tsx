import { useState, useEffect } from "react";
import { Sparkles, Hammer, Zap, Settings, Book, Search, Filter } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface AgentTemplate {
  slug: string;
  name: string;
  summary: string;
  capabilities: string[];
  scopes: string[];
  pricing: string;
  meta?: Record<string, unknown>;
}

interface FoundryRequest {
  id: string;
  organizationId: string;
  requestedAgentId: string;
  templateSlug?: string;
  capabilityMix?: Record<string, unknown>;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
}

export default function AgentFoundry() {
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [requests, setRequests] = useState<FoundryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchTemplates();
    fetchRequests();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/foundry/templates`);
      if (!res.ok) throw new Error("Failed to fetch templates");
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (err) {
      console.error("Failed to fetch templates:", err);
      setError("Failed to load agent templates");
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/foundry/builds`);
      if (!res.ok) return;
      const data = await res.json();
      setRequests(
        (data.builds || []).map((build: any) => ({
          id: build.id,
          organizationId: build.requestedBy,
          requestedAgentId: build.agentName,
          templateSlug: build.templateSlug,
          status: build.status,
          createdAt: build.createdAt,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Hammer className="h-10 w-10 text-cyan-400" />
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Agent Foundry
            </h1>
          </div>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Manufacture, customize, and deploy agents. Build your own agent from templates or create custom agents with specific capabilities.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search agent templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="operations">Operations</option>
            <option value="security">Security</option>
            <option value="productivity">Productivity</option>
            <option value="analytics">Analytics</option>
          </select>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-6 text-red-200">
            {error}
          </div>
        )}

        {/* Templates Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading agent templates...</div>
        ) : filteredTemplates.length === 0 ? (
          <div className="bg-gray-900/50 rounded-xl border border-white/10 p-12 text-center">
            <div className="text-5xl mb-4">🔨</div>
            <h3 className="text-xl font-semibold mb-2">No Templates Found</h3>
            <p className="text-gray-400">
              {searchQuery ? "Try a different search term" : "Agent templates will appear here"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredTemplates.map((template) => (
              <div
                key={template.slug}
                className="bg-gray-900/50 rounded-xl border border-white/10 p-6 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {template.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">{template.summary}</p>
                  </div>
                  <Sparkles className="h-6 w-6 text-purple-400 flex-shrink-0" />
                </div>

                {/* Capabilities */}
                {template.capabilities && template.capabilities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Capabilities</p>
                    <div className="flex flex-wrap gap-2">
                      {template.capabilities.map((cap, i) => (
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

                {/* Scopes */}
                {template.scopes && template.scopes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Scopes</p>
                    <div className="flex flex-wrap gap-2">
                      {template.scopes.slice(0, 3).map((scope, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded text-xs text-purple-300"
                        >
                          {scope}
                        </span>
                      ))}
                      {template.scopes.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-400">
                          +{template.scopes.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Pricing */}
                <div className="mb-4 pt-4 border-t border-gray-700/50">
                  <p className="text-sm font-semibold text-emerald-400">{template.pricing}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(`${API_BASE}/api/foundry/build`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            requestedBy: "user",
                            agentName: template.name,
                            templateSlug: template.slug,
                          }),
                        });
                        if (!res.ok) throw new Error("Failed to build agent");
                        const data = await res.json();
                        alert(`Agent build requested: ${data.agentName}`);
                        fetchRequests();
                      } catch (err) {
                        console.error("Failed to build agent:", err);
                        alert(`Failed to build agent: ${(err as Error).message}`);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
                  >
                    Create Agent
                  </button>
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                    <Book className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Requests */}
        {requests.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">My Agent Requests</h2>
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-gray-900/50 rounded-xl border border-white/10 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{request.requestedAgentId}</h3>
                      <p className="text-sm text-gray-400">
                        Created {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : request.status === "processing"
                          ? "bg-blue-500/20 text-blue-400"
                          : request.status === "failed"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Custom Agent CTA */}
        <div className="mt-12 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl border border-cyan-500/30 p-8 text-center">
          <Zap className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Need a Custom Agent?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Request a custom agent with specific capabilities tailored to your needs.
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-semibold hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all">
            Request Custom Agent
          </button>
        </div>
      </div>
    </div>
  );
}

