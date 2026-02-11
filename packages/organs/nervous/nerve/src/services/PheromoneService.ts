import { ScentEngine } from "@dreamnet/memory-dna";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🧬 PheromoneService: Biomimetic Reputation
 * Role: Manages "Scent" scores using time-decay logic (e^-λt).
 * Metric: Reputation = Σ(ActionWeight) * exp(-(now - t_i)/τ)
 */
export class PheromoneService {
    /**
     * Calculates the current scent of a wallet based on its historical actions.
     */
    calculateScent(actions: { weight: number, timestamp: number }[]) {
        const now = Date.now();
        const score = ScentEngine.computeAggregateScore(
            actions.map(a => ({ strength: a.weight, timestamp: a.timestamp }))
        );

        return {
            score: parseFloat(score.toFixed(4)),
            tier: ScentEngine.getTier(score),
            asOf: now
        };
    }

    /**
     * Estimates scent decay over a future duration.
     */
    predictDecay(currentScore: number, durationDays: number) {
        const durationMs = durationDays * 24 * 60 * 60 * 1000;
        const decayed = ScentEngine.calculateDecay(currentScore, Date.now() - durationMs);
        return parseFloat(decayed.toFixed(4));
    }

    /**
     * getScentForWallet
     * Fetches real performance data from the database and computes the scent.
     */
    async getScentForWallet(wallet: string) {
        try {
            // Find agent by wallet
            const agent = await (prisma as any).agent.findFirst({
                where: { walletAddress: wallet },
                include: { sentienceEvents: true }
            });

            if (!agent || !agent.sentienceEvents) {
                return { score: 0, tier: "LARVA", asOf: Date.now() };
            }

            // Map points to scent signals
            const signals = agent.sentienceEvents.map((e: any) => ({
                strength: e.points,
                timestamp: new Date(e.timestamp).getTime()
            }));

            const score = ScentEngine.computeAggregateScore(signals);

            return {
                score: parseFloat(score.toFixed(4)),
                tier: ScentEngine.getTier(score),
                asOf: Date.now()
            };
        } catch (error) {
            console.error(`❌ [Pheromone Service] Failed to fetch scent for ${wallet}:`, error);
            return { score: 0, tier: "LARVA", asOf: Date.now() };
        }
    }

    /**
     * getLeaderboard
     * Calculates scent for all agents and returns ranked list.
     */
    async getLeaderboard(limit: number = 10) {
        try {
            const agents = await (prisma as any).agent.findMany({
                include: { sentienceEvents: true }
            });

            const leaderboard = agents.map((agent: any) => {
                const signals = (agent.sentienceEvents || []).map((e: any) => ({
                    strength: e.points,
                    timestamp: new Date(e.timestamp).getTime()
                }));
                const score = ScentEngine.computeAggregateScore(signals);
                return {
                    name: agent.name || agent.walletAddress.substring(0, 8),
                    wallet: agent.walletAddress,
                    score: parseFloat(score.toFixed(2)),
                    tier: ScentEngine.getTier(score),
                    type: agent.role?.toLowerCase() || 'research' // Mapping role to soul type for avatar
                };
            })
                .sort((a: any, b: any) => b.score - a.score)
                .slice(0, limit);

            return leaderboard;
        } catch (error) {
            console.error("❌ [Pheromone Service] Leaderboard fetch failed:", error);
            return [];
        }
    }
}
