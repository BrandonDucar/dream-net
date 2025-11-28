/**
 * IP Blocking - Blocks internal IP addresses (RFC1918, loopback, link-local)
 * 
 * Phase I: DNS resolution + IP range checks.
 * Phase II: Can add caching and more sophisticated checks.
 */

import { promises as dns } from 'dns';

/**
 * Check if an IP address is in a private/internal range
 */
function isPrivateIP(ip: string): boolean {
  // IPv4 checks
  if (ip.includes('.')) {
    const parts = ip.split('.').map(Number);
    
    // RFC1918: 10.0.0.0/8
    if (parts[0] === 10) return true;
    
    // RFC1918: 172.16.0.0/12
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    
    // RFC1918: 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;
    
    // Loopback: 127.0.0.0/8
    if (parts[0] === 127) return true;
    
    // Link-local: 169.254.0.0/16
    if (parts[0] === 169 && parts[1] === 254) return true;
  }
  
  // IPv6 checks
  if (ip.includes(':')) {
    // Loopback: ::1
    if (ip === '::1' || ip.toLowerCase() === '0:0:0:0:0:0:0:1') return true;
    
    // Link-local: fe80::/10
    if (ip.toLowerCase().startsWith('fe80:')) return true;
    
    // Unique local: fc00::/7
    const lower = ip.toLowerCase();
    if (lower.startsWith('fc') || lower.startsWith('fd')) return true;
  }
  
  return false;
}

/**
 * Resolve domain to IP address
 */
async function resolveDomainToIP(domain: string): Promise<string | null> {
  try {
    const addresses = await dns.resolve4(domain);
    if (addresses.length > 0) {
      return addresses[0];
    }
  } catch {
    // IPv4 resolution failed, try IPv6
    try {
      const addresses = await dns.resolve6(domain);
      if (addresses.length > 0) {
        return addresses[0];
      }
    } catch {
      // Both failed
      return null;
    }
  }
  return null;
}

/**
 * Check if a URL should be blocked based on IP address
 * 
 * @param url - URL to check
 * @returns Object with blocked status and reason
 */
export async function isURLBlocked(url: string): Promise<{
  blocked: boolean;
  reason?: string;
  domain?: string;
  resolvedIP?: string;
}> {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    
    // Resolve domain to IP
    const ip = await resolveDomainToIP(domain);
    
    if (!ip) {
      // DNS resolution failed - fail-safe: block if we can't verify
      return {
        blocked: true,
        reason: 'DNS resolution failed - blocking for safety',
        domain,
      };
    }
    
    // Check if IP is private/internal
    if (isPrivateIP(ip)) {
      return {
        blocked: true,
        reason: 'Internal/private IP address blocked',
        domain,
        resolvedIP: ip,
      };
    }
    
    // Check for localhost variants
    if (domain === 'localhost' || domain === '127.0.0.1' || domain === '::1') {
      return {
        blocked: true,
        reason: 'Localhost blocked',
        domain,
        resolvedIP: ip,
      };
    }
    
    // Allowed
    return {
      blocked: false,
      domain,
      resolvedIP: ip,
    };
  } catch (error: any) {
    // Invalid URL or other error - fail-safe: block
    return {
      blocked: true,
      reason: `Invalid URL or resolution error: ${error.message}`,
    };
  }
}

/**
 * Check if an IP address is internal (synchronous check)
 */
export function isInternalIP(ip: string): boolean {
  return isPrivateIP(ip);
}

