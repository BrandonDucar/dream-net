#!/usr/bin/env tsx
/**
 * Scan All DreamNet Domains
 * 
 * Checks:
 * - Domain ownership (DNS records)
 * - DNS configuration
 * - SSL certificate status
 * - Domain routing (where they point)
 * - Domain issuance capabilities
 * 
 * Usage: pnpm tsx scripts/scan-domains.ts
 */

import { execSync } from 'child_process';
import { dns } from 'dns/promises';

const domains = [
  'dreamnet.ink',
  'dreamnet.live',
  'aethersafe.pro',
  'dadfi.org',
  'www.dreamnet.ink',
  'www.dreamnet.live',
  'www.aethersafe.pro',
  'www.dadfi.org',
];

interface DomainInfo {
  domain: string;
  aRecords: string[];
  cnameRecords: string[];
  mxRecords: string[];
  txtRecords: string[];
  nsRecords: string[];
  sslValid: boolean;
  sslExpiry?: Date;
  httpStatus?: number;
  httpRedirect?: string;
}

async function resolveDNS(domain: string, type: string): Promise<string[]> {
  try {
    const records = await dns.resolve(domain, type);
    return Array.isArray(records) ? records : [records];
  } catch {
    return [];
  }
}

async function checkSSL(domain: string): Promise<{ valid: boolean; expiry?: Date }> {
  try {
    // Use openssl to check certificate
    const result = execSync(
      `echo | openssl s_client -servername ${domain} -connect ${domain}:443 2>/dev/null | openssl x509 -noout -dates`,
      { encoding: 'utf-8', stdio: 'pipe', timeout: 5000 }
    );

    const expiryMatch = result.match(/notAfter=(.+)/);
    if (expiryMatch) {
      return { valid: true, expiry: new Date(expiryMatch[1]) };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

async function checkHTTP(domain: string): Promise<{ status?: number; redirect?: string }> {
  try {
    const url = `https://${domain}`;
    const result = execSync(
      `curl -s -o /dev/null -w "%{http_code}" -L -m 5 ${url}`,
      { encoding: 'utf-8', stdio: 'pipe', timeout: 5000 }
    );
    const status = parseInt(result.trim());
    return { status };
  } catch {
    return {};
  }
}

async function scanDomain(domain: string): Promise<DomainInfo> {
  console.log(`\n🔍 Scanning ${domain}...`);

  const info: DomainInfo = {
    domain,
    aRecords: [],
    cnameRecords: [],
    mxRecords: [],
    txtRecords: [],
    nsRecords: [],
    sslValid: false,
  };

  // DNS Records
  try {
    info.aRecords = await resolveDNS(domain, 'A');
    info.cnameRecords = await resolveDNS(domain, 'CNAME');
    info.mxRecords = await resolveDNS(domain, 'MX');
    info.txtRecords = await resolveDNS(domain, 'TXT');
    info.nsRecords = await resolveDNS(domain, 'NS');

    console.log(`   📍 A Records: ${info.aRecords.length > 0 ? info.aRecords.join(', ') : 'None'}`);
    console.log(`   🔗 CNAME Records: ${info.cnameRecords.length > 0 ? info.cnameRecords.join(', ') : 'None'}`);
    console.log(`   📧 MX Records: ${info.mxRecords.length > 0 ? info.mxRecords.length : 'None'}`);
    console.log(`   📝 TXT Records: ${info.txtRecords.length > 0 ? info.txtRecords.length : 'None'}`);
  } catch (error: any) {
    console.log(`   ⚠️  DNS lookup failed: ${error.message}`);
  }

  // SSL Certificate
  try {
    const ssl = await checkSSL(domain);
    info.sslValid = ssl.valid;
    info.sslExpiry = ssl.expiry;
    if (ssl.valid && ssl.expiry) {
      const daysUntilExpiry = Math.floor((ssl.expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      console.log(`   🔒 SSL: Valid (expires in ${daysUntilExpiry} days)`);
    } else {
      console.log(`   🔒 SSL: Not valid or not found`);
    }
  } catch {
    console.log(`   🔒 SSL: Could not check`);
  }

  // HTTP Status
  try {
    const http = await checkHTTP(domain);
    info.httpStatus = http.status;
    if (http.status) {
      console.log(`   🌐 HTTP Status: ${http.status}`);
    }
  } catch {
    console.log(`   🌐 HTTP: Could not check`);
  }

  return info;
}

async function main() {
  console.log('🌐 Scanning DreamNet Domains...\n');
  console.log('='.repeat(60));

  const results: DomainInfo[] = [];

  for (const domain of domains) {
    try {
      const info = await scanDomain(domain);
      results.push(info);
    } catch (error: any) {
      console.error(`❌ Failed to scan ${domain}: ${error.message}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Domain Summary:\n');

  results.forEach(info => {
    const status = info.sslValid && info.httpStatus === 200 ? '✅' : '⚠️';
    console.log(`${status} ${info.domain}`);
    if (info.aRecords.length > 0) {
      console.log(`   → Points to: ${info.aRecords[0]}`);
    } else if (info.cnameRecords.length > 0) {
      console.log(`   → CNAME: ${info.cnameRecords[0]}`);
    } else {
      console.log(`   → No DNS records found`);
    }
    if (info.sslValid) {
      console.log(`   🔒 SSL: Valid`);
    }
    if (info.httpStatus) {
      console.log(`   🌐 HTTP: ${info.httpStatus}`);
    }
    console.log('');
  });

  // Check domain issuance capabilities
  console.log('='.repeat(60));
  console.log('\n🎫 Domain Issuance Capabilities:\n');

  try {
    const { getDomainsForWallet } = await import('../packages/organs/reproductive/domain-issuance-core');
    // Check if we can issue domains
    console.log('   ✅ Domain Issuance Core package available');
    console.log('   💡 Can issue domains via: /api/domain-issuance');
  } catch {
    console.log('   ⚠️  Domain Issuance Core not available');
  }

  console.log('\n💡 To issue a domain:');
  console.log('   POST /api/domain-issuance/issue');
  console.log('   { "wallet": "0x...", "domain": "subdomain.dreamnet.ink" }');
}

main().catch(console.error);

