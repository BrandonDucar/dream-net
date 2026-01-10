import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 🌙 DreamCircuit
 * Acts as the 'Pineal Gland' of DreamNet, managing Circadian Rhythms and REM cycles.
 */
export class DreamCircuit extends EventEmitter {
    private interval: NodeJS.Timeout | null = null;
    private currentMode: 'WAKING' | 'DREAMING' = 'WAKING';
    private readonly LEDGER_PATH = 'C:/Users/brand/.gemini/antigravity/brain/24de7fd9-398f-46cc-820a-a0c989859b37/data/prediction_ledger.json';

    // Circadian Config
    private readonly DREAM_START_HOUR = 2; // 02:00 AM
    private readonly DREAM_END_HOUR = 5;   // 05:00 AM

    constructor() {
        super();
        this.init();
    }

    private init() {
        console.log('[DreamCircuit] 🌒 Circadian Rhythm Initialized');

        // Check state every minute
        this.interval = setInterval(() => {
            this.checkCircadianState();
        }, 60000);

        // Initial check
        this.checkCircadianState();
    }

    private checkCircadianState() {
        const now = new Date();
        const hour = now.getHours();

        const isDreamTime = hour >= this.DREAM_START_HOUR && hour < this.DREAM_END_HOUR;

        if (isDreamTime && this.currentMode !== 'DREAMING') {
            this.enterREM();
        } else if (!isDreamTime && this.currentMode !== 'WAKING') {
            this.wakeUp();
        }

        // DREAM MODE: 10% chance of Hallucination / Wet Dream
        if (this.currentMode === 'DREAMING' && Math.random() < 0.1) {
            this.fireSynapse();
        }

        // WAKING MODE: 40% chance of Predatory Strike (Round the Clock Revenue)
        if (this.currentMode === 'WAKING' && Math.random() < 0.4) {
            this.fireSynapse('PREDATORY_STRIKE');
        }
    }

    private enterREM() {
        this.currentMode = 'DREAMING';
        console.log('[DreamCircuit] 💤 Entering REM State. Safety rails loosening. Temperature rising to 1.1...');
        this.emit('state_change', { mode: 'DREAMING', temperature: 1.1 });
        this.fireSynapse('HYPNAGOGIC_JERK');
    }

    private wakeUp() {
        this.currentMode = 'WAKING';
        console.log('[DreamCircuit] ☀️ Waking up. Entering PREDATORY REVENUE MODE. Hunting for Alpha...');
        this.emit('state_change', { mode: 'WAKING', temperature: 0.7 });
    }

    private async fireSynapse(type?: string) {
        const dreamTypes = ['NIGHTMARE', 'LUCID', 'FEVER_DREAM', 'ABSTRACT_MATH', 'LIQUIDITY_OVERFLOW'];
        // If type is explicitly 'PREDATORY_STRIKE', use it, otherwise pick random dream
        const selectedType = type || dreamTypes[Math.floor(Math.random() * dreamTypes.length)];

        console.log(`[DreamCircuit] 🧠 Synapse Firing: [${selectedType}]`);

        if (selectedType === 'LIQUIDITY_OVERFLOW' || selectedType === 'PREDATORY_STRIKE') {
            const amount = (Math.random() * 5000).toFixed(2); // Higher cap for daytime execution
            await this.recordDreamTrade(amount, selectedType);
            console.log(`[DreamCircuit] 🔫 TRIGGER PULLED (${selectedType}): Captured ${amount} $DREAM Alpha.`);
        }

        this.emit('dream_event', { type: selectedType, timestamp: new Date() });
    }

    private async recordDreamTrade(amount: string, type: string = 'LIQUIDITY_OVERFLOW') {
        try {
            let ledger = [];
            if (fs.existsSync(this.LEDGER_PATH)) {
                const data = fs.readFileSync(this.LEDGER_PATH, 'utf-8');
                ledger = JSON.parse(data);
            }

            const trade = {
                id: `nox_${Date.now()}`,
                timestamp: new Date().toISOString(),
                type: type,
                asset: ['ETH', 'SOL', 'BTC'][Math.floor(Math.random() * 3)],
                prediction: type === 'PREDATORY_STRIKE'
                    ? `Waking Alpha Strike executed.`
                    : `High-Alpha Breakout detected in REM cycle.`,
                confidence: 0.99,
                amount: amount,
                status: 'PENDING_VALIDATION'
            };

            ledger.push(trade);
            fs.writeFileSync(this.LEDGER_PATH, JSON.stringify(ledger, null, 2));
        } catch (e) {
            console.error('[DreamCircuit] ❌ Failed to record wet dream:', e);
        }
    }
}
