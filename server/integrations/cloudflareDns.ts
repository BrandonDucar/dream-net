/**
 * Cloudflare DNS Provider Implementation
 * Manages DNS records via Cloudflare API
 */

import type { DnsProvider, DnsRecord } from './dnsProvider';

const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';

interface CloudflareDnsRecord {
  id: string;
  type: 'A' | 'CNAME';
  name: string;
  content: string;
  ttl: number;
  proxied?: boolean;
  zone_id: string;
  zone_name: string;
}

interface CloudflareApiResponse<T> {
  success: boolean;
  result: T;
  errors: Array<{ code: number; message: string }>;
}

export class CloudflareDnsProvider implements DnsProvider {
  private apiToken: string;
  private zoneId: string;
  private zoneName: string;

  constructor() {
    this.apiToken = process.env.CF_API_TOKEN || '';
    this.zoneId = process.env.CF_ZONE_ID || '';

    if (!this.apiToken || !this.zoneId) {
      throw new Error('Cloudflare DNS provider requires CF_API_TOKEN and CF_ZONE_ID environment variables');
    }

    // Extract zone name from CF_ZONE_ID or use CF_ZONE_NAME if provided
    this.zoneName = process.env.CF_ZONE_NAME || '';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<CloudflareApiResponse<T>> {
    const response = await fetch(`${CLOUDFLARE_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json() as CloudflareApiResponse<T>;

    if (!response.ok || !data.success) {
      const errors = data.errors || [{ message: response.statusText }];
      throw new Error(`Cloudflare API error: ${errors.map(e => e.message).join(', ')}`);
    }

    return data;
  }

  /**
   * Normalize record name (remove zone name if present)
   */
  private normalizeName(name: string): string {
    if (this.zoneName && name.endsWith(`.${this.zoneName}`)) {
      return name.slice(0, -(this.zoneName.length + 1));
    }
    if (name === '@' || name === this.zoneName) {
      return '@';
    }
    return name;
  }

  /**
   * Get full record name (add zone name if needed)
   */
  private getFullName(name: string): string {
    if (name === '@') {
      return this.zoneName;
    }
    if (name.includes('.')) {
      return name;
    }
    return `${name}.${this.zoneName}`;
  }

  async listRecords(type?: 'A' | 'CNAME'): Promise<DnsRecord[]> {
    const typeParam = type ? `&type=${type}` : '';
    const data = await this.makeRequest<CloudflareDnsRecord[]>(
      `/zones/${this.zoneId}/dns_records?per_page=100${typeParam}`
    );

    return (data.result || []).map(record => ({
      type: record.type,
      name: this.normalizeName(record.name),
      value: record.content,
      ttl: record.ttl,
      proxied: record.proxied,
      id: record.id,
    }));
  }

  async getRecord(name: string, type: 'A' | 'CNAME'): Promise<DnsRecord | null> {
    const records = await this.listRecords(type);
    const normalizedName = this.normalizeName(name);
    return records.find(r => r.name === normalizedName && r.type === type) || null;
  }

  async ensureARecord(
    name: string,
    value: string,
    options?: { proxied?: boolean; ttl?: number }
  ): Promise<DnsRecord> {
    const normalizedName = this.normalizeName(name);
    const existing = await this.getRecord(name, 'A');

    const recordData: any = {
      type: 'A',
      name: normalizedName === '@' ? this.zoneName : this.getFullName(name),
      content: value,
      ttl: options?.ttl || 1, // 1 = auto, or specific TTL
      proxied: options?.proxied || false,
    };

    if (existing) {
      // Update existing record
      const data = await this.makeRequest<CloudflareDnsRecord>(
        `/zones/${this.zoneId}/dns_records/${existing.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(recordData),
        }
      );

      return {
        type: 'A',
        name: normalizedName,
        value: data.result.content,
        ttl: data.result.ttl,
        proxied: data.result.proxied,
        id: data.result.id,
      };
    } else {
      // Create new record
      const data = await this.makeRequest<CloudflareDnsRecord>(
        `/zones/${this.zoneId}/dns_records`,
        {
          method: 'POST',
          body: JSON.stringify(recordData),
        }
      );

      return {
        type: 'A',
        name: normalizedName,
        value: data.result.content,
        ttl: data.result.ttl,
        proxied: data.result.proxied,
        id: data.result.id,
      };
    }
  }

  async ensureCnameRecord(
    name: string,
    target: string,
    options?: { proxied?: boolean; ttl?: number }
  ): Promise<DnsRecord> {
    const normalizedName = this.normalizeName(name);
    const existing = await this.getRecord(name, 'CNAME');

    const recordData: any = {
      type: 'CNAME',
      name: normalizedName === '@' ? this.zoneName : this.getFullName(name),
      content: target,
      ttl: options?.ttl || 1,
      proxied: options?.proxied || false,
    };

    if (existing) {
      // Update existing record
      const data = await this.makeRequest<CloudflareDnsRecord>(
        `/zones/${this.zoneId}/dns_records/${existing.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(recordData),
        }
      );

      return {
        type: 'CNAME',
        name: normalizedName,
        value: data.result.content,
        ttl: data.result.ttl,
        proxied: data.result.proxied,
        id: data.result.id,
      };
    } else {
      // Create new record
      const data = await this.makeRequest<CloudflareDnsRecord>(
        `/zones/${this.zoneId}/dns_records`,
        {
          method: 'POST',
          body: JSON.stringify(recordData),
        }
      );

      return {
        type: 'CNAME',
        name: normalizedName,
        value: data.result.content,
        ttl: data.result.ttl,
        proxied: data.result.proxied,
        id: data.result.id,
      };
    }
  }

  async removeRecord(name: string, type: 'A' | 'CNAME'): Promise<void> {
    const existing = await this.getRecord(name, type);
    if (!existing || !existing.id) {
      return; // Already removed or doesn't exist
    }

    await this.makeRequest(
      `/zones/${this.zoneId}/dns_records/${existing.id}`,
      {
        method: 'DELETE',
      }
    );
  }
}

/**
 * Create DNS provider based on environment configuration
 */
export function createDnsProvider(domain?: string): import('./dnsProvider').DnsProvider {
  const provider = process.env.DNS_PROVIDER?.toLowerCase() || '';

  if (provider === 'namecheap' || (process.env.NAMECHEAP_API_USER && process.env.NAMECHEAP_API_KEY)) {
    try {
      const { NamecheapDnsProvider } = require('./namecheapDns');
      const targetDomain = domain || process.env.PRIMARY_DOMAIN || 'dreamnet.ink';
      return new NamecheapDnsProvider(targetDomain);
    } catch (error: any) {
      console.warn(`[DomainKeeper] Failed to initialize Namecheap DNS provider: ${error.message}`);
      console.warn('[DomainKeeper] Falling back to NoOp provider');
      return new (require('./dnsProvider').NoOpDnsProvider)();
    }
  }

  if (provider === 'cloudflare' || (process.env.CF_API_TOKEN && process.env.CF_ZONE_ID)) {
    try {
      return new CloudflareDnsProvider();
    } catch (error: any) {
      console.warn(`[DomainKeeper] Failed to initialize Cloudflare DNS provider: ${error.message}`);
      console.warn('[DomainKeeper] Falling back to NoOp provider');
      return new (require('./dnsProvider').NoOpDnsProvider)();
    }
  }

  // Unknown or no provider configured
  if (provider && provider !== 'none') {
    console.warn(`[DomainKeeper] Unknown DNS provider: ${provider}. DNS sync will be skipped.`);
  }

  return new (require('./dnsProvider').NoOpDnsProvider)();
}

