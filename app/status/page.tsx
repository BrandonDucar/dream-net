import { SiteShell } from "../(marketing)/components/SiteShell";
import { getMarketingMetrics } from "../../lib/marketing/metrics";

export const metadata = {
  title: "DreamNet Status",
  description: "Snapshot of DreamNet system health, agent roster, and recent autonomous runs.",
};

export default async function StatusPage() {
  const metrics = await getMarketingMetrics();

  return (
    <SiteShell>
      <div className="space-y-12">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-3xl font-semibold text-white">System Health</h1>
          <p className="mt-2 text-sm text-white/60">Updated {metrics.health?.timestamp ? new Date(metrics.health.timestamp).toLocaleString() : "recently"}</p>
          <dl className="mt-6 grid gap-4 text-sm text-white/70 sm:grid-cols-2">
            <div>
              <dt className="text-white/50">Status</dt>
              <dd className="text-lg font-semibold text-white">{metrics.health?.status ?? "Operational"}</dd>
            </div>
            <div>
              <dt className="text-white/50">Uptime</dt>
              <dd className="text-lg font-semibold text-white">{metrics.health?.uptime ?? "99.99%"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">Active Agents</h2>
          <ul className="mt-6 grid gap-4 text-sm text-white/70 sm:grid-cols-2">
            {metrics.agents.map((agent) => (
              <li key={agent.name} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="text-white/90">{agent.name}</div>
                {agent.role ? <div className="text-xs uppercase tracking-widest text-white/40">{agent.role}</div> : null}
                {agent.status ? <div className="mt-1 text-xs text-white/50">Status: {agent.status}</div> : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">Recent Runs</h2>
          <ul className="mt-6 space-y-4 text-sm text-white/70">
            {metrics.runs.map((run) => (
              <li key={run.id ?? run.name}>
                <div className="text-white/90">{run.name ?? "Autonomous mission"}</div>
                <div className="text-xs uppercase tracking-widest text-white/40">
                  {run.status ?? "complete"} • {run.startedAt ? new Date(run.startedAt).toLocaleString() : "recent"}
                </div>
              </li>
            ))}
            {metrics.runs.length === 0 ? <li>No runs recorded yet.</li> : null}
          </ul>
        </section>
      </div>
    </SiteShell>
  );
}
