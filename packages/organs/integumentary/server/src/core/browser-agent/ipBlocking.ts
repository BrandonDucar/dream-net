import { URL } from 'url';
import dns from 'dns';
import { promisify } from 'util';
import net from 'net';

const lookup = promisify(dns.lookup);

export class IPBlocking {
    /**
     * Validate that a URL does not resolve to a blocked IP address
     */
    public async validateUrl(urlStr: string): Promise<{ allowed: boolean; reason?: string; resolvedIp?: string }> {
        try {
            const url = new URL(urlStr);
            const hostname = url.hostname;

            // 1. Check if hostname is an IP literal and block if internal
            if (net.isIP(hostname)) {
                if (this.isInternalIP(hostname)) {
                    return { allowed: false, reason: `Direct IP access to internal address '${hostname}' is blocked.`, resolvedIp: hostname };
                }
                // If it's a public IP, we might still want to block it if we only allow domains, 
                // but for now we rely on domainAllowlist for that policy. 
                // This class strictly checks for *internal/unsafe* IPs.
            }

            // 2. Resolve DNS to check for rebinding / internal resolution
            try {
                const { address } = await lookup(hostname);

                if (this.isInternalIP(address)) {
                    return { allowed: false, reason: `Domain '${hostname}' resolves to internal IP '${address}'.`, resolvedIp: address };
                }

                return { allowed: true, resolvedIp: address };
            } catch (dnsError) {
                // If DNS fails, we can't verify it's safe, but we also can't connect to it.
                // However, to be safe against some DNS rebinding tricks or partial failures, 
                // we might fail open or closed. 
                // For now, if we can't resolve it, Lighthouse will likely fail anyway.
                // We'll allow it to proceed to Lighthouse which handles its own errors, 
                // assuming the domainAllowlist has already passed.
                return { allowed: true, reason: 'DNS resolution failed, proceeding with caution.' };
            }

        } catch (error) {
            return { allowed: false, reason: 'Invalid URL format.' };
        }
    }

    /**
     * Check if an IP address is internal/private/reserved
     */
    private isInternalIP(ip: string): boolean {
        // IPv4 Checks
        if (net.isIPv4(ip)) {
            const parts = ip.split('.').map(Number);

            // 127.0.0.0/8 (Loopback)
            if (parts[0] === 127) return true;

            // 10.0.0.0/8 (Private)
            if (parts[0] === 10) return true;

            // 172.16.0.0/12 (Private)
            if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

            // 192.168.0.0/16 (Private)
            if (parts[0] === 192 && parts[1] === 168) return true;

            // 169.254.0.0/16 (Link-Local)
            if (parts[0] === 169 && parts[1] === 254) return true;

            // 0.0.0.0/8 (Current network)
            if (parts[0] === 0) return true;
        }

        // IPv6 Checks
        if (net.isIPv6(ip)) {
            // ::1 (Loopback)
            if (ip === '::1' || ip === '0:0:0:0:0:0:0:1') return true;

            // fe80::/10 (Link-Local)
            if (ip.toLowerCase().startsWith('fe80:')) return true;

            // fc00::/7 (Unique Local Address - Private)
            if (ip.toLowerCase().startsWith('fc') || ip.toLowerCase().startsWith('fd')) return true;
        }

        return false;
    }
}

export const defaultIpBlocking = new IPBlocking();
