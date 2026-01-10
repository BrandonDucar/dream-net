import { URL } from 'url';

// Default allowed domains for DreamNet Browser Agent
const DEFAULT_ALLOWED_DOMAINS = new Set([
    'dreamnet.ink',
    'api.dreamnet.ink',
    'vercel.app',
    'github.com',
    'twitter.com',
    'x.com',
    'google.com',
    'example.com' // For testing
]);

export class DomainAllowlist {
    private allowedDomains: Set<string>;

    constructor(initialDomains: string[] = []) {
        this.allowedDomains = new Set([...DEFAULT_ALLOWED_DOMAINS, ...initialDomains]);
    }

    /**
     * Check if a URL is allowed
     */
    public isAllowed(urlStr: string): { allowed: boolean; reason?: string } {
        try {
            const url = new URL(urlStr);
            const hostname = url.hostname;

            // Check exact match
            if (this.allowedDomains.has(hostname)) {
                return { allowed: true };
            }

            // Check wildcard subdomains (e.g., *.dreamnet.ink)
            // This is a simplified check. For production, we might want more robust wildcard handling.
            for (const domain of this.allowedDomains) {
                if (hostname.endsWith('.' + domain)) {
                    return { allowed: true };
                }
            }

            return { allowed: false, reason: `Domain '${hostname}' is not in the allowlist.` };
        } catch (error) {
            return { allowed: false, reason: 'Invalid URL format.' };
        }
    }

    /**
     * Add a domain to the allowlist
     */
    public addDomain(domain: string): void {
        this.allowedDomains.add(domain);
    }

    /**
     * Remove a domain from the allowlist
     */
    public removeDomain(domain: string): void {
        this.allowedDomains.delete(domain);
    }

    /**
     * Get all allowed domains
     */
    public getDomains(): string[] {
        return Array.from(this.allowedDomains);
    }
}

export const defaultDomainAllowlist = new DomainAllowlist();
