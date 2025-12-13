# Namecheap API Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

Namecheap API Core provides **domain and DNS management** integration with Namecheap's API. It enables domain listing, DNS record management, domain registration, and domain transfer operations.

---

## Key Features

### Domain Management
- List domains
- Get domain info
- Domain registration
- Domain transfer
- Domain renewal

### DNS Management
- List DNS records
- Create DNS records
- Update DNS records
- Delete DNS records
- Set DNS hosts

### API Integration
- XML-based API
- Sandbox support
- Error handling
- Response parsing
- Status tracking

---

## Architecture

### Components

1. **Namecheap API Client** (`index.ts`)
   - API communication
   - Request handling
   - Response parsing
   - Error handling

---

## API Reference

### Initialization

#### `new NamecheapApiClient(config?: NamecheapApiConfig): NamecheapApiClient`
Creates Namecheap API client.

**Example**:
```typescript
import { NamecheapApiClient } from '@dreamnet/namecheap-api-core';

const client = new NamecheapApiClient({
  apiUser: process.env.NAMECHEAP_API_USER,
  apiKey: process.env.NAMECHEAP_API_KEY,
  username: process.env.NAMECHEAP_USERNAME,
  clientIp: process.env.NAMECHEAP_CLIENT_IP,
  useSandbox: false,
});
```

### Domain Operations

#### `getDomains(): Promise<NamecheapDomain[]>`
Lists all domains.

**Example**:
```typescript
const domains = await client.getDomains();
domains.forEach(domain => {
  console.log(`${domain.Name}: ${domain.Expires}`);
});
```

#### `getDomainInfo(domain: string): Promise<NamecheapDomain | null>`
Gets domain information.

**Example**:
```typescript
const domain = await client.getDomainInfo('example.com');
if (domain) {
  console.log(`Created: ${domain.Created}`);
  console.log(`Expires: ${domain.Expires}`);
  console.log(`Locked: ${domain.IsLocked}`);
}
```

### DNS Operations

#### `getDnsRecords(domain: string, sld: string, tld: string): Promise<NamecheapDnsRecord[]>`
Lists DNS records for a domain.

**Example**:
```typescript
const records = await client.getDnsRecords('example', 'com');
records.forEach(record => {
  console.log(`${record.HostName} ${record.RecordType}: ${record.Address}`);
});
```

#### `setDnsHosts(domain: string, sld: string, tld: string, hosts: NamecheapDnsRecord[]): Promise<boolean>`
Sets DNS hosts for a domain.

**Example**:
```typescript
const success = await client.setDnsHosts('example', 'com', [
  {
    HostName: '@',
    RecordType: 'A',
    Address: '192.0.2.1',
    TTL: '1800',
  },
  {
    HostName: 'www',
    RecordType: 'A',
    Address: '192.0.2.1',
    TTL: '1800',
  },
]);
```

---

## Data Models

### NamecheapDomain

```typescript
interface NamecheapDomain {
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
```

### NamecheapDnsRecord

```typescript
interface NamecheapDnsRecord {
  HostName: string;
  RecordType: string;
  Address: string;
  MXPref?: string;
  TTL: string;
}
```

### NamecheapApiResponse

```typescript
interface NamecheapApiResponse<T = any> {
  '@': {
    Status: 'OK' | 'ERROR';
    Command: string;
    Server: string;
    GMTTimeDifference: string;
    ExecutionTime: string;
  };
  Errors?: {
    Error: string | Array<{ Number: string; $: string }>;
  };
  Warnings?: {
    Warning: string | Array<{ Number: string; $: string }>;
  };
  CommandResponse?: T;
}
```

---

## Environment Variables

- **NAMECHEAP_API_USER**: API username
- **NAMECHEAP_API_KEY**: API key
- **NAMECHEAP_USERNAME**: Account username
- **NAMECHEAP_CLIENT_IP**: Whitelisted IP address
- **NAMECHEAP_USE_SANDBOX**: Use sandbox environment

---

## DNS Record Types

### A Record
- IPv4 address mapping
- Hostname to IP
- Standard DNS record

### AAAA Record
- IPv6 address mapping
- Hostname to IPv6
- Modern DNS record

### CNAME Record
- Canonical name
- Alias mapping
- Domain aliasing

### MX Record
- Mail exchange
- Email routing
- Priority-based

### TXT Record
- Text records
- Verification
- SPF/DKIM

---

## Integration Points

### DreamNet Systems
- **Domain Issuance Core**: Domain management
- **DreamNet OS Core**: Infrastructure
- **DreamNet Audit Core**: Audit logging

### External Systems
- **Namecheap API**: Domain services
- **DNS Providers**: DNS management

---

## Usage Examples

### List Domains

```typescript
const domains = await client.getDomains();
console.log(`Total domains: ${domains.length}`);
```

### Get DNS Records

```typescript
const records = await client.getDnsRecords('example', 'com');
records.forEach(record => {
  console.log(`${record.HostName}.${record.RecordType} = ${record.Address}`);
});
```

### Update DNS

```typescript
await client.setDnsHosts('example', 'com', [
  { HostName: '@', RecordType: 'A', Address: '192.0.2.1', TTL: '1800' },
]);
```

---

## Best Practices

1. **API Configuration**
   - Use sandbox for testing
   - Whitelist IP addresses
   - Secure API keys
   - Monitor API usage

2. **DNS Management**
   - Validate records
   - Check TTL values
   - Monitor changes
   - Backup records

3. **Error Handling**
   - Handle API errors
   - Parse XML responses
   - Check status codes
   - Log errors

---

## Security Considerations

1. **API Security**
   - Protect API keys
   - Use environment variables
   - Whitelist IPs
   - Monitor access

2. **DNS Security**
   - Validate DNS records
   - Prevent DNS hijacking
   - Monitor changes
   - Audit DNS operations

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

