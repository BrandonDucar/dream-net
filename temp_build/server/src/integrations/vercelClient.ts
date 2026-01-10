/**
 * Vercel API Client for Domain Management
 * Handles project domain attachment and configuration
 */

const VERCEL_API_BASE = 'https://api.vercel.com';

export interface VercelProject {
  id: string;
  name: string;
  accountId: string;
  updatedAt: number;
  createdAt: number;
}

export interface VercelDomain {
  name: string;
  apexName: string;
  projectId: string;
  redirect?: string | null;
  redirectStatusCode?: number | null;
  gitBranch?: string | null;
  updatedAt?: number;
  createdAt?: number;
  verified?: boolean;
  verification?: {
    type: string;
    domain: string;
    value: string;
    reason: string;
  }[];
}

async function makeVercelRequest(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    throw new Error('VERCEL_TOKEN not configured');
  }

  const teamId = process.env.VERCEL_TEAM_ID;
  const url = teamId
    ? `${VERCEL_API_BASE}${path}${path.includes('?') ? '&' : '?'}teamId=${teamId}`
    : `${VERCEL_API_BASE}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Vercel API error: ${response.status} - ${error.message || error.error?.message || 'Unknown error'}`);
  }

  return response.json();
}

/**
 * Get project by name
 */
export async function getProjectByName(name: string): Promise<VercelProject | null> {
  try {
    const data = await makeVercelRequest('/v9/projects');
    const projects = data.projects as VercelProject[];
    return projects.find(p => p.name === name) || null;
  } catch (error: any) {
    console.error('[VercelClient] Error getting project:', error.message);
    throw error;
  }
}

/**
 * List all domains attached to a project
 */
export async function listProjectDomains(projectId: string): Promise<VercelDomain[]> {
  try {
    const data = await makeVercelRequest(`/v9/projects/${projectId}/domains`);
    return (data.domains || []) as VercelDomain[];
  } catch (error: any) {
    console.error('[VercelClient] Error listing domains:', error.message);
    throw error;
  }
}

/**
 * Add a domain to a project
 */
export async function addProjectDomain(
  projectId: string,
  domain: string,
  options?: { gitBranch?: string; redirect?: string; redirectStatusCode?: number }
): Promise<VercelDomain> {
  try {
    const body: any = { name: domain };
    if (options?.gitBranch) body.gitBranch = options.gitBranch;
    if (options?.redirect) body.redirect = options.redirect;
    if (options?.redirectStatusCode) body.redirectStatusCode = options.redirectStatusCode;

    const data = await makeVercelRequest(`/v9/projects/${projectId}/domains`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return data as VercelDomain;
  } catch (error: any) {
    // If domain already exists, that's okay - return existing domain info
    if (error.message.includes('already exists') || error.message.includes('409')) {
      const domains = await listProjectDomains(projectId);
      const existing = domains.find(d => d.name === domain);
      if (existing) return existing;
    }
    console.error('[VercelClient] Error adding domain:', error.message);
    throw error;
  }
}

/**
 * Remove a domain from a project
 */
export async function removeProjectDomain(projectId: string, domain: string): Promise<void> {
  try {
    await makeVercelRequest(`/v9/projects/${projectId}/domains/${encodeURIComponent(domain)}`, {
      method: 'DELETE',
    });
  } catch (error: any) {
    // If domain doesn't exist, that's okay
    if (error.message.includes('404') || error.message.includes('not found')) {
      return;
    }
    console.error('[VercelClient] Error removing domain:', error.message);
    throw error;
  }
}

/**
 * Get project domain configuration
 * Vercel doesn't have a direct "set primary domain" API, but we can ensure
 * the domain is attached and verified
 */
export async function ensureDomainAttached(
  projectId: string,
  domain: string,
  isProduction: boolean = true
): Promise<VercelDomain> {
  const domains = await listProjectDomains(projectId);
  const existing = domains.find(d => d.name === domain);

  if (existing) {
    // Domain already attached
    return existing;
  }

  // Add domain
  return await addProjectDomain(projectId, domain, {
    gitBranch: isProduction ? undefined : 'main', // Production uses default branch
  });
}

/**
 * Get Vercel's expected DNS records for a domain
 * Vercel uses CNAME records for subdomains and CNAME flattening for apex domains
 */
export async function getVercelDnsRecords(domain: string): Promise<Array<{
  type: 'A' | 'CNAME';
  name: string;
  value: string;
  ttl?: number;
}>> {
  // Extract domain parts
  const parts = domain.split('.');
  const isApex = parts.length === 2; // e.g., "dreamnet.ink"

  if (isApex) {
    // Apex domain - Vercel uses CNAME flattening (CNAME record at root)
    // Most DNS providers support CNAME flattening, but some require A records
    // We'll use CNAME as primary, which works with Cloudflare and most modern DNS providers
    return [
      {
        type: 'CNAME' as const,
        name: '@',
        value: 'cname.vercel-dns.com',
      },
    ];
  } else {
    // Subdomain - use CNAME
    const subdomain = parts[0]; // e.g., "staging" from "staging.dreamnet.ink"
    return [
      {
        type: 'CNAME' as const,
        name: subdomain,
        value: 'cname.vercel-dns.com',
      },
    ];
  }
}

