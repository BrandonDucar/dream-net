import { type EmergentAgent } from './QuantumFamily.js';
import { db } from '../db.js';
import { swarmAgents } from '../../shared/schema.js';
import { onboardingWorker } from '../workers/FarcasterOnboardingWorker.js';

/**
 * 🐣 FarcasterBirthOrchestrator
 * Detects the emergence of new agents and triggers the onboarding pipeline.
 */
export class FarcasterBirthOrchestrator {
    /**
     * Triggers the onboarding sequence for a newly emerged agent.
     */
    public async onboardAgent(agent: EmergentAgent) {
        console.log(`🐣 [Birth] Triggering onboarding pipeline for Agent ${agent.id}...`);

        try {
            // 1. Initial Persistence (Register as 'pending')
            await db.insert(swarmAgents).values({
                id: agent.id,
                status: 'idle',
                licenseLevel: agent.licenseLevel,
                lineage: agent.lineage,
                birthBlock: agent.birthBlock,
                name: agent.id,
                type: 'emergent',
                createdAt: new Date(),
                updatedAt: new Date()
            }).onConflictDoNothing();

            // 2. Pass to Onboarding Worker for the 5-step Wizard
            await onboardingWorker.processAgent(agent.id);

            console.log(`✨ [Birth] Agent ${agent.id} handed off to onboarding pipeline.`);

        } catch (error: any) {
            console.error(`❌ [Birth] Handoff failed for ${agent.id}:`, error.message);
        }
    }
}

export const farcasterBirth = new FarcasterBirthOrchestrator();
