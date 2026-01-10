/**
 * Directory Registry
 * Central registry for all DreamNet entities (citizens, agents, dreams, nodes, ports, conduits)
 */
import type { DirectoryEntry, DirectoryEntityType, DirectoryId, CitizenDirectoryEntry, AgentDirectoryEntry, DreamDirectoryEntry, NodeDirectoryEntry, PortDirectoryEntry, ConduitDirectoryEntry } from "./types";
export declare function registerEntry(entry: DirectoryEntry): DirectoryEntry;
export declare function getEntry(id: DirectoryId): DirectoryEntry | undefined;
export declare function listEntriesByType(type: DirectoryEntityType): DirectoryEntry[];
export declare function listAllEntries(): DirectoryEntry[];
export declare function searchEntries(query: string): DirectoryEntry[];
export declare function registerCitizen(props: {
    citizenId: string;
    label: string;
    description?: string;
}): CitizenDirectoryEntry;
export declare function registerAgent(props: {
    agentId: string;
    label: string;
    clusterId?: string;
    kind?: string;
    description?: string;
}): AgentDirectoryEntry;
export declare function registerDream(props: {
    dreamId: string;
    label: string;
    founderCitizenId?: string;
    status?: string;
    description?: string;
}): DreamDirectoryEntry;
export declare function registerNode(props: {
    nodeId: string;
    label: string;
    clusterId?: string;
    description?: string;
}): NodeDirectoryEntry;
export declare function registerPort(props: {
    portId: string;
    label: string;
    description?: string;
}): PortDirectoryEntry;
export declare function registerConduit(props: {
    conduitId: string;
    portId: string;
    clusterId: string;
    toolId: string;
    label: string;
    description?: string;
}): ConduitDirectoryEntry;
