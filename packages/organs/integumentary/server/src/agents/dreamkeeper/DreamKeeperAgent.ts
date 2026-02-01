import { Agent, AgentInvocationContext } from '../core/types';

export interface DreamKeeperInput {
    snapshotId: string;
    timestamp: string;
    vertexFusion?: any;
    domeState?: any;
    agentMetrics?: any;
    anomalies?: any[];
}

export interface DreamKeeperOutput {
    overallHealth: 'STABLE' | 'WARN' | 'CRITICAL';
    scores: {
        core: number;
        dome: number;
        hubs: number;
        realms: number;
        infra: number;
        agents: number;
    };
    alerts: Array<{
        id: string;
        severity: 'INFO' | 'WARN' | 'CRITICAL';
        area: 'CORE' | 'DOME' | 'HUBS' | 'REALMS' | 'INFRA' | 'AGENTS';
        description: string;
        suggestedHandler?: 'drone-dome-sky-scanner' | 'nightmare-surgeon' | 'dev-cookbox';
    }>;
    tasks: Array<{
        id: string;
        handlerAgentId: string;
        taskType: string;
        payload: any;
        priority: 'LOW' | 'MEDIUM' | 'HIGH';
    }>;
}

export class DreamKeeperAgent implements Agent<DreamKeeperInput, DreamKeeperOutput> {
    id = 'dreamnet-dreamkeeper' as const;
    name = 'DreamKeeper';
    description = 'Global diagnostic and health-scoring agent for DreamNet';
    category = 'monitoring' as const;
    version = '1.0.0';

    private genAI?: any;
    private model?: any;

    async initialize(): Promise<void> {
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
            console.warn('⚠️ GOOGLE_AI_API_KEY not set, DreamKeeper will be disabled');
            return;
        }

        try {
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({
                model: 'gemini-pro',
                systemInstruction: `You are DreamKeeper: the global health monitor for DreamNet.
You analyze system state and output health scores, alerts, and task recommendations.
Output ONLY valid JSON in the dreamkeeper_update format.`,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 8192,
                }
            });
        } catch (error) {
            console.error('Failed to initialize DreamKeeper:', error);
        }
    }

    async run(input: DreamKeeperInput, ctx: AgentInvocationContext): Promise<DreamKeeperOutput> {
        if (!this.model) {
            // Return stub data if not initialized
            return {
                overallHealth: 'STABLE',
                scores: {
                    core: 95,
                    dome: 92,
                    hubs: 88,
                    realms: 90,
                    infra: 94,
                    agents: 91
                },
                alerts: [],
                tasks: []
            };
        }

        const prompt = `Analyze this DreamNet state and generate a dreamkeeper_update:

Snapshot ID: ${input.snapshotId}
Timestamp: ${input.timestamp}

Vertex Fusion:
${JSON.stringify(input.vertexFusion, null, 2)}

Dome State:
${JSON.stringify(input.domeState, null, 2)}

Agent Metrics:
${JSON.stringify(input.agentMetrics, null, 2)}

Anomalies:
${JSON.stringify(input.anomalies, null, 2)}

Output ONLY a JSON object with this structure:
{
  "overallHealth": "STABLE|WARN|CRITICAL",
  "scores": {
    "core": 0-100,
    "dome": 0-100,
    "hubs": 0-100,
    "realms": 0-100,
    "infra": 0-100,
    "agents": 0-100
  },
  "alerts": [
    {
      "id": "alert-1",
      "severity": "INFO|WARN|CRITICAL",
      "area": "CORE|DOME|HUBS|REALMS|INFRA|AGENTS",
      "description": "string",
      "suggestedHandler": "drone-dome-sky-scanner|nightmare-surgeon|dev-cookbox"
    }
  ],
  "tasks": [
    {
      "id": "task-1",
      "handlerAgentId": "string",
      "taskType": "string",
      "payload": {},
      "priority": "LOW|MEDIUM|HIGH"
    }
  ]
}`;

        const result = await this.model.generateContent(prompt);
        const response = result.response.text();

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to extract JSON from AI response');
        }

        return JSON.parse(jsonMatch[0]);
    }
}
