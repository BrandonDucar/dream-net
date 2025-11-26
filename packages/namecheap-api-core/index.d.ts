/**
 * Namecheap API Core
 *
 * Integration with Namecheap API for domain and DNS management
 *
 * Documentation: https://www.namecheap.com/support/api/intro/
 *
 * Environment Variables:
 * - NAMECHEAP_API_USER: Your Namecheap API username
 * - NAMECHEAP_API_KEY: Your Namecheap API key
 * - NAMECHEAP_USERNAME: Your Namecheap account username
 * - NAMECHEAP_CLIENT_IP: Your whitelisted IP address (required for API)
 */
export interface NamecheapDomain {
    Name: string;
    User: string;
    Created: string;
    Expires: string;
    IsExpired: string;
    IsLocked: string;
    AutoRenew: string;
    WhoisGuard: string;
    IsPremium: string;
    IsOurDNS: string;
}
export interface NamecheapDnsRecord {
    HostName: string;
    RecordType: string;
    Address: string;
    MXPref?: string;
    TTL: string;
}
export interface NamecheapApiResponse<T = any> {
    '@': {
        Status: 'OK' | 'ERROR';
        Command: string;
        Server: string;
        GMTTimeDifference: string;
        ExecutionTime: string;
    };
    Errors?: {
        Error: string | Array<{
            Number: string;
            $: string;
        }>;
    };
    Warnings?: {
        Warning: string | Array<{
            Number: string;
            $: string;
        }>;
    };
    CommandResponse?: T;
}
export declare class NamecheapApiClient {
    private apiUser;
    private apiKey;
    private username;
    private clientIp;
    private baseUrl;
    private sandboxUrl;
    private useSandbox;
    constructor(config?: {
        apiUser?: string;
        apiKey?: string;
        username?: string;
        clientIp?: string;
        useSandbox?: boolean;
    });
    /**
     * Make an API request to Namecheap
     */
    private makeRequest;
    /**
     * Parse XML response using fast-xml-parser
     */
    private parseXmlResponse;
    /**
     * Get list of all domains
     */
    getDomains(): Promise<NamecheapDomain[]>;
    /**
     * Get DNS records for a domain
     */
    getDnsRecords(domain: string): Promise<NamecheapDnsRecord[]>;
    /**
     * Set DNS records for a domain
     */
    setDnsRecords(domain: string, records: Array<{
        hostname: string;
        type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS';
        address: string;
        mxPref?: number;
        ttl?: number;
    }>): Promise<void>;
    /**
     * Get domain info
     */
    getDomainInfo(domain: string): Promise<NamecheapDomain | null>;
}
