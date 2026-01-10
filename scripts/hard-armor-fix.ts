import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

async function main() {
    console.log("🛡️ Starting Hard Armor Fix: Standardizing Monorepo TSConfigs...");

    // 1. Root TSConfig Repair
    const rootTsConfigPath = path.resolve(process.cwd(), 'tsconfig.json');
    if (fs.existsSync(rootTsConfigPath)) {
        let content = fs.readFileSync(rootTsConfigPath, 'utf8');
        // Fix legacy root references
        content = content.replace(/"path":\s*"\.\/shared"/g, '"path": "./packages/shared"');
        content = content.replace(/"path":\s*"\.\/spine"/g, '"path": "./packages/nerve"'); // Spine is unified in Nerve
        fs.writeFileSync(rootTsConfigPath, content);
        console.log("[Hard Armor] Root tsconfig.json repaired.");
    }

    // 2. Package TSConfig Repair
    const tsConfigFiles = await glob('packages/**/tsconfig.json');
    for (const tsFile of tsConfigFiles) {
        let content = fs.readFileSync(tsFile, 'utf8');
        let modified = false;

        // Common broken relative patterns
        // If they try to go up to a "shared" folder that isn't there
        if (content.includes('"path": "../shared"')) {
            content = content.replace(/"path":\s*"\.\.\/shared"/g, '"path": "../../shared"'); // Likely needed one more level up
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(tsFile, content);
            console.log(`[Hard Armor] Repaired ${tsFile}`);
        }
    }

    console.log("✨ Hard Armor Fix Complete. The system's structural integrity is restored.");
}

main().catch(console.error);
