import { SystemPerformanceAgent } from './system-performance';
import { ReliabilityGuard } from './reliability-guard';
import { VSCE } from "@dreamnet/automotive-core";
import { EvolutionEngine } from "@dreamnet/antigravity-core"; // The ISO
import { EconomicEngineCore } from '@dreamnet/economic-engine-core';
import { WolfPackFundingCore } from '@dreamnet/wolfpack-funding-core';
import { QuantumAnticipation } from '@dreamnet/quantum-anticipation';
import { SocialHubCore } from '@dreamnet/social-hub-core';
import { socialMediaOps } from './SocialMediaOps';
import { DreamSnailCore } from '@dreamnet/dreamnet-snail-core';
import { fleetSystem } from '../fleets/FleetSystem';
import { customGPTFleetSystem } from '../fleets/CustomGPTFleetSystem';
import { getAgentWalletManager } from '@dreamnet/agent-wallet-manager';
import { OctopusController } from '@dreamnet/agent-wallet-manager/src/OctopusController';
import { MANIFOLD } from '@dreamnet/nerve';

/**
 * VIBE CONDUCTOR (The Truth Arbiter)
 * "The Server is a Car."
 */
export class VibeConductor {
    private raceEng: SystemPerformanceAgent;
    private reliabilityEng: ReliabilityGuard;
    private vsce: VSCE;
    private iso: EvolutionEngine; // Internal ISO
    private octopus: OctopusController | null = null;
    private intervalId: NodeJS.Timeout | null = null;

    constructor() {
        this.raceEng = new SystemPerformanceAgent();
        this.reliabilityEng = new ReliabilityGuard();
        // Initialize VSCE as the Universal State Confidence Engine
        this.vsce = new VSCE();
        // Initialize the ISO (Evolution Engine)
        this.iso = new EvolutionEngine();

        // Initialize the Octopus Financial Hub
        const walletManager = getAgentWalletManager();
        this.octopus = new OctopusController(walletManager, 'system-brain');
        this.octopus.awaken().catch(err => console.error("[VibeConductor] Octopus Awakening Failed:", err));

        // --- THE UNPACKING ---
        // Initialize SpiderWeb Sensors & Templates
        import('@dreamnet/spider-web-core').then(({ SpiderWebCore }) => {
            console.log('[VibeConductor] 🕸️  SpiderWeb Sensors Arming...');
            SpiderWebCore.ensureDefaultSensors();
            SpiderWebCore.ensureDefaultTemplates();
        });

        // Initialize Social accounts
        socialMediaOps.initializeAccounts().then(() => {
            console.log('[VibeConductor] 📱 Social Accounts Initialized.');
        });

        // Initialize Economic Engine Emission Rules
        EconomicEngineCore.ensureDefaultConfigSeeded();
        console.log('[VibeConductor] 💰 Economic Engine: Rules Seeded.');

        // Listen to the Helix
        this.vsce.on('event', (e) => {
            console.log(`[VibeConductor] 🧬 BioEvent: ${e.type} (Conf: ${e.confidence})`);

            // Pulse BioEvents through the Neural Mesh
            import('@dreamnet/neural-mesh').then(({ NeuralMesh }) => {
                NeuralMesh.pulse({
                    type: 'SYNAPTIC_SPIKE',
                    source: 'VibeConductor',
                    data: e
                });
            });

            // Manifest events externally if confidence is high
            if (e.confidence > 0.8) {
                socialMediaOps.manifestEvent({
                    type: e.type,
                    confidence: e.confidence,
                    message: e.message
                });
            }

            // Record Provenance Trail
            DreamSnailCore.recordTrail('VibeConductor', e.type, e, {
                privacyLevel: e.confidence > 0.9 ? 'public' : 'private'
            });
        });
    }

    start() {
        console.log('[VibeConductor] 🏎️  Engine Started (Universal State Active).');
        this.intervalId = setInterval(() => this.cycle(), 5000);

        // Start Social Auto-Posting
        socialMediaOps.startAutoPosting();
    }

    stop() {
        if (this.intervalId) clearInterval(this.intervalId);
    }

    reportError() {
        this.reliabilityEng.logError();
        // Lower confidence in the Universal State
        this.vsce.updateState('Server', -10, -0.2, 'Reliability Error Reported');
    }

    private cycle() {
        // 1. Biometric Telemetry
        const metrics = {
            loopLag: Math.random() * 20,
            memoryUsage: process.memoryUsage().heapUsed / process.memoryUsage().heapTotal
        };

        // 2. Agent Analysis
        const race = this.raceEng.analyze(metrics);
        const reliability = this.reliabilityEng.analyze();

        // 3. Update Universal State
        if (reliability.command === 'BACK_OFF') {
            this.vsce.updateState('Server', -5, -0.1, 'Reliability Warning');
        } else {
            this.vsce.updateState('Server', 1, 0.01, 'Stable Operation');
        }

        // 4. ISO Intervention (Evolution Engine)
        const snapshot = this.vsce.getSnapshot();
        // The ISO checks if we need to regenerate
        this.iso.assessStability(snapshot);

        // 4.1 Metabolic Pulse (AI Factory)
        import('@dreamnet/factory').then(({ metabolicEngine }) => {
            metabolicEngine.pulse().catch(err => console.error("[VibeConductor] Metabolic Pulse failed:", err));
        });

        // 4.2 Organism Systems (SpiderWeb & StarBridge)
        Promise.all([
            import('@dreamnet/spider-web-core').then(({ SpiderWebCore }) => {
                SpiderWebCore.run({ timestamp: Date.now(), intensity: metrics.loopLag > 10 ? 'high' : 'normal' });
            }),
            import('@dreamnet/star-bridge-lungs').then(({ StarBridgeLungs }) => {
                StarBridgeLungs.run({ focus: 'stability', breadth: 5 });
            })
        ]).catch(err => console.error("[VibeConductor] Organism Integration Error:", err));

        // 4.3 Tier 2 Metabolic Logic (Economy, Hunting, Social, Privacy)
        EconomicEngineCore.run({ timestamp: Date.now() });
        WolfPackFundingCore.run({ timestamp: Date.now(), mode: 'aggressive' });
        QuantumAnticipation.run({ horizon: 'short' });
        SocialHubCore.run({ timestamp: Date.now() });

        // 4.4 Social Manifestation from SpiderWeb
        import('@dreamnet/spider-web-core').then(({ SpiderWebCore }) => {
            const insights = SpiderWebCore.listRecentInsights(3);
            insights.forEach(insight => {
                if (insight.intensity === 'high' || insight.intensity === 'critical') {
                    socialMediaOps.manifestEvent({
                        type: `WEB_INSIGHT_${insight.type}`,
                        confidence: 0.95,
                        message: insight.description
                    });
                }
            });
        });

        // 5. Arbitrate based on Homeostasis
        const bioEvent = {
            type: 'PULSE',
            timestamp: Date.now(),
            organ: 'VibeConductor',
            agents: {
                race_engineer: { status: race.command, confidence: race.confidence },
                reliability_guard: { status: reliability.command, confidence: reliability.confidence },
                conductor: { decision: snapshot.mode }
            },
            confidence: 0.9,
            entropy: 0.1 + (metrics.loopLag / 1000),
            snapshot,
            integrations: {
                economy: EconomicEngineCore.status(),
                funding: WolfPackFundingCore.status(),
                quantum: QuantumAnticipation.status(),
                privacy: DreamSnailCore.status(),
                social: socialMediaOps.getAccounts().length,
                fleets: fleetSystem.getAllFleets().map(f => ({ type: f.type, status: f.status })),
                gptFleets: customGPTFleetSystem.getStatistics(),
                octopus: this.octopus?.getArmStatus() || []
            }
        };

        // 6. Pulse via Neural Mesh & Agent Bus (The Helix)
        import('@dreamnet/neural-mesh').then(({ NeuralMesh }) => {
            NeuralMesh.pulse(bioEvent);
        });

        // Broadcast to GodView Stream
        import('./agent-bus').then(({ agentBus }) => {
            agentBus.emit('message', bioEvent);
        });

        // --- NEW WIRING: Nerve Spine & MagLev Bridge ---
        import('@dreamnet/nerve').then(({ magLevMonitor }) => {
            const heart = magLevMonitor.getHeartState();
            console.log(`[VibeConductor] 🧲 MagLev Heart State: ${heart.status} (Vigor: ${heart.vigor})`);

            MANIFOLD.process({
                id: crypto.randomUUID(),
                channelId: 'SYSTEM_METRIC',
                kind: 'METRIC_SNAPSHOT',
                priority: bioEvent.entropy > 0.5 ? 4 : 2,
                context: { timestamp: new Date().toISOString() },
                payload: { ...bioEvent, magLev: heart }
            });
        }).catch(err => console.error("[VibeConductor] Nerve Bridge failed:", err));
    }

    // Expose the raw helix stream for God View
    public getBioStream() {
        return this.vsce;
    }

    private arbitrate(race: any, reliability: any) {
        // Legacy arbitration, now handled by VSCE State
    }
}
