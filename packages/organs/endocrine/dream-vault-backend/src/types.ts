/**
 * Type definitions for DreamNet Vault Backend
 * Built on top of HashiCorp Vault
 */

/**
 * Vault Client Configuration
 */
export interface VaultConfig {
  /** Vault server address (e.g., http://localhost:8200) */
  address: string;
  /** Vault API token for authentication */
  token: string;
  /** Namespace (optional, for Vault Enterprise) */
  namespace?: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Enable SSL verification */
  ssl?: {
    rejectUnauthorized: boolean;
    ca?: string;
  };
}

/**
 * Secret metadata and value
 */
export interface VaultSecret<T = Record<string, any>> {
  /** Request ID (for audit trail) */
  request_id: string;
  /** Lease ID (for secrets with TTL) */
  lease_id: string;
  /** Time-to-live in seconds */
  lease_duration: number;
  /** Is renewable */
  renewable: boolean;
  /** Secret metadata */
  metadata: SecretMetadata;
  /** Secret data payload */
  data: T;
  /** Warnings (if any) */
  warnings?: string[];
}

/**
 * Secret metadata (versioning, deletion info, etc.)
 */
export interface SecretMetadata {
  cas_required: boolean;
  created_time: string;
  current_version: number;
  custom_metadata?: Record<string, string>;
  delete_version_after: string;
  max_versions: number;
  oldest_version: number;
  updated_time: string;
  versions: Record<number, VersionMetadata>;
}

export interface VersionMetadata {
  created_time: string;
  deletion_time?: string;
  destroyed: boolean;
}

/**
 * Authentication methods
 */
export enum AuthMethod {
  TOKEN = "token",
  APPROLE = "approle",
  KUBERNETES = "kubernetes",
  JWT = "jwt",
  LDAP = "ldap",
}

/**
 * AppRole authentication credentials
 */
export interface AppRoleAuth {
  role_id: string;
  secret_id: string;
}

/**
 * Vault audit log entry
 */
export interface AuditLogEntry {
  timestamp: string;
  type: "request" | "response";
  auth: {
    client_token: string;
    entity_id: string;
    display_name: string;
    policies: string[];
    principal_type: string;
    ttl?: string;
  };
  request: {
    client_token: string;
    path: string;
    method: string;
    headers: Record<string, string>;
  };
  response?: {
    secret: VaultSecret;
  };
  error?: string;
}

/**
 * Key rotation policy
 */
export interface RotationPolicy {
  /** Path to the secret */
  path: string;
  /** Rotation interval in seconds */
  interval: number;
  /** Last rotation timestamp */
  last_rotated?: string;
  /** Next rotation timestamp */
  next_rotation?: string;
  /** Rotation function */
  rotationFn: (currentSecret: any) => Promise<any>;
}

/**
 * Transit encryption key
 */
export interface TransitKey {
  name: string;
  type: "aes128-gcm96" | "aes256-gcm96" | "chacha20-poly1305" | "rsa-2048" | "rsa-4096";
  allow_plaintext_backup: boolean;
  keys: Record<number, string>;
  latest_version: number;
  min_decryption_version: number;
  supports_decryption: boolean;
  supports_derivation: boolean;
  supports_encryption: boolean;
  supports_signing: boolean;
}

/**
 * Encrypted data (transit engine)
 */
export interface EncryptedData {
  ciphertext: string;
  key_version: number;
}

/**
 * Decrypted data (transit engine)
 */
export interface DecryptedData {
  plaintext: string;
}

/**
 * Vault health status
 */
export interface VaultHealthStatus {
  initialized: boolean;
  sealed: boolean;
  standby: boolean;
  performance_standby: boolean;
  replication_performance_mode: string;
  replication_dr_mode: string;
  server_time_utc: number;
  version: string;
  cluster_name?: string;
  cluster_id?: string;
}

/**
 * RBAC Policy
 */
export interface VaultPolicy {
  name: string;
  rules: string; // HCL policy rules
}

/**
 * Treasury secret structure
 */
export interface TreasurySecret {
  HOT_SENDER_PK?: string;
  CIRCLE_API_KEY?: string;
  CIRCLE_ENTITY_SECRET?: string;
  SOVEREIGN_BEARER_TOKEN?: string;
  RUNTIME_BRIDGE_KEY?: string;
  ECONOMIC_ENGINE_KEY?: string;
  DREAMSHOP_API_KEY?: string;
}

/**
 * Main Vault Client Interface
 */
export interface IVaultClient {
  // Connection management
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  // Secret operations
  write<T = Record<string, any>>(path: string, data: T): Promise<VaultSecret<T>>;
  read<T = Record<string, any>>(path: string): Promise<VaultSecret<T>>;
  list(path: string): Promise<string[]>;
  delete(path: string): Promise<void>;

  // Secret metadata
  getMetadata(path: string): Promise<SecretMetadata>;
  updateMetadata(path: string, metadata: Partial<SecretMetadata>): Promise<void>;
  deleteAllVersions(path: string): Promise<void>;

  // Key rotation
  rotate(path: string, newValue: any): Promise<void>;
  setRotationPolicy(policy: RotationPolicy): Promise<void>;
  getRotationStatus(path: string): Promise<{ rotated_at?: string; next_rotation?: string }>;

  // Transit encryption
  encrypt(keyName: string, plaintext: string): Promise<EncryptedData>;
  decrypt(keyName: string, ciphertext: string): Promise<DecryptedData>;
  createTransitKey(name: string, type: string): Promise<TransitKey>;

  // Authentication
  authenticate(method: AuthMethod, credentials: any): Promise<string>;
  renewToken(token: string): Promise<string>;

  // Audit
  getAuditLogs(limit?: number): Promise<AuditLogEntry[]>;
  enableAuditLogging(backend: string, path: string): Promise<void>;

  // Health & Status
  health(): Promise<VaultHealthStatus>;
  seal(): Promise<void>;
  unseal(shard: string): Promise<void>;

  // Policy management
  createPolicy(policy: VaultPolicy): Promise<void>;
  deletePolicy(name: string): Promise<void>;
  listPolicies(): Promise<string[]>;
}

/**
 * Error types
 */
export class VaultError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = "VaultError";
  }
}

export class VaultConnectionError extends VaultError {
  constructor(message: string) {
    super(message, "CONNECTION_ERROR");
    this.name = "VaultConnectionError";
  }
}

export class VaultAuthenticationError extends VaultError {
  constructor(message: string) {
    super(message, "AUTHENTICATION_ERROR", 401);
    this.name = "VaultAuthenticationError";
  }
}

export class VaultAuthorizationError extends VaultError {
  constructor(message: string) {
    super(message, "AUTHORIZATION_ERROR", 403);
    this.name = "VaultAuthorizationError";
  }
}

export class VaultNotFoundError extends VaultError {
  constructor(path: string) {
    super(`Secret not found: ${path}`, "NOT_FOUND", 404);
    this.name = "VaultNotFoundError";
  }
}
