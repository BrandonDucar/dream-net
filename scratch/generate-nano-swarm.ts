import { writeFileSync } from 'fs';
import { join } from 'path';

const COUNT = 17900;
const GUILDS = ['piclaw', 'pyclaw', 'axo', 'edge', 'ghost', 'flash', 'quantum', 'aegis', 'archimedes', 'wolf', 'whale', 'orca', 'spider', 'fly'];

function generateNanoSwarm() {
    console.log(`🚀 Generating ${COUNT} nano agents...`);
    const agents = [];

    for (let i = 0; i < COUNT; i++) {
        const id = `nano-${i.toString().padStart(5, '0')}`;
        const guildId = GUILDS[Math.floor(Math.random() * GUILDS.length)];
        
        agents.push({
            id,
            template: 'nano',
            guildId,
            status: 'idle',
            metadata: {
                tier: 'nano',
                generation: 1,
                traits: {
                    vicious: Math.random().toFixed(2),
                    witty: Math.random().toFixed(2),
                    analytical: Math.random().toFixed(2)
                }
            }
        });

        if (i % 1000 === 0) {
            console.log(`📦 Generated ${i} agents...`);
        }
    }

    const data = {
        version: '1.0.0',
        total: agents.length,
        agents
    };

    const outputPath = join(process.cwd(), 'data', 'viral-nano-swarm.json');
    writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`✨ Successfully wrote ${agents.length} agents to ${outputPath}`);
}

generateNanoSwarm();
