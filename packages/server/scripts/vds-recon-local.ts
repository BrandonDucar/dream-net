/**
 * VDS Auth & Recon Test Pulse
 * 
 * Attempts to authenticate with vdsapps.com and capture session schema.
 * Run with: npx tsx scripts/vds-recon-local.ts
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';

const config = {
    email: 'nilknarf1972+brandon@gmail.com',
    pass: 'xP&R1mzUSG5pdhp^',
    baseUrl: 'https://vdsapps.com'
};

async function executeVDSRecon() {
    console.log("🛰️ [VDS RECON] INITIATING AUTH PULSE...");

    const session = axios.create({
        baseURL: config.baseUrl,
        withCredentials: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });

    try {
        // 1. Initial hit to get state/cookies
        console.log("🔗 Connecting to portal...");
        const initialResponse = await session.get('/');

        // 2. Attempt Login (Mapping likely .NET Identity or similar)
        console.log("🔑 Injecting credentials...");

        // Note: We are guessing the form structure based on common RapIDAdmin/VDS patterns.
        // Usually it's /RapIDAdmin/Account/Login or similar
        const loginUrl = '/RapIDAdmin/Account/Login';

        // We'll need to parse the CSRF token if present, but let's try a direct POST first to see the error/redirect
        const loginResponse = await session.post(loginUrl,
            `usernameOrEmailAddress=${encodeURIComponent(config.email)}&password=${encodeURIComponent(config.pass)}&rememberMe=false&takeMeToApplicationId=0dcb265f-9495-49c3-9292-925f84b00077`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                maxRedirects: 5
            }
        );

        console.log(`📡 Response Status: ${loginResponse.status}`);
        console.log(`🌐 Final URL: ${loginResponse.config.url}`);

        if (loginResponse.data.includes('PerfectPass') || loginResponse.data.includes('Dashboard')) {
            console.log("✅ AUTH SUCCESSFUL: Infiltrated VDS Dashboard.");

            // 3. Scan for API/SDK/Key signatures
            console.log("🔍 Scanning for API Signatures...");
            const signatures = ['api', 'key', 'sdk', 'developer', 'integration', 'token', 'documentation'];
            signatures.forEach(sig => {
                if (loginResponse.data.toLowerCase().includes(sig)) {
                    console.log(`📡 Found potential signature: "${sig}"`);
                }
            });

            // 4. Dump the DOM for analysis
            const dumpPath = path.join(process.cwd(), 'vds-dashboard-dump.html');
            fs.writeFileSync(dumpPath, loginResponse.data);
            console.log(`📄 Dashboard dump saved to: ${dumpPath}`);

            // 5. Look for specific API Key links
            const keyLinkMatch = loginResponse.data.match(/href="([^"]*api[^"]*)"/i);
            if (keyLinkMatch) {
                console.log(`🔗 Detected potential API link: ${keyLinkMatch[1]}`);
            }
        } else {
            console.log("❌ AUTH FAILED: Could not reach the inner sanctum. Check credentials or MFA.");
            // Dump the error page for debugging
            fs.writeFileSync('vds-error.html', loginResponse.data);
        }

    } catch (error: any) {
        console.error("💥 RECON CRASHED:", error.message);
        if (error.response) {
            console.log("Error Payload:", error.response.data.substring(0, 500));
        }
    }
}

executeVDSRecon();
