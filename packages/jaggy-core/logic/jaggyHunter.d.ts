/**
 * Jaggy Hunter Logic
 * Actively hunts for webhooks, APIs, and opportunities
 * Like Wolf Pack but for webhooks - silent and deadly
 */
import type { JaggyHunt, JaggyTerritory, JaggyMemory } from "../types";
/**
 * Jaggy hunts for webhooks in a territory
 */
export declare function huntWebhooks(territory: JaggyTerritory): Promise<JaggyHunt[]>;
/**
 * Jaggy implements a discovery (pounces)
 */
export declare function implementDiscovery(huntId: string): Promise<boolean>;
/**
 * Jaggy watches the mesh for opportunities
 */
export declare function watchMesh(event: any): JaggyHunt[];
/**
 * Get active hunts
 */
export declare function getActiveHunts(): JaggyHunt[];
/**
 * Get memories
 */
export declare function getMemories(): JaggyMemory[];
/**
 * Create territory
 */
export declare function createTerritory(name: string, type: JaggyTerritory["type"]): JaggyTerritory;
/**
 * Get territories
 */
export declare function getTerritories(): JaggyTerritory[];
