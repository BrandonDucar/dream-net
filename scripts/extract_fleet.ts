
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHARDS_DIR = path.join(__dirname, '../packages/client/src/miniapps/shards');
const OUTPUT_JSON = path.join(__dirname, '../packages/client/public/data/fleet.json');
const OUTPUT_MD = path.join(__dirname, '../OHARA_APP_LIST_SYNCED.md');

// Ensure output dir exists
const dataDir = path.dirname(OUTPUT_JSON);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

function extractApps() {
    if (!fs.existsSync(SHARDS_DIR)) {
        console.error(`❌ Shards directory not found: ${SHARDS_DIR}`);
        return;
    }

    const files = fs.readdirSync(SHARDS_DIR).filter(f => f.endsWith('.ts'));
    console.log(`📡 Found ${files.length} shards. Extracting neural patterns...`);

    let allApps: any[] = [];

    for (const file of files) {
        const content = fs.readFileSync(path.join(SHARDS_DIR, file), 'utf-8');
        // Regex to extract objects. Looking for id: '...' and name: "..."
        // We match individual fields to be robust against formatting changes

        // Split by object start/end roughly
        const objectMatches = content.match(/{[\s\S]*?}/g);

        if (objectMatches) {
            for (const objStr of objectMatches) {
                const idMatch = objStr.match(/id:\s*['"]([^'"]+)['"]/);
                const nameMatch = objStr.match(/name:\s*["']([^"']+)["']/);
                const descMatch = objStr.match(/description:\s*["']([^"']+)["']/);
                const catMatch = objStr.match(/category:\s*['"]([^'"]+)['"]/);

                if (idMatch && nameMatch) {
                    allApps.push({
                        id: idMatch[1],
                        name: nameMatch[1],
                        description: descMatch ? descMatch[1] : '',
                        category: catMatch ? catMatch[1] : 'utility'
                    });
                }
            }
        }
    }

    console.log(`✅ Extracted ${allApps.length} apps from the code.`);

    // Write JSON
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(allApps, null, 2));
    console.log(`💾 Saved Fleet Data: ${OUTPUT_JSON}`);

    // Write Markdown Sync
    let mdContent = `# 📱 Ohara Mini-App Fleet (Synced: ${new Date().toISOString()})\n\n`;
    mdContent += `Total Active Ships: ${allApps.length}\n\n`;

    allApps.forEach((app, index) => {
        mdContent += `${index + 1}. **${app.name}** (ID: ${app.id})\n`;
        mdContent += `    * *Function*: ${app.description}\n`;
        mdContent += `    * *Category*: ${app.category}\n`;
    });

    fs.writeFileSync(OUTPUT_MD, mdContent);
    console.log(`📄 Generated Status Report: ${OUTPUT_MD}`);
}

extractApps();
