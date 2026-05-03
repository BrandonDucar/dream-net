import dotenv from 'dotenv';
dotenv.config();

import { Neynar } from '../packages/platform-connector/src/NeynarClient.js';

async function checkSigners() {
    const keys = [
        { name: 'Primary (Ghostmint)', key: process.env.NEYNAR_API_KEY },
        { name: 'Extra (Neyclaw)', key: process.env.EXTRA_API_KEY }
    ];

    const signers = [
        { name: 'neyclaw-dreamnet', uuid: '54f2136f-5a26-4407-a182-0dd194fa55c8' },
        { name: 'ghostmintops', uuid: '893ffd48-d6f6-4226-a25e-6a17bee8a752' }
    ];

    console.log('🔍 [Diagnostic] Cross-checking Farcaster Signers & API Keys...\n');

    for (const keyInfo of keys) {
        if (!keyInfo.key) continue;
        console.log(`🔑 Testing API Key: ${keyInfo.name} (${keyInfo.key.slice(0, 8)}...)`);
        
        // Manually re-init client with this key for testing
        // Note: This is hacky because NeynarClient is a singleton, but for a script it's fine
        process.env.NEYNAR_API_KEY = keyInfo.key;
        
        for (const signer of signers) {
            try {
                // @ts-ignore - access private client for testing
                const client = Neynar.getClient();
                const status = await client.lookupSigner({ signerUuid: signer.uuid });
                
                if (status) {
                    console.log(`   ✅ [${signer.name}] Details:`, JSON.stringify(status, null, 2));
                    if (status.fid) {
                        const userRes = await client.fetchBulkUsers({ fids: status.fid.toString() });
                        if (userRes.users && userRes.users.length > 0) {
                            console.log(`      User Found: @${userRes.users[0].username} (FID: ${status.fid})`);
                        }
                    }
                }
            } catch (e: any) {
                console.log(`   ❌ [${signer.name}] Failed: ${e.response?.data?.message || e.message}`);
            }
        }
        console.log('');
    }
}

checkSigners();
