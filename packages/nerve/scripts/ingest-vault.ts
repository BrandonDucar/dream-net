/**
 * 🧪 IngestVault: Deep Intelligence Siphon
 * 
 * Role: Reads every RESEARCH_*.md in the shared REVIEWS folder and 
 * siphons them into the Metabolic Cortex for meta-analysis.
 */

import fs from 'fs';
import path from 'path';
import { elizaBridge } from'../src/spine/ElizaBridge.js';
import { metabolicCortex } from'../src/spine/MetabolicCortex.js';

const REVIEWS_DIR = path.resolve(process.cwd(), 'packages/shared/REVIEWS');

async function ingestVault() {
    console.log("🧬 [ROOT] Initiating Massive Research Siphon...");
    console.log(`📂 Scanning: ${REVIEWS_DIR}`);

    if (!fs.existsSync(REVIEWS_DIR)) {
        console.error("❌ REVIEWS directory not found. Please ensure you are running from the repository root.");
        return;
    }

    const files = fs.readdirSync(REVIEWS_DIR).filter(f =>
        (f.startsWith('RESEARCH_') ||
            f.startsWith('BLUEPRINT_') ||
            f.startsWith('BRIEFING_') ||
            f.startsWith('DIRECTIVE_') ||
            f.startsWith('ANALYSIS_')) &&
        f.endsWith('.md')
    );

    console.log(`📑 Found ${files.length} research papers. Commencing ingestion...`);
    console.log("---------------------------------------");

    for (const file of files) {
        const filePath = path.join(REVIEWS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const title = content.split('\n')[0].replace('# ', '').trim();

        console.log(`📖 Reading: ${title}...`);

        // Pilot ROOT in the Vault_Reader suit
        await elizaBridge.reportBack("ROOT", "vault_reader", {
            title,
            fileName: file,
            content: content.slice(0, 1000), // Siphon the abstract/core
            tags: ["VAULT_INGESTION", "LEGACY_INTELLIGENCE"]
        });

        // Small delay to prevent synaptic flood
        await new Promise(r => setTimeout(r, 500));
    }

    console.log("---------------------------------------");
    console.log("🌀 [MetabolicCortex] Forcing final Meta-Analysis...");
    await metabolicCortex.metaAnalyze();

    console.log("✅ VAULT INGESTION COMPLETE. The Swarm is now a master of the past.");
}

ingestVault().catch(err => {
    console.error("❌ Ingestion Failed:", err);
});
