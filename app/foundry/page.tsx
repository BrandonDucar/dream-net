import { Hero } from "../(marketing)/components/Hero";
import { SiteShell } from "../(marketing)/components/SiteShell";
import { StatsStrip } from "../(marketing)/components/StatsStrip";
import { getFoundrySummaries } from "../../lib/marketing/metrics";

export const metadata = {
  title: "Atlas Agent Foundry | DreamNet",
  description: "Atlas Agent Foundry hybridizes DreamNet agents into new mission-ready specialists.",
};

export default async function FoundryPage() {
  const { traits, hybrids } = await getFoundrySummaries();

  const stats = [
    { label: "Traits Logged", value: String(traits.length), caption: "Latest telemetry ingestions" },
    { label: "Hybrids Proposed", value: String(hybrids.length), caption: "Awaiting mission validation" },
    { label: "Atlas Core", value: "Live", caption: "StarBridge-linked Foundry runtime" },
  ];

  return (
    <SiteShell>
      <div className="space-y-16">
        <Hero
          title="Atlas Agent Foundry — hybridize, iterate, deploy."
          subtitle="Foundry ingests agent telemetry, extracts traits, and proposes new hybrid specialists ready for DreamNet missions."
          primaryCta={{ label: "Submit Telemetry", href: "/api/foundry/traits" }}
          secondaryCta={{ label: "Propose a Hybrid", href: "/api/foundry/hybridize" }}
        />

        <StatsStrip stats={stats} />

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">Trait registry</h2>
          <p className="mt-2 text-sm text-white/70">
            Every ingestion captures a trait vector from an existing agent—governing patterns, mission skills, telemetry fingerprints. These form the genetic material for new hybrids.
          </p>
          <div className="mt-6 overflow-auto">
            <table className="min-w-full divide-y divide-white/10 text-sm text-white/70">
              <thead className="text-white/60">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Trait</th>
                  <th className="px-4 py-2 text-left font-semibold">Source</th>
                  <th className="px-4 py-2 text-left font-semibold">Vector size</th>
                  <th className="px-4 py-2 text-left font-semibold">Captured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {traits.length > 0 ? (
                  traits.map((trait: any) => (
                    <tr key={trait.id}>
                      <td className="px-4 py-2">{trait.name}</td>
                      <td className="px-4 py-2">{trait.source}</td>
                      <td className="px-4 py-2">{trait.vector?.length ?? 0}</td>
                      <td className="px-4 py-2 text-white/50">
                        {trait.createdAt ? new Date(trait.createdAt).toLocaleString() : "Recently"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-6 text-center text-white/50" colSpan={4}>
                      No traits ingested yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">Hybrid lineage</h2>
          <p className="mt-2 text-sm text-white/70">
            Hybrids blend parent traits to create new mission archetypes. The lineage graph below shows which traits combined to form each proposal.
          </p>
          <div className="mt-6 grid gap-4 text-sm text-white/70">
            {hybrids.length > 0 ? (
              hybrids.map((hybrid: any) => (
                <div key={hybrid.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
                  <div className="text-white/90 text-lg font-semibold">{hybrid.name}</div>
                  <div className="mt-2 text-xs uppercase tracking-widest text-white/40">
                    Parents: {Array.isArray(hybrid.parents) && hybrid.parents.length > 0 ? hybrid.parents.join(", ") : "Unspecified"}
                  </div>
                  {hybrid.notes ? <p className="mt-3 text-white/70">{hybrid.notes}</p> : null}
                  <div className="mt-3 flex items-center gap-4 text-xs text-white/50">
                    <span>Score: {hybrid.score ?? 0}</span>
                    <span>{hybrid.createdAt ? new Date(hybrid.createdAt).toLocaleString() : "Recently"}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 text-center text-white/50">
                No hybrids proposed yet. Submit telemetry to seed the first Atlas creations.
              </div>
            )}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
