import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

async function main() {
    console.log("🛡️ Starting Precise Armor Fix: Re-mapping Package Links...");

    // 1. Root TSConfig - Standardize all and find missed ones
    const rootTsPath = path.resolve(process.cwd(), 'tsconfig.json');
    if (fs.existsSync(rootTsPath)) {
        let content = fs.readFileSync(rootTsPath, 'utf8');
        // Finalizing root references
        content = content.replace(/"path":\s*"\.\.\/shared"/g, '"path": "./packages/shared"');
        content = content.replace(/"path":\s*"\.\.\/lib"/g, '"path": "./packages/lib"');
        fs.writeFileSync(rootTsPath, content);
    }

    // 2. Package-level TSConfigs
    const tsConfigFiles = await glob('packages/**/tsconfig.json');
    for (const tsFile of tsConfigFiles) {
        if (tsFile === 'tsconfig.json') continue;

        let content = fs.readFileSync(tsFile, 'utf8');
        let modified = false;

        // Pattern 1: ../../shared -> ../shared (Correct sibling reference)
        if (content.includes('"path": "../../shared"')) {
            content = content.replace(/"path":\s*"\.\.\/\.\.\/shared"/g, '"path": "../shared"');
            modified = true;
        }

        // Pattern 2: ../../lib -> ../lib
        if (content.includes('"path": "../../lib"')) {
            content = content.replace(/"path":\s*"\.\.\/\.\.\/lib"/g, '"path": "../lib"');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(tsFile, content);
            console.log(`[Precise Armor] Repaired ${tsFile}`);
        }
    }

    console.log("✨ Precise Armor Fix Complete.");
}

main().catch(console.error);
