import { ethers } from 'ethers';

export interface YieldDistribution {
    vessel: string;
    targetAddress: string;
    percentage: number;
}

export class TreasuryController {
    private static instance: TreasuryController;
    private revenueSplit: YieldDistribution[] = [
        { vessel: 'Uniswap', targetAddress: process.env.UNISWAP_WALLET_ADDRESS || '', percentage: 0.4 },
        { vessel: 'VeChain', targetAddress: process.env.VECHAIN_WALLET_ADDRESS || '', percentage: 0.2 },
        { vessel: 'Zora', targetAddress: process.env.ZORA_WALLET_ADDRESS || '', percentage: 0.1 },
        { vessel: 'Farcaster', targetAddress: process.env.FARCASTER_WALLET_ADDRESS || '', percentage: 0.1 },
        { vessel: 'Base Meme', targetAddress: process.env.BASE_MEME_WALLET_ADDRESS || '', percentage: 0.2 }
    ];

    private constructor() {
        console.log('[Treasury] 💰 Circulation Controller active. Yield paths established.');
        this.subscribeToSenses();

        // 🛰️ Auto-Pilot Assignment
        import('@dreamnet/nerve').then(({ pilotRegistry }) => {
            pilotRegistry.assign('Treasury', 'defi');
            console.log(`[Treasury] 🧥 Suit Equipped: DeFi (Base L2 + Sovereign Wallets)`);
        });
    }

    private subscribeToSenses() {
        import('@dreamnet/nerve').then(({ MANIFOLD }) => {
            MANIFOLD.on('SENSORY_INPUT', async (event: any) => {
                const snapshot = event.payload;
                if (!snapshot) return;

                console.log(`[Treasury] 👂 Sensory signal received. Analyzing market context...`);

                // DYNAMIC ADJUSTMENT LOGIC
                // Example: If Gold (XAU) is performing well, increase defensive allocations
                const goldPrice = snapshot.metals?.XAU || 0;
                if (goldPrice > 2500) {
                    console.log(`[Treasury] 🛡️  Gold surge detected ($${goldPrice}). Shifting toward defensive vessels...`);
                    this.adjustSplit('Base Meme', 0.3); // Safe haven memes?
                    this.adjustSplit('Uniswap', 0.3);
                }

                // Example: If ETH is pumping, increase yield hunt
                const ethPrice = snapshot.crypto?.ethereum || 3300;
                if (ethPrice > 4000) {
                    console.log(`[Treasury] 🚀 ETH Moon Mission active ($${ethPrice}). Increasing aggressive yield hunt...`);
                    this.adjustSplit('VeChain', 0.4); // Deep logistics growth
                }
            });
        });
    }

    private adjustSplit(vessel: string, newPercentage: number) {
        const item = this.revenueSplit.find(s => s.vessel === vessel);
        if (item) {
            item.percentage = newPercentage;
            // Normalize others (simplified)
            const remaining = 1 - newPercentage;
            const others = this.revenueSplit.filter(s => s.vessel !== vessel);
            others.forEach(o => o.percentage = remaining / others.length);
        }
    }

    public static getInstance(): TreasuryController {
        if (!TreasuryController.instance) {
            TreasuryController.instance = new TreasuryController();
        }
        return TreasuryController.instance;
    }

    /**
     * Calculate and execute "Evaporation" (revenue distribution)
     */
    public async evaporate(amount: bigint) {
        console.log(`[Treasury] 💨 Initiating evaporation for ${ethers.formatEther(amount)} ETH...`);

        for (const split of this.revenueSplit) {
            const splitAmount = (amount * BigInt(Math.floor(split.percentage * 100))) / 100n;
            console.log(`[Treasury] 🌊 Routing ${ethers.formatEther(splitAmount)} ETH to ${split.vessel} (${split.targetAddress}) [${(split.percentage * 100).toFixed(1)}%]`);

            // Future: Execute transaction via HOT_SENDER_PK
            // await this.sendTransaction(split.targetAddress, splitAmount);
        }
    }

    private async sendTransaction(to: string, amount: bigint) {
        // Implementation for hot wallet signing
    }
}

export const Treasury = TreasuryController.getInstance();
