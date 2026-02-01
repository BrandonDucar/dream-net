/**
 * Aethersafe Immune System 🛡️
 * Hijacked Wisdom: Immunology (Self vs. Non-Self)
 * 
 * Philosophy: Distinguish "Self" (Healthy) from "Non-Self" (Error). Attack the Non-Self.
 * Mechanism: Polling health checks and auto-restart logic ("Healing").
 */

import type { AgentContainer } from '@dreamnet/agents';

type Antibody = (agent: AgentContainer) => Promise<void>;

export class ImmuneSystem {
    private monitoredAgents: Set<AgentContainer> = new Set();
    private healingFactor: boolean = true; // Auto-heal enabled

    /**
     * Register an agent for immune protection (Vaccination)
     */
    public protect(agent: AgentContainer) {
        this.monitoredAgents.add(agent);
        console.log(`[🛡️ Immune] Protecting ${agent.constructor.name} (Antibodies deployed)`);
    }

    /**
     * The "T-Cell" Loop: Scans for infection (errors)
     */
    public startSurveillance(intervalMs: number = 5000) {
        console.log(`[🛡️ Immune] T-Cells patrolling every ${intervalMs}ms...`);

        setInterval(async () => {
            for (const agent of this.monitoredAgents) {
                const health = agent.checkHealth();

                if (health.status === 'ERROR' || health.errorCount > 10) {
                    console.warn(`[🛡️ Immune] INFECTION DETECTED in ${agent.constructor.name}. Initiating Immune Response...`);
                    await this.heal(agent);
                }
            }
        }, intervalMs);
    }

    /**
     * The "Healing" Protocol (Restart)
     */
    private async heal(agent: AgentContainer) {
        if (!this.healingFactor) return;

        try {
            console.log(`[🛡️ Immune] Administering Adrenaline (Restarting) to ${agent.constructor.name}...`);
            await agent.shutdown().catch(() => { }); // Force kill infection
            await agent.boot(); // Resurrect
            console.log(`[🛡️ Immune] ${agent.constructor.name} HEALED. Welcome back.`);
        } catch (err) {
            console.error(`[🛡️ Immune] Healing Failed. ${agent.constructor.name} is necrotic.`, err);
        }
    }
}

export const Aethersafe = new ImmuneSystem();
