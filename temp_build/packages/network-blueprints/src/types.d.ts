/**
 * Network Blueprint Types
 * Defines the structure for network configurations that can bootstrap DreamNet instances
 */
export interface NetworkBlueprint {
    id: string;
    label: string;
    slug: string;
    primaryDomain?: string;
    description?: string;
    version?: string;
    citizens?: Array<{
        citizenId: string;
        label: string;
        description?: string;
    }>;
    agents?: Array<{
        agentId: string;
        label: string;
        clusterId?: string;
        kind?: string;
        description?: string;
    }>;
    dreams?: Array<{
        dreamId: string;
        label: string;
        founderCitizenId?: string;
        status?: string;
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
