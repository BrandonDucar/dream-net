export interface RuntimeContext {
    DreamVault?: any;
    DreamShop?: any;
    FieldLayer?: any;
    DreamBetCore?: any;
    ZenGardenCore?: any;
    CivicPanelCore?: any;
    DreamTankCore?: any;
    LiquidityEngine?: any;
    SocialHubCore?: any;
    InitRitualCore?: any;
    EconomicEngineCore?: any;
    AgentRegistryCore?: any;
    DreamNetOSCore?: any;
    WolfPackFundingCore?: any;
    WolfPackAnalystCore?: any;
    IdentityGrid?: any;
    ReputationLattice?: any;
    NarrativeField?: any;
    NeuralMesh?: any;
    OrchestratorCore?: any;
}
export interface RuntimeSnapshot {
    lastCycleAt: number | null;
    lastCycleDurationMs: number | null;
    lastCycleError?: string;
    osStatus?: any;
    civicStatus?: any;
    econStatus?: any;
}
export interface RuntimeBridgeStatus {
    initialized: boolean;
    snapshots: RuntimeSnapshot;
}
