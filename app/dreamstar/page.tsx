import { Hero } from "../(marketing)/components/Hero";
import { SiteShell } from "../(marketing)/components/SiteShell";
import { StatsStrip } from "../(marketing)/components/StatsStrip";
import { VerticalHighlights } from "../(marketing)/components/VerticalHighlights";
import { getMarketingMetrics } from "../../lib/marketing/metrics";

export const metadata = {
  title: "DreamStar – AI-Assisted Originals | DreamNet",
  description:
    "DreamStar lets artists train DreamNet on their inspirations to produce 100% original, royalty-ready tracks with audit trails and DreamVault provenance.",
};

export default async function DreamStarPage() {
  const metrics = await getMarketingMetrics();
  const stats = [
    { label: "Influence Profiles", value: "3,200+", caption: "Multi-genre feature banks" },
    { label: "Average Turnaround", value: "14 min", caption: "Spec-to-master with DreamForge" },
    { label: "Royalty Tracking", value: "Integrated", caption: "Powered by Royalty Flow Nexus" },
  ];

  const crosslinks = [
    {
      name: "DreamSnail",
      description: "Privacy-first NFTs to unlock DreamStar stems with zk trail proofs.",
      href: "/dreamsnail",
      accent: "linear-gradient(135deg, #F73D9B, #5CFFED)",
    },
    {
      name: "Royalty Flow Nexus",
      description: "Revenue and rights accounting spine wired into DreamStar releases.",
      href: "/metals",
      accent: "linear-gradient(135deg, #E0B857, #FFEDC2)",
    },
  ];

  return (
    <SiteShell>
      <div className="space-y-16">
        <Hero
          title="DreamStar — train on your influences, release originals."
          subtitle="Upload what inspires you. DreamStar maps harmonic DNA, orchestrates an ensemble of generative models, and delivers royalty-ready masters anchored to DreamVault provenance."
          primaryCta={{ label: "Request a Studio Session", href: "/contact" }}
        />

        <StatsStrip stats={stats} />

        <section className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold text-white">Full-cycle creative pipeline</h2>
            <ol className="mt-4 space-y-4 text-sm leading-relaxed text-white/70">
              <li>
                <strong className="text-white">Ingestion & Analysis</strong> — playlists, stems, or catalog archives are fingerprinted in DreamVault and modeled via ChronoCache.
              </li>
              <li>
                <strong className="text-white">Generative Ensemble</strong> — transformer + diffusion + audio VAE blend influence vectors into brand-new compositions.
              </li>
              <li>
                <strong className="text-white">Artist Curation</strong> — review multiple takes, request variations, tag favorites, and approve final masters.
              </li>
              <li>
                <strong className="text-white">Release & Royalties</strong> — exports route through Creamer distribution while Royalty Flow Nexus tracks downstream splits.
              </li>
            </ol>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold text-white">Governed autonomy</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Each DreamStar mission is budgeted through the Compute Governor, scheduled via Daemon jobs, and audited on StarBridge. Trigger proofs link every take back to DreamVault fingerprints to guarantee originality.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              DreamNet’s agent mesh coordinates creative ops, quality guardrails, and release handoffs without manual babysitting—while still giving artists the final say.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">Recent DreamStar missions</h2>
          <ul className="mt-6 space-y-4 text-sm text-white/70">
            {metrics.runs
              .filter((run) => run.name?.toLowerCase().includes("dreamstar"))
              .map((run) => (
                <li key={run.id ?? run.name}>
                  <div className="text-white/90">{run.name}</div>
                  <div className="text-xs uppercase tracking-widest text-white/40">
                    {run.status ?? "complete"} • {run.startedAt ? new Date(run.startedAt).toLocaleString() : "Recently"}
                  </div>
                </li>
              ))}
            {metrics.runs.filter((run) => run.name?.toLowerCase().includes("dreamstar")).length === 0 ? (
              <li>No DreamStar-specific missions logged yet. Studio pilot is staging.</li>
            ) : null}
          </ul>
        </section>

        <VerticalHighlights verticals={crosslinks} />
      </div>
    </SiteShell>
  );
}
