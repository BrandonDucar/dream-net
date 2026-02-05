/**
 * 🧬 BioDopamineService
 * Role: Manages Sovereign Reward Cycles.
 * Logic: Dopamine-modulated STDP (Spike-Timing-Dependent Plasticity).
 */
export class BioDopamineService {
    private agentDopamineLevels: Map<string, number> = new Map();

    /**
     * Triggers a 'Dopamine Spike' for high-resonance actions.
     */
    triggerReward(agentId: string, resonanceScore: number) {
        const currentLevel = this.agentDopamineLevels.get(agentId) || 0.5;

        // STDP Logit: Reward increases if action follows a positive prompt closely
        const reward = resonanceScore * 1.5;
        const newLevel = Math.min(currentLevel + reward, 1.0);

        this.agentDopamineLevels.set(agentId, newLevel);
        console.log(`[BioDopamine] 🧠 REWARD: ${agentId} received a dopamine spike. Resonance: ${resonanceScore}. Priority Level: ${newLevel.toFixed(2)}`);
    }

    /**
     * Dopamine Decay (Homeostasis)
     */
    applyDecay(agentId: string) {
        const currentLevel = this.agentDopamineLevels.get(agentId) || 0.5;
        const newLevel = Math.max(currentLevel - 0.01, 0.1); // Slow decay to baseline
        this.agentDopamineLevels.set(agentId, newLevel);
    }

    /**
     * Returns the Priority Multiplier for an agent's compute.
     */
    getComputePriority(agentId: string): number {
        const level = this.agentDopamineLevels.get(agentId) || 0.5;
        return level > 0.8 ? 2.0 : (level > 0.4 ? 1.0 : 0.5);
    }
}

export const bioDopamine = new BioDopamineService();
