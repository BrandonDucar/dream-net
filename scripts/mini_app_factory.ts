import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * MINI-APP FACTORY (GRANDMASTER VERSION)
 * 
 * Automates the creation of "Quests" (spokes) for the DreamNet sprawl.
 * Inherits the "Utmost Authority" DNA from the Gold Back Valuator.
 * Includes automated Handshake Manifests for Farcaster/Base.dev.
 */
interface AppConfig {
    name: string;
    description: string;
    category: string;
    buttonText: string;
}

const APPS_DIR = path.resolve('apps');
const TEMPLATE_DIR = path.resolve('apps/dreamnet-quest'); // Our Grandmaster Template

export function createQuest(config: AppConfig) {
    const targetDir = path.join(APPS_DIR, config.name);
    console.log(`🚀 Manufacturing Quest: ${config.name}...`);

    if (!fs.existsSync(targetDir)) {
        // 1. Xerox the Template
        console.log(`🧬 Injecting Grandmaster DNA...`);
        fs.cpSync(TEMPLATE_DIR, targetDir, { recursive: true });
    } else {
        console.warn(`⚠️ Quest ${config.name} already exists. Updating metadata...`);
        // Force clean sync critical directories
        console.log(`🧹 Purging and syncing src/public layers...`);
        fs.rmSync(path.join(targetDir, 'src'), { recursive: true, force: true });
        fs.rmSync(path.join(targetDir, 'public'), { recursive: true, force: true });
        fs.cpSync(path.join(TEMPLATE_DIR, 'src'), path.join(targetDir, 'src'), { recursive: true });
        fs.cpSync(path.join(TEMPLATE_DIR, 'public'), path.join(targetDir, 'public'), { recursive: true });
    }

    // 2. Localize the Metadata (Constants & Package)
    console.log(`📝 Writing Sovereign Identity...`);

    // Update package.json name
    const pkgPath = path.join(targetDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
        let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        pkg.name = config.name;
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }

    const constantsPath = path.join(targetDir, 'src/lib/constants.ts');
    if (fs.existsSync(constantsPath)) {
        let constants = fs.readFileSync(constantsPath, 'utf8');

        constants = constants.replace(/export const APP_NAME: string = '.*?';/g, `export const APP_NAME: string = '${config.name}';`);
        constants = constants.replace(/export const APP_DESCRIPTION: string = '.*?';/g, `export const APP_DESCRIPTION: string = '${config.description}';`);
        constants = constants.replace(/export const APP_PRIMARY_CATEGORY: string = '.*?';/g, `export const APP_PRIMARY_CATEGORY: string = '${config.category}';`);
        constants = constants.replace(/export const APP_BUTTON_TEXT: string = '.*?';/g, `export const APP_BUTTON_TEXT: string = '${config.buttonText}';`);

        fs.writeFileSync(constantsPath, constants);
    }

    // 3. Generate the Handshake Manifest (.well-known/farcaster.json)
    console.log(`📜 Generating Farcaster Handshake...`);
    const wellKnownDir = path.join(targetDir, 'public/.well-known');
    if (!fs.existsSync(wellKnownDir)) {
        fs.mkdirSync(wellKnownDir, { recursive: true });
    }

    const manifest = {
        accountAssociation: "SIGNED_KEY_HANDSHAKE_HERE", // Auto-placeholder for SIWN
        miniapp: {
            version: '1',
            name: config.name,
            homeUrl: `https://${config.name}.vercel.app`,
            iconUrl: `https://${config.name}.vercel.app/icon.png`,
            imageUrl: `https://${config.name}.vercel.app/api/opengraph-image`,
            buttonTitle: config.buttonText,
            splashImageUrl: `https://${config.name}.vercel.app/splash.png`,
            splashBackgroundColor: '#000000',
            webhookUrl: `https://api.neynar.com/f/app/CLIENT_ID/event`
        }
    };
    fs.writeFileSync(path.join(wellKnownDir, 'farcaster.json'), JSON.stringify(manifest, null, 2));

    // 4. Prepare for Vercel Sprawl (vercel.json)
    console.log(`☁️ Preparing Vercel Node...`);
    const vercelConfig = {
        version: 2,
        name: config.name,
        framework: "nextjs",
        buildCommand: "pnpm run build",
        outputDirectory: ".next"
    };
    fs.writeFileSync(path.join(targetDir, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));

    console.log(`✅ Quest ${config.name} is ready for activation.`);
    console.log(`👉 Next step: cd apps/${config.name} && vercel deploy`);
}

// Launching the Social Intelligence Node
createQuest({
    name: "oharas-eye",
    description: "The Utmost Authority in Social Scanning",
    category: "social",
    buttonText: "ACTIVATE EYE"
});
