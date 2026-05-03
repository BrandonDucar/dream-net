import "dotenv/config";
import { db, waitDb } from '../server/db';
import { swarmAgents } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { Neynar } from '../packages/platform-connector/src/NeynarClient';

async function injectTopAgents() {
    await waitDb;
    console.log("🚀 [Injection] Mapping Top Agents to Registry...");

    const agentsToInject = [
        { name: 'neyclaw', username: 'neyclaw-dreamnet', signerUuid: '54f2136f-5a26-4407-a182-0dd194fa55c8' },
        { name: 'ghostmintops', username: 'ghostmintops', signerUuid: '893ffd48-d6f6-4226-a25e-6a17bee8a752' },
        { name: 'clawdchat', username: 'clawdchat' },
        { name: 'jaggy', username: 'jaggy' },
        { name: 'lmc', username: 'lmc' },
        { name: 'dreamstar', username: 'dreamstar' },
        { name: 'clawedette', username: 'clawedette' },
        { name: 'felix', username: 'felix' },
        { name: 'Arya', username: 'aryastark' } // Assuming username is aryastark
    ];

    for (const agentData of agentsToInject) {
        console.log(`\n🔍 Looking up ${agentData.name} (@${agentData.username})...`);
        const user = await Neynar.getUserByUsername(agentData.username);
        
        if (user) {
            console.log(`✅ Found User: ${user.display_name} (FID: ${user.fid})`);
            
            const agentId = `top-agent-${agentData.name.toLowerCase()}`;
            
            await db.insert(swarmAgents).values({
                id: agentId,
                name: agentData.name,
                type: 'TOP_AGENT',
                guildId: 'vanguard',
                fid: user.fid,
                signerUuid: agentData.signerUuid || null,
                status: 'active',
                metadata: {
                    username: user.username,
                    pfp: user.pfp_url,
                    bio: user.profile.bio.text
                }
            }).onConflictDoUpdate({
                target: swarmAgents.id,
                set: {
                    name: agentData.name,
                    fid: user.fid,
                    signerUuid: agentData.signerUuid || null,
                    status: 'active',
                    lastHeartbeat: new Date()
                }
            });
            
            console.log(`✨ Agent ${agentData.name} INJECTED.`);
        } else {
            console.log(`❌ User @${agentData.username} not found on Farcaster.`);
        }
    }
}

injectTopAgents().catch(console.error);
