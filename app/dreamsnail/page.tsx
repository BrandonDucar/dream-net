import { Hero } from "../(marketing)/components/Hero";
import { SiteShell } from "../(marketing)/components/SiteShell";
import { StatsStrip } from "../(marketing)/components/StatsStrip";
import { getDreamstarMissions, getFoundrySummaries, getMarketingMetrics } from "../../lib/marketing/metrics";

export const metadata = {
  title: "DreamSnail – Privacy Trails & Triple-Helix NFTs | DreamNet",
  description:
    "DreamSnail NFTs combine triple-helix identity, Fibonacci rarity, and zk-proven slime trails so collectors prove activity without revealing wallets.",
};

const rarityTiers = [
  { tier: "Tier 1-5", detail: "Standard shells • classic glow" },
  { tier: "Tier 8-55", detail: "Accent palettes • dense twists • halo variants" },
  { tier: "Tier 89-377", detail: "Iridescent shaders • zk badges at mint" },
  { tier: "Tier 610+", detail: "Legendary triple helix • audio-reactive aura" },
];

export default async function DreamSnailPage() {
  const [metrics, missions, foundry] = await Promise.all([
    getMarketingMetrics(),
    getDreamstarMissions(),
    getFoundrySummaries(),
  ]);
  const stats = [
    { label: "Trail Commitments", value: "Poseidon", caption: "Merkle + zk verified" },
    { label: "Rarity Model", value: "Fibonacci", caption: "Supply-balanced tiers" },
    { label: "Deploy Target", value: "Base L2", caption: "Low cost, high throughput" },
  ];

  return (
    <SiteShell>
      <div className="space-y-16">
        <Hero
          title="DreamSnail — zk trails with legendary biomimicry."
          subtitle="Every DreamSnail blends triple-helix art, Fibonacci rarity, and privacy-preserving activity trails. Prove journeys, unlock perks, never expose your wallet."
          primaryCta={{ label: "Join the Trailblazer List", href: "/contact" }}
        />

        <StatsStrip stats={stats} />

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">How the slime trail works</h2>
          <ol className="mt-6 space-y-5 text-sm leading-relaxed text-white/70">
            <li>
              <strong className="text-white">Commit</strong> — each event is hashed with Poseidon and appended to TrailCommit&apos;s Merkle tree.
            </li>
            <li>
              <strong className="text-white">Prove</strong> — zk circuits (`trail.circom`, `viewkey.circom`) prove membership or viewing privileges without revealing the event.
            </li>
            <li>
              <strong className="text-white">Unlock</strong> — verified proofs mint on-chain badges, airdrops, or DreamStar stem access via Royalty Flow Nexus.
            </li>
          </ol>
          <p className="mt-6 text-sm text-white/60">
            Viewers see beautiful trails and proof chips. Owners stay anonymous unless they share their viewing key.
          </p>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold text-white">Triple-helix identity</h2>
            <p className="mt-4 text-sm text-white/70">
              Helix geometry is derived from snailDNA = keccak256(minterAddr || salt || VRF). Radii, phase offsets, and twist density drive both the visual shader and the compact `HelixSig` stored on-chain.
            </p>
            <p className="mt-4 text-sm text-white/70">
              GPU shaders render the helix in real time, while CPU fallback produces deterministic SVGs. Helix glow can sync with StarBridge heartbeat for live installations.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold text-white">Fibonacci rarity tiers</h2>
            <ul className="mt-6 space-y-3 text-sm text-white/70">
              {rarityTiers.map((item) => (
                <li key={item.tier}>
                  <span className="font-semibold text-white">{item.tier}</span> — {item.detail}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">Launch sequence</h2>
          <ol className="mt-6 space-y-4 text-sm text-white/70">
            <li>Deploy TrailCommit, DreamSnail, Verifier contracts on Base testnet.</li>
            <li>Mint developer set, validate circuits and UI trail proofs.</li>
            <li>Lock rarity tiers, pin helix assets, publish DreamSnail explorer.</li>
            <li>Mainnet launch with gated mint, VRF reveals, and weekly Trail Challenges.</li>
          </ol>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">Cross-ecosystem hooks</h2>
          <p className="mt-4 text-sm text-white/70">
            DreamSnail trails unlock DreamStar stems, DreamOps missions, and Atlas experiences once zk badges verify the owner&apos;s footprint. Everything is logged back through StarBridge for autonomous rewards.
          </p>
          <div className="mt-6 grid gap-6 text-sm text-white/70 lg:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">DreamStar Crossovers</h3>
              <ul className="mt-3 space-y-2">
                {missions.ingestions.slice(0, 5).map((mission: any) => (
                  <li key={mission.id}>
                    {mission.artist} — {mission.project} <span className="text-white/50">({mission.status ?? "pending"})</span>
                  </li>
                ))}
                {missions.ingestions.length === 0 ? <li>No DreamStar missions logged yet.</li> : null}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">Foundry Traits Referenced</h3>
              <ul className="mt-3 space-y-2">
                {foundry.traits.slice(0, 5).map((trait: any) => (
                  <li key={trait.id}>
                    {trait.name} <span className="text-white/50">({trait.source})</span>
                  </li>
                ))}
                {foundry.traits.length === 0 ? <li>No Foundry traits ingested yet.</li> : null}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
