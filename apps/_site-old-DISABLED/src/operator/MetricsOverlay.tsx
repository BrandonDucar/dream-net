import React from "react";
import { useMetrics } from '../hooks/useMetrics.js';
import { Activity, Clock, CheckCircle, AlertCircle, Image, Send, Zap, Server } from "lucide-react";

const sectionClass =
  "rounded-3xl border border-white/10 bg-black/40 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  color?: "cyan" | "emerald" | "amber" | "rose" | "magenta";
}

function MetricCard({ title, value, icon, subtitle, color = "cyan" }: MetricCardProps) {
  const colorClasses = {
    cyan: "border-dream-cyan/30 bg-dream-cyan/10 text-dream-cyan",
    emerald: "border-dream-emerald/30 bg-dream-emerald/10 text-dream-emerald",
    amber: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    rose: "border-rose-400/30 bg-rose-400/10 text-rose-300",
    magenta: "border-dream-magenta/30 bg-dream-magenta/10 text-dream-magenta",
  };

  return (
    <div className={`${sectionClass} border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-xl p-2 ${colorClasses[color]}`}>{icon}</div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">{title}</p>
            <p className="text-2xl font-semibold text-white">{value}</p>
            {subtitle && <p className="text-xs text-white/60 mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function PhaseBadge({ phase }: { phase: string }) {
  const phaseColors: Record<string, { bg: string; text: string }> = {
    operational: { bg: "bg-green-500/20", text: "text-green-400" },
    degraded: { bg: "bg-amber-500/20", text: "text-amber-300" },
    booting: { bg: "bg-blue-500/20", text: "text-blue-400" },
    error: { bg: "bg-red-500/20", text: "text-red-400" },
  };

  const colors = phaseColors[phase] ?? { bg: "bg-white/10", text: "text-white/60" };

  return (
    <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${colors.bg} ${colors.text}`}>
      {phase}
    </span>
  );
}

export function MetricsOverlay() {
  const { metrics, isLoading, error } = useMetrics(20000);

  if (isLoading && !metrics) {
    return (
      <div className={sectionClass}>
        <p className="text-white/60">Loading metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={sectionClass}>
        <p className="text-rose-400">Error loading metrics: {error}</p>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Metrics & Insights</p>
          <h2 className="text-2xl font-semibold text-white">System Overview</h2>
        </div>
        <PhaseBadge phase={metrics.phase} />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Uptime"
          value={`${metrics.uptimePercent.toFixed(1)}%`}
          icon={<Server className="w-5 h-5" />}
          color="emerald"
        />
        <MetricCard
          title="Heartbeat"
          value={`${metrics.avgHeartbeatMs}ms`}
          icon={<Activity className="w-5 h-5" />}
          subtitle="Avg latency"
          color="cyan"
        />
        <MetricCard
          title="HALO Cycles"
          value={metrics.haloCyclesToday}
          icon={<Zap className="w-5 h-5" />}
          subtitle="Today"
          color="magenta"
        />
        <MetricCard
          title="Tasks"
          value={`${metrics.tasksCompleted} / ${metrics.tasksPending}`}
          icon={<CheckCircle className="w-5 h-5" />}
          subtitle="Done / Pending"
          color={metrics.tasksPending > 0 ? "amber" : "emerald"}
        />
        <MetricCard
          title="Events"
          value={metrics.events24h}
          icon={<AlertCircle className="w-5 h-5" />}
          subtitle="Last 24h"
          color="cyan"
        />
        <MetricCard
          title="Media"
          value={`${metrics.mediaPublic} / ${metrics.mediaCount}`}
          icon={<Image className="w-5 h-5" />}
          subtitle="Public / Total"
          color="magenta"
        />
        <MetricCard
          title="Posts Queued"
          value={metrics.postsQueued}
          icon={<Clock className="w-5 h-5" />}
          color="amber"
        />
        <MetricCard
          title="Posts Posted"
          value={metrics.postsPosted}
          icon={<Send className="w-5 h-5" />}
          color="emerald"
        />
      </div>
    </div>
  );
}

