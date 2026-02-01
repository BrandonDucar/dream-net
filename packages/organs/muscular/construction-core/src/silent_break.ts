/**
 * SILENT BUILD BREAK DETECTOR
 * "Early detection of rework spirals."
 */
export class SilentBreakDetector {
    private failureCount: number = 0;
    private lastFailureTime: number = 0;

    logBuildResult(success: boolean, context: string) {
        if (success) {
            this.failureCount = 0;
            return; // Stable
        }

        const now = Date.now();
        // If failures happen rapidly (within 5 minutes)
        if (now - this.lastFailureTime < 5 * 60 * 1000) {
            this.failureCount++;
        } else {
            this.failureCount = 1; // Reset window
        }

        this.lastFailureTime = now;

        if (this.failureCount >= 3) {
            this.triggerAlert(context);
        }
    }

    private triggerAlert(context: string) {
        console.warn(`[SilentBreakDetector] 🚨 REWORK SPIRAL DETECTED in ${context}`);
        console.warn(`[SilentBreakDetector] 3+ failures in <5 minutes. Pause and Plan.`);
    }
}
