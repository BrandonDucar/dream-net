
import ipaddr from 'ipaddr.js';
import dns from 'dns';
import { promisify } from 'util';

const resolve4 = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);

export class InternalIPBlocker {
    /**
     * Checks if a hostname resolves to an internal/private IP address.
     * @param hostname The hostname or IP to check.
     * @returns True if the hostname resolves to a private/internal IP, false otherwise.
     */
    static async isInternal(hostname: string): Promise<boolean> {
        // 1. Check if it's already an IP
        if (ipaddr.isValid(hostname)) {
            return this.isPrivateIP(hostname);
        }

        // 2. Resolve hostname to IPs
        try {
            const ips = await this.resolveHostname(hostname);

            // 3. Check all resolved IPs
            for (const ip of ips) {
                if (this.isPrivateIP(ip)) {
                    return true; // Block if ANY resolved IP is private
                }
            }

            return false;
        } catch (error) {
            // If we can't resolve it, it's safer to block or allow depending on policy.
            // For security, if DNS fails, we might want to allow it to fail at the request level,
            // but here we just return false (not internal) and let the request fail naturally,
            // OR return true to be paranoid. 
            // Let's log and return false, assuming if it doesn't resolve it can't be connected to anyway.
            console.warn(`[InternalIPBlocker] DNS resolution failed for ${hostname}:`, error);
            return false;
        }
    }

    private static isPrivateIP(ip: string): boolean {
        try {
            const addr = ipaddr.parse(ip);
            const range = addr.range();

            // Block these ranges
            const blockedRanges = [
                'loopback',      // 127.0.0.0/8, ::1
                'private',       // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, fc00::/7
                'linkLocal',     // 169.254.0.0/16, fe80::/10
                'uniqueLocal',   // fc00::/7
                'unspecified'    // 0.0.0.0, ::
            ];

            return blockedRanges.includes(range);
        } catch (e) {
            return false; // Invalid IP
        }
    }

    private static async resolveHostname(hostname: string): Promise<string[]> {
        const ips: string[] = [];

        try {
            const ipv4 = await resolve4(hostname).catch(() => []);
            ips.push(...ipv4);
        } catch { }

        try {
            const ipv6 = await resolve6(hostname).catch(() => []);
            ips.push(...ipv6);
        } catch { }

        return ips;
    }
}
