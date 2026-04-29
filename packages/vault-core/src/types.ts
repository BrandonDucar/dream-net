export const VAULT_SCHEMA_VERSION = "2026-04-27.v1";

export type VaultSourceKind =
  | "local_files"
  | "repo"
  | "container"
  | "cloudflare"
  | "vercel"
  | "google_cloud"
  | "database"
  | "message_bus"
  | "connector"
  | "social"
  | "secret_registry"
  | "nuc"
  | "vault";

export type VaultAuthState =
  | "not_required"
  | "available"
  | "missing"
  | "expired"
  | "invalid"
  | "blocked"
  | "unknown";

export type VaultSensitivity =
  | "public"
  | "internal"
  | "confidential"
  | "secret_metadata";

export type VaultObjectKind =
  | "file"
  | "repository"
  | "container"
  | "cloud_resource"
  | "integration"
  | "health_check"
  | "secret_reference"
  | "vault_document"
  | "receipt";

export type VaultEventSeverity = "info" | "warn" | "error" | "blocked";

export type VaultReceiptStatus =
  | "success"
  | "degraded"
  | "blocked"
  | "failed";

export interface VaultSource {
  id: string;
  kind: VaultSourceKind;
  name: string;
  system: string;
  scope: string;
  authState: VaultAuthState;
  endpoint?: string;
  lastSeenAt: string;
  metadata?: Record<string, unknown>;
}

export interface VaultObject {
  id: string;
  sourceId: string;
  kind: VaultObjectKind;
  externalId: string;
  uri: string;
  title: string;
  contentHash?: string;
  sizeBytes?: number;
  mimeType?: string;
  tags: string[];
  sensitivity: VaultSensitivity;
  indexedAt: string;
  blobPointer?: string;
  vectorRef?: string;
  metadata?: Record<string, unknown>;
}

export interface VaultEvent {
  id: string;
  type: string;
  severity: VaultEventSeverity;
  sourceId: string;
  objectId?: string;
  message: string;
  createdAt: string;
  details?: Record<string, unknown>;
}

export interface VaultReceipt {
  id: string;
  schemaVersion: string;
  jobId: string;
  sourceIds: string[];
  action: "scan" | "heartbeat" | "mirror" | "schema";
  status: VaultReceiptStatus;
  startedAt: string;
  finishedAt: string;
  objectCount: number;
  eventCount: number;
  authContext: {
    state: VaultAuthState;
    principal?: string;
    scopes?: string[];
  };
  sensitivity: VaultSensitivity;
  destinationPointer?: string;
  previousHash?: string;
  hash: string;
  errors?: string[];
  metadata?: Record<string, unknown>;
}

export interface VaultIndexJob {
  id: string;
  name: string;
  sourceKind: VaultSourceKind;
  mode: "read_only" | "mirror_optional";
  enabled: boolean;
  handlerName: string;
  schedule?: string;
  tags: string[];
  metadata?: Record<string, unknown>;
}

export interface VaultInventoryOptions {
  rootDir: string;
  vaultHome: string;
  jobs: string[];
  maxLocalFiles: number;
  includeContentPreview: boolean;
  now?: Date;
}

export interface VaultInventoryResult {
  job: VaultIndexJob;
  startedAt: string;
  finishedAt: string;
  sources: VaultSource[];
  objects: VaultObject[];
  events: VaultEvent[];
  errors: string[];
}

export interface VaultRunSummary {
  startedAt: string;
  finishedAt: string;
  vaultHome: string;
  results: Array<{
    jobId: string;
    status: VaultReceiptStatus;
    sourceCount: number;
    objectCount: number;
    eventCount: number;
    receiptId: string;
    receiptHash: string;
  }>;
  totals: {
    sources: number;
    objects: number;
    events: number;
    blockedEvents: number;
    errors: number;
  };
}
