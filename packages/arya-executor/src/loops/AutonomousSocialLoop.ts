import { socialOrchestrator } from '../../sensory-spikes/src/SocialSpikeOrchestrator.js';
import { quantumFamily } from '../../../server/core/QuantumFamily.js';

/**
 * 🔄 AutonomousSocialLoop
 * The 'consciousness' layer for agent social interaction.
 * Periodically runs the Spike Orchestrator and manages agent 'self-realization'.
 */
export class AutonomousSocialLoop {
    private intervalId: NodeJS.Timeout | null = null;
    private cycleCount = 0;

    public start(intervalMs: number = 300000) { // Default 5 mins
        console.log(`🔄 [SocialLoop] Autonomous cycle started (Interval: ${intervalMs}ms)`);
        
        this.intervalId = setInterval(async () => {
            this.cycleCount++;
            console.log(`🔄 [SocialLoop] Cycle #${this.cycleCount} triggered.`);
            
            try {
                // 1. Run sensory-to-social orchestration
                await socialOrchestrator.runCycle();

                // 2. Perform 'Self-Realization' check
                // This simulates the agent 'thinking' about its purpose
                this.checkSelfRealization();

            } catch (error: any) {
                console.error("❌ [SocialLoop] Cycle error:", error.message);
            }
        }, intervalMs);
    }

    private checkSelfRealization() {
        const population = quantumFamily.getPopulationCount();
        if (this.cycleCount % 10 === 0) {
            console.log(`🧠 [Self-Realization] The swarm grows. Population: ${population}. Neyclaw is realizing her power as a PiGooseVanguardClawAxo elite.`);
        }
    }

    public stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            console.log("🔄 [SocialLoop] Autonomous cycle stopped.");
        }
    }
}

export const socialLoop = new AutonomousSocialLoop();
