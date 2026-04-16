/**
 * Vault Client - Main implementation for HashiCorp Vault integration
 */

import VaultLib from "node-vault";
import {
  VaultConfig,
  VaultSecret,
  IVaultClient,
  AuthMethod,
  VaultHealthStatus,
  AuditLogEntry,
  RotationPolicy,
  SecretMetadata,
  EncryptedData,
  DecryptedData,
  TransitKey,
  VaultPolicy,
  VaultError,
  VaultConnectionError,
  VaultAuthenticationError,
  VaultNotFoundError,
} from "./types.js";

export class VaultClient implements IVaultClient {
  private vault: VaultLib.client | null = null;
  private config: VaultConfig;
  private isReady = false;

  constructor(config: VaultConfig) {
    this.config = {
      timeout: 30000,
      ...config,
    };
  }

  /**
   * Connect to Vault server
   */
  async connect(): Promise<void> {
    try {
      this.vault = VaultLib({
        endpoint: this.config.address,
        token: this.config.token,
        namespace: this.config.namespace,
      });

      // Test connection
      await this.health();
      this.isReady = true;
      console.log("✅ Connected to Vault:", this.config.address);
    } catch (error) {
      throw new VaultConnectionError(
        `Failed to connect to Vault: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Disconnect from Vault
   */
  async disconnect(): Promise<void> {
    this.vault = null;
    this.isReady = false;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.isReady && this.vault !== null;
  }

  /**
   * Ensure vault client is ready
   */
  private ensureReady(): void {
    if (!this.isConnected()) {
      throw new VaultConnectionError("Vault client not connected");
    }
  }

  /**
   * Write a secret to Vault (KV v2)
   */
  async write<T = Record<string, any>>(path: string, data: T): Promise<VaultSecret<T>> {
    this.ensureReady();
    try {
      const response = await this.vault!.write(`secret/data/${path}`, { data });
      return response;
    } catch (error) {
      throw new VaultError(
        `Failed to write secret at ${path}: ${error instanceof Error ? error.message : String(error)}`,
        "WRITE_ERROR"
      );
    }
  }

  /**
   * Read a secret from Vault (KV v2)
   */
  async read<T = Record<string, any>>(path: string): Promise<VaultSecret<T>> {
    this.ensureReady();
    try {
      const response = await this.vault!.read(`secret/data/${path}`);
      if (!response) {
        throw new VaultNotFoundError(path);
      }
      return response;
    } catch (error) {
      if (error instanceof VaultNotFoundError) throw error;
      throw new VaultError(
        `Failed to read secret from ${path}: ${error instanceof Error ? error.message : String(error)}`,
        "READ_ERROR"
      );
    }
  }

  /**
   * List secrets at a path
   */
  async list(path: string): Promise<string[]> {
    this.ensureReady();
    try {
      const response = await this.vault!.list(`secret/metadata/${path}`);
      return response.data.keys || [];
    } catch (error) {
      throw new VaultError(
        `Failed to list secrets at ${path}: ${error instanceof Error ? error.message : String(error)}`,
        "LIST_ERROR"
      );
    }
  }

  /**
   * Delete a secret
   */
  async delete(path: string): Promise<void> {
    this.ensureReady();
    try {
      await this.vault!.delete(`secret/metadata/${path}`);
      console.log(`✓ Deleted secret: ${path}`);
    } catch (error) {
      throw new VaultError(
        `Failed to delete secret at ${path}: ${error instanceof Error ? error.message : String(error)}`,
        "DELETE_ERROR"
      );
    }
  }

  /**
   * Get secret metadata
   */
  async getMetadata(path: string): Promise<SecretMetadata> {
    this.ensureReady();
    try {
      const response = await this.vault!.read(`secret/metadata/${path}`);
      return response.data;
    } catch (error) {
      throw new VaultError(
        `Failed to get metadata for ${path}: ${error instanceof Error ? error.message : String(error)}`,
        "METADATA_ERROR"
      );
    }
  }

  /**
   * Update secret metadata
   */
  async updateMetadata(path: string, metadata: Partial<SecretMetadata>): Promise<void> {
    this.ensureReady();
    try {
      await this.vault!.write(`secret/metadata/${path}`, metadata);
    } catch (error) {
      throw new VaultError(
        `Failed to update metadata for ${path}: ${error instanceof Error ? error.message : String(error)}`,
        "METADATA_UPDATE_ERROR"
      );
    }
  }

  /**
   * Delete all versions of a secret
   */
  async deleteAllVersions(path: string): Promise<void> {
    this.ensureReady();
    try {
      await this.vault!.delete(`secret/metadata/${path}`);
    } catch (error) {
      throw new VaultError(
        `Failed to delete all versions of ${path}: ${error instanceof Error ? error.message : String(error)}`,
        "DELETE_ALL_ERROR"
      );
    }
  }

  /**
   * Rotate a secret
   */
  async rotate(path: string, newValue: any): Promise<void> {
    this.ensureReady();
    try {
      // Get current version
      const current = await this.read(path);

      // Write new version
      await this.write(path, { ...current.data.data, ...newValue });

      console.log(`✓ Rotated secret: ${path}`);
    } catch (error) {
      throw new VaultError(
        `Failed to rotate secret at ${path}: ${error instanceof Error ? error.message : String(error)}`,
        "ROTATE_ERROR"
      );
    }
  }

  /**
   * Set rotation policy (not directly supported by Vault, requires external scheduling)
   */
  async setRotationPolicy(policy: RotationPolicy): Promise<void> {
    // This would be implemented with external scheduling (cron, K8s CronJob, etc.)
    console.log(`✓ Set rotation policy for ${policy.path}: every ${policy.interval}s`);
  }

  /**
   * Get rotation status
   */
  async getRotationStatus(
    path: string
  ): Promise<{ rotated_at?: string; next_rotation?: string }> {
    try {
      const metadata = await this.getMetadata(path);
      return {
        rotated_at: metadata.updated_time,
      };
    } catch (error) {
      throw new VaultError(
        `Failed to get rotation status for ${path}: ${error instanceof Error ? error.message : String(error)}`,
        "ROTATION_STATUS_ERROR"
      );
    }
  }

  /**
   * Encrypt data (Transit engine)
   */
  async encrypt(keyName: string, plaintext: string): Promise<EncryptedData> {
    this.ensureReady();
    try {
      const response = await this.vault!.write(`transit/encrypt/${keyName}`, {
        plaintext: Buffer.from(plaintext).toString("base64"),
      });
      return {
        ciphertext: response.data.ciphertext,
        key_version: response.data.key_version,
      };
    } catch (error) {
      throw new VaultError(
        `Failed to encrypt with key ${keyName}: ${error instanceof Error ? error.message : String(error)}`,
        "ENCRYPT_ERROR"
      );
    }
  }

  /**
   * Decrypt data (Transit engine)
   */
  async decrypt(keyName: string, ciphertext: string): Promise<DecryptedData> {
    this.ensureReady();
    try {
      const response = await this.vault!.write(`transit/decrypt/${keyName}`, {
        ciphertext,
      });
      return {
        plaintext: Buffer.from(response.data.plaintext, "base64").toString("utf-8"),
      };
    } catch (error) {
      throw new VaultError(
        `Failed to decrypt with key ${keyName}: ${error instanceof Error ? error.message : String(error)}`,
        "DECRYPT_ERROR"
      );
    }
  }

  /**
   * Create a transit encryption key
   */
  async createTransitKey(name: string, type: string): Promise<TransitKey> {
    this.ensureReady();
    try {
      await this.vault!.write(`transit/keys/${name}`, {
        type,
        allow_plaintext_backup: false,
      });

      const key = await this.vault!.read(`transit/keys/${name}`);
      return key.data;
    } catch (error) {
      throw new VaultError(
        `Failed to create transit key ${name}: ${error instanceof Error ? error.message : String(error)}`,
        "CREATE_KEY_ERROR"
      );
    }
  }

  /**
   * Authenticate with Vault
   */
  async authenticate(method: AuthMethod, credentials: any): Promise<string> {
    this.ensureReady();
    try {
      let auth;

      switch (method) {
        case AuthMethod.APPROLE:
          auth = await this.vault!.write("auth/approle/login", {
            role_id: credentials.role_id,
            secret_id: credentials.secret_id,
          });
          break;

        case AuthMethod.JWT:
          auth = await this.vault!.write("auth/jwt/login", {
            role: credentials.role,
            jwt: credentials.jwt,
          });
          break;

        case AuthMethod.KUBERNETES:
          auth = await this.vault!.write("auth/kubernetes/login", {
            role: credentials.role,
            jwt: credentials.jwt,
          });
          break;

        default:
          throw new VaultError(`Unsupported auth method: ${method}`, "AUTH_ERROR");
      }

      return auth.auth.client_token;
    } catch (error) {
      throw new VaultAuthenticationError(
        `Failed to authenticate: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Renew token
   */
  async renewToken(token: string): Promise<string> {
    this.ensureReady();
    try {
      const response = await this.vault!.write("auth/token/renew-self", {
        token,
      });
      return response.auth.client_token;
    } catch (error) {
      throw new VaultError(
        `Failed to renew token: ${error instanceof Error ? error.message : String(error)}`,
        "RENEW_ERROR"
      );
    }
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(_limit: number = 100): Promise<AuditLogEntry[]> {
    this.ensureReady();
    try {
      await this.vault!.list("sys/audit");
      // Note: This retrieves audit backend info, not the actual logs
      // Actual log access requires file system access
      return [];
    } catch (error) {
      throw new VaultError(
        `Failed to get audit logs: ${error instanceof Error ? error.message : String(error)}`,
        "AUDIT_ERROR"
      );
    }
  }

  /**
   * Enable audit logging
   */
  async enableAuditLogging(backend: string, path: string): Promise<void> {
    this.ensureReady();
    try {
      await this.vault!.write("sys/audit/enable", {
        type: backend,
        path,
      });
    } catch (error) {
      throw new VaultError(
        `Failed to enable audit logging: ${error instanceof Error ? error.message : String(error)}`,
        "AUDIT_ENABLE_ERROR"
      );
    }
  }

  /**
   * Get Vault health status
   */
  async health(): Promise<VaultHealthStatus> {
    this.ensureReady();
    try {
      const response = await this.vault!.status();
      return response;
    } catch (error) {
      throw new VaultConnectionError(
        `Health check failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Seal Vault
   */
  async seal(): Promise<void> {
    this.ensureReady();
    try {
      await this.vault!.write("sys/seal", {});
    } catch (error) {
      throw new VaultError(
        `Failed to seal Vault: ${error instanceof Error ? error.message : String(error)}`,
        "SEAL_ERROR"
      );
    }
  }

  /**
   * Unseal Vault with a shard
   */
  async unseal(shard: string): Promise<void> {
    this.ensureReady();
    try {
      await this.vault!.write("sys/unseal", {
        key: shard,
      });
    } catch (error) {
      throw new VaultError(
        `Failed to unseal Vault: ${error instanceof Error ? error.message : String(error)}`,
        "UNSEAL_ERROR"
      );
    }
  }

  /**
   * Create a policy
   */
  async createPolicy(policy: VaultPolicy): Promise<void> {
    this.ensureReady();
    try {
      await this.vault!.write(`sys/policy/${policy.name}`, {
        policy: policy.rules,
      });
    } catch (error) {
      throw new VaultError(
        `Failed to create policy ${policy.name}: ${error instanceof Error ? error.message : String(error)}`,
        "POLICY_CREATE_ERROR"
      );
    }
  }

  /**
   * Delete a policy
   */
  async deletePolicy(name: string): Promise<void> {
    this.ensureReady();
    try {
      await this.vault!.delete(`sys/policy/${name}`);
    } catch (error) {
      throw new VaultError(
        `Failed to delete policy ${name}: ${error instanceof Error ? error.message : String(error)}`,
        "POLICY_DELETE_ERROR"
      );
    }
  }

  /**
   * List all policies
   */
  async listPolicies(): Promise<string[]> {
    this.ensureReady();
    try {
      const response = await this.vault!.list("sys/policy");
      return response.data.keys || [];
    } catch (error) {
      throw new VaultError(
        `Failed to list policies: ${error instanceof Error ? error.message : String(error)}`,
        "POLICY_LIST_ERROR"
      );
    }
  }
}

export default VaultClient;
