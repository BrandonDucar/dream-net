import { Agent, AgentInvocationContext } from '../core/types';

export interface VertexCoreRequest {
    guardianStatus: any;
    agents: any[];
}

export interface VertexFusion {
    timestamp: string;
    overall_status: 'healthy' | 'degraded' | 'critical';
    integrity_metric: number;
    dome: {
        ring1_infra: { status: string; load: number };
        ring2_swarm: { efficiency: number; coverage: number };
        ring3_harmonics: { stability: number; latency_ms: number };
    };
    anomalies: Array<{
        type: string;
        severity: 'INFO' | 'WARN' | 'CRITICAL';
        description: string;
    }>;
}

export class VertexCoreAgent implements Agent<VertexCoreRequest, VertexFusion> {
    id = 'dreamnet-vertex-core' as const;
    name = 'DreamNet Vertex Core';
    description = 'Analyzes DreamNet state and produces vertex_fusion JSON';
    category = 'analysis' as const;
    version = '1.0.0';

    private genAI?: any;
    private model?: any;

    async initialize(): Promise<void> {
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
            console.warn('⚠️ GOOGLE_AI_API_KEY not set, Vertex Core will be disabled');
            return;
        }

        try {
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({
                model: 'gemini-pro',
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 8192,
                }
            });
        } catch (error) {
            console.error('Failed to initialize Vertex Core:', error);
        }
    }

    async run(input: VertexCoreRequest, ctx: AgentInvocationContext): Promise<VertexFusion> {
        if (!this.model) {
            // Return stub data if not initialized
            return {
                timestamp: new Date().toISOString(),
                overall_status: 'healthy',
                integrity_metric: 95,
                dome: {
                    ring1_infra: { status: 'stable', load: 45 },
                    ring2_swarm: { efficiency: 92, coverage: 88 },
                    ring3_harmonics: { stability: 94, latency_ms: 12 }
                },
                anomalies: []
            };
        }

        const prompt = `
You are Agent 1: DreamNet Vertex Core.

Analyze this DreamNet state and produce a vertex_fusion JSON:

Guardian Status:
${JSON.stringify(input.guardianStatus, null, 2)}

Agents (sample):
${JSON.stringify(input.agents.slice(0, 10), null, 2)}

Output ONLY a JSON object with this exact structure:
{
  "timestamp": "${new Date().toISOString()}",
  "overall_status": "healthy|degraded|critical",
  "integrity_metric": 0-100,
  "dome": {
    "ring1_infra": { "status": "stable|stressed|critical", "load": 0-100 },
    "ring2_swarm": { "efficiency": 0-100, "coverage": 0-100 },
    "ring3_harmonics": { "stability": 0-100, "latency_ms": number }
  },
  "anomalies": [
    { "type": "string", "severity": "INFO|WARN|CRITICAL", "description": "string" }
  ]
}
`;

        const result = await this.model.generateContent(prompt);
        const response = result.response.text();

        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to extract JSON from AI response');
        }

        return JSON.parse(jsonMatch[0]);
    }
}


export interface VertexCoreRequest {
    guardianStatus: any;
    agents: any[];
}

export interface VertexFusion {
    timestamp: string;
    overall_status: 'healthy' | 'degraded' | 'critical';
    integrity_metric: number;
    dome: {
        ring1_infra: { status: string; load: number };
        ring2_swarm: { efficiency: number; coverage: number };
        ring3_harmonics: { stability: number; latency_ms: number };
    };
    anomalies: Array<{
        type: string;
        severity: 'INFO' | 'WARN' | 'CRITICAL';
        description: string;
    }>;
}

export class VertexCoreAgent implements AgentDefinition<VertexCoreRequest, VertexFusion> {
    id = 'vertex-core' as const;
    name = 'DreamNet Vertex Core';
    description = 'Analyzes DreamNet state and produces vertex_fusion JSON';
    category = 'analysis' as const;
    version = '1.0.0';

    private genAI?: any;
    private model?: any;

    async initialize(): Promise<void> {
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
            console.warn('⚠️ GOOGLE_AI_API_KEY not set, Vertex Core will be disabled');
            return;
        }

        try {
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({
                model: 'gemini-pro',
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 8192,
                }
            });
        } catch (error) {
            console.error('Failed to initialize Vertex Core:', error);
        }
    }

    async run(request: VertexCoreRequest, ctx: AgentContext): Promise<VertexFusion> {
        if (!this.model) {
            throw new Error('Vertex Core not initialized - missing GOOGLE_AI_API_KEY');
        }

        const prompt = `
You are Agent 1: DreamNet Vertex Core.

Analyze this DreamNet state and produce a vertex_fusion JSON:

Guardian Status:
${JSON.stringify(request.guardianStatus, null, 2)}

Agents (sample):
${JSON.stringify(request.agents.slice(0, 10), null, 2)}

Output ONLY a JSON object with this exact structure:
{
  "timestamp": "${new Date().toISOString()}",
  "overall_status": "healthy|degraded|critical",
  "integrity_metric": 0-100,
  "dome": {
    "ring1_infra": { "status": "stable|stressed|critical", "load": 0-100 },
    "ring2_swarm": { "efficiency": 0-100, "coverage": 0-100 },
    "ring3_harmonics": { "stability": 0-100, "latency_ms": number }
  },
  "anomalies": [
    { "type": "string", "severity": "INFO|WARN|CRITICAL", "description": "string" }
  ]
}
`;

        const result = await this.model.generateContent(prompt);
        const response = result.response.text();

        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to extract JSON from AI response');
        }

        return JSON.parse(jsonMatch[0]);
    }

    async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
        if (!this.model) {
            return { healthy: false, message: 'Not initialized' };
        }
        return { healthy: true };
    }
}
