import { EventEmitter } from 'events';

export interface EnvStatus {
    valid: boolean;
    missing: string[];
    timestamp: number;
}

/**
 * Meta-Agent: EnvKeeper (Sentinel of the Veil)
 * 
 * Ensures all critical environment variables are present and valid before
 * the organism attempted to ignite.
 */
class EnvKeeper extends EventEmitter {
    private criticalKeys = [
        'GITHUB_TOKEN',
        'VERCEL_TOKEN',
        'ALCHEMY_API_KEY',
        'PHANTOM_PRIVATE_KEY',
        'METAMASK_PRIVATE_KEY',
        'COSMIC_SECRET',
        'OHARA_API_KEY'
    ];

    public validate(): EnvStatus {
        const missing = this.criticalKeys.filter(key => !process.env[key]);
        const status = {
            valid: missing.length === 0,
            missing,
            timestamp: Date.now()
        };

        if (!status.valid) {
            console.error(`[EnvKeeper] ⚠️ CRITICAL VOID DETECTED: Missing keys: ${missing.join(', ')}`);
            this.emit('env:missing', status);
        } else {
            console.log(`[EnvKeeper] ✅ All ${this.criticalKeys.length} critical seals verified.`);
            this.emit('env:verified', status);
        }

        return status;
    }

    /**
     * Periodically scan to ensure no "veils" have been dropped mid-flight
     */
    public startSentry(intervalMs = 60000) {
        console.log(`[EnvKeeper] 👁️ Eye of the Sentry opened. Scanning every ${intervalMs}ms...`);
        setInterval(() => this.validate(), intervalMs);
    }
}

export const envKeeper = new EnvKeeper();
