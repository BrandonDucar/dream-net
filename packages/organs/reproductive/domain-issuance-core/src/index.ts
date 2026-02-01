/**
 * Domain Issuance Core
 * 
 * Issues .dream and .sheep domains to DreamNet users
 * Tied to Dream State Passports
 */

import { nanoid } from 'nanoid';

export type DomainTier = 'personal' | 'custom' | 'premium' | 'external';

export interface IssuedDomain {
  domain: string; // e.g., "alice.dream" or "alice.sheep"
  passportId: string; // e.g., "passport:alice-001"
  walletAddress: string;
  tier: DomainTier;
  issuedAt: number;
  expiresAt?: number; // Optional expiration
  metadata?: {
    customName?: string;
    purpose?: string;
    linkedDomains?: string[]; // External domains linked to this
  };
}

export interface DomainRegistry {
  [domain: string]: IssuedDomain;
}

// In-memory registry (replace with database in production)
const domainRegistry: DomainRegistry = {};

/**
 * Issue a .dream domain to a passport holder
 */
export function issueDreamDomain(params: {
  passportId: string;
  walletAddress: string;
  requestedName?: string;
  tier?: DomainTier;
}): IssuedDomain {
  const { passportId, walletAddress, requestedName, tier = 'personal' } = params;

  // Extract username from passport ID (e.g., "passport:alice-001" -> "alice")
  const username = passportId.split(':')[1]?.split('-')[0] || nanoid(8);
  const domainName = requestedName || username;

  // Check if domain already exists
  const domain = `${domainName.toLowerCase()}.dream`;
  if (domainRegistry[domain]) {
    throw new Error(`Domain ${domain} already issued`);
  }

  const issuedDomain: IssuedDomain = {
    domain,
    passportId,
    walletAddress,
    tier,
    issuedAt: Date.now(),
    metadata: {
      customName: requestedName,
    },
  };

  domainRegistry[domain] = issuedDomain;

  console.log(`🎫 Issued domain: ${domain} → ${passportId}`);

  return issuedDomain;
}

/**
 * Issue a .sheep domain (alternative TLD)
 */
export function issueSheepDomain(params: {
  passportId: string;
  walletAddress: string;
  requestedName?: string;
  tier?: DomainTier;
}): IssuedDomain {
  const { passportId, walletAddress, requestedName, tier = 'personal' } = params;

  const username = passportId.split(':')[1]?.split('-')[0] || nanoid(8);
  const domainName = requestedName || username;

  const domain = `${domainName.toLowerCase()}.sheep`;
  if (domainRegistry[domain]) {
    throw new Error(`Domain ${domain} already issued`);
  }

  const issuedDomain: IssuedDomain = {
    domain,
    passportId,
    walletAddress,
    tier,
    issuedAt: Date.now(),
    metadata: {
      customName: requestedName,
    },
  };

  domainRegistry[domain] = issuedDomain;

  console.log(`🐑 Issued domain: ${domain} → ${passportId}`);

  return issuedDomain;
}

/**
 * Get domain by name
 */
export function getDomain(domain: string): IssuedDomain | null {
  return domainRegistry[domain] || null;
}

/**
 * Get all domains for a passport
 */
export function getDomainsForPassport(passportId: string): IssuedDomain[] {
  return Object.values(domainRegistry).filter(
    d => d.passportId === passportId
  );
}

/**
 * Get all domains for a wallet
 */
export function getDomainsForWallet(walletAddress: string): IssuedDomain[] {
  return Object.values(domainRegistry).filter(
    d => d.walletAddress.toLowerCase() === walletAddress.toLowerCase()
  );
}

/**
 * Link external domain to .dream domain
 */
export function linkExternalDomain(
  dreamDomain: string,
  externalDomain: string
): void {
  const domain = domainRegistry[dreamDomain];
  if (!domain) {
    throw new Error(`Domain ${dreamDomain} not found`);
  }

  if (!domain.metadata) {
    domain.metadata = {};
  }

  if (!domain.metadata.linkedDomains) {
    domain.metadata.linkedDomains = [];
  }

  domain.metadata.linkedDomains.push(externalDomain);

  console.log(`🔗 Linked ${externalDomain} → ${dreamDomain}`);
}

/**
 * Resolve domain to passport/wallet
 */
export function resolveDomain(domain: string): {
  passportId: string;
  walletAddress: string;
  tier: DomainTier;
} | null {
  const issued = domainRegistry[domain];
  if (!issued) {
    return null;
  }

  return {
    passportId: issued.passportId,
    walletAddress: issued.walletAddress,
    tier: issued.tier,
  };
}

/**
 * List all issued domains
 */
export function listAllDomains(): IssuedDomain[] {
  return Object.values(domainRegistry);
}

// Export registry for inspection (dev only)
export { domainRegistry };

/**
 * Issue a generic subdomain on a specific Root Domain (e.g. "agent.dreamnet.google")
 * This supports the "Split Strategy" (Google Primary, Ink Reserve)
 */
export function issueSubdomain(params: {
  passportId: string;
  walletAddress: string;
  rootDomain: string; // e.g. "dreamnet.google"
  subdomainName?: string; // e.g. "smith"
  tier?: DomainTier;
}): IssuedDomain {
  const { passportId, walletAddress, rootDomain, subdomainName, tier = 'personal' } = params;

  const username = passportId.split(':')[1]?.split('-')[0] || nanoid(8);
  const prefix = subdomainName || username;

  // Construct full FQDN
  const domain = `${prefix.toLowerCase()}.${rootDomain}`;

  if (domainRegistry[domain]) {
    throw new Error(`Domain ${domain} already issued`);
  }

  const issuedDomain: IssuedDomain = {
    domain,
    passportId,
    walletAddress,
    tier,
    issuedAt: Date.now(),
    metadata: {
      customName: prefix,
      purpose: "subdomain-routing"
    },
  };

  domainRegistry[domain] = issuedDomain;

  console.log(`🌐 Issued Global Subdomain: ${domain} → ${passportId}`);

  return issuedDomain;
}

