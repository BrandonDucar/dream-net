import React from "react";
import { useMetrics } from '../hooks/useMetrics.js';
import { Activity, Clock, Zap, Server } from "lucide-react";

export function CompactMetricsOverlay() {
  const { metrics, isLoading } = useMetrics(20000);

  if (isLoading || !metrics) {
    return (
      <div className="fixed top-4 right-4 z-50 rounded-xl border border-white/10 bg-black/80 backdrop-blur px-4 py-3 text-xs text-white/60">
        Loading metrics...
      </div>
    );
  }

  const phaseColors: Record<string, string> = {
    operational: "text-green-400",
    degraded: "text-amber-300",
    booting: "text-blue-400",
    error: "text-red-400",
  };

  return (
    <div className="fixed top-4 right-4 z-50 rounded-xl border border-white/10 bg-black/80 backdrop-blur p-4 min-w-[280px]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-[0.2em] text-white/40">System Status</span>
        <span className={`text-xs font-semibold uppercase ${phaseColors[metrics.phase] ?? "text-white/60"}`}>
          {metrics.phase}
        </span>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/60">
            <Server className="w-3 h-3" />
            <span>Uptime</span>
          </div>
          <span className="text-white font-mono">{metrics.uptimePercent.toFixed(1)}%</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/60">
            <Activity className="w-3 h-3" />
            <span>Latency</span>
          </div>
          <span className="text-white font-mono">{metrics.avgHeartbeatMs}ms</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/60">
            <Zap className="w-3 h-3" />
            <span>HALO Cycles</span>
          </div>
          <span className="text-white font-mono">{metrics.haloCyclesToday}</span>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-white/40">
            <Clock className="w-3 h-3" />
            <span>Updated</span>
          </div>
          <span className="text-white/60 font-mono text-[10px]">
            {new Date(metrics.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}

