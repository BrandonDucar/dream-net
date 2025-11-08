import { SiteShell } from "../(marketing)/components/SiteShell";

export const metadata = {
  title: "Contact DreamNet",
  description: "Schedule a mission briefing or request detail on DreamStar, DreamSnail, or Metals Intelligence.",
};

export default function ContactPage() {
  return (
    <SiteShell>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-semibold text-white">Contact DreamOps Command</h1>
        <p className="mt-4 text-sm text-white/70">
          Drop your details and mission objectives. DreamOps will route your message through Royalty Flow Nexus and respond within one autonomous cycle.
        </p>
        <form action="https://formspree.io/f/xdknvgnq" method="POST" className="mt-8 space-y-4">
          <input
            type="text"
            name="name"
            required
            placeholder="Your name"
            className="w-full rounded-xl border border-white/20 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-300 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="w-full rounded-xl border border-white/20 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-300 focus:outline-none"
          />
          <textarea
            name="message"
            required
            rows={5}
            placeholder="How can DreamNet help? Include preferred vertical or mission brief."
            className="w-full rounded-xl border border-white/20 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-300 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-300"
          >
            Send to DreamOps
          </button>
        </form>
      </div>
    </SiteShell>
  );
}
