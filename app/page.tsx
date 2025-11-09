import { Hero } from "./(marketing)/components/Hero";
import { SiteShell } from "./(marketing)/components/SiteShell";
import { StatsStrip } from "./(marketing)/components/StatsStrip";
import { VerticalHighlights } from "./(marketing)/components/VerticalHighlights";
import { getMarketingMetrics } from "../lib/marketing/metrics";

export const metadata = {
  title: "DreamNet – Autonomous Intelligence Platform",
  description:
    "DreamNet builds, deploys, and governs autonomous systems spanning creative, privacy, and finance verticals. Explore DreamStar, DreamSnail, and Precious Metals Intelligence.",
};

export default async function MarketingHome() {
  const metrics = await getMarketingMetrics();

  const stats = [
    {
      label: "System Status",
      value: metrics.health?.status?.toUpperCase() ?? "OPERATIONAL",
      caption: metrics.health?.uptime ? `Uptime ${metrics.health.uptime}` : undefined,
    },
    {
      label: "Agents Active",
      value: String(metrics.agents.length),
      caption: metrics.agents.slice(0, 2).map((agent) => agent.name).join(" • ") || "Atlas Agent Foundry • DreamForge",
    },
    {
      label: "Latest Mission",
      value: metrics.runs[0]?.name ?? "DreamStar Studio Pilot",
      caption: metrics.runs[0]?.status ? `Status: ${metrics.runs[0].status}` : undefined,
    },
  ];

  const verticals = [
    {
      name: "DreamStar",
      description: "Artist-trained AI music engine that transforms influence catalogs into fully original, releasable tracks.",
      href: "/dreamstar",
      accent: "linear-gradient(135deg, #7755FF, #2FD3FF)",
      badge: "AI Music",
    },
    {
      name: "DreamSnail",
      description: "Triple-helix NFTs with zk-proven slime trails, Fibonacci rarity, and privacy-native unlocks.",
      href: "/dreamsnail",
      accent: "linear-gradient(135deg, #F73D9B, #5CFFED)",
      badge: "Privacy NFTs",
    },
    {
      name: "Foundry",
      description: "Atlas Agent Foundry hybridizes agents, traits, and telemetry into new mission-ready specialists.",
      href: "/foundry",
      accent: "linear-gradient(135deg, #4E9BFF, #8D66FF)",
      badge: "Hybrid Lab",
    },
    {
      name: "Precious Metals Intelligence",
      description: "Real-time metals signals, compliance automation, and treasury intelligence for institutional buyers.",
      href: "/metals",
      accent: "linear-gradient(135deg, #E0B857, #FFEDC2)",
      badge: "Enterprise",
    },
  ];

  const changelog = metrics.changelog;

  return (
    <SiteShell>
      <div className="space-y-16">
        <Hero
          title="Autonomous systems that evolve while you sleep."
          subtitle="DreamNet is a biomimetic intelligence platform spanning agents, governance, and live revenue verticals. Watch it build, heal, and deploy itself in real time."
          primaryCta={{ label: "Schedule a Mission Briefing", href: "/contact" }}
          secondaryCta={{ label: "View Live Status", href: "/status" }}
        />

        <StatsStrip stats={stats} />

        <VerticalHighlights verticals={verticals} />

        <section className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold text-white">Governance Spine</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Compute Governor, Daemon orchestration, and StarBridge event mesh keep DreamNet cost-aware, compliant, and responsive. Manual overrides include throttle presets, emergency stop, and budget relays.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/70">
              <li>• Compute Governor – live credit ledger, throttles, emergency brake</li>
              <li>• Daemon Engine – mission scheduling with budget fences</li>
              <li>• StarBridge – high-trust pub/sub linking agents, UI, and deploy pipelines</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold text-white">Recent Autonomous Activity</h2>
            <ul className="mt-4 space-y-4 text-sm text-white/70">
              {metrics.runs.length > 0
                ? metrics.runs.map((run) => (
                    <li key={run.id ?? run.name}>
                      <div className="text-white/90">{run.name ?? "Autonomous mission"}</div>
                      <div className="text-xs uppercase tracking-wide text-white/50">
                        {run.status ?? "complete"} • {run.startedAt ? new Date(run.startedAt).toLocaleString() : "Recently"}
                      </div>
                    </li>
                  ))
                : (
                  <li>No missions recorded yet. DreamNet is warming up.</li>
                )}
            </ul>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">Latest Updates</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {changelog.map((entry) => (
              <div key={`${entry.date}-${entry.message}`} className="rounded-2xl border border-white/5 bg-slate-900/40 p-4">
                <div className="text-xs uppercase tracking-widest text-white/40">{entry.date}</div>
                <p className="mt-2 text-sm text-white/80">{entry.message}</p>
              </div>
            ))}
            {changelog.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-4 text-sm text-white/60">
                No updates logged yet. DreamNet is compiling mission reports.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
