import { Connection } from '@solana/web3.js';
import { epigenetics } from '@dreamnet/memory-dna';

/**
 * Ghost RPC Service (Avenue 31)
 * 
 * Logic: Rotates between providers to evade detection.
 * If a provider returns a 401/403, it records trauma and shifts.
 */
export class GhostRPCService {
    private providers: string[] = [
        process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
        'https://solana-mainnet.g.allthenodes.com',
        'https://rpc.ankr.com/solana',
        'https://104.21.31.25' // Jupiter IP Bypass if needed
    ];

    private currentIndex = 0;

    public getConnection(): Connection {
        const url = this.providers[this.currentIndex];
        console.log(`[GhostRPC] Routing via Shadow: ${url}`);
        return new Connection(url, 'confirmed');
    }

    /**
     * Called when a "Metabolic Trauma" occurs on an RPC call.
     */
    public rotateProvider(reason: string) {
        const oldProvider = this.providers[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.providers.length;
        const newProvider = this.providers[this.currentIndex];

        console.warn(`[GhostRPC] 🛡️ Evasion Triggered: ${reason}`);
        console.warn(`[GhostRPC] 🔄 Shifting from ${oldProvider} to ${newProvider}`);

        // Log trauma for the old provider hash
        const hash = Buffer.from(oldProvider).toString('hex').slice(0, 16);
        epigenetics.logTrauma(hash);
    }

    public addProvider(url: string) {
        if (!this.providers.includes(url)) {
            this.providers.push(url);
        }
    }
}

export const ghostRPC = new GhostRPCService();
