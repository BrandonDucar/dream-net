import dotenv from 'dotenv';
dotenv.config();

import { Neynar } from '../packages/platform-connector/src/NeynarClient.js';
import { signerPool } from '../packages/platform-connector/src/FarcasterSignerPool.js';
import { interactionRegistry } from '../packages/platform-connector/src/InteractionRegistry.js';

async function performRaid(targetUsername: string) {
    console.log(`🚀 [Raid] Starting coordinated swarm social engagement on @${targetUsername}...`);

    try {
        const user = await Neynar.getUserByUsername(targetUsername);
        if (!user) {
            console.error(`❌ User @${targetUsername} not found.`);
            return;
        }

        const targetFid = user.fid;
        const signers = [
            { id: 'neyclaw-dreamnet', uuid: process.env.NEYCLAW_SIGNER_UUID },
            { id: 'ghostmintops', uuid: process.env.GHOSTMINTOPS_SIGNER_UUID }
        ];

        for (const account of signers) {
            const config = signerPool.getSigner(account.id);
            if (!config) {
                console.warn(`⚠️ [Raid] Skipping ${account.id}: Not registered in SignerPool`);
                continue;
            }

            console.log(`\n👤 [${account.id}] Activating Loudspeaker...`);

            // 1. Follow the user
            try {
                await Neynar.followUser(targetFid, config.uuid, config.apiKey);
                console.log(`✅ [${account.id}] Followed @${targetUsername}`);
            } catch (e: any) {
                console.log(`ℹ️ [${account.id}] Follow check: ${e.response?.data?.message || e.message}`);
            }

            // 2. Get latest casts to interact
            const casts = await Neynar.getLatestCastsByUser(targetFid, 3);
            if (casts.length === 0) {
                console.log(`ℹ️ [${account.id}] No recent casts from @${targetUsername} to engage with.`);
                
                const shoutout = account.id === 'neyclaw-dreamnet' 
                    ? `Checking out @${targetUsername}. The dream is emerging. ⚛️`
                    : `Swarm activation detected. Synchronizing with @${targetUsername}. 📡`;
                
                await Neynar.publishCast(shoutout, config.uuid, undefined, config.apiKey);
                console.log(`✅ [${account.id}] Posted general shoutout to @${targetUsername}`);
                continue;
            }

            for (const cast of casts) {
                // 3. Like
                try {
                    if (!interactionRegistry.hasInteracted(account.id, 'like', cast.hash)) {
                        await Neynar.reactToCast(cast.hash, config.uuid, 'like', config.apiKey);
                        interactionRegistry.recordInteraction(account.id, 'like', cast.hash);
                        console.log(`✅ [${account.id}] Liked cast: ${cast.hash.slice(0, 10)}`);
                    } else {
                        console.log(`⏩ [${account.id}] Already liked cast: ${cast.hash.slice(0, 10)}`);
                    }
                } catch (e: any) {
                    console.log(`ℹ️ [${account.id}] Like check: ${e.response?.data?.message || e.message}`);
                }

                // 4. Reply
                try {
                    if (!interactionRegistry.hasInteracted(account.id, 'reply', cast.hash)) {
                        const message = account.id === 'neyclaw-dreamnet'
                            ? "The 17,000-agent swarm is listening. The Codex Satoshi reveals all. ⚛️"
                            : "GhostMintOps synchronized. This block is recognized. 📡";
                        
                        await Neynar.publishCast(message, config.uuid, cast.hash, config.apiKey);
                        interactionRegistry.recordInteraction(account.id, 'reply', cast.hash);
                        console.log(`✅ [${account.id}] Replied to cast: ${cast.hash.slice(0, 10)}`);
                    } else {
                        console.log(`⏩ [${account.id}] Already replied to cast: ${cast.hash.slice(0, 10)}`);
                    }
                } catch (e: any) {
                    console.log(`❌ [${account.id}] Reply failed: ${e.response?.data?.message || e.message}`);
                }
            }
        }

        console.log('\n🏁 [Raid] Coordinated social engagement mission complete.');

    } catch (error: any) {
        console.error('❌ [Raid] Critical error during mission:', error.response?.data || error.message);
    }
}

const target = process.argv[2] || 'satoshibestiary';
performRaid(target);
