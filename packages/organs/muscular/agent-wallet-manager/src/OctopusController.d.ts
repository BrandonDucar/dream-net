import { AgentWalletManager } from '../index.js';
export type OctopusArmType = "TREASURY_VAULT" | "DEFI_LIQUIDITY" | "GOVERNANCE_VOTER" | "ZORA_MINTING" | "OPERATIONS_FUND" | "SHIELD_UPKEEP" | "RESEARCH_GRANT" | "EMERGENCY_RESERVE";
interface OctopusArm {
    type: OctopusArmType;
    walletId: string;
    address: string;
    status: "active" | "sleeping" | "severed";
    taskFocus: string;
}
export declare class OctopusController {
    private arms;
    private brainWalletId;
    private manager;
    constructor(manager: AgentWalletManager, brainWalletId: string);
    /**
     * Wake the Octopus: Initialize all 8 Arms
     */
    awaken(): Promise<void>;
    private provisionArm;
    /**
     * Command an Arm to execute a task
     */
    execute(armType: OctopusArmType, action: () => Promise<any>): Promise<any>;
    getArmStatus(): OctopusArm[];
}
export {};
//# sourceMappingURL=OctopusController.d.ts.map