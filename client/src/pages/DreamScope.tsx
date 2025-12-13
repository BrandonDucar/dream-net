/**
 * DreamScope Page
 * 
 * Live view of The Citadel (DreamNet strategic command center)
 */

import React, { useState, useEffect } from "react";

type CitadelState = {
  snapshot: any;
  dome: {
    report: any;
    commands: any[];
  };
  eventFabric: any;
  monitoring: any;
  dreamkeeper: {
    spec: any;
    protocols: any;
  };
  deploykeeper: {
    blueprint: any;
    infraPlan: any;
  };
  dataSpine: {
    spec: any;
    storagePlan: any;
    migrationRecommendations: any;
  };
  socialops: {
    spec: any;
    playbooks: any;
    guidelines: any;
  };
  masterPlan: {
    blueprint: any;
    roadmap: any;
    riskMatrix: any;
  };
  meta: {
    agentsRun: number[];
    errors: string[];
    timestamp: string;
  };
};

async function getCitadelState(): Promise<CitadelState> {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const res = await fetch(`${baseUrl}/api/citadel/state`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load Citadel state");
  }
  const data = await res.json();
  return data;
}

export default function DreamScopePage() {
  const [state, setState] = useState<CitadelState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadState() {
      try {
        setLoading(true);
        const citadelState = await getCitadelState();
        setState(citadelState);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load Citadel state");
        console.error("[DreamScope] Error loading state:", err);
      } finally {
        setLoading(false);
      }
    }

    loadState();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">DreamScope / The Citadel</h1>
          <p className="text-gray-400">Loading strategic intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !state) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">DreamScope / The Citadel</h1>
          <p className="text-red-400">Error: {error || "Failed to load state"}</p>
        </div>
      </div>
    );
  }

  const { snapshot, dome, eventFabric, dreamkeeper, masterPlan, meta } = state;

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <section>
          <h1 className="text-3xl font-bold mb-2">DreamScope / The Citadel</h1>
          <p className="text-sm text-gray-400">
            Live view of DreamNet&apos;s strategic brain.
          </p>
          <div className="mt-2 text-xs text-gray-500">
            Last updated: {new Date(meta.timestamp).toLocaleString()} | Agents run: {meta.agentsRun.join(", ") || "none"}
            {meta.errors.length > 0 && (
              <span className="text-red-400 ml-2">Errors: {meta.errors.length}</span>
            )}
          </div>
        </section>

        {/* Snapshot Meta */}
        <section className="border border-gray-700 rounded-lg p-4 space-y-2 bg-gray-800">
          <h2 className="text-xl font-semibold">Snapshot Meta</h2>
          {snapshot?.meta ? (
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-400">Version:</span> {snapshot.meta.version}</p>
              <p><span className="text-gray-400">Environment:</span> {snapshot.meta.environment}</p>
              <p><span className="text-gray-400">Created:</span> {new Date(snapshot.meta.created_at).toLocaleString()}</p>
              <pre className="text-xs bg-black/30 p-3 rounded overflow-x-auto mt-2">
                {JSON.stringify(snapshot.meta, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-gray-500">No snapshot data available</p>
          )}
        </section>

        {/* Services */}
        <section className="border border-gray-700 rounded-lg p-4 space-y-2 bg-gray-800">
          <h2 className="text-xl font-semibold">Services</h2>
          {snapshot?.domains?.services ? (
            <div className="space-y-2">
              {Object.entries(snapshot.domains.services).map(([key, service]: [string, any]) => (
                <div key={key} className="border-l-2 border-blue-500 pl-3">
                  <p className="font-medium">{service.id || key}</p>
                  <p className="text-sm text-gray-400">{service.type} - {service.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No services data available</p>
          )}
        </section>

        {/* Dome Health */}
        <section className="border border-gray-700 rounded-lg p-4 space-y-2 bg-gray-800">
          <h2 className="text-xl font-semibold">Dome Health</h2>
          {dome?.report ? (
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Overall health: </span>
                <span className={`font-bold ${
                  dome.report.overall_health === "stable" ? "text-green-400" :
                  dome.report.overall_health === "fragile" ? "text-yellow-400" :
                  dome.report.overall_health === "critical" ? "text-red-400" :
                  "text-gray-400"
                }`}>
                  {dome.report.overall_health || "unknown"}
                </span>
              </div>
              {dome.report.summary && (
                <p className="text-sm text-gray-300">{dome.report.summary}</p>
              )}
              {dome.report.risk_zones && dome.report.risk_zones.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Risk Zones ({dome.report.risk_zones.length})</h3>
                  <div className="space-y-2">
                    {dome.report.risk_zones.map((zone: any, idx: number) => (
                      <div key={idx} className="border-l-2 border-red-500 pl-3 bg-black/20 p-2 rounded">
                        <p className="font-medium text-sm">{zone.id}</p>
                        <p className="text-xs text-gray-400">{zone.severity} - {zone.category}</p>
                        <p className="text-xs text-gray-300 mt-1">{zone.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No dome report available</p>
          )}
        </section>

        {/* Event Families */}
        <section className="border border-gray-700 rounded-lg p-4 space-y-2 bg-gray-800">
          <h2 className="text-xl font-semibold">Event Families</h2>
          {eventFabric?.families ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">{eventFabric.families.length} families defined</p>
              {eventFabric.families.map((family: any, idx: number) => (
                <div key={idx} className="border-l-2 border-purple-500 pl-3">
                  <p className="font-medium text-sm">{family.id}</p>
                  <p className="text-xs text-gray-400">{family.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {family.events?.length || 0} events
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No event fabric data available</p>
          )}
        </section>

        {/* DreamKeeper */}
        <section className="border border-gray-700 rounded-lg p-4 space-y-2 bg-gray-800">
          <h2 className="text-xl font-semibold">DreamKeeper</h2>
          {dreamkeeper?.spec ? (
            <div className="space-y-3">
              {dreamkeeper.spec.health_bands && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Health Bands</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {dreamkeeper.spec.health_bands.map((band: any, idx: number) => (
                      <div key={idx} className="bg-black/20 p-2 rounded text-xs">
                        <span className="font-medium">{band.name}</span>
                        <span className="text-gray-400 ml-2">({band.range})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {dreamkeeper.spec.entities && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Monitored Entities</h3>
                  <p className="text-xs text-gray-400">{dreamkeeper.spec.entities.length} entity types</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No DreamKeeper data available</p>
          )}
        </section>

        {/* Master Plan */}
        {masterPlan?.blueprint && (
          <section className="border border-gray-700 rounded-lg p-4 space-y-2 bg-gray-800">
            <h2 className="text-xl font-semibold">Master Plan</h2>
            <pre className="text-xs bg-black/30 p-3 rounded overflow-x-auto">
              {JSON.stringify(masterPlan.blueprint, null, 2)}
            </pre>
          </section>
        )}

        {/* Raw JSON View (Collapsible) */}
        <details className="border border-gray-700 rounded-lg p-4 bg-gray-800">
          <summary className="cursor-pointer font-semibold">Raw JSON View</summary>
          <pre className="text-xs bg-black/30 p-3 rounded overflow-x-auto mt-2 max-h-96 overflow-y-auto">
            {JSON.stringify(state, null, 2)}
          </pre>
        </details>
      </div>
    </main>
  );
}

