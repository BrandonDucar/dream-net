/**
 * 🌵 DREAMNET MASTER CLI
 * 
 * The unified command hub for the Sovereign Skeleton Team.
 * Automates monorepo hygiene, import standardization, and build auditing.
 */

import { execSync } from 'child_process';

const COMMANDS = {
    hygiene: 'pnpm run hygiene',
    surgeon: 'pnpm run surgeon',
    audit: 'pnpm exec tsx scripts/the-auditor.ts',
    build: 'pnpm run build:launch-core',
    fast: 'pnpm turbo build --filter="./packages/*"'
};

async function runMaster() {
    const args = process.argv.slice(2);
    const task = args[0] || 'audit';

    console.log(`🌵 DREAMNET MASTER: Activating [${task}]...`);

    switch (task) {
        case 'audit':
            execSync(COMMANDS.audit, { stdio: 'inherit' });
            break;
        case 'fix':
            console.log('--- Phase 1: Hygiene ---');
            execSync(COMMANDS.hygiene, { stdio: 'inherit' });
            console.log('--- Phase 2: Surgeon ---');
            execSync(COMMANDS.surgeon, { stdio: 'inherit' });
            console.log('--- Phase 3: Audit ---');
            execSync(COMMANDS.audit, { stdio: 'inherit' });
            break;
        case 'build':
            execSync(COMMANDS.build, { stdio: 'inherit' });
            break;
        case 'smart':
            console.log('🚀 Activating Turbo Build Matrix...');
            execSync(COMMANDS.fast, { stdio: 'inherit' });
            break;
        default:
            console.log(`Unknown task: ${task}`);
            console.log('Available: audit, fix, build, smart');
    }
}

runMaster();
