import { useEffect, useRef } from "react";
export function usePolling(callback, intervalMs) {
    const savedCallback = useRef(callback);
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
    useEffect(() => {
        const tick = () => savedCallback.current();
        const id = setInterval(tick, intervalMs);
        return () => clearInterval(id);
    }, [intervalMs]);
}
