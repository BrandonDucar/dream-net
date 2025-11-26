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
export class NamecheapApiClient {
    apiUser;
    apiKey;
    username;
    clientIp;
    baseUrl = 'https://api.namecheap.com/xml.response';
    sandboxUrl = 'https://api.sandbox.namecheap.com/xml.response';
    useSandbox;
    constructor(config) {
        this.apiUser = config?.apiUser || process.env.NAMECHEAP_API_USER || '';
        this.apiKey = config?.apiKey || process.env.NAMECHEAP_API_KEY || '';
        this.username = config?.username || process.env.NAMECHEAP_USERNAME || '';
        this.clientIp = config?.clientIp || process.env.NAMECHEAP_CLIENT_IP || '';
        this.useSandbox = config?.useSandbox || process.env.NAMECHEAP_USE_SANDBOX === 'true';
        if (!this.apiUser || !this.apiKey || !this.username) {
            throw new Error('Namecheap API credentials are required. Set NAMECHEAP_API_USER, NAMECHEAP_API_KEY, and NAMECHEAP_USERNAME');
        }
        if (!this.clientIp && !this.useSandbox) {
            console.warn('[Namecheap] NAMECHEAP_CLIENT_IP not set. API calls may fail if IP is not whitelisted.');
        }
    }
    /**
     * Make an API request to Namecheap
     */
    async makeRequest(command, params = {}) {
        const url = this.useSandbox ? this.sandboxUrl : this.baseUrl;
        const queryParams = new URLSearchParams({
            ApiUser: this.apiUser,
            ApiKey: this.apiKey,
            UserName: this.username,
            Command: command,
            ClientIp: this.clientIp || '127.0.0.1',
            ...params,
        });
        const response = await fetch(`${url}?${queryParams.toString()}`);
        const xmlText = await response.text();
        // Parse XML response (simplified - in production, use a proper XML parser)
        return this.parseXmlResponse(xmlText);
    }
    /**
     * Parse XML response using fast-xml-parser
     */
    parseXmlResponse(xml) {
        try {
            // Dynamic import for fast-xml-parser
            const { XMLParser } = require('fast-xml-parser');
            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: '@_',
                textNodeName: '#text',
                parseAttributeValue: true,
                trimValues: true,
            });
            const result = parser.parse(xml);
            const apiResponse = result.ApiResponse || result;
            // Check for errors
            if (apiResponse['@_Status'] === 'ERROR' || apiResponse.Status === 'ERROR') {
                const errors = apiResponse.Errors?.Error || [];
                const errorArray = Array.isArray(errors) ? errors : [errors];
                const errorMessages = errorArray
                    .map((err) => {
                    if (typeof err === 'string')
                        return err;
                    return err['#text'] || err['@_Number'] || JSON.stringify(err);
                })
                    .filter(Boolean);
                throw new Error(`Namecheap API Error: ${errorMessages.join('; ') || 'Unknown error'}`);
            }
            // Extract CommandResponse if present
            if (apiResponse.CommandResponse) {
                return apiResponse.CommandResponse;
            }
            return { success: true, ...apiResponse };
        }
        catch (error) {
            // Fallback to regex parsing if fast-xml-parser fails
            if (error.message?.includes('Namecheap API Error')) {
                throw error;
            }
            console.warn('[Namecheap] XML parsing error, using fallback:', error.message);
            // Simple regex fallback for error detection
            const statusMatch = xml.match(/Status="([^"]+)"/);
            if (statusMatch && statusMatch[1] === 'ERROR') {
                const errorMatch = xml.match(/<Error[^>]*Number="([^"]+)"[^>]*>([^<]+)<\/Error>/);
                if (errorMatch) {
                    throw new Error(`Namecheap API Error [${errorMatch[1]}]: ${errorMatch[2]}`);
                }
                throw new Error('Namecheap API Error: Unknown error');
            }
            throw new Error(`Failed to parse XML response: ${error.message}`);
        }
    }
    /**
     * Get list of all domains
     */
    async getDomains() {
        try {
            const response = await this.makeRequest('namecheap.domains.getList');
            const domainList = response.DomainGetListResult?.Domain || [];
            const domains = Array.isArray(domainList) ? domainList : [domainList];
            return domains.map((d) => ({
                Name: d['@_Name'] || d.Name || '',
                User: d['@_User'] || d.User || '',
                Created: d['@_Created'] || d.Created || '',
                Expires: d['@_Expires'] || d.Expires || '',
                IsExpired: d['@_IsExpired'] || d.IsExpired || 'false',
                IsLocked: d['@_IsLocked'] || d.IsLocked || 'false',
                AutoRenew: d['@_AutoRenew'] || d.AutoRenew || 'false',
                WhoisGuard: d['@_WhoisGuard'] || d.WhoisGuard || 'false',
                IsPremium: d['@_IsPremium'] || d.IsPremium || 'false',
                IsOurDNS: d['@_IsOurDNS'] || d.IsOurDNS || 'false',
            }));
        }
        catch (error) {
            console.error('[Namecheap] Failed to get domains:', error.message);
            throw error;
        }
    }
    /**
     * Get DNS records for a domain
     */
    async getDnsRecords(domain) {
        try {
            const sld = domain.split('.')[0];
            const tld = domain.split('.').slice(1).join('.');
            const response = await this.makeRequest('namecheap.domains.dns.getHosts', {
                SLD: sld,
                TLD: tld,
            });
            const hostList = response.DomainDNSGetHostsResult?.host || [];
            const hosts = Array.isArray(hostList) ? hostList : [hostList];
            return hosts.map((h) => ({
                HostName: h['@_Name'] || h.Name || '',
                RecordType: h['@_Type'] || h.Type || '',
                Address: h['@_Address'] || h.Address || '',
                MXPref: h['@_MXPref'] || h.MXPref,
                TTL: h['@_TTL'] || h.TTL || '1800',
            }));
        }
        catch (error) {
            console.error(`[Namecheap] Failed to get DNS records for ${domain}:`, error.message);
            throw error;
        }
    }
    /**
     * Set DNS records for a domain
     */
    async setDnsRecords(domain, records) {
        try {
            const sld = domain.split('.')[0];
            const tld = domain.split('.').slice(1).join('.');
            const params = {
                SLD: sld,
                TLD: tld,
            };
            // Namecheap API requires all records in a specific format
            records.forEach((record, index) => {
                params[`HostName${index + 1}`] = record.hostname;
                params[`RecordType${index + 1}`] = record.type;
                params[`Address${index + 1}`] = record.address;
                if (record.mxPref) {
                    params[`MXPref${index + 1}`] = record.mxPref.toString();
                }
                params[`TTL${index + 1}`] = (record.ttl || 1800).toString();
            });
            await this.makeRequest('namecheap.domains.dns.setHosts', params);
        }
        catch (error) {
            console.error(`[Namecheap] Failed to set DNS records for ${domain}:`, error.message);
            throw error;
        }
    }
    /**
     * Get domain info
     */
    async getDomainInfo(domain) {
        const domains = await this.getDomains();
        return domains.find(d => d.Name.toLowerCase() === domain.toLowerCase()) || null;
    }
}
