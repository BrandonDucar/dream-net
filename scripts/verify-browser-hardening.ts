import { defaultDomainAllowlist } from '../server/core/browser-agent/domainAllowlist';
import { defaultIpBlocking } from '../server/core/browser-agent/ipBlocking';

async function verifyHardening() {
    console.log('🛡️  Verifying Browser Agent Hardening...');

    // 1. Test Domain Allowlist
    console.log('\n1. Testing Domain Allowlist:');
    const allowedDomains = ['dreamnet.ink', 'api.dreamnet.ink', 'vercel.app'];
    const blockedDomains = ['evil.com', 'internal.local'];

    for (const domain of allowedDomains) {
        const result = defaultDomainAllowlist.isAllowed(`https://${domain}`);
        if (result.allowed) {
            console.log(`✅ Allowed: ${domain}`);
        } else {
            console.error(`❌ FAILED: ${domain} should be allowed`);
        }
    }

    for (const domain of blockedDomains) {
        const result = defaultDomainAllowlist.isAllowed(`https://${domain}`);
        if (!result.allowed) {
            console.log(`✅ Blocked: ${domain}`);
        } else {
            console.error(`❌ FAILED: ${domain} should be blocked`);
        }
    }

    // 2. Test IP Blocking
    console.log('\n2. Testing IP Blocking:');
    const blockedIps = [
        'http://127.0.0.1',
        'http://localhost',
        'http://10.0.0.1',
        'http://192.168.1.1',
        'http://169.254.169.254'
    ];
    const allowedIps = ['https://google.com']; // Should resolve to public IP

    for (const url of blockedIps) {
        const result = await defaultIpBlocking.validateUrl(url);
        if (!result.allowed) {
            console.log(`✅ Blocked: ${url} (${result.reason})`);
        } else {
            console.error(`❌ FAILED: ${url} should be blocked`);
        }
    }

    for (const url of allowedIps) {
        const result = await defaultIpBlocking.validateUrl(url);
        if (result.allowed) {
            console.log(`✅ Allowed: ${url}`);
        } else {
            console.error(`❌ FAILED: ${url} should be allowed`);
        }
    }

    console.log('\n✅ Verification Complete');
}

verifyHardening().catch(console.error);
