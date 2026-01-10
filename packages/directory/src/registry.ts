/**
 * Directory Registry
 * Central registry for all DreamNet entities (citizens, agents, dreams, nodes, ports, conduits)
 */

import type {
  DirectoryEntry,
  DirectoryEntityType,
  DirectoryId,
  CitizenDirectoryEntry,
  AgentDirectoryEntry,
  DreamDirectoryEntry,
  NodeDirectoryEntry,
  PortDirectoryEntry,
  ConduitDirectoryEntry,
} from './types.js';

const DIRECTORY: Map<DirectoryId, DirectoryEntry> = new Map();

function nowIso(): string {
  return new Date().toISOString();
}

export function registerEntry(entry: DirectoryEntry): DirectoryEntry {
  const existing = DIRECTORY.get(entry.id);
  const timestamp = nowIso();

  const withTimestamps: DirectoryEntry = {
    ...entry,
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };

  DIRECTORY.set(entry.id, withTimestamps);
  return withTimestamps;
}

export function getEntry(id: DirectoryId): DirectoryEntry | undefined {
  return DIRECTORY.get(id);
}

export function listEntriesByType(type: DirectoryEntityType): DirectoryEntry[] {
  return Array.from(DIRECTORY.values()).filter((e) => e.type === type);
}

export function listAllEntries(): DirectoryEntry[] {
  return Array.from(DIRECTORY.values());
}

export function searchEntries(query: string): DirectoryEntry[] {
  const lowerQuery = query.toLowerCase();
  return Array.from(DIRECTORY.values()).filter(
    (e) =>
      e.label.toLowerCase().includes(lowerQuery) ||
      e.id.toLowerCase().includes(lowerQuery) ||
      e.description?.toLowerCase().includes(lowerQuery)
  );
}

// Helper creators for each entity type:

export function registerCitizen(props: {
  citizenId: string;
  label: string;
  description?: string;
}): CitizenDirectoryEntry {
  const id = props.citizenId; // use citizenId as directory id for now
  const base = {
    id,
    type: "citizen" as const,
    label: props.label,
    description: props.description,
    createdAt: "",
    updatedAt: "",
  };
  return registerEntry({
    ...base,
    citizenId: props.citizenId,
  }) as CitizenDirectoryEntry;
}

export function registerAgent(props: {
  agentId: string;
  label: string;
  clusterId?: string;
  kind?: string;
  description?: string;
}): AgentDirectoryEntry {
  const id = `AGENT-${props.agentId}`;
  const base = {
    id,
    type: "agent" as const,
    label: props.label,
    description: props.description,
    createdAt: "",
    updatedAt: "",
  };
  return registerEntry({
    ...base,
    agentId: props.agentId,
    clusterId: props.clusterId,
    kind: props.kind,
  }) as AgentDirectoryEntry;
}

export function registerDream(props: {
  dreamId: string;
  label: string;
  founderCitizenId?: string;
  status?: string;
  description?: string;
}): DreamDirectoryEntry {
  const id = props.dreamId;
  const base = {
    id,
    type: "dream" as const,
    label: props.label,
    description: props.description,
    createdAt: "",
    updatedAt: "",
  };
  return registerEntry({
    ...base,
    dreamId: props.dreamId,
    founderCitizenId: props.founderCitizenId,
    status: props.status,
  }) as DreamDirectoryEntry;
}

export function registerNode(props: {
  nodeId: string;
  label: string;
  clusterId?: string;
  description?: string;
}): NodeDirectoryEntry {
  const id = props.nodeId;
  const base = {
    id,
    type: "node" as const,
    label: props.label,
    description: props.description,
    createdAt: "",
    updatedAt: "",
  };
  return registerEntry({
    ...base,
    nodeId: props.nodeId,
    clusterId: props.clusterId,
  }) as NodeDirectoryEntry;
}

export function registerPort(props: {
  portId: string;
  label: string;
  description?: string;
}): PortDirectoryEntry {
  const id = `PORT-${props.portId}`;
  const base = {
    id,
    type: "port" as const,
    label: props.label,
    description: props.description,
    createdAt: "",
    updatedAt: "",
  };
  return registerEntry({
    ...base,
    portId: props.portId,
  }) as PortDirectoryEntry;
}

export function registerConduit(props: {
  conduitId: string;
  portId: string;
  clusterId: string;
  toolId: string;
  label: string;
  description?: string;
}): ConduitDirectoryEntry {
  const id = `CONDUIT-${props.conduitId}`;
  const base = {
    id,
    type: "conduit" as const,
    label: props.label,
    description: props.description,
    createdAt: "",
    updatedAt: "",
  };
  return registerEntry({
    ...base,
    conduitId: props.conduitId,
    portId: props.portId,
    clusterId: props.clusterId,
    toolId: props.toolId,
  }) as ConduitDirectoryEntry;
}
