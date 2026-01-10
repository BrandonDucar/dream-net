
import { AgentWalletManager } from "../index";
import { ShieldStore } from "../../shield-core/store/shieldStore";
import { DreamSnailCore } from "../../dreamnet-snail-core";

// The 8 Strategic Arms of the Octopus
export type OctopusArmType =
    | "TREASURY_VAULT"
    | "DEFI_LIQUIDITY"
    | "GOVERNANCE_VOTER"
    | "ZORA_MINTING"
    | "OPERATIONS_FUND"
    | "SHIELD_UPKEEP"
    | "RESEARCH_GRANT"
    | "EMERGENCY_RESERVE";

interface OctopusArm {
    type: OctopusArmType;
    walletId: string;
    address: string;
    status: "active" | "sleeping" | "severed";
    taskFocus: string;
}

export class OctopusController {
    private arms: Map<OctopusArmType, OctopusArm> = new Map();
    private brainWalletId: string;
    private manager: AgentWalletManager;

    constructor(manager: AgentWalletManager, brainWalletId: string) {
        this.manager = manager;
        this.brainWalletId = brainWalletId;
    }

    /**
     * Wake the Octopus: Initialize all 8 Arms
     */
    async awaken(): Promise<void> {
        const shieldStatus = ShieldStore.status();
        if (shieldStatus.shieldHealth === "critical") {
            console.warn("🐙 [Octopus] Too dangerous to wake up. Shield is critical.");
            return;
        }

        // Initialize/Load Arms
        await this.provisionArm("TREASURY_VAULT", "Cold Storage & Long Term Asset Holding");
        await this.provisionArm("DEFI_LIQUIDITY", "Active LP Management on Base");
        await this.provisionArm("GOVERNANCE_VOTER", "Voting on Proposals");
        await this.provisionArm("ZORA_MINTING", "Minting Dream Memories as NFTs");
        await this.provisionArm("OPERATIONS_FUND", "Paying Gas & Server Costs");
        await this.provisionArm("SHIELD_UPKEEP", "Funding Security Bounties");
        await this.provisionArm("RESEARCH_GRANT", "Wolf Pack Grant Management");
        await this.provisionArm("EMERGENCY_RESERVE", "Ink Sac - Emergency Exit Liquidity");

        console.log(`🐙 [Octopus] Awakened with ${this.arms.size} active arms.`);

        // Log wake-up provenance
        DreamSnailCore.recordTrail(this.brainWalletId, "octopus:awaken", { arms: this.arms.size });
    }

    private async provisionArm(type: OctopusArmType, task: string) {
        // In a real system, we'd load existing wallets or derive them from a master seed path
        // For now, we mock the derivation/retrieval via the manager
        const walletId = `arm_${type.toLowerCase()}`;

        // Check if exists, else create
        const wallet = await this.manager.getOrCreateWallet(walletId, "base", type);

        if (wallet) {
            this.arms.set(type, {
                type,
                walletId,
                address: wallet.address,
                status: "active",
                taskFocus: task
            });
        }
    }

    /**
     * Command an Arm to execute a task
     */
    async execute(armType: OctopusArmType, action: () => Promise<any>): Promise<any> {
        const arm = this.arms.get(armType);
        if (!arm || arm.status !== "active") {
            throw new Error(`Arm ${armType} is not active.`);
        }

        // 1. Strategic Shield Check
        const shield = ShieldStore.status();
        // If >10 threats or degraded heuristic
        if (shield.threatsDetected > 10 || shield.shieldHealth === "degraded" || shield.shieldHealth === "critical") {
            // If High Risk, only allow Emergency Arm
            if (armType !== "EMERGENCY_RESERVE") {
                console.warn(`🐙 [Octopus] Withholding functionality for ${armType} due to Shield Warning.`);
                throw new Error("Security Risk: Action Aborted by Octopus Brain.");
            }
        }

        // 2. Execute
        try {
            const result = await action();

            // 3. Snail Trail (Provenance)
            DreamSnailCore.recordTrail(arm.address, `octopus:exec:${armType}`, { result }, { privacyLevel: "encrypted" });

            return result;
        } catch (error) {
            console.error(`🐙 [Octopus] Arm ${armType} failed:`, error);
            throw error;
        }
    }

    getArmStatus(): OctopusArm[] {
        return Array.from(this.arms.values());
    }
}
