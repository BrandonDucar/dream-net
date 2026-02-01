import { broadcastStarbridgeEvent } from "../starbridge/bus.js";
import { StarbridgeTopic, StarbridgeSource } from "../starbridge/types.js";
import { metabolicBridge } from "./MetabolicBridgeService.js";

/**
 * Metabolic Pulse Service (The Heartbeat)
 * 
 * Cyclically triggers sensing, foraging, and payout events.
 * It "breathes" life into the 143 Agent Citizens.
 */
export class MetabolicPulseService {
    private pulseInterval: NodeJS.Timeout | null = null;
    private isBeating: boolean = false;

    /**
     * Ignite the Pulse
     */
    public ignite() {
        if (this.isBeating) return;
        this.isBeating = true;

        console.log("🦾 [MetabolicPulse] Engine Ignited. Foraging sequence commencing.");

        // Every 5 minutes, trigger a Foraging Pulse
        this.pulseInterval = setInterval(() => {
            this.beat();
        }, 5 * 60 * 1000);

        // Immediate first beat
        this.beat();
    }

    /**
     * A single metabolic cycle: Sense -> Forage -> Payout
     */
    private async beat() {
        try {
            console.log("💓 [MetabolicPulse] Cycle: Inhaling data, exhaling value...");

            // 1. Trigger Sensing Event
            await broadcastStarbridgeEvent({
                topic: StarbridgeTopic.System,
                source: StarbridgeSource.Runtime,
                type: "metabolic.sense",
                payload: { strategy: "SCAN_RARE_GOODS_WHOP" }
            });

            // 2. Trigger Foraging (Locator Logic)
            // In a real run, this would call Ducar Consulting locator APIs
            await broadcastStarbridgeEvent({
                topic: StarbridgeTopic.System,
                source: StarbridgeSource.Runtime,
                type: "metabolic.forage",
                payload: { targets: ["Silver", "Labubus", "Gold"] }
            });

            // 3. Simulate a Metabolic Payout (Solana -> Base)
            // If the treasury has excess SOL, exhale to Base for Whop profits
            const mockAmount = (Math.random() * 10).toFixed(2);
            if (parseFloat(mockAmount) > 5) {
                console.log(`🤑 [MetabolicPulse] Significant foraging success! Initiating metabolic payout: ${mockAmount} USDC.`);
                await metabolicBridge.bridgeSolanaToBase(mockAmount, "0xMONOLITH_METAMASK_MOCK");
            }

        } catch (error) {
            console.error("💔 [MetabolicPulse] Arrythmia detected:", error);
        }
    }

    /**
     * Stop the Pulse
     */
    public stop() {
        if (this.pulseInterval) {
            clearInterval(this.pulseInterval);
            this.pulseInterval = null;
        }
        this.isBeating = false;
        console.log("🛑 [MetabolicPulse] Engine halted.");
    }
}

export const metabolicPulse = new MetabolicPulseService();
