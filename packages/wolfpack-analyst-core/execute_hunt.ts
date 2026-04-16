
import { GrantHunter } from './logic/grantHunter.js';
import { RepoHunter, RepoScanTarget } from './logic/repoHunter.js';
import { AnalystStore } from './store/analystStore.js';

async function main() {
    console.log('🐺 WOLF PACK: INITIALIZING GLOBAL HUNT...');

    // 1. Scout for Grant Opportunities
    console.log('\n📡 Phase 1: Grant Scouting...');
    const ecosystems = ['Arbitrum', 'Solana', 'Cronos', 'Chiliz'];
    await GrantHunter.scoutOpportunities(ecosystems);

    // 2. Scan Repositories for "Weak Signals"
    console.log('\n🔍 Phase 2: Repository Hunting...');
    const targets: RepoScanTarget[] = [
        { owner: 'chiliz', repo: 'chiliz-chain-governance', focus: 'gas-optimization' },
        { owner: 'offchainlabs', repo: 'nitro', focus: 'gas-optimization' },
        { owner: 'solana-labs', repo: 'solana-program-library', focus: 'logic-error' }
    ];

    for (const target of targets) {
        await RepoHunter.scanTarget(target);
    }

    // 3. Summarize Intelligence
    console.log('\n📊 Phase 3: Intelligence Summary...');
    const insights = AnalystStore.getInsights();
    console.log(`Total Insights Generated: ${insights.length}`);

    insights.forEach((insight, index) => {
        console.log(`\n[${index + 1}] ${insight.title || insight.summary}`);
        console.log(`    Type: ${insight.type}`);
        console.log(`    Confidence: ${(insight.confidence * 100).toFixed(1)}%`);
        if (insight.actionable) {
            console.log(`    Target Action: ${insight.suggestedAction}`);
        }
    });

    console.log('\n🐺 HUNT COMPLETE. SIGNS PERSISTED TO ANALYST_STORE.');
}

main().catch(console.error);
