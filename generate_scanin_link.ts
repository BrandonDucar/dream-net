
import dotenv from 'dotenv';
import path from 'path';
import { googleAuthService } from './packages/server/src/services/GoogleAuthService.js';

// Manually load env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function main() {
    try {
        const url = googleAuthService.getAuthUrl();
        console.log('\n🔱 GMAIL MASTERY: SCAN-IN LINK GENERATED');
        console.log('------------------------------------------');
        console.log(url);
        console.log('------------------------------------------');
        console.log('\nACTION: Visit the link above to authorize the "Draft & Ping" scopes.');
    } catch (e) {
        console.error('Failed to generate Auth URL:', e);
    }
}

main();
