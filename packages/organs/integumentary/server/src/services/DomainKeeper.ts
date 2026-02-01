/**
 * DomainKeeper Service
 * 
 * This keeps dreamnet.ink attached to the right Vercel project and ensures DNS records
 * match expected configuration. It provides self-healing domain management:
 * 
 * - Ensures PRIMARY_DOMAIN (dreamnet.ink) is always attached to the correct Vercel project
 * - Optionally manages STAGING_DOMAIN (staging.dreamnet.ink) as a preview alias
 * - Syncs DNS records to point to Vercel's infrastructure
 * - Idempotent - safe to call multiple times
 * 
 * Environment Variables:
 * - VERCEL_TOKEN: Vercel API token (required)
 * - VERCEL_TEAM_ID: Vercel team ID (optional, if account is under a team)
 * - VERCEL_PROJECT_NAME: Name of the Vercel project (default: "dream-net")
 * - PRIMARY_DOMAIN: Primary domain for this deployment (e.g., "dreamnet.live" or "dreamnet.ink")
 * - STAGING_DOMAIN: Staging/preview domain (optional, default: "staging.dreamnet.ink")
 * - DNS_PROVIDER: DNS provider name (e.g., "cloudflare", "none")
 * - CF_API_TOKEN: Cloudflare API token (if using Cloudflare)
 * - CF_ZONE_ID: Cloudflare zone ID (if using Cloudflare)
 * - CF_ZONE_NAME: Cloudflare zone name (optional, auto-detected)
 */

import type { DnsProvider } from '../integrations/dnsProvider';
import {
  getProjectByName,
  ensureDomainAttached,
  getVercelDnsRecords,
  type VercelDomain,
} from '../integrations/vercelClient';

export interface DomainSyncResult {
  domain: string;
  action: 'attached' | 'already-attached' | 'skipped' | 'error';
  message: string;
  dnsAction?: 'created' | 'updated' | 'already-correct' | 'skipped' | 'error';
  dnsMessage?: string;
}

export class DomainKeeper {
  private vercelProjectName: string;
  private primaryDomain: string;
  private stagingDomain: string | null;
  private dnsProvider: DnsProvider;

  constructor(dnsProvider: DnsProvider) {
    this.vercelProjectName = process.env.VERCEL_PROJECT_NAME || 'dream-net';
    this.primaryDomain = process.env.PRIMARY_DOMAIN || 'dreamnet.ink';
    this.stagingDomain = process.env.STAGING_DOMAIN || null;
    this.dnsProvider = dnsProvider;
  }

  /**
   * Sync production domain (dreamnet.ink)
   * Ensures it's attached to Vercel project and DNS is correct
   */
  async syncProductionDomain(): Promise<DomainSyncResult> {
    const result: DomainSyncResult = {
      domain: this.primaryDomain,
      action: 'skipped',
      message: '',
    };

    try {
      // 1. Find Vercel project
      const project = await getProjectByName(this.vercelProjectName);
      if (!project) {
        result.action = 'error';
        result.message = `Vercel project "${this.vercelProjectName}" not found`;
        return result;
      }

      // 2. Ensure domain is attached
      let domain: VercelDomain;
      try {
        domain = await ensureDomainAttached(project.id, this.primaryDomain, true);
        result.action = 'attached';
        result.message = `Domain attached to project ${project.name}`;
      } catch (error: any) {
        // Check if already attached
        const { listProjectDomains } = require('../integrations/vercelClient');
        const domains = await listProjectDomains(project.id);
        const existing = domains.find(d => d.name === this.primaryDomain);
        if (existing) {
          domain = existing;
          result.action = 'already-attached';
          result.message = `Domain already attached to project ${project.name}`;
        } else {
          throw error;
        }
      }

      // 3. Sync DNS records
      try {
        const dnsRecords = await getVercelDnsRecords(this.primaryDomain);
        const dnsResult = await this.syncDnsRecords(this.primaryDomain, dnsRecords);
        result.dnsAction = dnsResult.action;
        result.dnsMessage = dnsResult.message;
      } catch (error: any) {
        result.dnsAction = 'error';
        result.dnsMessage = `DNS sync failed: ${error.message}`;
        // Don't fail the whole operation if DNS sync fails
        console.error(`[DomainKeeper] DNS sync error for ${this.primaryDomain}:`, error);
      }

      return result;
    } catch (error: any) {
      result.action = 'error';
      result.message = `Failed to sync production domain: ${error.message}`;
      console.error('[DomainKeeper] Production domain sync error:', error);
      return result;
    }
  }

  /**
   * Sync staging domain (staging.dreamnet.ink)
   * Attaches as preview/alias domain
   */
  async syncStagingDomain(): Promise<DomainSyncResult | null> {
    if (!this.stagingDomain) {
      return null; // Staging domain not configured
    }

    const result: DomainSyncResult = {
      domain: this.stagingDomain,
      action: 'skipped',
      message: '',
    };

    try {
      const project = await getProjectByName(this.vercelProjectName);
      if (!project) {
        result.action = 'error';
        result.message = `Vercel project "${this.vercelProjectName}" not found`;
        return result;
      }

      // Attach staging domain (not production)
      let domain: VercelDomain;
      try {
        domain = await ensureDomainAttached(project.id, this.stagingDomain, false);
        result.action = 'attached';
        result.message = `Staging domain attached to project ${project.name}`;
      } catch (error: any) {
        const { listProjectDomains } = require('../integrations/vercelClient');
        const domains = await listProjectDomains(project.id);
        const existing = domains.find(d => d.name === this.stagingDomain);
        if (existing) {
          domain = existing;
          result.action = 'already-attached';
          result.message = `Staging domain already attached`;
        } else {
          throw error;
        }
      }

      // Sync DNS for staging
      try {
        const dnsRecords = await getVercelDnsRecords(this.stagingDomain);
        const dnsResult = await this.syncDnsRecords(this.stagingDomain, dnsRecords);
        result.dnsAction = dnsResult.action;
        result.dnsMessage = dnsResult.message;
      } catch (error: any) {
        result.dnsAction = 'error';
        result.dnsMessage = `DNS sync failed: ${error.message}`;
        console.error(`[DomainKeeper] DNS sync error for ${this.stagingDomain}:`, error);
      }

      return result;
    } catch (error: any) {
      result.action = 'error';
      result.message = `Failed to sync staging domain: ${error.message}`;
      console.error('[DomainKeeper] Staging domain sync error:', error);
      return result;
    }
  }

  /**
   * Sync DNS records for a domain
   */
  private async syncDnsRecords(
    domain: string,
    expectedRecords: Array<{ type: 'A' | 'CNAME'; name: string; value: string }>
  ): Promise<{ action: string; message: string }> {
    if (expectedRecords.length === 0) {
      return { action: 'skipped', message: 'No DNS records to sync' };
    }

    const actions: string[] = [];

    for (const record of expectedRecords) {
      try {
        if (record.type === 'A') {
          await this.dnsProvider.ensureARecord(record.name, record.value);
          actions.push(`A record ${record.name} -> ${record.value}`);
        } else if (record.type === 'CNAME') {
          await this.dnsProvider.ensureCnameRecord(record.name, record.value);
          actions.push(`CNAME ${record.name} -> ${record.value}`);
        }
      } catch (error: any) {
        console.error(`[DomainKeeper] Failed to sync ${record.type} record for ${record.name}:`, error);
        actions.push(`ERROR: ${record.type} ${record.name} - ${error.message}`);
      }
    }

    if (actions.length > 0 && !actions.some(a => a.startsWith('ERROR'))) {
      return { action: 'updated', message: actions.join('; ') };
    } else if (actions.some(a => a.startsWith('ERROR'))) {
      return { action: 'error', message: actions.join('; ') };
    } else {
      return { action: 'already-correct', message: 'DNS records already correct' };
    }
  }

  /**
   * Sync all domains (production + staging)
   */
  async syncAllDomains(): Promise<DomainSyncResult[]> {
    const results: DomainSyncResult[] = [];

    // Sync production domain
    const productionResult = await this.syncProductionDomain();
    results.push(productionResult);

    // Sync staging domain if configured
    if (this.stagingDomain) {
      const stagingResult = await this.syncStagingDomain();
      if (stagingResult) {
        results.push(stagingResult);
      }
    }

    return results;
  }
}

/**
 * Get DomainKeeper instance (singleton pattern)
 */
let domainKeeperInstance: DomainKeeper | null = null;

export function getDomainKeeper(): DomainKeeper {
  if (!domainKeeperInstance) {
    const { createDnsProvider } = require('../integrations/cloudflareDns');
    const dnsProvider = createDnsProvider();
    domainKeeperInstance = new DomainKeeper(dnsProvider);
  }
  return domainKeeperInstance;
}

