/**
 * Namecheap DNS Provider
 * 
 * Implements DnsProvider interface for Namecheap DNS management
 */

import type { DnsProvider, DnsRecord } from './dnsProvider';
import { NamecheapApiClient } from '../../packages/namecheap-api-core/index.js';

export class NamecheapDnsProvider implements DnsProvider {
  private client: NamecheapApiClient;
  private domain: string;

  constructor(domain: string) {
    this.domain = domain;
    try {
      this.client = new NamecheapApiClient();
    } catch (error: any) {
      throw new Error(`Failed to initialize Namecheap DNS provider: ${error.message}`);
    }
  }

  private async getRecords(): Promise<DnsRecord[]> {
    try {
      const records = await this.client.getDnsRecords(this.domain);
      return records.map(record => ({
        name: record.HostName === '@' ? '' : record.HostName,
        type: record.RecordType as 'A' | 'CNAME',
        value: record.Address,
        ttl: parseInt(record.TTL) || 1800,
      }));
    } catch (error: any) {
      console.error(`[Namecheap DNS] Failed to get records for ${this.domain}:`, error.message);
      return [];
    }
  }

  async ensureARecord(name: string, value: string, options?: { proxied?: boolean; ttl?: number }): Promise<DnsRecord> {
    try {
      const existingRecords = await this.getRecords();
      const recordName = name || '@';
      
      // Find existing A record
      const existingIndex = existingRecords.findIndex(
        r => (r.name || '@') === recordName && r.type === 'A'
      );

      const updatedRecords = existingRecords
        .filter(r => !((r.name || '@') === recordName && r.type === 'A'))
        .map(r => ({
          hostname: r.name || '@',
          type: r.type,
          address: r.value,
          ttl: r.ttl || 1800,
        }));

      // Add/update the A record
      updatedRecords.push({
        hostname: recordName,
        type: 'A',
        address: value,
        ttl: options?.ttl || 1800,
      });

      await this.client.setDnsRecords(this.domain, updatedRecords);
      
      return {
        type: 'A',
        name: recordName === '@' ? '' : recordName,
        value,
        ttl: options?.ttl || 1800,
      };
    } catch (error: any) {
      throw new Error(`Failed to ensure A record: ${error.message}`);
    }
  }

  async ensureCnameRecord(name: string, target: string, options?: { proxied?: boolean; ttl?: number }): Promise<DnsRecord> {
    try {
      const existingRecords = await this.getRecords();
      const recordName = name || '@';
      
      // Find existing CNAME record
      const existingIndex = existingRecords.findIndex(
        r => (r.name || '@') === recordName && r.type === 'CNAME'
      );

      const updatedRecords = existingRecords
        .filter(r => !((r.name || '@') === recordName && r.type === 'CNAME'))
        .map(r => ({
          hostname: r.name || '@',
          type: r.type,
          address: r.value,
          ttl: r.ttl || 1800,
        }));

      // Add/update the CNAME record
      updatedRecords.push({
        hostname: recordName,
        type: 'CNAME',
        address: target,
        ttl: options?.ttl || 1800,
      });

      await this.client.setDnsRecords(this.domain, updatedRecords);
      
      return {
        type: 'CNAME',
        name: recordName === '@' ? '' : recordName,
        value: target,
        ttl: options?.ttl || 1800,
      };
    } catch (error: any) {
      throw new Error(`Failed to ensure CNAME record: ${error.message}`);
    }
  }

  async removeRecord(name: string, type: 'A' | 'CNAME'): Promise<void> {
    try {
      const existingRecords = await this.getRecords();
      const recordName = name || '@';
      
      // Remove the specified record
      const updatedRecords = existingRecords
        .filter(r => !((r.name || '@') === recordName && r.type === type))
        .map(r => ({
          hostname: r.name || '@',
          type: r.type,
          address: r.value,
          ttl: r.ttl || 1800,
        }));

      await this.client.setDnsRecords(this.domain, updatedRecords);
    } catch (error: any) {
      throw new Error(`Failed to remove DNS record: ${error.message}`);
    }
  }

  async listRecords(type?: 'A' | 'CNAME'): Promise<DnsRecord[]> {
    const records = await this.getRecords();
    if (type) {
      return records.filter(r => r.type === type);
    }
    return records;
  }

  async getRecord(name: string, type: 'A' | 'CNAME'): Promise<DnsRecord | null> {
    const records = await this.getRecords();
    const recordName = name || '@';
    return records.find(r => (r.name || '@') === recordName && r.type === type) || null;
  }
}

