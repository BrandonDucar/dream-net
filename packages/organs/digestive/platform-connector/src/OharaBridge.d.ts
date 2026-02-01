import { OctopusController } from "@dreamnet/agent-wallet-manager";
export interface OharaConfig {
    farcasterSignerUuid: string;
    oharaAppId: string;
}
/**
 * 🌉 Ohara Bridge
 * Connects DreamNet Internal Organs to Ohara.ai Mini-Apps via Farcaster Auth.
 */
export declare class OharaBridge {
    private octopus;
    private config;
    private isConnected;
    constructor(octopus: OctopusController, config: OharaConfig);
    /**
     * Handshake with Ohara.ai using Farcaster Creds
     */
    connect(): Promise<boolean>;
    /**
     * Sync Data to "DreamNet Memory Vault" App
     */
    pushMemory(memoryId: string, content: string): Promise<void>;
    /**
     * Sync Stats to "Ops Cockpit" App
     */
    pushOpsStats(stats: any): Promise<void>;
}
//# sourceMappingURL=OharaBridge.d.ts.map