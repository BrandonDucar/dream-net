import Link from "next/link";

type Vertical = {
  name: string;
  description: string;
  href: string;
  accent: string;
  badge?: string;
};

type VerticalHighlightsProps = {
  verticals: Vertical[];
};

export function VerticalHighlights({ verticals }: VerticalHighlightsProps) {
  return (
    <section className="rounded-3xl bg-slate-950/60 px-6 py-12 shadow-inner sm:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="lg:w-1/3">
            <h2 className="text-3xl font-semibold text-white">Three launch vectors. One autonomous organism.</h2>
            <p className="mt-4 text-base text-white/70">
              DreamNet deploys across creative, privacy, and finance verticals—each one powered by the same self-healing intelligence spine.
            </p>
          </div>
          <div className="grid flex-1 gap-6 sm:grid-cols-2">
            {verticals.map((vertical) => (
              <Link
                key={vertical.name}
                href={vertical.href}
                className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white" style={{ background: vertical.accent }}>
                  {vertical.name.charAt(0)}
                </span>
                <h3 className="relative mt-4 text-xl font-semibold text-white">{vertical.name}</h3>
                <p className="relative mt-3 text-sm leading-relaxed text-white/70">{vertical.description}</p>
                {vertical.badge ? (
                  <span className="relative mt-4 inline-flex w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/80">
                    {vertical.badge}
                  </span>
                ) : null}
                <span className="relative mt-6 text-sm font-semibold text-cyan-300">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
