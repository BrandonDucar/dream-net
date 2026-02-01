/**
 * Auto-Recovery System
 * Suggests and executes recovery actions for failed subsystems
 */
import type { SubsystemSummary } from '../types.js';
export interface RecoveryAction {
    id: string;
    subsystem: string;
    action: "restart" | "reinitialize" | "clear_cache" | "reset_config" | "escalate";
    priority: "low" | "medium" | "high" | "critical";
    description: string;
    estimatedTime: number;
    risk: "low" | "medium" | "high";
}
/**
 * Generate recovery actions for failed subsystems
 */
export declare function generateRecoveryActions(subsystems: SubsystemSummary[]): RecoveryAction[];
/**
 * Execute recovery action (placeholder - would integrate with actual recovery)
 */
export declare function executeRecoveryAction(action: RecoveryAction): Promise<boolean>;
//# sourceMappingURL=autoRecovery.d.ts.map