
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FLEET_DATA_PATH = path.join(__dirname, '../packages/client/public/data/fleet.json');

// 🔮 THE CONJURING DICTIONARY
const POWER_WORDS = {
    utility: [
        "Sovereign", "Immutable", "Decentralized", "Permissionless",
        "Autonomous", "AI-Driven", "Quantum-Ready", "Zero-Knowledge"
    ],
    gaming: [
        "Play-to-Earn", "High-Stakes", "Provably Fair", "On-Chain Assets",
        "Metaverse-Native", "XP-Enabled", "Guild-Compatible"
    ],
    finance: [
        "Yield-Bearing", "Liquid", "Solvent", "Algorithmic",
        "Deflationary", "Governance-Gated", "Treasury-Backed"
    ],
    social: [
        "Censorship-Resistant", "Encrypted", "Graph-Aware", "Identity-Sovereign",
        "Web3-Native", "Community-Owned"
    ],
    other: ["Next-Gen", "DreamNet-Powered", "Hyper-Scalable"]
};

const TEMPLATES = [
    "The world's first {POWER} solution for {NAME}.",
    "Unleash {POWER} capabilities with {NAME}, exclusively on DreamNet.",
    "{NAME}: The {POWER} standard for modern agents.",
    "Experience {POWER} like never before. This is {NAME}.",
    "Built for the sovereign web: {NAME} delivers {POWER} performance."
];

async function optimizeSeo() {
    console.log("🧠 DREAMNET SEO OPTIMIZER");
    console.log("   Loading fleet data...");

    if (!fs.existsSync(FLEET_DATA_PATH)) {
        console.error("❌ Fleet data not found!");
        process.exit(1);
    }

    const rawData = fs.readFileSync(FLEET_DATA_PATH, 'utf-8');
    const apps = JSON.parse(rawData);
    let optimizedCount = 0;

    const optimizedApps = apps.map((app: any) => {
        // Skip if already optimized (simple check)
        if (app.description.includes("DreamNet")) return app;

        const category = (app.category || 'other') as keyof typeof POWER_WORDS;
        const words = POWER_WORDS[category] || POWER_WORDS.other;

        // Pick a random power word
        const powerWord = words[Math.floor(Math.random() * words.length)];

        // Pick a random template
        const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];

        // Construct new description
        let newDesc = template
            .replace("{NAME}", app.name)
            .replace("{POWER}", powerWord);

        // Append original context if short
        if (app.description.length > 5 && app.description.length < 50) {
            newDesc += ` (${app.description})`;
        }

        console.log(`   ✨ Optimized [${app.name}]: "${newDesc}"`);
        optimizedCount++;

        return {
            ...app,
            description: newDesc,
            keywords: [powerWord, category, "DreamNet", "Base.org", "Web3"].join(", ")
        };
    });

    if (optimizedCount > 0) {
        fs.writeFileSync(FLEET_DATA_PATH, JSON.stringify(optimizedApps, null, 2));
        console.log(`✅ SEO Injection Complete. ${optimizedCount} nodes upgraded.`);
        console.log("   run 'npx tsx scripts/fleet_manifestor.ts' to apply changes.");
    } else {
        console.log("   All nodes already optimized.");
    }
}

optimizeSeo();
