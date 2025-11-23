/**
 * Runtime Status Adapter
 *
 * Provides a safe, importable interface for getting DreamNet OS runtime status.
 * Works in both Node.js (server) and browser environments.
 * Falls back to mocked data if core packages are not available.
 */
export interface RuntimeStatusViewModel {
    heartbeatAt: number | null;
    infraHealth: number;
    economyHealth: number;
    socialHealth: number;
    dreamPipelineHealth: number;
    subsystems: {
        name: string;
        status: "ok" | "warn" | "error" | "unknown";
        details?: string;
    }[];
}
/**
 * Get a runtime status snapshot.
 *
 * In Node.js/server environments with RuntimeBridgeCore available:
 * - Uses real data from DreamNetOSCore.getSnapshot()
 *
 * In browser environments or when cores are unavailable:
 * - Returns mocked data with realistic structure
 */
export declare function getRuntimeStatusSnapshot(): RuntimeStatusViewModel;
