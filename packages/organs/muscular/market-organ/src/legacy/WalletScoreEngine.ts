import { NERVE_BUS } from '@dreamnet/nerve';
import { portal } from '../../../server/src/core/PortalOrgan.js';
import { getDb } from '../../../server/src/db.js';
import { wallets, dreams } from '@shared/schema';
import { eq, avg, sql } from 'drizzle-orm';

export interface WalletScore {
    address: string;
    score: number; // 0-100
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    lastAnalysis: number;
    portfolioValue?: number;
    rank?: number;
    insights?: string[];
}

/**
 * Modernized WalletScoreEngine (2026)
 * Role: Predicts market resonance and wallet-to-organ affinity.
 */
export class WalletScoreEngine {
    /**
     * AI-Powered Analysis (Grounded in Live Data)
     */
    public async analyzeWallet(address: string): Promise<WalletScore> {
        console.log(`[🪙 SENSEI] Analyzing wallet resonance: ${address}...`);

        // Track energy consumption via Portal Organ
        portal.trackJouleBurn('WalletScoreEngine', 5);

        const db = await getDb({ intent: 'READ' });

        // 1. Fetch Wallet Stats from Substrate
        const [wallet] = await db.select()
            .from(wallets)
            .where(eq(wallets.userId, address)) // Mapping address to userId (FID/Wallet)
            .limit(1);

        // 2. Aggregate Dream Performance (Reputation)
        const dreamStats = await db.select({
            avgScore: avg(dreams.score),
            nightmareCount: sql<number>`count(*) filter (where is_nightmare = true)`
        })
            .from(dreams)
            .where(eq(dreams.wallet, address));

        const avgDreamScore = Number(dreamStats[0]?.avgScore || 0);
        const nightmareRatio = Number(dreamStats[0]?.nightmareCount || 0);

        // 3. Synthesize Score (2026 Logic)
        // Score = (WalletValue_Bonus + Reputation_Weight) - (Nightmare_Penalty)
        const walletBonus = Math.min((wallet?.totalValue || 0) / 1000, 20); // Max 20 points from value
        const reputationWeight = Math.min(avgDreamScore / 2, 70); // Max 70 points from dreams
        const penalty = nightmareRatio * 5; // 5 points off per nightmare

        const finalScore = Math.max(0, Math.min(100, Math.round(walletBonus + reputationWeight - penalty)));

        // Determination of Risk
        const risk: WalletScore['riskLevel'] = finalScore > 85 ? 'LOW' : finalScore > 60 ? 'MEDIUM' : 'HIGH';

        const walletScore: WalletScore = {
            address,
            score: finalScore,
            riskLevel: risk,
            lastAnalysis: Date.now(),
            portfolioValue: wallet?.totalValue || 0,
            insights: [
                `Resonance: ${finalScore}% efficiency detected.`,
                nightmareRatio > 0 ? `⚠️ Nightmare artifacts detected in history.` : "✅ Clean substrate provenance.",
                `Vault Value: $${wallet?.totalValue || 0} collateralized.`
            ]
        };

        // Emit high-priority market signal via Nerve Bus
        NERVE_BUS.publish('MARKET_SIGNAL', {
            type: 'WALLET_SCORE_UPDATED',
            payload: walletScore
        }, 'high');

        return walletScore;
    }
}
