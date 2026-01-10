/**
 * Mycelium Network Logic
 * Distributed webhook routing with self-healing paths
 */
import type { WebhookHypha, WebhookMycelium } from "../types";
/**
 * Create a hypha (webhook path)
 */
export declare function createHypha(sourceId: string, targetId: string, options?: {
    strength?: number;
    capacity?: number;
}): WebhookHypha;
/**
 * Create a mycelium network (webhook network)
 */
export declare function createMycelium(name: string, neuronIds: string[], hyphaIds: string[]): WebhookMycelium;
/**
 * Find optimal path through mycelium network
 */
export declare function findOptimalPath(sourceId: string, targetId: string, myceliumId?: string): string[] | null;
/**
 * Heal damaged hyphae (self-healing network)
 */
export declare function healHyphae(): void;
/**
 * Find alternative paths if primary path fails
 */
export declare function findAlternativePath(failedHyphaId: string, sourceId: string, targetId: string): string[] | null;
/**
 * Get all hyphae
 */
export declare function getHyphae(): WebhookHypha[];
/**
 * Get all mycelia
 */
export declare function getMycelia(): WebhookMycelium[];
/**
 * Update hypha load
 */
export declare function updateHyphaLoad(hyphaId: string, load: number): void;
