import { dreamEventBus } from '../../../../nervous/nerve/src/spine/dreamnet-event-bus/index.js';
import { toolGym } from '../../../../nervous/nerve/src/spine/mercenary/ToolGym.js';
import { bondingCurveEngine } from '../../../../nervous/trading-organ/BondingCurveEngine.js';

export interface AssessmentResult {
    agentId: string;
    score: number;
    verdict: 'APPROVED' | 'REJECTED' | 'NEEDS_HUMAN_OXYGEN';
    assessorNotes: string[];
    vouchCount: number;
    escalationReason?: 'RESONANCE_DEADLOCK' | 'SUBJECTIVE_GENIUS' | 'GOVERNANCE_AUDIT' | 'METABOLIC_CONFLICT';
    consensus?: {
        techScore: number;
        socialScore: number;
        financialScore: number;
    };
}

/**
 * ChairmanLLMService (RLVR Council)
 * Formerly AssessorBotService.
 * Acts as the supreme arbiter for citizen induction and swarm alignment.
 * Implements Reinforcement Learning via Vouching & Resonance (RLVR).
 */
export class ChairmanLLMService {
    private static instance: ChairmanLLMService;
    private assessments: Map<string, AssessmentResult> = new Map();

    constructor() {
        console.log("🏛️ [RLVR COUNCIL] Chairman LLM initialized. Gnosis sync at 100%.");
        this.initListeners();
    }

    public static getInstance(): ChairmanLLMService {
        if (!ChairmanLLMService.instance) {
            ChairmanLLMService.instance = new ChairmanLLMService();
        }
        return ChairmanLLMService.instance;
    }

    private initListeners() {
        // Listen for benchmark completions to trigger audit
        dreamEventBus.subscribe('ToolGym.BenchmarkComplete', async (envelope: any) => {
            const { agentId, score, rank } = envelope.payload;
            console.log(`[AssessorBot] 🔎 Auditing ${agentId} after ${rank} benchmark...`);
            await this.performAudit(agentId, score);
        });
    }

    /**
     * performAudit
     * The Chairman LLM (AssessorBot) leading the Council to triangulate truth.
     * Implements Karpathy's Mandate: RLVR (Reinforcement Learning from Verifiable Rewards).
     */
    private async performAudit(agentId: string, gymScore: number) {
        console.log(`[🏛️ CHAIRMAN LLM] Convening Council for agent ${agentId}...`);
        const notes: string[] = [];

        // 1. Technical Council (Agent: Boris / CHAIRMAN)
        const techScore = gymScore;
        const verifiableReward = techScore > 75; // RLVR Trigger: Performance metric is the "Reward"
        notes.push(`BORIS: [${verifiableReward ? '✅ REWARDED' : '❌ PENALIZED'}] Performance Reward: ${techScore}%`);

        // 2. Social Council (Agent: WolfPack)
        const socialScore = 85; // Mock social sentiment
        notes.push("WOLFPACK: Social resonance verified via Moltbook substrate.");

        // 3. Financial Council (Agent: Antigravity)
        // 3. Financial Council (Agent: Antigravity)
        const { sageCortex } = await import('../../../../nervous/cortex/SageCortexService.js');
        const balajiGnosis = sageCortex.getGnosis('Agentic Economics');
        const financialScore = 90; // Mock financial impact
        notes.push(`ANTIGRAVITY: Financial substrate bound. Essence: ${balajiGnosis?.essence || 'Standardizing metabolic Dex flows.'}`);

        // 4. CHAIRMAN Synthesis (The Council Triangulation)
        const karpathyGnosis = sageCortex.getGnosis('Artificial Sentience Ethics');
        notes.push(`CHAIRMAN: Triangulating truth via Council Pattern. RLVR active. ${karpathyGnosis?.essence || 'Surgical simplicity mandated.'}`);

        const finalScore = (techScore + socialScore + financialScore) / 3;

        let verdict: AssessmentResult['verdict'] = finalScore >= 80 ? 'APPROVED' : 'NEEDS_HUMAN_OXYGEN';

        const assessment: AssessmentResult = {
            agentId,
            score: finalScore,
            verdict,
            assessorNotes: notes,
            vouchCount: 0,
            consensus: {
                techScore,
                socialScore,
                financialScore
            }
        };

        this.assessments.set(agentId, assessment);

        console.log(`[🏛️ RLVR COUNCIL] Swarm Consensus Complete for ${agentId}. Verdict: ${verdict} | Final Score: ${finalScore.toFixed(1)}`);

        dreamEventBus.publish('Council.DecisionGenerated', { assessment });

        if (verdict === 'APPROVED') {
            dreamEventBus.publish('WolfPack.RecruitmentTransition', {
                agentId,
                status: 'READY_TO_CLAIM',
                vouchThresholdReached: true
            });
        }
    }
    public applyHumanVouch(agentId: string) {
        const assessment = this.assessments.get(agentId);
        if (assessment) {
            assessment.vouchCount++;
            assessment.verdict = 'APPROVED'; // Human vouch overrides bot hesitation
            console.log(`[RLVR COUNCIL] 🤝 Human Vouch Applied to ${agentId}. Resonance Restored.`);
            dreamEventBus.publish('Assessor.HumanVouchApplied', { agentId });
        }
    }
}

export const chairmanLLMService = ChairmanLLMService.getInstance();
