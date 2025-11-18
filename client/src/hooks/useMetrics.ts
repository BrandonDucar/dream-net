import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export interface MetricsSnapshot {
  timestamp: string;
  uptimePercent: number;
  avgHeartbeatMs: number;
  haloCyclesToday: number;
  tasksCompleted: number;
  tasksPending: number;
  events24h: number;
  mediaCount: number;
  mediaPublic: number;
  postsQueued: number;
  postsPosted: number;
  phase: string;
}

export function useMetrics(intervalMs: number = 20000) {
  const [metrics, setMetrics] = useState<MetricsSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/metrics`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setMetrics(data.metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return { metrics, isLoading, error, refetch: fetchMetrics };
}

