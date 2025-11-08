import { Hero } from "../(marketing)/components/Hero";
import { SiteShell } from "../(marketing)/components/SiteShell";
import { StatsStrip } from "../(marketing)/components/StatsStrip";

export const metadata = {
  title: "Precious Metals Intelligence | DreamNet",
  description:
    "DreamNet delivers real-time metals pricing, AI trading signals, and compliance automation for institutional buyers and treasury teams.",
};

const stats = [
  { label: "Price Feeds", value: "Real-time", caption: "Gold • Silver • Platinum • Palladium" },
  { label: "Signal Accuracy", value: "92%", caption: "Back-tested vs 2024 spot data" },
  { label: "Compliance", value: "Reg D / CF Ready", caption: "Auto-generated filings" },
];

const benefits = [
  {
    name: "Live Market Intelligence",
    detail: "Ingests MetalpriceAPI + on-chain liquidity to surface actionable desk alerts.",
  },
  {
    name: "Autonomous Deal Rooms",
    detail: "Daemon orchestrates outreach, follow-ups, and LOI prep within approved budget envelopes.",
  },
  {
    name: "Treasury Guardrails",
    detail: "Compute Governor enforces spend ceilings, while Royalty Flow Nexus reconciles counterparties.",
  },
];

export default function MetalsPage() {
  return (
    <SiteShell>
      <div className="space-y-16">
        <Hero
          title="Precious Metals Intelligence engineered for speed and compliance."
          subtitle="DreamNet fuses live market feeds with autonomous agents to source supply, qualify buyers, and execute deals under tight regulatory constraints."
          primaryCta={{ label: "Book a Treasury Review", href: "/contact" }}
        />

        <StatsStrip stats={stats} />

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold text-white">Why metals desks choose DreamNet</h2>
            <ul className="mt-6 space-y-4 text-sm text-white/70">
              {benefits.map((benefit) => (
                <li key={benefit.name}>
                  <span className="font-semibold text-white">{benefit.name}</span> — {benefit.detail}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold text-white">Agent stack</h2>
            <p className="mt-4 text-sm text-white/70">
              Metals Intelligence leverages LocalEdge AI for outreach, InvestorOps Sentinel for reporting, and Wallet Maestro for custody visibility. StarBridge synchronizes all desk events with DreamOps dashboards.
            </p>
            <p className="mt-4 text-sm text-white/70">
              Atlas Agent Foundry rapidly clones vertical-specific assistants (compliance, syndication, liquidity scouting) so your desk scales without additional hires.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">From inquiry to settlement</h2>
          <ol className="mt-6 space-y-4 text-sm text-white/70">
            <li>Inbound lead captured via DreamNet site or referral.</li>
            <li>Daemon schedules qualification call, collects KYC docs, pushes to InvestorOps Sentinel.</li>
            <li>Pricing engine quotes spreads with live risk guardrails.</li>
            <li>Deal execution logged, downstream compliance paperwork generated automatically.</li>
          </ol>
        </section>
      </div>
    </SiteShell>
  );
}
