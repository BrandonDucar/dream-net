import type {
  VaultEvent,
  VaultEventSeverity,
  VaultIndexJob,
  VaultInventoryResult,
  VaultObject,
  VaultObjectKind,
  VaultSensitivity,
  VaultSource,
  VaultSourceKind,
} from "../types.js";
import { createVaultId } from "../hash.js";

export function createJob(id: string, name: string, sourceKind: VaultSourceKind, handlerName: string, tags: string[]): VaultIndexJob {
  return {
    id,
    name,
    sourceKind,
    mode: "read_only",
    enabled: true,
    handlerName,
    tags,
  };
}

export function createSource(input: Omit<VaultSource, "id" | "lastSeenAt"> & { id?: string; now: string }): VaultSource {
  return {
    id: input.id ?? createVaultId("source", input.kind, input.system, input.scope),
    kind: input.kind,
    name: input.name,
    system: input.system,
    scope: input.scope,
    authState: input.authState,
    endpoint: input.endpoint,
    lastSeenAt: input.now,
    metadata: input.metadata,
  };
}

export function createObject(input: {
  sourceId: string;
  kind: VaultObjectKind;
  externalId: string;
  uri: string;
  title: string;
  indexedAt: string;
  contentHash?: string;
  sizeBytes?: number;
  mimeType?: string;
  tags?: string[];
  sensitivity?: VaultSensitivity;
  blobPointer?: string;
  vectorRef?: string;
  metadata?: Record<string, unknown>;
}): VaultObject {
  return {
    id: createVaultId("object", input.sourceId, input.kind, input.externalId, input.contentHash),
    sourceId: input.sourceId,
    kind: input.kind,
    externalId: input.externalId,
    uri: input.uri,
    title: input.title,
    contentHash: input.contentHash,
    sizeBytes: input.sizeBytes,
    mimeType: input.mimeType,
    tags: input.tags ?? [],
    sensitivity: input.sensitivity ?? "internal",
    indexedAt: input.indexedAt,
    blobPointer: input.blobPointer,
    vectorRef: input.vectorRef,
    metadata: input.metadata,
  };
}

export function createEvent(input: {
  type: string;
  severity: VaultEventSeverity;
  sourceId: string;
  message: string;
  createdAt: string;
  objectId?: string;
  details?: Record<string, unknown>;
}): VaultEvent {
  return {
    id: createVaultId("event", input.type, input.sourceId, input.message, input.createdAt),
    type: input.type,
    severity: input.severity,
    sourceId: input.sourceId,
    objectId: input.objectId,
    message: input.message,
    createdAt: input.createdAt,
    details: input.details,
  };
}

export function emptyResult(job: VaultIndexJob, startedAt: string): VaultInventoryResult {
  return {
    job,
    startedAt,
    finishedAt: new Date().toISOString(),
    sources: [],
    objects: [],
    events: [],
    errors: [],
  };
}
