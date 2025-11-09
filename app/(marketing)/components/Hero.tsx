import Link from "next/link";

type HeroProps = {
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export function Hero({ title, subtitle, primaryCta, secondaryCta }: HeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-black px-6 py-20 shadow-2xl sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#5cf5ff33,transparent_65%)]" />
      <div className="relative mx-auto max-w-4xl text-center text-white">
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
        <p className="mt-6 text-lg text-slate-200 sm:text-xl">{subtitle}</p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={primaryCta.href}
            className="rounded-full bg-cyan-400 px-7 py-3 text-base font-semibold text-slate-900 transition hover:bg-cyan-300"
          >
            {primaryCta.label}
          </Link>
          {secondaryCta ? (
            <Link
              href={secondaryCta.href}
              className="rounded-full border border-white/30 px-7 py-3 text-base font-semibold text-white transition hover:border-white/60 hover:bg-white/10"
            >
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
