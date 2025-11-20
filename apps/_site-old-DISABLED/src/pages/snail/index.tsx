import { useState, useEffect } from "react";
import { Shield, Lock, Eye, TrendingUp, AlertTriangle, CheckCircle, Key } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface SnailTrail {
  id: string;
  eventType: string;
  timestamp: string;
  metadata: {
    source: string;
    privacyLevel: "public" | "private" | "encrypted" | "zero-knowledge";
  };
}

interface SnailInsight {
  id: string;
  insightType: "pattern" | "anomaly" | "recommendation" | "privacy-alert";
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  actionable: boolean;
  actionUrl?: string;
}

interface PrivacyConfig {
  encryptionEnabled: boolean;
  zeroKnowledgeEnabled: boolean;
  allowAnalytics: boolean;
  allowTracking: boolean;
  shareWithAgents: string[];
}

export default function DreamSnailPage() {
  const [trails, setTrails] = useState<SnailTrail[]>([]);
  const [insights, setInsights] = useState<SnailInsight[]>([]);
  const [config, setConfig] = useState<PrivacyConfig | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId] = useState("user-1"); // TODO: Get from auth

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [trailsRes, insightsRes, configRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE}/api/snail/trail?userId=${userId}`),
        fetch(`${API_BASE}/api/snail/insights?userId=${userId}`),
        fetch(`${API_BASE}/api/snail/privacy?userId=${userId}`),
        fetch(`${API_BASE}/api/snail/analytics?userId=${userId}`),
      ]);

      if (trailsRes.ok) {
        const data = await trailsRes.json();
        setTrails(data.trails || []);
      }

      if (insightsRes.ok) {
        const data = await insightsRes.json();
        setInsights(data.insights || []);
      }

      if (configRes.ok) {
        const data = await configRes.json();
        setConfig(data.config);
      }

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Failed to fetch snail data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePrivacyConfig = async (updates: Partial<PrivacyConfig>) => {
    try {
      const res = await fetch(`${API_BASE}/api/snail/privacy`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...updates }),
      });

      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
      }
    } catch (error) {
      console.error("Failed to update privacy config:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const getPrivacyLevelColor = (level: string) => {
    switch (level) {
      case "encrypted":
        return "text-emerald-400";
      case "zero-knowledge":
        return "text-purple-400";
      case "private":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Dream Snail...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06060a] via-[#0a0a12] to-[#06060a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <Shield className="h-16 w-16 text-cyan-400 mx-auto" />
          </div>
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Dream Snail
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Know-All Win-All Privacy Layer. Verifiable provenance trails, encrypted data, zero-knowledge proofs.
          </p>
        </div>

        {/* Analytics Dashboard */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{analytics.totalTrails}</div>
              <div className="text-sm text-gray-400">Total Trails</div>
            </div>
            <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">{analytics.privacyScore}</div>
              <div className="text-sm text-gray-400">Privacy Score</div>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 p-6">
              <div className="text-3xl font-bold text-emerald-400 mb-2">{analytics.insightsCount}</div>
              <div className="text-sm text-gray-400">Active Insights</div>
            </div>
            <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 p-6">
              <div className="text-sm font-semibold text-blue-400 mb-2">Most Active</div>
              <div className="text-xs text-gray-400">{analytics.mostActiveDay}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Privacy Configuration */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-black/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="h-6 w-6 text-cyan-400" />
                <h2 className="text-xl font-bold">Privacy Settings</h2>
              </div>

              {config && (
                <div className="space-y-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-300">Encryption</span>
                    <input
                      type="checkbox"
                      checked={config.encryptionEnabled}
                      onChange={(e) => updatePrivacyConfig({ encryptionEnabled: e.target.checked })}
                      className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyan-400 focus:ring-cyan-400"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-300">Zero-Knowledge</span>
                    <input
                      type="checkbox"
                      checked={config.zeroKnowledgeEnabled}
                      onChange={(e) => updatePrivacyConfig({ zeroKnowledgeEnabled: e.target.checked })}
                      className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyan-400 focus:ring-cyan-400"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-300">Allow Analytics</span>
                    <input
                      type="checkbox"
                      checked={config.allowAnalytics}
                      onChange={(e) => updatePrivacyConfig({ allowAnalytics: e.target.checked })}
                      className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyan-400 focus:ring-cyan-400"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-gray-300">Allow Tracking</span>
                    <input
                      type="checkbox"
                      checked={config.allowTracking}
                      onChange={(e) => updatePrivacyConfig({ allowTracking: e.target.checked })}
                      className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-cyan-400 focus:ring-cyan-400"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Insights */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-black/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-bold">Privacy Insights</h2>
              </div>

              <div className="space-y-4">
                {insights.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-emerald-400" />
                    <p>No insights yet. Your privacy trail is clean!</p>
                  </div>
                ) : (
                  insights.map((insight) => (
                    <div
                      key={insight.id}
                      className={`rounded-xl border p-4 ${getSeverityColor(insight.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{insight.title}</h3>
                        <span className="text-xs uppercase">{insight.severity}</span>
                      </div>
                      <p className="text-sm mb-3 opacity-90">{insight.description}</p>
                      {insight.actionable && insight.actionUrl && (
                        <a
                          href={insight.actionUrl}
                          className="text-xs underline hover:no-underline"
                        >
                          Take action →
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Trail History */}
        <div className="mt-6">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-black/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-cyan-400" />
              <h2 className="text-xl font-bold">Trail History</h2>
              <span className="text-sm text-gray-400">({trails.length} events)</span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {trails.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No trails recorded yet.</p>
                </div>
              ) : (
                trails.slice(0, 50).map((trail) => (
                  <div
                    key={trail.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-white/5 hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Key className={`h-4 w-4 ${getPrivacyLevelColor(trail.metadata.privacyLevel)}`} />
                      <div>
                        <div className="text-sm font-semibold">{trail.eventType}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(trail.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${getPrivacyLevelColor(
                        trail.metadata.privacyLevel
                      )} bg-black/30`}
                    >
                      {trail.metadata.privacyLevel}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






