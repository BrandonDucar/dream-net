export type AliveSubsystemStatus = {
    ok: boolean;
    details?: string;
    error?: string;
};
export type AlivePhase = "booting" | "operational" | "degraded" | "error";
export type AliveStatus = {
    alive: boolean;
    phase: AlivePhase;
    timestamp: string;
    subsystems: {
        squadBuilder?: AliveSubsystemStatus;
        halo?: AliveSubsystemStatus;
        apiForge?: AliveSubsystemStatus;
        graftEngine?: AliveSubsystemStatus;
        sporeEngine?: AliveSubsystemStatus;
        eventWormholes?: AliveSubsystemStatus;
        memoryDna?: AliveSubsystemStatus;
        darkFabric?: AliveSubsystemStatus;
        dreamScope?: AliveSubsystemStatus;
    };
};
