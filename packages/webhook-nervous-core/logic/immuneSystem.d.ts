/**
 * Immune System Logic
 * Pattern recognition, threat detection, and automatic defense
 */
import type { WebhookAntigen, WebhookAntibody, WebhookMemoryCell, WebhookEvent } from "../types";
/**
 * Create an antibody (webhook validator/security rule)
 */
export declare function createAntibody(name: string, pattern: string, action: WebhookAntibody["action"], options?: {
    memory?: boolean;
    effectiveness?: number;
}): WebhookAntibody;
/**
 * Detect antigens (threats) in webhook event
 */
export declare function detectAntigens(event: WebhookEvent): WebhookAntigen[];
/**
 * Neutralize antigen (mark as handled)
 */
export declare function neutralizeAntigen(antigenId: string): boolean;
/**
 * Get all antigens
 */
export declare function getAntigens(): WebhookAntigen[];
/**
 * Get all antibodies
 */
export declare function getAntibodies(): WebhookAntibody[];
/**
 * Get all memory cells
 */
export declare function getMemoryCells(): WebhookMemoryCell[];
/**
 * Decay memory cells (forget old patterns)
 */
export declare function decayMemoryCells(): void;
