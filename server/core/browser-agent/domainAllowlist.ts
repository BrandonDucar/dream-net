/**
 * Domain Allowlist - Manages allowed domains for Browser Agent
 * 
 * Phase I: In-memory allowlist with default safe domains.
 * Phase II: Can add persistence and admin API.
 */

/**
 * Domain Allowlist - Manages allowed domains
 */
export class DomainAllowlist {
  private allowedDomains: Set<string> = new Set();
  private defaultDomains: string[] = [
    'dreamnet.ink',
    'api.dreamnet.ink',
    'vercel.app',
    'github.com',
    'github.io',
  ];

  constructor() {
    // Initialize with default domains
    for (const domain of this.defaultDomains) {
      this.allowedDomains.add(this.normalizeDomain(domain));
    }
  }

  /**
   * Normalize domain (lowercase, remove protocol, remove path)
   */
  private normalizeDomain(domainOrUrl: string): string {
    try {
      // If it's a full URL, extract domain
      if (domainOrUrl.includes('://')) {
        const url = new URL(domainOrUrl);
        return url.hostname.toLowerCase();
      }
      // Otherwise treat as domain
      return domainOrUrl.toLowerCase().split('/')[0].split(':')[0];
    } catch {
      // If URL parsing fails, try to extract domain manually
      return domainOrUrl.toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
    }
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.toLowerCase();
    } catch {
      // Fallback: try to extract manually
      const match = url.match(/https?:\/\/([^\/]+)/);
      if (match) {
        return match[1].toLowerCase().split(':')[0];
      }
      return this.normalizeDomain(url);
    }
  }

  /**
   * Check if a domain is allowed
   * @param url - URL or domain to check
   * @returns true if domain is allowed
   */
  isDomainAllowed(url: string): boolean {
    const domain = this.extractDomain(url);
    return this.allowedDomains.has(domain);
  }

  /**
   * Add a domain to the allowlist
   * @param domain - Domain to add
   */
  addAllowedDomain(domain: string): void {
    const normalized = this.normalizeDomain(domain);
    this.allowedDomains.add(normalized);
  }

  /**
   * Remove a domain from the allowlist
   * @param domain - Domain to remove
   */
  removeAllowedDomain(domain: string): void {
    const normalized = this.normalizeDomain(domain);
    this.allowedDomains.delete(normalized);
  }

  /**
   * List all allowed domains
   * @returns Array of allowed domains
   */
  listAllowedDomains(): string[] {
    return Array.from(this.allowedDomains).sort();
  }

  /**
   * Check if allowlist has a domain
   * @param domain - Domain to check
   * @returns true if domain exists in allowlist
   */
  hasDomain(domain: string): boolean {
    const normalized = this.normalizeDomain(domain);
    return this.allowedDomains.has(normalized);
  }

  /**
   * Get count of allowed domains
   */
  getDomainCount(): number {
    return this.allowedDomains.size;
  }

  /**
   * Clear all domains (keeps defaults)
   */
  clear(): void {
    this.allowedDomains.clear();
    for (const domain of this.defaultDomains) {
      this.allowedDomains.add(this.normalizeDomain(domain));
    }
  }
}

// Singleton instance
let allowlistInstance: DomainAllowlist | null = null;

/**
 * Get the singleton DomainAllowlist instance
 */
export function getDomainAllowlist(): DomainAllowlist {
  if (!allowlistInstance) {
    allowlistInstance = new DomainAllowlist();
  }
  return allowlistInstance;
}

