import { detectThreat } from './threatDetector.js';
import { ThreatLevel } from '../types.js';

/**
 * 📱 DeviceGuard: Protecting the Physical-Digital Boundary
 * Philosophy: When the user's phone "acts funny," it signifies a metabolic mismatch.
 */

export class DeviceGuard {
    /**
     * Diagnose an input anomaly (e.g., backwards typing)
     */
    public static diagnoseInputAnomaly(userAgent: string, symptoms: string[]): { status: string; action: string } {
        console.log(`📱 [DeviceGuard] Analyzing mobile anomaly for ${userAgent}...`);

        const isBackwards = symptoms.includes('backwards_typing') || symptoms.includes('input_jitter');

        if (isBackwards) {
            detectThreat(
                'affective-mismatch',
                'high',
                userAgent,
                'input-buffer',
                { symptoms, message: "Mirror-Writing Dissonance detected." }
            );

            return {
                status: "DISSONANT",
                action: "Initiate 'Nerve Flush' - Advise user to clear browser cache and toggle 'Liquid Glass' mode to re-sync metabolism."
            };
        }

        return {
            status: "RESONANT",
            action: "Monitor pulse."
        };
    }

    /**
     * Emit a 'Nerve Pulse' to stabilize connected devices
     */
    public static emitNervePulse() {
        console.log("⚡ [ShieldCore] Emitting Nerve Pulse to stabilize mobile IO...");
        // This would publish to NERVE_BUS to signal connected clients to reset their input buffers
    }
}
