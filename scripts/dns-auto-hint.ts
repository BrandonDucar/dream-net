#!/usr/bin/env tsx
/**
 * DnsAutoHint - Generate exact DNS cut-sheet for pointing hostname to deployment
 * 
 * Goal: Produce an exact DNS cut-sheet for pointing a new hostname to a deployment.
 */

interface DnsRecord {
  host: string;
  type: string;
  value: string;
  ttl: number;
  purpose: string;
}

interface DnsConfig {
  provider: 'vercel' | 'cloud-run' | 'cloudflare' | 'firebase';
  domain: string;
  apex: boolean;
  wwwRedirect: boolean;
  email: boolean;
}

class DnsAutoHint {
  generateRecords(config: DnsConfig): DnsRecord[] {
    const records: DnsRecord[] = [];
    
    if (config.provider === 'vercel') {
      // Vercel uses CNAME for subdomains, ALIAS/ANAME for apex
      if (config.apex) {
        records.push({
          host: '@',
          type: 'ALIAS',
          value: 'cname.vercel-dns.com',
          ttl: 3600,
          purpose: 'Apex domain to Vercel'
        });
      } else {
        records.push({
          host: config.domain.split('.')[0],
          type: 'CNAME',
          value: 'cname.vercel-dns.com',
          ttl: 3600,
          purpose: 'Subdomain to Vercel'
        });
      }
      
      // TXT for verification
      records.push({
        host: config.domain,
        type: 'TXT',
        value: 'vercel-dns-verification',
        ttl: 3600,
        purpose: 'Vercel domain verification'
      });
      
      // www redirect
      if (config.wwwRedirect) {
        records.push({
          host: 'www',
          type: 'CNAME',
          value: config.apex ? config.domain : `${config.domain.split('.')[0]}.${config.domain.split('.').slice(1).join('.')}`,
          ttl: 3600,
          purpose: 'www redirect to apex'
        });
      }
    } else if (config.provider === 'cloud-run') {
      // Cloud Run uses A/AAAA records (get IPs from service)
      records.push({
        host: config.apex ? '@' : config.domain.split('.')[0],
        type: 'A',
        value: 'GET_FROM_CLOUD_RUN_SERVICE_IP',
        ttl: 3600,
        purpose: 'Cloud Run service IP (update with actual IP)'
      });
    }
    
    // Preserve MX/SPF/DMARC if email is present
    if (config.email) {
      records.push({
        host: '@',
        type: 'MX',
        value: 'DO_NOT_CHANGE',
        ttl: 3600,
        purpose: 'Email MX records (preserve existing)'
      });
    }
    
    return records;
  }
  
  generateCutSheet(config: DnsConfig): void {
    console.log('📋 DNS Auto-Hint - Generating DNS cut-sheet...\n');
    
    const records = this.generateRecords(config);
    
    console.log('=== DNS Records Table ===');
    console.log('Host | Type | Value | TTL | Purpose');
    console.log('-----|------|-------|-----|---------');
    records.forEach(record => {
      console.log(`${record.host.padEnd(20)} | ${record.type.padEnd(6)} | ${record.value.padEnd(40)} | ${record.ttl} | ${record.purpose}`);
    });
    
    console.log('\n=== Apply in This Order ===');
    console.log('1. Add domain in platform dashboard (Vercel/Cloud Run)');
    console.log('2. Add TXT record for verification');
    console.log('3. Add CNAME/ALIAS/A records');
    console.log('4. Wait for DNS propagation (up to 48 hours)');
    console.log('5. Verify in platform dashboard');
    
    console.log('\n=== Validation Checklist ===');
    console.log(`dig ${config.domain} +short`);
    console.log(`nslookup ${config.domain}`);
    console.log(`curl -I https://${config.domain}`);
    console.log('\nExpected outputs:');
    console.log('- dig: Should show CNAME or IP address');
    console.log('- nslookup: Should resolve to platform edge');
    console.log('- curl: Should return 200 OK from platform');
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const provider = process.argv[2] as 'vercel' | 'cloud-run' | 'cloudflare' | 'firebase' || 'vercel';
  const domain = process.argv[3] || 'dreamnet.ink';
  
  const config: DnsConfig = {
    provider,
    domain,
    apex: !domain.includes('.') || domain.split('.').length === 2,
    wwwRedirect: true,
    email: false
  };
  
  const hint = new DnsAutoHint();
  hint.generateCutSheet(config);
}

export { DnsAutoHint };

