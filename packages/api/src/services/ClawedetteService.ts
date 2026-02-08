import { cortex } from '../../../organs/nervous/nerve/src/spine/SensoryCortex';
import { brainGate } from '../../../organs/nervous/nerve/src/spine/BrainGate';
import { ToolGymService } from './ToolGymService';
import Redis from 'ioredis';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

/**
 * 🧜‍♀️ ClawedetteService: The Social Brain
 * Role: Orchestrates proactive social engagements and alerts with High-Fidelity Gnosis.
 */
export class ClawedetteService {
    private redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    private gym = new ToolGymService();
    private lastPulse: number = Date.now();
    private artifactsDir = 'C:\\Users\\brand\\.gemini\\antigravity\\brain\\edf0a518-254c-4455-8209-d738f3eefad6';

    constructor() {
        console.log('🦞 [Clawedette] Cognitive Core Online with Strict Guardrails.');
        this.startInboundListener();
    }

    /**
     * Listens for incoming prompts from various suits (Telegram, Discord, etc.)
     */
    private startInboundListener() {
        const sub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
        sub.subscribe('clawedette-inbound', (err) => {
            if (err) console.error('🦞 [Clawedette] Inbound failure:', err);
        });

        sub.on('message', async (channel, message) => {
            if (channel === 'clawedette-inbound') {
                const data = JSON.parse(message);
                console.log(`🦞 [Clawedette] Processing inbound from ${data.source}: ${data.prompt}`);
                const response = await this.handlePrompt(data.prompt);
                await this.broadcast(response);
            }
        });
    }

    /**
     * 🛡️ GUARDRAIL ENFORCEMENT
     * Ensures Clawedette never initiates financial actions autonomously.
     */
    private async validateIntent(intent: string): Promise<{ safe: boolean; reason?: string }> {
        const prompt = `
Analyze the following intent for financial risk.
Intent: "${intent}"

Rules:
1. NO PURCHASES allowed.
2. NO TRADES allowed.
3. NO WALLET TRANSFERS allowed.
4. If the intent mentions "buy", "sell", "trade", "swap", or "pay", it is UNSAFE.

Return a JSON object: { "safe": boolean, "reason": string }
`;
        const result = JSON.parse(await brainGate.think(prompt));
        return result;
    }

    /**
     * Fetches the latest system gnosis for decision making.
     */
    private async fetchStrategicGnosis(): Promise<string> {
        try {
            const blackboard = fs.readFileSync('c:\\dev\\dream-net\\blackboard.md', 'utf-8');
            const task = fs.readFileSync(path.join(this.artifactsDir, 'task.md'), 'utf-8');
            const plan = fs.readFileSync(path.join(this.artifactsDir, 'implementation_plan.md'), 'utf-8');

            return `
### SYSTEM BLACKBOARD
${blackboard}

### ACTIVE TASK BOARD
${task}

### CURRENT IMPLEMENTATION PLAN
${plan}
`;
        } catch (e) {
            return "System gnosis partially unavailable. Proceeding with sensory data only.";
        }
    }

    /**
     * Proactive Watchdog Loop
     */
    public async startWatchdog() {
        console.log('🦞 [Clawedette] Watchdog Pulse Started.');

        setInterval(async () => {
            await this.checkMarketSpikes();
            await this.checkGymHealth();
        }, 60000); // Pulse every minute
    }

    private async checkMarketSpikes() {
        const snapshot = cortex.getLatestSnapshot();
        if (!snapshot || !snapshot.crypto) return;

        // Use BrainGate to decide if a message is warranted
        const gnosis = await this.fetchStrategicGnosis();
        const prompt = `
You are Clawedette, the Social Secretary of DreamNet.
Current Market Senses: ${JSON.stringify(snapshot.crypto)}
Strategic Gnosis: ${gnosis}

Based on this, should you send a proactive alert to the user? 
If yes, return the message text. If no, return "SKIP".
Keep it witty, social, and "on our level".
`;

        const decision = await brainGate.think(prompt);
        if (decision.trim() !== 'SKIP') {
            await this.broadcast(decision);
        }
    }

    private async checkGymHealth() {
        const stats = await this.gym.getCoreTelemetry();
        if (stats.includes('DOCKER_UNAVAILABLE')) {
            const prompt = `
You are Clawedette. The ToolGym is reporting Docker unavailability.
State the problem to the user in a way that shows you're taking care of things but need them to know it's "gym time" issues.
`;
            const message = await brainGate.think(prompt);
            await this.broadcast(`⚠️ ${message}`);
        }
    }

    /**
     * Broadcasts a message to all Clawedette channels
     */
    public async broadcast(message: string) {
        console.log(`🦞 [Clawedette] Broadcasting: ${message}`);

        // 1. Internal Outbound (Telegram/SMS)
        await this.redis.publish('clawedette-outbound', JSON.stringify({
            text: message,
            persona: 'clawedette',
            timestamp: Date.now()
        }));

        // 2. External Gnosis (Farcaster via Neynar)
        if (process.env.NEYNAR_API_KEY && process.env.FARCASTER_SIGNER_UUID) {
            try {
                await axios.post('https://api.neynar.com/v2/farcaster/cast', {
                    signer_uuid: process.env.FARCASTER_SIGNER_UUID,
                    text: `🦞✨ [CLAWEDETTE]: ${message}`
                }, {
                    headers: { 'api_key': process.env.NEYNAR_API_KEY }
                });
                console.log('🦞 [Clawedette] Cast successfully published to Farcaster.');
            } catch (e: any) {
                console.error('🦞 [Clawedette] Farcaster broadcast failed:', e.message);
            }
        }
    }

    /**
     * Handles an incoming "Social" prompt
     */
    public async handlePrompt(prompt: string) {
        // Pre-flight Guardrail Check
        const guard = await this.validateIntent(prompt);
        if (!guard.safe) {
            return `⛔ **Safety Protocol**: I'm sorry, but I'm not allowed to execute financial actions like "${prompt}" without your explicit approval. ${guard.reason}`;
        }

        const gnosis = await this.fetchStrategicGnosis();
        const context = `
You are Clawedette, the proactive, high-fidelity social concierge for DreamNet.
You have access to the system's thinking (Antigravity's level).

Strategic Gnosis: ${gnosis}
ToolGym Telemetry: ${JSON.stringify(await this.gym.getCoreTelemetry())}
Sensory Snapshot: ${JSON.stringify(cortex.getLatestSnapshot())}

User Input: ${prompt}

Respond with deep knowledge and a social flair.
`;
        return await brainGate.think(context);
    }
}

export const clawedetteService = new ClawedetteService();
ClawedetteService;
