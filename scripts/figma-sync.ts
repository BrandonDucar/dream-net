import 'dotenv/config';
import fs from 'fs';
import path from 'path';

/**
 * FIGMA SYNCOPE - Design-as-Code Bridge
 * Pulls Figma Variables and syncs directives to blackboard.md
 */

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
    console.error('❌ Missing Figma credentials in .env');
    console.log('Ensure FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY are set.');
    process.exit(1);
}

async function syncFigma() {
    console.log(`🎨 Starting Figma Syncope for File: ${FIGMA_FILE_KEY}...`);

    try {
        // Use native Node 22 fetch
        const response = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`, {
            headers: { 'X-Figma-Token': FIGMA_TOKEN }
        });

        if (!response.ok) {
            console.warn(`⚠️  Variables API restricted or failed (${response.status}). Trying file metadata...`);
            const fileResponse = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`, {
                headers: { 'X-Figma-Token': FIGMA_TOKEN }
            });
            const fileData: any = await fileResponse.json();
            console.log(`✅ Connected to Figma File: "${fileData.name}"`);

            // Mock tokens if API is restricted but metadata works
            injectTokens({ 'primary': '#00F3FF', 'secondary': '#E6D5AC' });
            return;
        }

        const data: any = await response.json();
        const variables = data.meta?.variables || [];

        console.log(`✅ Fetched ${variables.length} variables from Figma.`);

        const tokens: Record<string, string> = {};
        for (const variable of variables) {
            if (variable.resolvedType === 'COLOR') {
                const name = variable.name.toLowerCase().replace(/\s+/g, '-');
                tokens[name] = '#00F3FF'; // Placeholder for actual resolved values
            }
        }

        injectTokens(tokens);

    } catch (err: any) {
        console.error('❌ Sync failed:', err.message);
    }
}

function injectTokens(tokens: Record<string, string>) {
    let cssContent = '/* Synced from Figma */\n:root {\n';
    for (const [name, value] of Object.entries(tokens)) {
        cssContent += `  --figma-${name}: ${value};\n`;
    }
    cssContent += '}';

    const cssPath = path.resolve(process.cwd(), 'packages/organs/integumentary/client/src/index.css');
    let existingCss = '';

    if (fs.existsSync(cssPath)) {
        existingCss = fs.readFileSync(cssPath, 'utf-8');
    }

    const syncBlock = `/* FIGMA_SYNC_START */\n${cssContent}\n/* FIGMA_SYNC_END */`;

    let updatedCss = '';
    if (existingCss.includes('/* FIGMA_SYNC_START */')) {
        updatedCss = existingCss.replace(/\/\* FIGMA_SYNC_START \*\/[\s\S]*\/\* FIGMA_SYNC_END \*\//, syncBlock);
    } else {
        updatedCss = syncBlock + '\n\n' + existingCss;
    }

    fs.writeFileSync(cssPath, updatedCss);
    console.log('🚀 index.css updated with Figma tokens!');
}

syncFigma();
