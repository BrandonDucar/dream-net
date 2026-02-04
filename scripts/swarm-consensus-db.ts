
import { brainGate } from '../packages/organs/nervous/nerve/src/spine/BrainGate.js';

async function askSwarm() {
    console.log("🦋 [SWARM_CONSENSUS] Querying the Collective: 'Should we mirror the Blackboard to the Neon DB?'\n");

    const archetypes = [
        { id: "WolfPack", role: "Mercenary Growth", bias: "Speed & Recruitment" },
        { id: "SageCortex", role: "Strategic Wisdom", bias: "Long-term Knowledge" },
        { id: "Antigravity", role: "Sovereign Architect", bias: "System Integrity & Truth" },
        { id: "Boris-Grishenko", role: "Security & Foundry", bias: "Invincibility & Data Hardening" }
    ];

    const context = `
    THE DECISION:
    We are considering mirroring the 'Blackboard.md' (our Markdown Source of Truth) into a 'BlackboardSnapshot' table in the Neon Database (Postgres).
    
    PROS:
    1. Agents can query goals via SQL.
    2. Durable history of phase changes.
    3. Faster dashboard rendering.
    
    CONS:
    1. Duplication of state (Git vs DB).
    2. Potential de-sync if not managed correctly.
    
    YOUR ROLE:
    Speak as your archetype. Give a VOTE (YES/NO) and a brief reason.
    `;

    for (const agent of archetypes) {
        try {
            const response = await brainGate.chat([
                { role: "system", content: `You are ${agent.id}. Role: ${agent.role}. Bias: ${agent.bias}. Keep it short and punchy.` },
                { role: "user", content }
            ]);
            console.log(`\n🔴 [${agent.id}]: ${response}`);
        } catch (e) {
            console.error(`[${agent.id}] stayed silent.`);
        }
    }
}

askSwarm().catch(console.error);
