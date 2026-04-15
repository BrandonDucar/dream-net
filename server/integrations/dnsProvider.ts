/**
 * DNS Provider Abstraction
 * Interface for managing DNS records across different providers
 */

export interface DnsRecord {
  type: 'A' | 'CNAME';
  name: string;
  value: string;
  ttl?: number;
  proxied?: boolean; // Cloudflare proxy
  id?: string; // Provider-specific record ID
}

export interface DnsProvider {
  /**
   * Ensure an A record exists with the specified value
   * Idempotent - updates if exists, creates if not
   */
  ensureARecord(
    name: string,
    value: string,
    options?: { proxied?: boolean; ttl?: number }
  ): Promise<DnsRecord>;

  /**
   * Ensure a CNAME record exists with the specified target
   * Idempotent - updates if exists, creates if not
   */
  ensureCnameRecord(
    name: string,
    target: string,
    options?: { proxied?: boolean; ttl?: number }
  ): Promise<DnsRecord>;

  /**
   * Remove a DNS record
   */
  removeRecord(name: string, type: 'A' | 'CNAME'): Promise<void>;

  /**
   * List all records for a domain
   */
  listRecords(type?: 'A' | 'CNAME'): Promise<DnsRecord[]>;

  /**
   * Get a specific record
   */
  getRecord(name: string, type: 'A' | 'CNAME'): Promise<DnsRecord | null>;
}

/**
 * No-op DNS provider for when DNS management is not configured
 */
export class NoOpDnsProvider implements DnsProvider {
  async ensureARecord(name: string, value: string): Promise<DnsRecord> {
    console.warn(`[NoOpDnsProvider] Skipping A record creation: ${name} -> ${value}`);
    return { type: 'A', name, value };
  }

  async ensureCnameRecord(name: string, target: string): Promise<DnsRecord> {
    console.warn(`[NoOpDnsProvider] Skipping CNAME record creation: ${name} -> ${target}`);
    return { type: 'CNAME', name, value: target };
  }

  async removeRecord(name: string, type: 'A' | 'CNAME'): Promise<void> {
    console.warn(`[NoOpDnsProvider] Skipping record removal: ${name} (${type})`);
  }

  async listRecords(type?: 'A' | 'CNAME'): Promise<DnsRecord[]> {
    return [];
  }

  async getRecord(name: string, type: 'A' | 'CNAME'): Promise<DnsRecord | null> {
    return null;
  }
}

