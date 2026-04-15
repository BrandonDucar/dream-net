import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Activity, Bot, CloudLightning, Cpu, ShieldHalf } from "lucide-react";
import { DreamScopeRouter } from "./dreamscope/DreamScopeRouter";
import { OperatorRouter } from "./operator/OperatorRouter";
import { StatusStrip } from "./components/StatusStrip";
import { StatusBadge } from "./components/StatusBadge";
import Gallery from "./pages/Gallery";
import DreamRewardsHub from "./pages/miniapps/rewards";
import CreatorSubscriptions from "./pages/miniapps/subscriptions";
import MiniAppsDirectory from "./pages/miniapps";
import TokenHub from "./pages/token";
import { WorkWithUsModal } from "./components/WorkWithUsModal";
import { CheckoutModal } from "./components/CheckoutModal";
const timeline = [
    {
        title: "Plant a Dream",
        description: "Seed a vision with intent, collaborators, and bounties that align incentives from day zero.",
    },
    {
        title: "Incubate in the Mesh",
        description: "Agents synthesize research, prototypes, and telemetry—DreamKeeper keeps the signal clean.",
    },
    {
        title: "Evolve to Launch",
        description: "DeployKeeper validates budgets, attribution, and Base deployment pathways automatically.",
    },
    {
        title: "Autonomous Deployment",
        description: "Dreams publish as living mini-apps with wallet connectivity, rights, and revenue sealed in.",
    },
];
const agents = [
    {
        name: "DreamKeeper",
        description: "Biomimetic immune system that watches the mesh, neutralizes threats, and preserves continuity.",
        icon: _jsx(ShieldHalf, { className: "h-6 w-6 text-dream-cyan" }),
    },
    {
        name: "DeployKeeper",
        description: "Precision deploy ops running CI/CD for autonomous agents with budget enforcement and lineage tracking.",
        icon: _jsx(CloudLightning, { className: "h-6 w-6 text-dream-emerald" }),
    },
    {
        name: "RelayBot",
        description: "Low-latency courier shuttling intents, approvals, and on-chain signatures between humans and AI.",
        icon: _jsx(Activity, { className: "h-6 w-6 text-dream-magenta" }),
    },
];
const navLinks = [
    { label: "Capabilities", href: "#capabilities" },
    { label: "Mini Apps", href: "/miniapps" },
    { label: "Token", href: "/token" },
    { label: "Rewards", href: "/miniapps/rewards" },
    { label: "Agents", href: "#agents" },
    { label: "Mesh Status", href: "#mesh" },
    { label: "Gallery", href: "/gallery" },
    { label: "Operator", href: "/operator" },
    { label: "Contact", href: "#contact" },
];
const miniApps = [
    {
        name: "Subscription Hub",
        description: "Launch on-chain membership tiers with ERC1155 badges, automated renewals, and Base-native revenue routing.",
        status: "Ready",
        link: "https://dreamnet.ink/miniapps/subscription-hub",
        tags: ["Base", "Memberships", "Automation"],
    },
    {
        name: "Token Balance",
        description: "Query wallet holdings across DreamNet vaults and Base mainnet with instant gating logic for contributors.",
        status: "QA",
        link: "https://dreamnet.ink/miniapps/token-balance",
        tags: ["Analytics", "Wallet", "Access"],
    },
    {
        name: "Simple Swap",
        description: "Low-friction transfer flow for Base ERC20 assets—optimized for contributor payouts and budgeting flows.",
        status: "QA",
        link: "https://dreamnet.ink/miniapps/simple-swap",
        tags: ["Finance", "Base", "Treasury"],
    },
];
function useMeshData() {
    const [status, setStatus] = useState(null);
    const [events, setEvents] = useState([]);
    const API_BASE = import.meta.env.VITE_API_URL ?? "";
    useEffect(() => {
        let cancelled = false;
        const fetchStatus = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/mesh/status`);
                if (!res.ok)
                    return;
                const body = (await res.json());
                if (!cancelled)
                    setStatus(body);
            }
            catch (err) {
                console.warn("[site] mesh status fetch failed", err);
            }
        };
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/mesh/events?limit=10`);
                if (!res.ok)
                    return;
                const body = (await res.json());
                if (!cancelled)
                    setEvents(body.runtime ?? []);
            }
            catch (err) {
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
function Badge({ active, label }) {
    return (_jsx("span", { className: `rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${active
            ? "border-dream-emerald/40 bg-dream-emerald/10 text-dream-emerald"
            : "border-white/10 text-white/60"}`, children: label }));
}
export default function App() {
    const { status, events } = useMeshData();
    const [showWorkWithUs, setShowWorkWithUs] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (path.startsWith("/dreamscope")) {
            return _jsx(DreamScopeRouter, { path: path });
        }
        if (path.startsWith("/operator")) {
            return _jsx(OperatorRouter, {});
        }
        if (path === "/gallery") {
            return _jsx(Gallery, {});
        }
        if (path === "/miniapps/rewards" || path === "/miniapps/rewards/") {
            return _jsx(DreamRewardsHub, {});
        }
        if (path === "/miniapps/subscriptions" || path === "/miniapps/subscriptions/") {
            return _jsx(CreatorSubscriptions, {});
        }
        if (path === "/miniapps" || path === "/miniapps/") {
            return _jsx(MiniAppsDirectory, {});
        }
        if (path === "/token" || path === "/token/") {
            return _jsx(TokenHub, {});
        }
    }
    const statusBadges = useMemo(() => {
        if (!status)
            return null;
        return Object.entries(status.components).map(([component, active]) => (_jsx(Badge, { active: active, label: component }, component)));
    }, [status]);
    return (_jsxs("div", { className: "min-h-screen bg-dream-black text-white", children: [_jsx(StatusStrip, {}), _jsx("header", { className: "fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-black/40 backdrop-blur", style: { top: "40px" }, children: _jsxs("div", { className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Cpu, { className: "h-6 w-6 text-dream-emerald" }), _jsx("span", { className: "font-mono text-sm uppercase tracking-[0.3em] text-white/70", children: "DreamNet" })] }), _jsx("nav", { className: "hidden items-center gap-6 text-sm text-white/70 md:flex", children: navLinks.map((link) => (_jsx("a", { href: link.href, className: "transition hover:text-white", children: link.label }, link.label))) }), _jsx("a", { href: "#contact", className: "rounded-full border border-dream-emerald/60 px-4 py-1 text-sm text-dream-emerald transition hover:bg-dream-emerald/10", children: "Connect" })] }) }), _jsxs("main", { className: "pt-32", children: [_jsxs("section", { className: "relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-mesh-grid opacity-90" }), _jsxs("div", { className: "mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center", children: [_jsxs("div", { className: "relative z-10 max-w-xl space-y-6", children: [_jsx("span", { className: "rounded-full border border-dream-emerald/30 px-3 py-1 text-xs uppercase tracking-[0.3em] text-dream-emerald/80", children: "biomimetic intelligence mesh" }), _jsx("h1", { className: "text-4xl font-semibold leading-tight text-white sm:text-5xl", children: "DreamNet orchestrates a living network of agents that evolve ideas into autonomous products." }), _jsx("p", { className: "text-white/70", children: "Dreams enter the mesh as seed visions, are incubated by specialized agents, and launch as Base mini-apps with governance, attribution, and revenue baked in." }), _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [_jsx(Badge, { active: true, label: "DreamKeeper online" }), _jsx(Badge, { active: true, label: "DeployKeeper primed" }), _jsx(Badge, { active: Boolean(status?.started), label: "Mesh link" })] }), _jsxs("div", { className: "flex flex-wrap gap-4 pt-4", children: [_jsx("a", { href: "/gallery", className: "rounded-full bg-gradient-to-r from-dream-emerald to-dream-cyan px-6 py-2 text-sm font-semibold text-black shadow-mesh transition hover:opacity-90", children: "View Gallery" }), _jsx("button", { onClick: () => setShowWorkWithUs(true), className: "rounded-full border border-white/10 px-6 py-2 text-sm text-white/70 transition hover:border-dream-magenta/60 hover:text-dream-magenta", children: "Work With Us" }), _jsx("a", { href: "#mesh", className: "rounded-full border border-white/10 px-6 py-2 text-sm text-white/70 transition hover:border-dream-magenta/60 hover:text-dream-magenta", children: "Live telemetry" })] })] }), _jsxs("div", { className: "relative z-10 w-full max-w-lg space-y-4 rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs uppercase tracking-[0.3em] text-white/50", children: "Mesh Status" }), _jsx(Bot, { className: "h-5 w-5 text-dream-cyan" })] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex items-center justify-between text-white/70", children: [_jsx("span", { children: "Components Active" }), _jsx("span", { className: "font-mono text-white", children: status
                                                                    ? Object.values(status.components).filter(Boolean).length
                                                                    : "—" })] }), _jsxs("div", { className: "flex items-center justify-between text-white/70", children: [_jsx("span", { children: "Event Buffer" }), _jsx("span", { className: "font-mono text-white", children: status?.recentEventCount ?? "—" })] }), _jsx("div", { className: "flex flex-wrap gap-2 pt-3", children: statusBadges })] }), _jsxs("div", { className: "rounded-2xl border border-white/10 bg-black/30 p-4", children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.3em] text-white/50", children: "Latest Signal" }), events.length ? (_jsx("div", { className: "mt-3 space-y-3 text-xs text-white/70", children: events.slice(0, 3).map((event) => (_jsxs("div", { children: [_jsxs("p", { className: "font-mono text-[10px] uppercase tracking-[0.2em] text-dream-magenta/80", children: [event.topic, ".", event.type] }), _jsx("p", { children: event.source })] }, event.id))) })) : (_jsx("p", { className: "mt-3 text-sm text-white/50", children: "Mesh warming up. Signals will appear as agents engage." }))] })] })] })] }), _jsx("section", { id: "capabilities", className: "mx-auto max-w-6xl px-6 py-20", children: _jsxs("div", { className: "grid gap-8 md:grid-cols-2", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-3xl font-semibold", children: "The Dream Lifecycle" }), _jsx("p", { className: "text-white/70", children: "Inspired by biomimicry, DreamNet follows a regenerative loop: plant, incubate, evolve, deploy. Each phase is orchestrated by specialized agents and anchored by verifiable telemetry." }), _jsx("div", { className: "space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5", children: timeline.map((item) => (_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-dream-cyan", children: item.title }), _jsx("p", { className: "text-sm text-white/60", children: item.description })] }, item.title))) })] }), _jsxs("div", { className: "space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6", children: [_jsx("h3", { className: "text-xl font-semibold text-dream-emerald", children: "Base \u00B7 Deploy Autonomously" }), _jsx("p", { className: "text-white/70", children: "Base provides a settlement layer for DreamNet\u2019s autonomous mini-apps. Gas, attestations, and ownership flows are managed by DeployKeeper, ensuring reproducible deployments and revenue routing." }), _jsxs("ul", { className: "space-y-3 text-sm text-white/60", children: [_jsx("li", { children: "\u2022 Wallet scoring & gating for contributor access." }), _jsx("li", { children: "\u2022 Automated Base bridge calls when DeployKeeper approves." }), _jsx("li", { children: "\u2022 Revenue flywheel callbacks for on-chain distribution." }), _jsx("li", { children: "\u2022 Starbridge ledger logs every action for transparent review." })] })] })] }) }), _jsx("section", { id: "miniapps", className: "border-y border-white/5 bg-black/50 py-20", children: _jsxs("div", { className: "mx-auto max-w-6xl px-6", children: [_jsxs("div", { className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-semibold", children: "Mini App Launchpad" }), _jsx("p", { className: "max-w-2xl text-white/70", children: "DreamNet ships on Base through composable mini apps. Each module can run autonomously, or wire into the agent mesh for human-in-the-loop approvals." })] }), _jsx("a", { href: "https://docs.base.org/base-camp/", className: "inline-flex items-center gap-2 rounded-full border border-dream-cyan/40 px-4 py-2 text-sm text-dream-cyan transition hover:bg-dream-cyan/10", children: "Base Builder Programs" })] }), _jsx("div", { className: "mt-10 grid gap-6 md:grid-cols-3", children: miniApps.map((app) => (_jsxs("div", { className: "group flex flex-col rounded-3xl border border-white/5 bg-gradient-to-br from-white/10 to-black/10 p-6 transition hover:border-dream-cyan/40 hover:shadow-mesh", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: app.status }), _jsx("span", { className: "rounded-full border border-dream-emerald/30 px-3 py-1 text-[10px] font-semibold text-dream-emerald", children: "Base" })] }), _jsx("h3", { className: "mt-4 text-xl font-semibold", children: app.name }), _jsx("p", { className: "mt-2 text-sm text-white/70", children: app.description }), _jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: app.tags.map((tag) => (_jsx("span", { className: "rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/60", children: tag }, tag))) }), _jsx("a", { href: app.link, className: "mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-white/70 transition hover:border-dream-emerald/60 hover:text-dream-emerald", target: "_blank", rel: "noreferrer", children: "Open mini app" })] }, app.name))) })] }) }), _jsx("section", { id: "agents", className: "border-y border-white/5 bg-black/40 py-20", children: _jsxs("div", { className: "mx-auto max-w-6xl px-6", children: [_jsx("h2", { className: "text-3xl font-semibold", children: "The Agent Mesh" }), _jsx("p", { className: "mt-3 max-w-2xl text-white/70", children: "A swarm of specialized agents brings Dreams to life. Each is tuned for a phase of evolution and constantly cross-checks the others via Starbridge events." }), _jsx("div", { className: "mt-12 grid gap-6 md:grid-cols-3", children: agents.map((agent) => (_jsxs("div", { className: "group rounded-3xl border border-white/5 bg-gradient-to-br from-white/10 to-black/10 p-6 transition hover:border-dream-emerald/50 hover:shadow-mesh", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("span", { className: "text-xs uppercase tracking-[0.3em] text-white/40", children: agent.name }), agent.icon] }), _jsx("p", { className: "text-sm text-white/70", children: agent.description })] }, agent.name))) })] }) }), _jsx("section", { id: "mesh", className: "mx-auto max-w-6xl px-6 py-20", children: _jsxs("div", { className: "grid gap-10 lg:grid-cols-2", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-3xl font-semibold", children: "Live Mesh Telemetry" }), _jsx("p", { className: "text-white/70", children: "Starbridge broadcasts are how DreamNet stays aware of itself. They record every dream mutation, deploy budget, and defense action. Subscribe downstream for analytics, compliance, or real-time monitoring." }), _jsxs("div", { className: "rounded-3xl border border-white/10 bg-black/30 p-6", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-white/50", children: "recent broadcasts" }), _jsx("div", { className: "mt-4 space-y-3 font-mono text-[11px] text-white/70", children: events.length ? (events.map((event) => (_jsxs("div", { className: "rounded-xl border border-white/5 bg-white/5 p-3", children: [_jsxs("div", { className: "flex items-center justify-between text-dream-cyan", children: [_jsx("span", { children: event.topic }), _jsx("span", { children: new Date(event.ts).toLocaleTimeString() })] }), _jsx("div", { className: "text-white", children: event.type }), _jsx("div", { className: "text-white/50", children: event.source })] }, event.id)))) : (_jsx("p", { children: "No events buffered yet. Agents are spinning up." })) })] })] }), _jsxs("div", { className: "space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6", children: [_jsx("h3", { className: "text-xl font-semibold text-dream-magenta", children: "DeployKeeper Controls" }), _jsx("p", { className: "text-sm text-white/70", children: "DeployKeeper takes the final handoff: verifying remixes, locking attribution, estimating Base gas, and broadcasting deploy intents. Hook these controls into custom dashboards or let the mesh act autonomously." }), _jsxs("ul", { className: "space-y-2 text-white/60", children: [_jsx("li", { children: "\u2022 Configure budget guardrails per dream or per wallet." }), _jsx("li", { children: "\u2022 Trigger Base minting flows with a single Starbridge call." }), _jsx("li", { children: "\u2022 Replay deploy events for audits or rollback." })] }), _jsxs("div", { className: "rounded-2xl border border-dream-magenta/30 bg-black/40 p-4", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-dream-magenta", children: "next milestone" }), _jsx("p", { className: "mt-2 text-sm text-white/70", children: "Enable public Mini App submissions with wallet scoring and DeployKeeper auto-review." })] })] })] }) }), _jsxs("section", { id: "contact", className: "border-t border-white/5 bg-black/60", children: [_jsxs("div", { className: "mx-auto max-w-5xl px-6 py-16", children: [_jsx("h2", { className: "text-3xl font-semibold", children: "Bring a Dream into the Mesh" }), _jsx("p", { className: "mt-3 max-w-2xl text-white/70", children: "DreamNet is currently onboarding partners building Base-native automations, composable AI agents, and tokenized flywheels. Share your intent and we\u2019ll wire the right agents into your flow." }), _jsxs("div", { className: "mt-6 flex flex-wrap items-center gap-4 text-sm text-white/60", children: [_jsx("span", { className: "rounded-full border border-white/10 px-4 py-2 font-mono", children: "partnerships@dreamnet.ai" }), _jsx("span", { className: "rounded-full border border-white/10 px-4 py-2 font-mono", children: "Base Wallet \u00B7 ready" })] })] }), _jsx("footer", { className: "border-t border-white/5", children: _jsxs("div", { className: "mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { children: ["\u00A9 ", new Date().getFullYear(), " DreamNet \u00B7 Engineered Digital Leverage."] }), _jsx(StatusBadge, {})] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("a", { href: "#capabilities", className: "hover:text-dream-cyan", children: "Capabilities" }), _jsx("a", { href: "#agents", className: "hover:text-dream-magenta", children: "Agents" }), _jsx("a", { href: "#mesh", className: "hover:text-dream-emerald", children: "Mesh Status" }), _jsx("a", { href: "/gallery", className: "hover:text-dream-cyan", children: "Gallery" })] })] }) })] })] }), _jsx(WorkWithUsModal, { isOpen: showWorkWithUs, onClose: () => setShowWorkWithUs(false) }), _jsx(CheckoutModal, { isOpen: showCheckout, onClose: () => setShowCheckout(false) })] }));
}
