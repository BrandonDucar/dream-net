import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

async function main() {
    console.log("🧬 Starting Organ Re-Wiring Surgery...");

    // 1. Update package.json files
    const pkgFiles = await glob('packages/organs/*/package.json');
    for (const pkgFile of pkgFiles) {
        let content = fs.readFileSync(pkgFile, 'utf8');
        let modified = false;

        if (content.includes('@dreamnet/organ-nerve')) {
            content = content.replace(/"@dreamnet\/organ-nerve":\s*"workspace:\*"/g, '"@dreamnet/nerve": "workspace:*"');
            modified = true;
        }
        if (content.includes('@dreamnet/nerve-organ')) {
            content = content.replace(/"@dreamnet\/nerve-organ":\s*"workspace:\*"/g, '"@dreamnet/nerve": "workspace:*"');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(pkgFile, content);
            console.log(`[Re-Wire] Updated dependencies in ${pkgFile}`);
        }
    }

    // 2. Update core.ts files
    const coreFiles = await glob('packages/organs/*/src/core.ts');
    for (const coreFile of coreFiles) {
        let content = fs.readFileSync(coreFile, 'utf8');
        let modified = false;

        if (content.includes('@dreamnet/nerve-organ')) {
            content = content.replace(/from\s+'@dreamnet\/nerve-organ'/g, "from '@dreamnet/nerve'");
            modified = true;
        }
        if (content.includes('@dreamnet/organ-nerve')) {
            content = content.replace(/from\s+'@dreamnet\/organ-nerve'/g, "from '@dreamnet/nerve'");
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(coreFile, content);
            console.log(`[Re-Wire] Updated imports in ${coreFile}`);
        }
    }

    console.log("✨ Surgery Complete. Organs are now re-wired to the Unified Spine.");
}

main().catch(console.error);
