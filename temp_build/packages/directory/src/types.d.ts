/**
 * Directory Types
 * Defines entity types and directory entries for DreamNet's discovery system
 */
export type DirectoryEntityType = "citizen" | "agent" | "dream" | "node" | "port" | "conduit";
export type DirectoryId = string;
export interface DirectoryBase {
    id: DirectoryId;
    type: DirectoryEntityType;
    label: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}
export interface CitizenDirectoryEntry extends DirectoryBase {
    type: "citizen";
    citizenId: string;
}
export interface AgentDirectoryEntry extends DirectoryBase {
    type: "agent";
    agentId: string;
    clusterId?: string;
    kind?: string;
}
export interface DreamDirectoryEntry extends DirectoryBase {
    type: "dream";
    dreamId: string;
    founderCitizenId?: string;
    status?: string;
}
export interface NodeDirectoryEntry extends DirectoryBase {
    type: "node";
    nodeId: string;
    clusterId?: string;
}
export interface PortDirectoryEntry extends DirectoryBase {
    type: "port";
    portId: string;
}
export interface ConduitDirectoryEntry extends DirectoryBase {
    type: "conduit";
    conduitId: string;
    portId: string;
    clusterId: string;
    toolId: string;
}
export type DirectoryEntry = CitizenDirectoryEntry | AgentDirectoryEntry | DreamDirectoryEntry | NodeDirectoryEntry | PortDirectoryEntry | ConduitDirectoryEntry;
