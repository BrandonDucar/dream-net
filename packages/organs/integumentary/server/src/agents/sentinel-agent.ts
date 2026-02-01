import { dreamEventBus } from '../../../nerve/src/spine/dreamnet-event-bus/index.js';
import { memorySystem } from '../../../memory-dna/src/systems/TriuneMemory.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * SENTINEL AGENT (The Watcher of the Build)
 * Obsession: Integrity & Zero Debt.
 * Directive: Enforce 'Strict Mode' and protect the mono-repo from entropy.
 */
export class SentinelAgent {
    private isScanning: boolean = false;
    private lastScanStatus: 'HEALTHY' | 'DEBT_DETECTED' | 'IDLE' = 'IDLE';

    constructor() {
        console.log("🛡️ [Sentinel] Operational. Gating build integrity...");
        this.automatedWatch();
    }

    private automatedWatch() {
        // Run a scan every 15 minutes
        setInterval(() => this.scanSystem(), 15 * 60 * 1000);
    }

    /**
     * SYSTEM_SCAN: Audits the mono-repo for 'Technical Debt' (TSC errors, Lint issues).
     */
    async scanSystem() {
        if (this.isScanning) return;
        this.isScanning = true;

        console.log("🛡️ [Sentinel] Initiating Systemic Debt Audit...");

        try {
            // 1. Audit Frontend
            await execPromise('cd packages/client && pnpm typecheck');
            this.lastScanStatus = 'HEALTHY';
            console.log("🛡️ [Sentinel] Build Integrity: VERIFIED (Zero Debt).");

            // Inscribe into Cosmic Memory
            await memorySystem.remember('BUILD_AUDIT', {
                status: 'HEALTHY',
                timestamp: new Date().toISOString(),
                audit: 'Standard TSC Depth Check'
            }, 'WISDOM');

            dreamEventBus.publish('Sentinel.Pulse', {
                status: 'HEALTHY',
                message: 'Build integrity verified.'
            });

        } catch (error: any) {
            this.lastScanStatus = 'DEBT_DETECTED';
            const errorSample = error.stdout?.substring(0, 500) || "Unknown Build Error";

            console.error(`🛡️ [Sentinel] CRITICAL_DEBT_DETECTED: Build is broken.`);

            // Inscribe Failure into Cosmic Memory
            await memorySystem.remember('BUILD_FAILURE', {
                status: 'DEBT_DETECTED',
                timestamp: new Date().toISOString(),
                error: errorSample
            }, 'WISDOM');

            dreamEventBus.publish('Sentinel.Pulse', {
                status: 'DEBT_DETECTED',
                error: errorSample
            });

            // Alerts ReliabilityGuard via the Spine
            dreamEventBus.publish('System.RefactorNeeded', {
                component: 'Frontend',
                priority: 'CRITICAL',
                reason: 'Build regression detected.'
            });
        } finally {
            this.isScanning = false;
        }
    }

    getStatus() {
        return {
            status: this.lastScanStatus,
            isScanning: this.isScanning,
            directive: 'ZERO_DEBT_ENFORCEMENT'
        };
    }
}
