import { SiteShell } from "../(marketing)/components/SiteShell";

export const metadata = {
  title: "DreamNet Terms of Service",
  description: "Usage guidelines and legal terms for DreamNet platform access and services.",
};

export default function TermsPage() {
  return (
    <SiteShell>
      <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-sm leading-relaxed text-white/70">
        <h1 className="text-3xl font-semibold text-white">Terms of Service</h1>
        <p>
          DreamNet is provided as a subscription service. By engaging DreamNet, you agree to respect platform security controls, comply with applicable laws, and avoid misuse of autonomous agents.
        </p>
        <p>
          Services are delivered “as is.” Liability is limited to the extent permitted by law. DreamNet maintains rate limits, HMAC authentication, and audit logging to protect the ecosystem.
        </p>
        <p>
          Questions about these terms or custom enterprise agreements can be directed to legal@dreamnet.ink.
        </p>
      </div>
    </SiteShell>
  );
}
