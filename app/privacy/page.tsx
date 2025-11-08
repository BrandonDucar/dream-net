import { SiteShell } from "../(marketing)/components/SiteShell";

export const metadata = {
  title: "DreamNet Privacy Policy",
  description: "Overview of DreamNet's privacy posture for DreamStar, DreamSnail, and platform services.",
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-sm leading-relaxed text-white/70">
        <h1 className="text-3xl font-semibold text-white">Privacy Policy</h1>
        <p>
          DreamNet is engineered with privacy by design. We minimize data collection, store sensitive artifacts inside DreamVault, and rely on cryptographic proofs (including DreamSnail commitments) to avoid harvesting raw user paths.
        </p>
        <p>
          Contact information submitted via the site is routed through encrypted channels and retained only to coordinate mission briefings. You can request deletion at any time by emailing privacy@dreamnet.ink.
        </p>
        <p>
          DreamNet does not sell personal data. Agents operate with scoped credentials, and every access is logged through StarBridge for auditability. Additional details are available on request.
        </p>
      </div>
    </SiteShell>
  );
}
