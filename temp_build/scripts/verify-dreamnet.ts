
import { fetch } from 'undici';

const DEFAULT_URL = process.env.DREAMNET_API_URL || 'http://localhost:8080';

async function verifyEndpoint(baseUrl: string, path: string, name: string) {
    const url = `${baseUrl}${path}`;
    console.log(`Checking ${name} at ${url}...`);
    try {
        const start = Date.now();
        const res = await fetch(url);
        const duration = Date.now() - start;

        if (res.ok) {
            console.log(`✅ ${name}: OK (${res.status}) - ${duration}ms`);
            try {
                const data = await res.json();
                // console.log('   Response:', JSON.stringify(data).substring(0, 100) + '...');
            } catch (e) {
                console.log('   (Non-JSON response)');
            }
            return true;
        } else {
            console.error(`❌ ${name}: Failed (${res.status}) - ${duration}ms`);
            return false;
        }
    } catch (error: any) {
        console.error(`❌ ${name}: Error - ${error.message}`);
        return false;
    }
}

async function main() {
    const args = process.argv.slice(2);
    const baseUrl = args[0] || DEFAULT_URL;

    console.log(`\n🔍 Starting DreamNet Verification on ${baseUrl}\n`);

    const checks = [
        { path: '/api/heartbeat', name: 'System Heartbeat' },
        { path: '/api/shield/status', name: 'Shield Status' },
        { path: '/api/system/health', name: 'System Health' },
        // Add more endpoints as needed
    ];

    let successCount = 0;

    for (const check of checks) {
        const success = await verifyEndpoint(baseUrl, check.path, check.name);
        if (success) successCount++;
    }

    console.log(`\n📊 Verification Complete: ${successCount}/${checks.length} checks passed.`);

    if (successCount === checks.length) {
        console.log('✅ All systems operational.');
        process.exit(0);
    } else {
        console.error('❌ Some systems failed verification.');
        process.exit(1);
    }
}

main().catch(console.error);
