/**
 * SYSTEM PERFORMANCE AGENT (The Race Engineer)
 * Obsession: Throughput & Speed.
 * "Push the hardware."
 */

export class SystemPerformanceAgent {
    analyze(metrics: { loopLag: number, memoryUsage: number }) {
        // Logic: If event loop is fast (< 10ms) -> PUSH
        if (metrics.loopLag < 10) {
            return {
                command: 'PUSH',
                confidence: 0.9,
                reason: 'Event loop is idle. We can handle more traffic.'
            };
        }

        // If memory is high > 80% -> COOL
        if (metrics.memoryUsage > 0.8) {
            return {
                command: 'COOL',
                confidence: 0.8,
                reason: 'Memory pressure high. GC needed.'
            };
        }

        return { command: 'MAINTAIN', confidence: 0.5, reason: 'Nominal.' };
    }
}
