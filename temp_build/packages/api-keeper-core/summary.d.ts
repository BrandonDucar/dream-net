/**
 * API Keeper Summary
 * Provides summary statistics for Ports Ops Panel
 */
export interface APIKeeperSummary {
    totalKeys: number;
    byProvider: Record<string, number>;
    lastScanAt: string | null;
    costToday: number;
    costThisMonth: number;
}
/**
 * Get API Keeper summary for Ports Ops Panel
 */
export declare function getApiKeeperSummary(): APIKeeperSummary;
