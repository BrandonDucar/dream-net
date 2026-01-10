import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';

/**
 * Grav Stability Script: The Fleet Stabilizer
 * Standardizes all tsconfig.json files to eliminate implicit type ghosts.
 * progress is solid.
 */

async function stabilize() {
    console.log("🚀 Starting Monorepo Stability Ascension...");

    const tsconfigs = await glob('**/tsconfig.json', {
        ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });

    console.log(`Found ${tsconfigs.length} tsconfig files. Applying Grav Standard...`);

    for (const configPath of tsconfigs) {
        try {
            const content = fs.readFileSync(configPath, 'utf-8');

            // Basic JSON cleanup
            let json;
            try {
                json = JSON.parse(content);
            } catch (e) {
                console.warn(`⚠️ skipping malformed JSON: ${configPath}`);
                continue;
            }

            if (!json.compilerOptions) {
                json.compilerOptions = {};
            }

            // Apply Grav Standard
            json.compilerOptions.skipLibCheck = true;

            // Ensure node types are explicitly included to avoid implicit ghosting
            if (!Array.isArray(json.compilerOptions.types)) {
                json.compilerOptions.types = ["node"];
            } else if (!json.compilerOptions.types.includes("node")) {
                json.compilerOptions.types.push("node");
            }

            // Remove empty types if they were set to [] by previous attempts
            // But we actually WANT ["node"] to ensure basic types are present

            fs.writeFileSync(configPath, JSON.stringify(json, null, 2));
            console.log(`✅ Stabilized: ${configPath}`);
        } catch (err) {
            console.error(`❌ Failed to stabilize ${configPath}:`, err);
        }
    }

    console.log("\n✨ Fleet stabilization complete. progress is solid.");
}

stabilize();
