/**
 * Auto-Integration Detection System
 * Automatically detects systems that aren't integrated and suggests/adds them
 */
import type { DreamNetOSContext } from '../types.js';
export interface IntegrationGap {
    system: string;
    type: "missing_from_heartbeat" | "missing_seo" | "missing_geofencing" | "missing_api_keeper";
    severity: "low" | "medium" | "high";
    description: string;
    suggestedFix: string;
    autoFixable: boolean;
}
/**
 * Detect integration gaps
 */
export declare function detectIntegrationGaps(ctx: DreamNetOSContext): IntegrationGap[];
/**
 * Auto-fix integration gaps
 */
export declare function autoFixIntegrationGaps(ctx: DreamNetOSContext): {
    fixed: string[];
    failed: string[];
};
/**
 * Get detected gaps
 */
export declare function getIntegrationGaps(): IntegrationGap[];
//# sourceMappingURL=autoIntegration.d.ts.map