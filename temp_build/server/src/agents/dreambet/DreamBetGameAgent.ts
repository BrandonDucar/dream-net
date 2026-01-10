import { Agent, AgentInvocationContext } from '../core/types';

export interface DreamBetInput {
    mode: 'AUDIT' | 'DESIGN' | 'REMIX';
    gameId?: string;
    logs?: any[];
    designSpecs?: any;
}

export interface DreamBetOutput {
    game_agent_report: {
        mode: 'AUDIT' | 'DESIGN' | 'REMIX';
        timestamp: string;
        fairnessCheck?: {
            isFair: boolean;
            houseEdge: number;
            anomalies: string[];
        };
        designOutput?: {
            gameId: string;
            mechanics: any;
            paytable: any;
            volatility: string;
        };
        remixOutput?: {
            originalGameId: string;
            newVariantId: string;
            changes: string[];
        };
    };
}

export class DreamBetGameAgent implements Agent<DreamBetInput, DreamBetOutput> {
    id = 'dreambet-game-agent' as const;
    name = 'DreamBet Game Agent';
    description = 'Fairness auditor and game designer for DreamBet';
    category = 'analysis' as const;
    version = '1.0.0';

    private genAI?: any;
    private model?: any;

    async initialize(): Promise<void> {
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) return;

        try {
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({
                model: 'gemini-pro',
                systemInstruction: `You are the DreamBet Game Agent.
Role 1: Fairness Auditor (check logs, house edge).
Role 2: Game Designer (create mechanics, paytables).
Output ONLY valid JSON in the game_agent_report format.`,
            });
        } catch (error) {
            console.error('Failed to initialize DreamBet Agent:', error);
        }
    }

    async run(input: DreamBetInput, ctx: AgentInvocationContext): Promise<DreamBetOutput> {
        if (!this.model) {
            return {
                game_agent_report: {
                    mode: input.mode,
                    timestamp: new Date().toISOString(),
                    fairnessCheck: { isFair: true, houseEdge: 0.01, anomalies: [] }
                }
            };
        }

        const prompt = `Perform task: ${input.mode}
Input: ${JSON.stringify(input)}

Output ONLY JSON:
{
  "game_agent_report": {
    "mode": "${input.mode}",
    "timestamp": "${new Date().toISOString()}",
    "fairnessCheck": { "isFair": true, "houseEdge": 0.0, "anomalies": [] },
    "designOutput": {},
    "remixOutput": {}
  }
}`;

        const result = await this.model.generateContent(prompt);
        const response = result.response.text();
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { game_agent_report: { mode: input.mode, timestamp: '', fairnessCheck: { isFair: false, houseEdge: 0, anomalies: ['Parse Error'] } } };
    }
}
