import { Hero } from "../(marketing)/components/Hero";
import { SiteShell } from "../(marketing)/components/SiteShell";
import { StatsStrip } from "../(marketing)/components/StatsStrip";
import { VerticalHighlights } from "../(marketing)/components/VerticalHighlights";
import { getDreamstarMissions, getMarketingMetrics } from "../../lib/marketing/metrics";

export const metadata = {
  title: "DreamStar – AI-Assisted Originals | DreamNet",
  description:
    "DreamStar lets artists train DreamNet on their inspirations to produce 100% original, royalty-ready tracks with audit trails and DreamVault provenance.",
};

export default async function DreamStarPage() {
  const metrics = await getMarketingMetrics();
  const missions = await getDreamstarMissions();
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
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white/50">Ingestion queue</h3>
              <ul className="mt-3 space-y-3 text-sm text-white/70">
                {missions.ingestions.length > 0 ? (
                  missions.ingestions.map((mission: any) => (
                    <li key={mission.id}>
                      <div className="text-white/90">
                        {mission.artist} — {mission.project}
                      </div>
                      <div className="text-xs uppercase tracking-widest text-white/40">
                        {mission.status ?? "pending"} •{" "}
                        {mission.createdAt ? new Date(mission.createdAt).toLocaleString() : "Recently"}
                      </div>
                    </li>
                  ))
                ) : (
                  <li>No ingestion missions logged yet.</li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white/50">Generation runs</h3>
              <ul className="mt-3 space-y-3 text-sm text-white/70">
                {missions.generations.length > 0 ? (
                  missions.generations.map((mission: any) => (
                    <li key={mission.id}>
                      <div className="text-white/90">
                        {mission.artist} — {mission.project}
                      </div>
                      <div className="text-xs uppercase tracking-widest text-white/40">
                        {mission.status ?? "pending"} •{" "}
                        {mission.createdAt ? new Date(mission.createdAt).toLocaleString() : "Recently"}
                      </div>
                    </li>
                  ))
                ) : (
                  <li>No generation runs recorded yet.</li>
                )}
              </ul>
            </div>
          </div>
        </section>

        <VerticalHighlights verticals={crosslinks} />
      </div>
    </SiteShell>
  );
}
