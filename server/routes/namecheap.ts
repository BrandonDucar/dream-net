/**
 * Namecheap API Routes
 * 
 * Endpoints for managing Namecheap domains and DNS
 */

import { Router } from 'express';
import { NamecheapApiClient } from '../../packages/namecheap-api-core/index.js';

const router = Router();

// Initialize client (will throw if credentials are missing)
let client: NamecheapApiClient | null = null;

try {
  client = new NamecheapApiClient();
} catch (error: any) {
  console.warn('[Namecheap Routes] API client not initialized:', error.message);
  console.warn('[Namecheap Routes] Set NAMECHEAP_API_USER, NAMECHEAP_API_KEY, NAMECHEAP_USERNAME, and NAMECHEAP_CLIENT_IP');
}

/**
 * GET /api/namecheap/domains
 * List all domains
 */
router.get('/domains', async (req, res) => {
  if (!client) {
    return res.status(503).json({
      error: 'Namecheap API not configured',
      message: 'Set NAMECHEAP_API_USER, NAMECHEAP_API_KEY, NAMECHEAP_USERNAME, and NAMECHEAP_CLIENT_IP',
    });
  }

  try {
    const domains = await client.getDomains();
    res.json({
      ok: true,
      count: domains.length,
      domains: domains.map(d => ({
        name: d.Name,
        user: d.User,
        created: d.Created,
        expires: d.Expires,
        isExpired: d.IsExpired === 'true',
        isLocked: d.IsLocked === 'true',
        autoRenew: d.AutoRenew === 'true',
        whoisGuard: d.WhoisGuard === 'ENABLED',
        isPremium: d.IsPremium === 'true',
        isOurDns: d.IsOurDNS === 'true',
      })),
    });
  } catch (error: any) {
    console.error('[Namecheap] Failed to get domains:', error);
    res.status(500).json({
      error: 'Failed to fetch domains',
      message: error.message,
    });
  }
});

/**
 * GET /api/namecheap/domains/:domain/dns
 * Get DNS records for a domain
 */
router.get('/domains/:domain/dns', async (req, res) => {
  if (!client) {
    return res.status(503).json({
      error: 'Namecheap API not configured',
    });
  }

  try {
    const { domain } = req.params;
    const records = await client.getDnsRecords(domain);
    res.json({
      ok: true,
      domain,
      count: records.length,
      records: records.map(r => ({
        hostname: r.HostName,
        type: r.RecordType,
        address: r.Address,
        mxPref: r.MXPref,
        ttl: parseInt(r.TTL) || 1800,
      })),
    });
  } catch (error: any) {
    console.error(`[Namecheap] Failed to get DNS records for ${req.params.domain}:`, error);
    res.status(500).json({
      error: 'Failed to fetch DNS records',
      message: error.message,
    });
  }
});

/**
 * GET /api/namecheap/domains/:domain
 * Get domain info
 */
router.get('/domains/:domain', async (req, res) => {
  if (!client) {
    return res.status(503).json({
      error: 'Namecheap API not configured',
    });
  }

  try {
    const { domain } = req.params;
    const domainInfo = await client.getDomainInfo(domain);
    
    if (!domainInfo) {
      return res.status(404).json({
        error: 'Domain not found',
        domain,
      });
    }

    res.json({
      ok: true,
      domain: {
        name: domainInfo.Name,
        user: domainInfo.User,
        created: domainInfo.Created,
        expires: domainInfo.Expires,
        isExpired: domainInfo.IsExpired === 'true',
        isLocked: domainInfo.IsLocked === 'true',
        autoRenew: domainInfo.AutoRenew === 'true',
        whoisGuard: domainInfo.WhoisGuard === 'ENABLED',
        isPremium: domainInfo.IsPremium === 'true',
        isOurDns: domainInfo.IsOurDNS === 'true',
      },
    });
  } catch (error: any) {
    console.error(`[Namecheap] Failed to get domain info for ${req.params.domain}:`, error);
    res.status(500).json({
      error: 'Failed to fetch domain info',
      message: error.message,
    });
  }
});

/**
 * POST /api/namecheap/domains/:domain/dns
 * Update DNS records for a domain
 */
router.post('/domains/:domain/dns', async (req, res) => {
  if (!client) {
    return res.status(503).json({
      error: 'Namecheap API not configured',
    });
  }

  try {
    const { domain } = req.params;
    const { records } = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'records must be an array',
      });
    }

    await client.setDnsRecords(domain, records);
    res.json({
      ok: true,
      message: 'DNS records updated successfully',
      domain,
    });
  } catch (error: any) {
    console.error(`[Namecheap] Failed to update DNS records for ${req.params.domain}:`, error);
    res.status(500).json({
      error: 'Failed to update DNS records',
      message: error.message,
    });
  }
});

export default router;

