import { useEffect, useState } from "react";
const API_BASE = import.meta.env.VITE_API_URL ?? "";
export function useMetrics(intervalMs = 20000) {
    const [metrics, setMetrics] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
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
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        }
        finally {
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
