import Link from "next/link";
import type { ReactNode } from "react";

const navLinks = [
  { href: "/dreamstar", label: "DreamStar" },
  { href: "/dreamsnail", label: "DreamSnail" },
  { href: "/metals", label: "Metals Intelligence" },
];

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-16 pt-10 sm:px-10">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-lg font-semibold tracking-wide text-white">
            DreamNet<span className="text-cyan-300">.ink</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="rounded-full bg-cyan-400 px-4 py-2 font-semibold text-slate-900 transition hover:bg-cyan-300"
            >
              Contact
            </Link>
          </nav>
        </header>

        <main className="mt-12 flex-1">{children}</main>

        <footer className="mt-16 border-t border-white/10 pt-8 text-sm text-white/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} DreamNet Autonomous Systems. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms
              </Link>
              <Link href="/status" className="hover:text-white">
                Status
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
