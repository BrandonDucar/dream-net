import { EventEmitter } from 'events';

export * from './verticals/medicine.js';
export * from './verticals/space.js';
export * from './verticals/security.js';
export * from './verticals/legal.js';
export * from './verticals/social.js';
export * from './connectors/agriConnector.js';

export interface Vertical {
    id: string;
    name: string;
    status: 'active' | 'scanned' | 'scaffolding' | 'stable';
    agents: string[];
    lastHeartbeat: number;
}

import { fetchCryptoPulse } from './connectors/coingecko.js';
import { fetchWeatherPulse } from './connectors/weather.js';

export class ExpansionRegistry extends EventEmitter {
    private verticals: Map<string, Vertical> = new Map();

    constructor() {
        super(); // Call the constructor of EventEmitter
        this.registerVertical({
            id: 'bio-sovereignty',
            name: 'Agentic Healthcare',
            status: 'scaffolding',
            agents: ['Bio-Sentinel', 'Helix-Prime'],
            lastHeartbeat: Date.now()
        });
        this.registerVertical({
            id: 'orbital-logic',
            name: 'Galactic Mesh',
            status: 'scanned',
            agents: ['Starlink-Agent', 'Orbital-Spine'],
            lastHeartbeat: Date.now()
        });

        // 🩸 SOVEREIGN PULSE: Start Data Ingestion (Crypto & Weather)
        console.log("🦅 EXPANSION: Starting Biological Rhythms (Crypto/Weather)...");
        this.runPulse();
        setInterval(() => this.runPulse(), 60000); // Pulse every 60s
    }

    private async runPulse() {
        await fetchCryptoPulse();
        await fetchWeatherPulse();
    }

    public registerVertical(v: Vertical) {
        this.verticals.set(v.id, v);
    }

    public simulateAgentActivity() {
        // ... legacy simulation code ... (keeping it for now)
        const vArray = this.getVerticals();
        const randomV = vArray[Math.floor(Math.random() * vArray.length)];
        const randomAgent = randomV.agents[Math.floor(Math.random() * randomV.agents.length)];
        const messages = [
            `Scanning market vectors for ${randomV.name}...`,
            `Optimizing ${randomAgent} neural paths...`,
            `Verifying sovereign alignment for ${randomV.id}...`,
            `Injecting agentic substrate into legacy nodes...`
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];

        this.emit('agent_thought', {
            vertical: randomV.id,
            agent: randomAgent,
            message
        });
    }

    public getVerticals(): Vertical[] {
        return Array.from(this.verticals.values());
    }
}
