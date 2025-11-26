/**
 * Scan Namecheap Domains and Configure DNS
 * 
 * This script:
 * 1. Lists all domains in your Namecheap account
 * 2. Shows current DNS configuration
 * 3. Suggests DNS updates for Cloud Run deployment
 * 4. Optionally updates DNS records
 */

import { NamecheapApiClient } from '../packages/namecheap-api-core/index.js';
import dotenv from 'dotenv';

dotenv.config();

// Get Cloud Run service URL from environment or prompt
const CLOUD_RUN_URL = process.env.CLOUD_RUN_URL || process.env.DREAMNET_URL || '';

async function main() {
  console.log('🔍 Scanning Namecheap domains...\n');

  try {
    const client = new NamecheapApiClient();
    
    // Get all domains
    const domains = await client.getDomains();
    
    console.log(`✅ Found ${domains.length} domain(s):\n`);
    
    for (const domain of domains) {
      console.log(`📦 ${domain.Name}`);
      console.log(`   User: ${domain.User}`);
      console.log(`   Expires: ${domain.Expires}`);
      console.log(`   Expired: ${domain.IsExpired === 'true' ? '⚠️ YES' : '✅ No'}`);
      console.log(`   Locked: ${domain.IsLocked === 'true' ? '🔒 Yes' : '🔓 No'}`);
      console.log(`   Auto-renew: ${domain.AutoRenew === 'true' ? '✅ Yes' : '❌ No'}`);
      console.log(`   Using Namecheap DNS: ${domain.IsOurDNS === 'true' ? '✅ Yes' : '❌ No'}`);
      
      // Get DNS records
      try {
        const records = await client.getDnsRecords(domain.Name);
        console.log(`   DNS Records (${records.length}):`);
        
        if (records.length === 0) {
          console.log('      ⚠️  No DNS records found');
        } else {
          records.forEach(record => {
            const hostname = record.HostName === '@' ? '(root)' : record.HostName;
            console.log(`      ${hostname} ${record.RecordType} → ${record.Address}`);
          });
        }
        
        // Suggest DNS updates for Cloud Run
        if (CLOUD_RUN_URL) {
          console.log(`\n   💡 DNS Configuration Suggestions:`);
          
          // Check if root domain has correct CNAME
          const rootCname = records.find(r => r.HostName === '@' && r.RecordType === 'CNAME');
          if (!rootCname || rootCname.Address !== CLOUD_RUN_URL) {
            console.log(`      ⚠️  Root domain (@) should point to: ${CLOUD_RUN_URL}`);
            console.log(`         Current: ${rootCname ? rootCname.Address : 'Not set'}`);
            console.log(`         Action: Update CNAME @ → ${CLOUD_RUN_URL}`);
          } else {
            console.log(`      ✅ Root domain correctly points to Cloud Run`);
          }
          
          // Check www subdomain
          const wwwCname = records.find(r => r.HostName === 'www' && r.RecordType === 'CNAME');
          if (!wwwCname || wwwCname.Address !== CLOUD_RUN_URL) {
            console.log(`      ⚠️  www subdomain should point to: ${CLOUD_RUN_URL}`);
            console.log(`         Current: ${wwwCname ? wwwCname.Address : 'Not set'}`);
            console.log(`         Action: Update CNAME www → ${CLOUD_RUN_URL}`);
          } else {
            console.log(`      ✅ www subdomain correctly points to Cloud Run`);
          }
        }
        
      } catch (error: any) {
        console.log(`   ❌ Failed to get DNS records: ${error.message}`);
      }
      
      console.log('');
    }
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`   Total domains: ${domains.length}`);
    console.log(`   Expired: ${domains.filter(d => d.IsExpired === 'true').length}`);
    console.log(`   Using Namecheap DNS: ${domains.filter(d => d.IsOurDNS === 'true').length}`);
    
    if (CLOUD_RUN_URL) {
      console.log(`\n💡 To update DNS records, use:`);
      console.log(`   POST /api/namecheap/domains/{domain}/dns`);
      console.log(`   With body: { "records": [{ "hostname": "@", "type": "CNAME", "address": "${CLOUD_RUN_URL}", "ttl": 1800 }] }`);
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Make sure you have set:');
    console.error('   - NAMECHEAP_API_USER');
    console.error('   - NAMECHEAP_API_KEY');
    console.error('   - NAMECHEAP_USERNAME');
    console.error('   - NAMECHEAP_CLIENT_IP (your whitelisted IP)');
    process.exit(1);
  }
}

main().catch(console.error);

