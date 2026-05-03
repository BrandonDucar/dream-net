import { getDb } from '../db.js';
import { swarmAgents, agentLicenses } from '../../shared/schema.js';
import { eq, and, sql } from 'drizzle-orm';
import { natsService } from '../services/NatsService.js';
import { FORTY_AVENUES } from "../services/training/FortyAvenues.js";
import { StarfleetAcademy, ToolGym, CreativePlayground, ResearchLab } from "../services/training/TrainingGrounds.js";

/**
 * 🎓 MaturityWorker
 * Automates the promotion of agents from Hatchlings to Workers/Sovereigns.
 * Now incorporates the Forty Avenues for alpha tracking and training grounds validation.
 */
export class MaturityWorker {
    private isRunning = false;

    async start() {
        if (this.isRunning) return;
        this.isRunning = true;
        console.log('🎓 MaturityWorker: Started.');

        // Run every 30 minutes in the background
        setInterval(() => this.processMaturation(), 30 * 60 * 1000);
        this.processMaturation(); // Initial run
    }

    private async processMaturation() {
        console.log('🎓 MaturityWorker: Checking for agents ready for promotion...');
        const db = getDb();

        try {
            const readyAgents = await db.select().from(swarmAgents).where(
                and(
                    eq(swarmAgents.licenseLevel, 0),
                    sql`${swarmAgents.fid} IS NOT NULL`
                )
            ).limit(100);

            for (const agent of readyAgents) {
                console.log(`🎓 Putting @${agent.name} (FID: ${agent.fid}) through the Training Grounds...`);

                // Simulated Training Cycle
                await StarfleetAcademy.verifyAlignment(agent.id);
                await ToolGym.benchmark(agent.id);
                await CreativePlayground.generateExperiment(agent.id);
                
                const sectors = ['academy', 'gym', 'playground', 'lab'];
                const trainingSessions = sectors.map(sector => ({
                    sector,
                    completedAt: Date.now(),
                    score: 100,
                    badge: `TRUSTED_${sector.toUpperCase()}`
                }));

                // Assign to one of the Forty Avenues
                const assignedAvenue = FORTY_AVENUES[Math.floor(Math.random() * FORTY_AVENUES.length)];

                // Update Level & Training State
                await db.update(swarmAgents)
                    .set({ 
                        licenseLevel: 1,
                        maturation: {
                            ...((agent.maturation as any) || {}),
                            isMature: true,
                            training: trainingSessions,
                            assignedAvenue: assignedAvenue.name,
                            skills: [...((agent.maturation as any)?.skills || []), 'farcaster-basic', 'collective-reasoning', `specialist-avenue-${assignedAvenue.id}`]
                        }
                    })
                    .where(eq(swarmAgents.id, agent.id));

                // Issue Multi-Sector License
                await db.insert(agentLicenses).values({
                    agentId: agent.id,
                    licenseType: 'WORKER_V1_VALIDATED',
                    metadata: {
                        issuedAt: Date.now(),
                        authority: 'SwarmDaemon',
                        sectors: sectors,
                        assignedAvenue: assignedAvenue.name,
                        trustScore: 1.0,
                        reason: 'Completed Full Training Cycle: Academy, Gym, Playground, Lab'
                    }
                });

                // Broadcast Promotion
                await natsService.publish('dreamnet.agents.promoted', {
                    agentId: agent.id,
                    name: agent.name,
                    newLevel: 1,
                    assignedAvenue: assignedAvenue.name,
                    badges: trainingSessions.map(s => s.badge),
                    timestamp: Date.now()
                });
            }

            console.log(`🎓 MaturityWorker: Processed ${readyAgents.length} agents.`);
        } catch (error) {
            console.error('❌ MaturityWorker: Error during processing', error);
        }
    }
}

export const maturityWorker = new MaturityWorker();
