type Stat = {
  label: string;
  value: string;
  caption?: string;
};

type StatsStripProps = {
  stats: Stat[];
};

export function StatsStrip({ stats }: StatsStripProps) {
  if (stats.length === 0) return null;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6 backdrop-blur lg:px-10">
      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="text-white/90">
            <div className="text-sm uppercase tracking-widest text-white/60">{stat.label}</div>
            <div className="mt-2 text-2xl font-semibold text-white">{stat.value}</div>
            {stat.caption ? <div className="mt-1 text-sm text-white/50">{stat.caption}</div> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
