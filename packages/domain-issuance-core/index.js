/**
 * Domain Issuance Core
 *
 * Issues .dream and .sheep domains to DreamNet users
 * Tied to Dream State Passports
 */
import { nanoid } from 'nanoid';
// In-memory registry (replace with database in production)
const domainRegistry = {};
/**
 * Issue a .dream domain to a passport holder
 */
export function issueDreamDomain(params) {
    const { passportId, walletAddress, requestedName, tier = 'personal' } = params;
    // Extract username from passport ID (e.g., "passport:alice-001" -> "alice")
    const username = passportId.split(':')[1]?.split('-')[0] || nanoid(8);
    const domainName = requestedName || username;
    // Check if domain already exists
    const domain = `${domainName.toLowerCase()}.dream`;
    if (domainRegistry[domain]) {
        throw new Error(`Domain ${domain} already issued`);
    }
    const issuedDomain = {
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
export function issueSheepDomain(params) {
    const { passportId, walletAddress, requestedName, tier = 'personal' } = params;
    const username = passportId.split(':')[1]?.split('-')[0] || nanoid(8);
    const domainName = requestedName || username;
    const domain = `${domainName.toLowerCase()}.sheep`;
    if (domainRegistry[domain]) {
        throw new Error(`Domain ${domain} already issued`);
    }
    const issuedDomain = {
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
export function getDomain(domain) {
    return domainRegistry[domain] || null;
}
/**
 * Get all domains for a passport
 */
export function getDomainsForPassport(passportId) {
    return Object.values(domainRegistry).filter(d => d.passportId === passportId);
}
/**
 * Get all domains for a wallet
 */
export function getDomainsForWallet(walletAddress) {
    return Object.values(domainRegistry).filter(d => d.walletAddress.toLowerCase() === walletAddress.toLowerCase());
}
/**
 * Link external domain to .dream domain
 */
export function linkExternalDomain(dreamDomain, externalDomain) {
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
export function resolveDomain(domain) {
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
export function listAllDomains() {
    return Object.values(domainRegistry);
}
// Export registry for inspection (dev only)
export { domainRegistry };
