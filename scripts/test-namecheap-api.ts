/**
 * Test Namecheap API Connection
 * 
 * This script tests the Namecheap API connection and shows what domains you have
 */

import { NamecheapApiClient } from '../packages/namecheap-api-core/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('🧪 Testing Namecheap API Connection...\n');

  try {
    const client = new NamecheapApiClient();
    console.log('✅ API Client initialized\n');

    // Test getting domains
    console.log('📡 Fetching domains...');
    const domains = await client.getDomains();
    
    console.log(`\n✅ Success! Found ${domains.length} domain(s):\n`);
    
    if (domains.length === 0) {
      console.log('   No domains found in your account.');
    } else {
      domains.forEach((domain, index) => {
        console.log(`${index + 1}. ${domain.Name}`);
        console.log(`   User: ${domain.User}`);
        console.log(`   Expires: ${domain.Expires}`);
        console.log(`   Expired: ${domain.IsExpired === 'true' ? '⚠️ YES' : '✅ No'}`);
        console.log(`   Using Namecheap DNS: ${domain.IsOurDNS === 'true' ? '✅ Yes' : '❌ No'}`);
        console.log('');
      });

      // Test getting DNS records for first domain
      if (domains.length > 0) {
        const firstDomain = domains[0];
        console.log(`\n📡 Fetching DNS records for ${firstDomain.Name}...`);
        try {
          const records = await client.getDnsRecords(firstDomain.Name);
          console.log(`\n✅ Found ${records.length} DNS record(s):\n`);
          
          if (records.length === 0) {
            console.log('   No DNS records found.');
          } else {
            records.forEach((record, index) => {
              const hostname = record.HostName === '@' ? '(root)' : record.HostName;
              console.log(`${index + 1}. ${hostname} ${record.RecordType} → ${record.Address}`);
            });
          }
        } catch (error: any) {
          console.error(`\n❌ Failed to get DNS records: ${error.message}`);
        }
      }
    }

    console.log('\n✅ API test completed successfully!');
    
  } catch (error: any) {
    console.error('\n❌ API Test Failed:', error.message);
    console.error('\n💡 Make sure you have set:');
    console.error('   - NAMECHEAP_API_USER');
    console.error('   - NAMECHEAP_API_KEY');
    console.error('   - NAMECHEAP_USERNAME');
    console.error('   - NAMECHEAP_CLIENT_IP (your whitelisted IP)');
    console.error('\n📖 See NAMECHEAP_SETUP.md for instructions');
    process.exit(1);
  }
}

main().catch(console.error);

