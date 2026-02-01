/**
 * Replit Deployment Script
 * 
 * Objective: Bundle core organs and sync them to a Replit container 
 * for persistent, always-on sovereign hosting.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const REPLIT_URL = process.env.REPLIT_URL; // e.g., https://replit.com/@user/project
const CORE_PACKAGES = [
    'nerve',
    'dream-cortex',
    'memory-dna',
    'organs'
];

async function deployToReplit() {
    console.log('🚀 Starting Sovereign Substrate Deployment to Replit...');

    if (!REPLIT_URL) {
        console.error('❌ REPLIT_URL not found in environment. Please set it.');
        process.exit(1);
    }

    try {
        // 1. Build Core Packages
        console.log('📦 Building core packages...');
        execSync('npx tsc -b packages/nerve packages/dream-cortex packages/memory-dna packages/organs', { stdio: 'inherit' });

        // 2. Prepare Bundle
        console.log('📁 Preparing deployment bundle...');
        const bundlePath = path.resolve('./replit-bundle');
        if (fs.existsSync(bundlePath)) {
            fs.rmSync(bundlePath, { recursive: true });
        }
        fs.mkdirSync(bundlePath);

        // Copy build artifacts (simplified for now)
        for (const pkg of CORE_PACKAGES) {
            const src = path.resolve(`./packages/${pkg}/dist`);
            if (fs.existsSync(src)) {
                fs.cpSync(src, path.join(bundlePath, pkg), { recursive: true });
                console.log(`✅ Bundled: ${pkg}`);
            }
        }

        // 3. Deployment Logic (e.g., via Replit CLI or Webhook)
        // Note: This is an architectural placeholder for the final sync step.
        console.log(`📡 Deployment ready. Target: ${REPLIT_URL}`);
        console.log('💡 TIP: Use "replit deploy" or sync the "replit-bundle" directory.');

    } catch (error) {
        console.error('❌ Deployment failed:', error);
        process.exit(1);
    }
}

deployToReplit();
