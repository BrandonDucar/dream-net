/**
 * Network Blueprint Registry
 * Manages registered network blueprints
 */
import type { NetworkBlueprint } from "./types";
export declare function registerBlueprint(blueprint: NetworkBlueprint): void;
export declare function getBlueprint(id: string): NetworkBlueprint | undefined;
export declare function listBlueprints(): NetworkBlueprint[];
