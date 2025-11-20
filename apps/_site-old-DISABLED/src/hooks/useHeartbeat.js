import { useEffect, useRef, useState, useCallback } from "react";
const API_BASE = import.meta.env.VITE_API_URL ?? "";
/**
 * useHeartbeat - A lightweight hook for periodic health/status checks
 *
 * Features:
 * - Automatic periodic fetching
 * - Immediate fetch on mount
 * - Safe cleanup on unmount
 * - Error handling with consecutive failure tracking
 * - Manual refetch capability
 *
 * @param options Configuration options
 * @returns Heartbeat state and controls
 */
export function useHeartbeat(options = {}) {
    const { intervalMs = 15000, onTick, endpoint = "/api/alive/status", enabled = true, } = options;
    const [status, setStatus] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [consecutiveFailures, setConsecutiveFailures] = useState(0);
    const intervalRef = useRef(null);
    const mountedRef = useRef(true);
    const lastEmissionRef = useRef(0); // For debouncing event emissions
    const maxConsecutiveFailures = options.maxConsecutiveFailures ?? 2;
    const fetchStatus = useCallback(async () => {
        if (!enabled)
            return;
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }
            const data = await res.json();
            // Handle different response formats
            const statusData = data.status ?? data;
            if (!mountedRef.current)
                return;
            const now = new Date();
            setStatus(statusData);
            setLastUpdated(now);
            // Reset failures on success
            const previousFailures = consecutiveFailures;
            setConsecutiveFailures(0);
            setIsLoading(false);
            // Call onTick callback if provided
            if (onTick) {
                onTick(statusData);
            }
            // If we just recovered from failures, notify
            if (previousFailures >= maxConsecutiveFailures && options.onFailureThreshold) {
                options.onFailureThreshold(0, now);
            }
        }
        catch (err) {
            if (!mountedRef.current)
                return;
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            setError(errorMessage);
            const newFailureCount = consecutiveFailures + 1;
            setConsecutiveFailures(newFailureCount);
            setIsLoading(false);
            // Don't call onTick on error
            // Trigger recovery actions when threshold is reached
            if (newFailureCount >= maxConsecutiveFailures) {
                const now = Date.now();
                // Debounce: don't emit more than once every 60 seconds
                if (now - lastEmissionRef.current > 60000) {
                    lastEmissionRef.current = now;
                    // Call failure threshold callback if provided
                    if (options.onFailureThreshold) {
                        options.onFailureThreshold(newFailureCount, lastUpdated);
                    }
                }
            }
        }
    }, [endpoint, enabled, onTick, maxConsecutiveFailures, options]);
    const refetch = useCallback(async () => {
        await fetchStatus();
    }, [fetchStatus]);
    // Initial fetch on mount
    useEffect(() => {
        if (enabled) {
            fetchStatus();
        }
    }, [enabled, fetchStatus]);
    // Set up interval
    useEffect(() => {
        if (!enabled || intervalMs < 10000) {
            // Safety: minimum 10 second interval
            return;
        }
        intervalRef.current = setInterval(() => {
            if (mountedRef.current) {
                fetchStatus();
            }
        }, intervalMs);
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [enabled, intervalMs, fetchStatus]);
    // Cleanup on unmount
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);
    return {
        status,
        lastUpdated,
        isLoading,
        error,
        refetch,
        consecutiveFailures,
    };
}
