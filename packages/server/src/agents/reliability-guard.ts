/**
 * RELIABILITY GUARD (The Reliability Engineer)
 * Obsession: Stability & Uptime.
 * "Don't crash."
 */

export class ReliabilityGuard {
    private errorBuffer: number[] = [];

    logError() {
        this.errorBuffer.push(Date.now());
    }

    analyze() {
        const now = Date.now();
        // Count errors in last minute
        const recentErrors = this.errorBuffer.filter(t => now - t < 60000).length;

        // Clean old errors
        this.errorBuffer = this.errorBuffer.filter(t => now - t < 60000);

        if (recentErrors > 5) {
            return {
                command: 'BACK_OFF',
                confidence: 1.0,
                reason: `Rate spike: ${recentErrors} errors/min.`
            };
        }

        if (recentErrors > 0) {
            return {
                command: 'WATCH',
                confidence: 0.7,
                reason: 'Intermittent errors detected.'
            };
        }

        return { command: 'GREEN', confidence: 0.9, reason: 'System stable.' };
    }
}
