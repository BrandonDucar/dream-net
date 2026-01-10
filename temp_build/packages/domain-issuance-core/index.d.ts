/**
 * Domain Issuance Core
 *
 * Issues .dream and .sheep domains to DreamNet users
 * Tied to Dream State Passports
 */
export type DomainTier = 'personal' | 'custom' | 'premium' | 'external';
export interface IssuedDomain {
    domain: string;
    passportId: string;
    walletAddress: string;
    tier: DomainTier;
    issuedAt: number;
    expiresAt?: number;
    metadata?: {
        customName?: string;
        purpose?: string;
        linkedDomains?: string[];
    };
}
export interface DomainRegistry {
    [domain: string]: IssuedDomain;
}
declare const domainRegistry: DomainRegistry;
/**
 * Issue a .dream domain to a passport holder
 */
export declare function issueDreamDomain(params: {
    passportId: string;
    walletAddress: string;
    requestedName?: string;
    tier?: DomainTier;
}): IssuedDomain;
/**
 * Issue a .sheep domain (alternative TLD)
 */
export declare function issueSheepDomain(params: {
    passportId: string;
    walletAddress: string;
    requestedName?: string;
    tier?: DomainTier;
}): IssuedDomain;
/**
 * Get domain by name
 */
export declare function getDomain(domain: string): IssuedDomain | null;
/**
 * Get all domains for a passport
 */
export declare function getDomainsForPassport(passportId: string): IssuedDomain[];
/**
 * Get all domains for a wallet
 */
export declare function getDomainsForWallet(walletAddress: string): IssuedDomain[];
/**
 * Link external domain to .dream domain
 */
export declare function linkExternalDomain(dreamDomain: string, externalDomain: string): void;
/**
 * Resolve domain to passport/wallet
 */
export declare function resolveDomain(domain: string): {
    passportId: string;
    walletAddress: string;
    tier: DomainTier;
} | null;
/**
 * List all issued domains
 */
export declare function listAllDomains(): IssuedDomain[];
export { domainRegistry };
/**
 * Issue a generic subdomain on a specific Root Domain (e.g. "agent.dreamnet.google")
 * This supports the "Split Strategy" (Google Primary, Ink Reserve)
 */
export declare function issueSubdomain(params: {
    passportId: string;
    walletAddress: string;
    rootDomain: string;
    subdomainName?: string;
    tier?: DomainTier;
}): IssuedDomain;
