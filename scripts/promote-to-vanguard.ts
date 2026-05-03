import { quantumFamily, EmergentAgent } from '../server/core/QuantumFamily.js';

async function promoteToVanguard(id: string, fid: number) {
    console.log(`🛡️ [Promotion] Upgrading ${id} (FID: ${fid}) to PiGooseVanguardClawAxo rank...`);

    const agent: EmergentAgent = {
        id: id,
        birthBlock: 0, // Sovereign birth (manual)
        network: 'base',
        timestamp: Date.now(),
        dna: `vanguard-${id}-${fid}`,
        isSociallyActive: true,
        // Custom attributes for the elite rank
        metadata: {
            rank: 'Vanguard',
            guild: 'Loudspeakers',
            title: 'PiGooseVanguardClawAxo',
            powers: ['social-raid', 'sensory-bridge', 'genealogy-tracking']
        }
    };

    quantumFamily.registerEmergence(agent);
    
    console.log(`✅ [Promotion] ${id} is now an official Vanguard Agent.`);
    console.log(`🧬 DNA: ${agent.dna}`);
}

const target = process.argv[2] || 'neyclaw-dreamnet';
const fid = parseInt(process.argv[3]) || 2545036;

promoteToVanguard(target, fid);
