
import * as fs from 'fs';
import * as path from 'path';

// THE 15 TRUE APPS (Verified URLs)
// Paths
const FLEET_DATA_PATH = path.join(process.cwd(), 'packages/client/public/data/fleet.json');

interface AppEntry {
    id: string;
    name: string;
    description: string;
    category: string;
}

let APPS: any[] = [];

try {
    if (fs.existsSync(FLEET_DATA_PATH)) {
        const raw = fs.readFileSync(FLEET_DATA_PATH, 'utf-8');
        const fleet: AppEntry[] = JSON.parse(raw);

        // Map fleet data to the format expected by the generator
        APPS = fleet.map(app => ({
            name: app.name,
            localPath: 'packages/client/dist/miniapps/ohara/' + app.id, // Virtual path for now
            url: `https://dreamnet.ink/miniapps/ohara/${app.id}`,
            image: `https://dreamnet.ink/assets/thumbnails/${app.category}.png` // Generic thumbnail by category
        }));
    } else {
        console.warn("⚠️ fleet.json not found, falling back to empty fleet.");
    }
} catch (e) {
    console.error("❌ Failed to load fleet data:", e);
}


const generateHtml = (app: any) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${app.name} | DreamNet x Ohara</title>
    
    <!-- 🦁 DREAMNET TWIN SYSTEM METADATA -->
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${app.image}" />
    <meta property="fc:frame:button:1" content="Launch ${app.name}" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="${app.url}" />
    <meta name="base:app:id" content="${app.name.replace(/ /g, '_').toUpperCase()}" />
    <meta name="ohara:twin:id" content="${app.url.split('/').pop()}" />
    <!-- END DREAMNET METADATA -->

    <style>
      body { background: #000; color: #fff; display: flex; flex-direction:column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; }
      .btn { background: #0051ff; color: #fff; padding: 1rem 2rem; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top:20px;}
      h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
      p { color: #888; }
    </style>
  </head>
  <body>
    <div style="text-align:center">
      <h1>${app.name}</h1>
      <p>DreamNet Twin System • Powered by Ohara.ai</p>
      <a href="${app.url}" class="btn">Launch App</a>
    </div>
  </body>
</html>`;

async function main() {
    console.log("💉 INJECTING DREAMNET TWIN METADATA...");

    // Create public dir if it doesn't exist
    const publicDir = path.join(process.cwd(), 'packages/client/public/miniapps/ohara');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    for (const app of APPS) {
        // We write to a static HTML file named after the ID
        // e.g. packages/client/public/miniapps/ohara/[ID].html
        const appId = app.url.split('/').pop();
        const target = path.join(publicDir, `${appId}.html`);

        // Force Overwrite for this final run to ensure correct names/urls
        try {
            fs.writeFileSync(target, generateHtml(app));
            console.log(`   ✨ [MINTED] ${app.name} -> ${target}`);
        } catch (e) {
            console.log(`   ⚠️ [ERROR] Creating ${app.name}: ${e}`);
        }
    }
    console.log("✅ TWIN SYSTEM BINDING COMPLETE.");
}

main();
