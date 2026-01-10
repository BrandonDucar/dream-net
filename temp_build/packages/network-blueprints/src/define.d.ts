/**
 * Network Blueprint Definition Helper
 * Provides a simplified API for defining network blueprints
 */
import type { NetworkBlueprint } from "./types";
interface DefineBlueprintInput {
    id: string;
    label: string;
    slug?: string;
    primaryDomain?: string;
    description?: string;
    version?: string;
    citizens?: Array<{
        id: string;
        label: string;
        type?: string;
        description?: string;
    }>;
    dreams?: Array<{
        id: string;
        label: string;
        type?: string;
        description?: string;
        founderCitizenId?: string;
        status?: string;
    }>;
    agents?: Array<{
        agentId: string;
        label: string;
        clusterId?: string;
        kind?: string;
        description?: string;
    }>;
    ports?: Array<{
        portId: string;
        label: string;
        description?: string;
    }>;
    conduits?: Array<{
        conduitId: string;
        portId: string;
        clusterId: string;
        toolId: string;
        label: string;
        description?: string;
    }>;
    metadata?: Record<string, unknown>;
}
/**
 * Define and auto-register a network blueprint
 * Transforms simplified input format to full NetworkBlueprint structure
 */
export declare function defineNetworkBlueprint(input: DefineBlueprintInput): NetworkBlueprint;
export {};
