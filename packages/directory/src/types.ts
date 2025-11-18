/**
 * Directory Types
 * Defines entity types and directory entries for DreamNet's discovery system
 */

export type DirectoryEntityType =
  | "citizen"
  | "agent"
  | "dream"
  | "node"
  | "port"
  | "conduit";

export type DirectoryId = string;

export interface DirectoryBase {
  id: DirectoryId;
  type: DirectoryEntityType;
  label: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Citizens (humans/entities with passports)
export interface CitizenDirectoryEntry extends DirectoryBase {
  type: "citizen";
  citizenId: string; // e.g. "CIT-000001" or "CIT-BRANDON"
  // Optionally: wallet addresses, external handles later
}

// Agents (software actors)
export interface AgentDirectoryEntry extends DirectoryBase {
  type: "agent";
  agentId: string; // from Agent Registry
  clusterId?: string;
  kind?: string;
}

// Dreams (projects/verticals)
export interface DreamDirectoryEntry extends DirectoryBase {
  type: "dream";
  dreamId: string; // e.g. "DREAM-0001"
  founderCitizenId?: string;
  status?: string; // "seed" | "sprout" | ...
}

// Nodes (cores/organs)
export interface NodeDirectoryEntry extends DirectoryBase {
  type: "node";
  nodeId: string; // e.g. "NODE-SHIELD-CORE"
  clusterId?: string;
}

// Ports (edge ports)
export interface PortDirectoryEntry extends DirectoryBase {
  type: "port";
  portId: string; // e.g. "AGENT_GATEWAY", "ENVKEEPER_PORT"
}

// Conduits (port → cluster → tool lines)
export interface ConduitDirectoryEntry extends DirectoryBase {
  type: "conduit";
  conduitId: string;
  portId: string;
  clusterId: string;
  toolId: string;
}

export type DirectoryEntry =
  | CitizenDirectoryEntry
  | AgentDirectoryEntry
  | DreamDirectoryEntry
  | NodeDirectoryEntry
  | PortDirectoryEntry
  | ConduitDirectoryEntry;
