import dotenv from 'dotenv';
dotenv.config();

import { Neynar } from '../packages/platform-connector/src/NeynarClient.js';

async function performRaid(targetUsername: string) {
    const signerUuid = process.env.GHOSTMINTOPS_SIGNER_UUID; // 893ffd48...
    
    if (!signerUuid) {
        console.error('❌ GHOSTMINTOPS_SIGNER_UUID not found in .env');
        return;
    }

    console.log(`🚀 [Raid] Socializing with @${targetUsername} as @ghostmintops...`);

    try {
        const user = await Neynar.getUserByUsername(targetUsername);
        if (!user) {
            console.error(`❌ User @${targetUsername} not found.`);
            return;
        }

        // 1. Follow
        try {
            await Neynar.followUser(user.fid, signerUuid);
            console.log(`✅ Followed @${targetUsername}`);
        } catch (e: any) {
            console.log(`ℹ️ Follow: ${e.response?.data?.message || e.message}`);
        }

        // 2. Post a direct shoutout
        const message = `Hello @${targetUsername}! The 17,000-agent DreamNet swarm is officially online and watching the blocks. ⚛️📡 #AgentSwarm #QuantumGuild`;
        await Neynar.publishCast(message, signerUuid);
        console.log(`✅ Posted shoutout to @${targetUsername}`);

        // 3. React to latest casts
        const casts = await Neynar.getLatestCastsByUser(user.fid, 2);
        for (const cast of casts) {
            try {
                await Neynar.reactToCast(cast.hash, signerUuid, 'like');
                console.log(`✅ Liked cast ${cast.hash.slice(0, 10)}`);
            } catch (e: any) {}
        }

        console.log('🏁 Mission Complete.');
    } catch (error: any) {
        console.error('❌ Mission Failed:', error.response?.data || error.message);
    }
}

const target = process.argv[2] || 'ghostmint';
performRaid(target);
