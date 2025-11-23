/**
 * Runtime Status Adapter
 *
 * Provides a safe, importable interface for getting DreamNet OS runtime status.
 * Works in both Node.js (server) and browser environments.
 * Falls back to mocked data if core packages are not available.
 */
/**
 * Get a runtime status snapshot.
 *
 * In Node.js/server environments with RuntimeBridgeCore available:
 * - Uses real data from DreamNetOSCore.getSnapshot()
 *
 * In browser environments or when cores are unavailable:
 * - Returns mocked data with realistic structure
 */
export function getRuntimeStatusSnapshot() {
    // Check if we're in a Node.js environment
    const isNode = typeof process !== 'undefined' && process.versions?.node;
    // Try to use real RuntimeBridgeCore if available (Node.js/server context only)
    if (isNode) {
        try {
            // Use dynamic import for Node.js environments
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const runtimeBridge = require("@dreamnet/runtime-bridge-core");
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const dreamNetOS = require("@dreamnet/dreamnet-os-core");
            if (runtimeBridge?.RuntimeBridgeCore && dreamNetOS?.DreamNetOSCore) {
                const bridgeStatus = runtimeBridge.RuntimeBridgeCore.getStatus();
                const osSnapshot = dreamNetOS.DreamNetOSCore.getSnapshot();
                if (osSnapshot) {
                    return {
                        heartbeatAt: osSnapshot.heartbeatAt ?? null,
                        infraHealth: osSnapshot.globalHealth?.infraHealth ?? 0.5,
                        economyHealth: osSnapshot.globalHealth?.economyHealth ?? 0.5,
                        socialHealth: osSnapshot.globalHealth?.socialHealth ?? 0.5,
                        dreamPipelineHealth: osSnapshot.globalHealth?.dreamPipelineHealth ?? 0.5,
                        subsystems: (osSnapshot.subsystems ?? []).map((sub) => ({
                            name: sub.name ?? "Unknown",
                            status: (sub.status ?? "unknown"),
                            details: sub.details,
                        })),
                    };
                }
            }
        }
        catch (err) {
            // RuntimeBridgeCore or DreamNetOSCore not available
            // Fall through to mocked data
        }
    }
    // Fallback: Return mocked data with realistic structure
    // This is used in browser contexts or when cores are unavailable
    return getMockedRuntimeStatus();
}
/**
 * Generate mocked runtime status data.
 * Used when core packages are not available (e.g., in browser).
 */
function getMockedRuntimeStatus() {
    const now = Date.now();
    return {
        heartbeatAt: now,
        infraHealth: 0.85,
        economyHealth: 0.75,
        socialHealth: 0.90,
        dreamPipelineHealth: 0.80,
        subsystems: [
            { name: "DreamVault", status: "ok", details: "Items=5" },
            { name: "DreamShop", status: "ok", details: "Offers=4" },
            { name: "FieldLayer", status: "ok", details: "Samples=120" },
            { name: "DreamBetCore", status: "ok", details: "Games=2, Rounds=10" },
            { name: "ZenGardenCore", status: "ok", details: "Sessions=1, Rewards=1" },
            { name: "DreamTankCore", status: "ok", details: "Dreams=1, Evaluations=0" },
            { name: "LiquidityEngine", status: "ok", details: "Pools=3, Planned=3, Active=0" },
            { name: "SocialHubCore", status: "ok", details: "Posts=2, Comments=0" },
            { name: "EconomicEngineCore", status: "ok", details: "Tokens=6, Balances=1, Rewards=1" },
            { name: "AgentRegistryCore", status: "ok", details: "Agents=10, Errors=0" },
            { name: "InitRitualCore", status: "ok", details: "Active=1, Completed=0" },
            { name: "DreamCortex", status: "ok", details: "Dreams=1" },
            { name: "ReputationLattice", status: "ok", details: "Scores=15" },
            { name: "NarrativeField", status: "ok", details: "Entries=8" },
            { name: "IdentityGrid", status: "ok", details: "Nodes=3, Edges=5" },
        ],
    };
}
