import { useEffect, useMemo, useState } from "react";
import { Activity, Bot, CloudLightning, Cpu, ShieldHalf } from "lucide-react";

type MeshStatus = {
  started: boolean;
  intervalCount: number;
  recentEventCount: number;
  components: Record<string, boolean>;
};

type MeshEvent = {
  id: string;
  topic: string;
  source: string;
  type: string;
  ts: string | Date;
  payload?: Record<string, unknown>;
};

const timeline = [
  {
    title: "Plant a Dream",
    description:
      "Seed a vision with intent, collaborators, and bounties that align incentives from day zero.",
  },
  {
    title: "Incubate in the Mesh",
    description:
      "Agents synthesize research, prototypes, and telemetry—DreamKeeper keeps the signal clean.",
  },
  {
    title: "Evolve to Launch",
    description:
      "DeployKeeper validates budgets, attribution, and Base deployment pathways automatically.",
  },
  {
    title: "Autonomous Deployment",
    description:
      "Dreams publish as living mini-apps with wallet connectivity, rights, and revenue sealed in.",
  },
];

const agents = [
  {
    name: "DreamKeeper",
    description:
      "Biomimetic immune system that watches the mesh, neutralizes threats, and preserves continuity.",
    icon: <ShieldHalf className="h-6 w-6 text-dream-cyan" />,
  },
  {
    name: "DeployKeeper",
    description:
      "Precision deploy ops running CI/CD for autonomous agents with budget enforcement and lineage tracking.",
    icon: <CloudLightning className="h-6 w-6 text-dream-emerald" />,
  },
  {
    name: "RelayBot",
    description:
      "Low-latency courier shuttling intents, approvals, and on-chain signatures between humans and AI.",
    icon: <Activity className="h-6 w-6 text-dream-magenta" />,
  },
];

const navLinks = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Agents", href: "#agents" },
  { label: "Mesh Status", href: "#mesh" },
  { label: "Contact", href: "#contact" },
];

function useMeshData() {
  const [status, setStatus] = useState<MeshStatus | null>(null);
  const [events, setEvents] = useState<MeshEvent[]>([]);

  const API_BASE = import.meta.env.VITE_API_URL ?? "";

  useEffect(() => {
    let cancelled = false;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/mesh/status`);
        if (!res.ok) return;
        const body = (await res.json()) as MeshStatus;
        if (!cancelled) setStatus(body);
      } catch (err) {
        console.warn("[site] mesh status fetch failed", err);
      }
    };

    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/mesh/events?limit=10`);
        if (!res.ok) return;
        const body = (await res.json()) as { runtime: MeshEvent[] };
        if (!cancelled) setEvents(body.runtime ?? []);
      } catch (err) {
        console.warn("[site] mesh events fetch failed", err);
      }
    };

    fetchStatus();
    fetchEvents();

    const interval = setInterval(() => {
      fetchStatus();
      fetchEvents();
    }, 15000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [API_BASE]);

  return { status, events };
}

function Badge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
        active
          ? "border-dream-emerald/40 bg-dream-emerald/10 text-dream-emerald"
          : "border-white/10 text-white/60"
      }`}
    >
      {label}
    </span>
  );
}

export default function App() {
  const { status, events } = useMeshData();

  const statusBadges = useMemo(() => {
    if (!status) return null;
    return Object.entries(status.components).map(([component, active]) => (
      <Badge key={component} active={active} label={component} />
    ));
  }, [status]);

  return (
    <div className="min-h-screen bg-dream-black text-white">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Cpu className="h-6 w-6 text-dream-emerald" />
            <span className="font-mono text-sm uppercase tracking-[0.3em] text-white/70">
              DreamNet
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#contact"
            className="rounded-full border border-dream-emerald/60 px-4 py-1 text-sm text-dream-emerald transition hover:bg-dream-emerald/10"
          >
            Connect
          </a>
        </div>
      </header>

      <main className="pt-28">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-grid opacity-90" />
          <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center">
            <div className="relative z-10 max-w-xl space-y-6">
              <span className="rounded-full border border-dream-emerald/30 px-3 py-1 text-xs uppercase tracking-[0.3em] text-dream-emerald/80">
                biomimetic intelligence mesh
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                DreamNet orchestrates a living network of agents that evolve
                ideas into autonomous products.
              </h1>
              <p className="text-white/70">
                Dreams enter the mesh as seed visions, are incubated by
                specialized agents, and launch as Base mini-apps with governance,
                attribution, and revenue baked in.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Badge active label="DreamKeeper online" />
                <Badge active label="DeployKeeper primed" />
                <Badge active={Boolean(status?.started)} label="Mesh link" />
              </div>
              <div className="flex gap-4 pt-4">
                <a
                  href="#capabilities"
                  className="rounded-full bg-gradient-to-r from-dream-emerald to-dream-cyan px-6 py-2 text-sm font-semibold text-black shadow-mesh transition hover:opacity-90"
                >
                  Explore the mesh
                </a>
                <a
                  href="#mesh"
                  className="rounded-full border border-white/10 px-6 py-2 text-sm text-white/70 transition hover:border-dream-magenta/60 hover:text-dream-magenta"
                >
                  Live telemetry
                </a>
              </div>
            </div>
            <div className="relative z-10 w-full max-w-lg space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Mesh Status
                </span>
                <Bot className="h-5 w-5 text-dream-cyan" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-white/70">
                  <span>Components Active</span>
                  <span className="font-mono text-white">
                    {status
                      ? Object.values(status.components).filter(Boolean).length
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span>Event Buffer</span>
                  <span className="font-mono text-white">
                    {status?.recentEventCount ?? "—"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-3">{statusBadges}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                  Latest Signal
                </p>
                {events.length ? (
                  <div className="mt-3 space-y-3 text-xs text-white/70">
                    {events.slice(0, 3).map((event) => (
                      <div key={event.id}>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dream-magenta/80">
                          {event.topic}.{event.type}
                        </p>
                        <p>{event.source}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-white/50">
                    Mesh warming up. Signals will appear as agents engage.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="capabilities" className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">The Dream Lifecycle</h2>
              <p className="text-white/70">
                Inspired by biomimicry, DreamNet follows a regenerative loop:
                plant, incubate, evolve, deploy. Each phase is orchestrated by
                specialized agents and anchored by verifiable telemetry.
              </p>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
                {timeline.map((item) => (
                  <div key={item.title}>
                    <p className="text-sm font-semibold text-dream-cyan">
                      {item.title}
                    </p>
                    <p className="text-sm text-white/60">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold text-dream-emerald">
                Base · Deploy Autonomously
              </h3>
              <p className="text-white/70">
                Base provides a settlement layer for DreamNet’s autonomous mini-apps.
                Gas, attestations, and ownership flows are managed by DeployKeeper,
                ensuring reproducible deployments and revenue routing.
              </p>
              <ul className="space-y-3 text-sm text-white/60">
                <li>• Wallet scoring & gating for contributor access.</li>
                <li>• Automated Base bridge calls when DeployKeeper approves.</li>
                <li>• Revenue flywheel callbacks for on-chain distribution.</li>
                <li>• Starbridge ledger logs every action for transparent review.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="agents" className="border-y border-white/5 bg-black/40 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-semibold">The Agent Mesh</h2>
            <p className="mt-3 max-w-2xl text-white/70">
              A swarm of specialized agents brings Dreams to life. Each is tuned
              for a phase of evolution and constantly cross-checks the others via
              Starbridge events.
            </p>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {agents.map((agent) => (
                <div
                  key={agent.name}
                  className="group rounded-3xl border border-white/5 bg-gradient-to-br from-white/10 to-black/10 p-6 transition hover:border-dream-emerald/50 hover:shadow-mesh"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                      {agent.name}
                    </span>
                    {agent.icon}
                  </div>
                  <p className="text-sm text-white/70">{agent.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="mesh" className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">Live Mesh Telemetry</h2>
              <p className="text-white/70">
                Starbridge broadcasts are how DreamNet stays aware of itself.
                They record every dream mutation, deploy budget, and defense
                action. Subscribe downstream for analytics, compliance, or
                real-time monitoring.
              </p>
              <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  recent broadcasts
                </p>
                <div className="mt-4 space-y-3 font-mono text-[11px] text-white/70">
                  {events.length ? (
                    events.map((event) => (
                      <div key={event.id} className="rounded-xl border border-white/5 bg-white/5 p-3">
                        <div className="flex items-center justify-between text-dream-cyan">
                          <span>{event.topic}</span>
                          <span>{new Date(event.ts).toLocaleTimeString()}</span>
                        </div>
                        <div className="text-white">{event.type}</div>
                        <div className="text-white/50">{event.source}</div>
                      </div>
                    ))
                  ) : (
                    <p>No events buffered yet. Agents are spinning up.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-semibold text-dream-magenta">
                DeployKeeper Controls
              </h3>
              <p className="text-sm text-white/70">
                DeployKeeper takes the final handoff: verifying remixes, locking
                attribution, estimating Base gas, and broadcasting deploy
                intents. Hook these controls into custom dashboards or let the
                mesh act autonomously.
              </p>
              <ul className="space-y-2 text-white/60">
                <li>• Configure budget guardrails per dream or per wallet.</li>
                <li>• Trigger Base minting flows with a single Starbridge call.</li>
                <li>• Replay deploy events for audits or rollback.</li>
              </ul>
              <div className="rounded-2xl border border-dream-magenta/30 bg-black/40 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-dream-magenta">
                  next milestone
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Enable public Mini App submissions with wallet scoring and
                  DeployKeeper auto-review.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="border-t border-white/5 bg-black/60">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-3xl font-semibold">Bring a Dream into the Mesh</h2>
            <p className="mt-3 max-w-2xl text-white/70">
              DreamNet is currently onboarding partners building Base-native
              automations, composable AI agents, and tokenized flywheels. Share
              your intent and we’ll wire the right agents into your flow.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="rounded-full border border-white/10 px-4 py-2 font-mono">
                partnerships@dreamnet.ai
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2 font-mono">
                Base Wallet · ready
              </span>
            </div>
          </div>
          <footer className="border-t border-white/5">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
              <span>© {new Date().getFullYear()} DreamNet · Engineered Digital Leverage.</span>
              <div className="flex gap-4">
                <a href="#capabilities" className="hover:text-dream-cyan">
                  Capabilities
                </a>
                <a href="#agents" className="hover:text-dream-magenta">
                  Agents
                </a>
                <a href="#mesh" className="hover:text-dream-emerald">
                  Mesh Status
                </a>
              </div>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}

