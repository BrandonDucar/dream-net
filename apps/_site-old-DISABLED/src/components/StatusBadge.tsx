import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export function StatusBadge() {
  const [phase, setPhase] = useState<string>("operational");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/public/status`);
        if (response.ok) {
          const data = await response.json();
          setPhase(data.phase || "operational");
        }
      } catch (error) {
        console.error("Failed to fetch status:", error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const phaseColors: Record<string, { bg: string; text: string }> = {
    operational: { bg: "bg-green-500/20", text: "text-green-400" },
    degraded: { bg: "bg-amber-500/20", text: "text-amber-300" },
    error: { bg: "bg-red-500/20", text: "text-red-400" },
    booting: { bg: "bg-blue-500/20", text: "text-blue-400" },
  };

  const colors = phaseColors[phase] ?? { bg: "bg-white/10", text: "text-white/60" };

  return (
    <span className={`rounded-full px-2 py-1 text-xs ${colors.bg} ${colors.text}`}>
      Status: {phase.charAt(0).toUpperCase() + phase.slice(1)}
    </span>
  );
}

