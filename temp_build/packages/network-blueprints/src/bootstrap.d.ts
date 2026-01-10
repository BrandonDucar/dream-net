/**
 * Blueprint Bootstrap
 * Bootstraps DreamNet entities from a network blueprint
 */
import type { NetworkBlueprint } from "./types";
export interface BootstrapResult {
    blueprintId: string;
    citizensRegistered: number;
    agentsRegistered: number;
    dreamsRegistered: number;
    portsRegistered: number;
    conduitsRegistered: number;
    success: boolean;
    errors?: string[];
}
export declare function bootstrapFromBlueprint(blueprint: NetworkBlueprint): BootstrapResult;
