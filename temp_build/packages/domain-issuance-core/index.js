"use strict";
/**
 * Domain Issuance Core
 *
 * Issues .dream and .sheep domains to DreamNet users
 * Tied to Dream State Passports
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.domainRegistry = void 0;
exports.issueDreamDomain = issueDreamDomain;
exports.issueSheepDomain = issueSheepDomain;
exports.getDomain = getDomain;
exports.getDomainsForPassport = getDomainsForPassport;
exports.getDomainsForWallet = getDomainsForWallet;
exports.linkExternalDomain = linkExternalDomain;
exports.resolveDomain = resolveDomain;
exports.listAllDomains = listAllDomains;
exports.issueSubdomain = issueSubdomain;
const nanoid_1 = require("nanoid");
// In-memory registry (replace with database in production)
const domainRegistry = {};
exports.domainRegistry = domainRegistry;
/**
 * Issue a .dream domain to a passport holder
 */
function issueDreamDomain(params) {
    const { passportId, walletAddress, requestedName, tier = 'personal' } = params;
    // Extract username from passport ID (e.g., "passport:alice-001" -> "alice")
    const username = passportId.split(':')[1]?.split('-')[0] || (0, nanoid_1.nanoid)(8);
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
function issueSheepDomain(params) {
    const { passportId, walletAddress, requestedName, tier = 'personal' } = params;
    const username = passportId.split(':')[1]?.split('-')[0] || (0, nanoid_1.nanoid)(8);
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
function getDomain(domain) {
    return domainRegistry[domain] || null;
}
/**
 * Get all domains for a passport
 */
function getDomainsForPassport(passportId) {
    return Object.values(domainRegistry).filter(d => d.passportId === passportId);
}
/**
 * Get all domains for a wallet
 */
function getDomainsForWallet(walletAddress) {
    return Object.values(domainRegistry).filter(d => d.walletAddress.toLowerCase() === walletAddress.toLowerCase());
}
/**
 * Link external domain to .dream domain
 */
function linkExternalDomain(dreamDomain, externalDomain) {
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
function resolveDomain(domain) {
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
function listAllDomains() {
    return Object.values(domainRegistry);
}
/**
 * Issue a generic subdomain on a specific Root Domain (e.g. "agent.dreamnet.google")
 * This supports the "Split Strategy" (Google Primary, Ink Reserve)
 */
function issueSubdomain(params) {
    const { passportId, walletAddress, rootDomain, subdomainName, tier = 'personal' } = params;
    const username = passportId.split(':')[1]?.split('-')[0] || (0, nanoid_1.nanoid)(8);
    const prefix = subdomainName || username;
    // Construct full FQDN
    const domain = `${prefix.toLowerCase()}.${rootDomain}`;
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
            customName: prefix,
            purpose: "subdomain-routing"
        },
    };
    domainRegistry[domain] = issuedDomain;
    console.log(`🌐 Issued Global Subdomain: ${domain} → ${passportId}`);
    return issuedDomain;
}
