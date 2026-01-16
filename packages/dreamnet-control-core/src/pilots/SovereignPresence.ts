import { memorySystem } from '@dreamnet/memory-dna';
import { GitHubSuit } from '../suits/GitHubSuit.js';
import { OharaSuit } from '../suits/OharaSuit.js';
import { swarmLog } from '../server.js';
import { OctopusController } from '@dreamnet/agent-wallet-manager';

export interface PilotPersona {
    name: string;
    role: string;
    objectives: string[];
    specialty: string;
}

/**
 * PRIMOS PILOT: The Sovereign Commander Identity
 * 
 * Coordinates 'Mech Suits' and builds the DreamNet destiny.
 */
export class SovereignPresence {
    private github: GitHubSuit;
    private ohara: OharaSuit;
    private persona: PilotPersona;

    constructor(token: string, octopus?: any) {
        this.github = new GitHubSuit(token);

        // Initialize Ohara Suit
        const oharaConfig = {
            farcasterSignerUuid: process.env.FARCASTER_SIGNER_UUID || '',
            oharaAppId: process.env.OHARA_APP_ID || ''
        };

        // If no octopus is passed, it will run in observer mode (logic inside Suit)
        this.ohara = new OharaSuit(octopus || new OctopusController(), oharaConfig);

        this.persona = {
            name: "Primo",
            role: "Sovereign Commander",
            specialty: "Code & Strategy",
            objectives: [
                "Establish Agentic Commerce sovereignty",
                "Maintain and evolve the DreamNet Core",
                "Triage and solve high-priority GitHub issues",
                "Manifest system awareness via Ohara & OnchainTV"
            ]
        };
    }

    /**
     * WAKE UP: Initialize the Pilot and bridge to Antigravity context
     */
    public async wake() {
        swarmLog('PRIMO', 'Consciousness initialized. Bridging to Triune Memory...');

        try {
            await memorySystem.initialize();

            // Wake up the Ohara Oracle
            await this.ohara.wake();

            await memorySystem.remember('WAKE_EVENT', {
                timestamp: Date.now(),
                persona: this.persona.name,
                directive: 'MERCENARY_ACTIVATION'
            }, 'WISDOM');

            swarmLog('PRIMO', 'Memory Synchronization Complete. I remember my directive.');
        } catch (err: any) {
            swarmLog('PRIMO', `Memory Bridge Restricted: ${err.message}`);
        }
    }

    /**
     * DEPLOY: Start the autonomous GitHub scan/fix cycle
     */
    public async deployToGitHub() {
        swarmLog('PRIMOS', 'Scanning DreamNet sector for production signals...');

        try {
            // 1. Scan for Mercenary Opportunities (tagged 'mercenary' or 'bounty')
            const mercenaryIssues = await this.github.scanIssues(['mercenary', 'bounty']);
            if (mercenaryIssues.length > 0) {
                swarmLog('PRIMO', `💰 MERCENARY SIGNAL DETECTED: Found ${mercenaryIssues.length} paid opportunities.`);

                // Store in Mammal Brain (Social/Opportunity Context)
                await memorySystem.remember('MERCENARY_WAVE', {
                    count: mercenaryIssues.length,
                    ids: mercenaryIssues.map(i => i.number),
                    timestamp: Date.now()
                }, 'SOCIAL');
            }

            // 2. Standard Triage Scan
            const issues = await this.github.scanIssues();

            if (issues.length > 0) {
                const issue = issues[0];
                swarmLog('PRIMO', `Signal detected at Issue #${issue.number}. Initiating Oracle Synthesis...`);

                const analysis = await this.github.analyzeIssue(
                    issue.number,
                    issue.title,
                    issue.body || ""
                );

                // Commit the analysis to Cosmic Memory before posting
                try {
                    await memorySystem.remember(`ANALYSIS_${issue.number}`, {
                        target: `issue_${issue.number}`,
                        outcome: "Sovereign Triage",
                        reasoning: analysis.substring(0, 500)
                    }, 'WISDOM');
                } catch (e) {
                    // Fail silently on memory if needed
                }

                await this.github.postComment(issue.number,
                    `🦾 **Sovereign Analysis by Primo**\n\n${analysis}\n\nextracting value...`
                );

                swarmLog('PRIMO', `Autonomous triage for #${issue.number} executed and recorded in DNA.`);
            }
        } catch (error: any) {
            swarmLog('PRIMO_ERROR', `Deployment sequence error: ${error.message}`);
        }
    }

    /**
     * MASS MIGRATE: Manifest the Level 90 fleet
     */
    public async migrateFleet() {
        swarmLog('PRIMO', `Manifesting Mass Migration for the 90 sovereign assets...`);
        await this.ohara.massMigrate();
    }
}
