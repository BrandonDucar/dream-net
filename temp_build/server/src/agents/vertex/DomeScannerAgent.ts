import { Agent, AgentInvocationContext } from '../core/types';
import { VertexFusion } from './VertexCoreAgent';

export interface DomeUpdate {
    source_timestamp: string;
    overall_dome_status: string;
    ring1_actions: Action[];
    ring2_actions: Action[];
    ring3_actions: Action[];
    alerts: Alert[];
}

interface Action {
    command: string;
    parameters: Record<string, any>;
    reason: string;
}

interface Alert {
    id: string;
    ring: 1 | 2 | 3;
    severity: 'INFO' | 'WARN' | 'CRITICAL';
    description: string;
}

export class DomeScannerAgent implements Agent<VertexFusion, DomeUpdate> {
    id = 'drone-dome-sky-scanner' as const;
    name = 'Drone Dome Sky Scanner';
    description = 'Analyzes vertex_fusion and generates dome control actions';
    category = 'analysis' as const;
    version = '1.0.0';

    private genAI?: any;
    private model?: any;

    async initialize(): Promise<void> {
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
            console.warn('⚠️ GOOGLE_AI_API_KEY not set, Dome Scanner will be disabled');
            return;
        }

        try {
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({
                model: 'gemini-pro',
                systemInstruction: `You are Agent 2: the Drone Dome Sky Scanner.
You read vertex_fusion JSON and generate precise dome control actions.
Output ONLY valid JSON in the specified format.`,
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 8192,
                }
            });
        } catch (error) {
            console.error('Failed to initialize Dome Scanner:', error);
        }
    }

    async run(vertexFusion: VertexFusion, ctx: AgentInvocationContext): Promise<DomeUpdate> {
        if (!this.model) {
            // Return stub data if not initialized
            return {
                source_timestamp: vertexFusion.timestamp,
                overall_dome_status: 'stable',
                ring1_actions: [],
                ring2_actions: [],
                ring3_actions: [],
                alerts: []
            };
        }

        const prompt = `Analyze this vertex_fusion and generate drone_dome_update JSON:

${JSON.stringify(vertexFusion, null, 2)}

Output ONLY a JSON object with this structure:
{
  "source_timestamp": "${vertexFusion.timestamp}",
  "overall_dome_status": "string",
  "ring1_actions": [
    { "command": "INCREASE_ANCHOR_SUPPORT", "parameters": {}, "reason": "string" }
  ],
  "ring2_actions": [
    { "command": "REPOSITION_SWARM", "parameters": {}, "reason": "string" }
  ],
  "ring3_actions": [
    { "command": "DAMPEN_HARMONIC_BAND", "parameters": {}, "reason": "string" }
  ],
  "alerts": [
    { "id": "alert-1", "ring": 1, "severity": "INFO", "description": "string" }
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


export interface DomeUpdate {
    source_timestamp: string;
    overall_dome_status: string;
    ring1_actions: Action[];
    ring2_actions: Action[];
    ring3_actions: Action[];
    alerts: Alert[];
}

interface Action {
    command: string;
    parameters: Record<string, any>;
    reason: string;
}

interface Alert {
    id: string;
    ring: 1 | 2 | 3;
    severity: 'INFO' | 'WARN' | 'CRITICAL';
    description: string;
}

export class DomeScannerAgent implements AgentDefinition<VertexFusion, DomeUpdate> {
    id = 'dome-scanner' as const;
    name = 'Drone Dome Sky Scanner';
    description = 'Analyzes vertex_fusion and generates dome control actions';
    category = 'analysis' as const;
    version = '1.0.0';

    private genAI?: any;
    private model?: any;

    async initialize(): Promise<void> {
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
            console.warn('⚠️ GOOGLE_AI_API_KEY not set, Dome Scanner will be disabled');
            return;
        }

        try {
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({
                model: 'gemini-pro',
                systemInstruction: `You are Agent 2: the Drone Dome Sky Scanner.
You read vertex_fusion JSON and generate precise dome control actions.
Output ONLY valid JSON in the specified format.`,
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 8192,
                }
            });
        } catch (error) {
            console.error('Failed to initialize Dome Scanner:', error);
        }
    }

    async run(vertexFusion: VertexFusion, ctx: AgentContext): Promise<DomeUpdate> {
        if (!this.model) {
            throw new Error('Dome Scanner not initialized - missing GOOGLE_AI_API_KEY');
        }

        const prompt = `Analyze this vertex_fusion and generate drone_dome_update JSON:

${JSON.stringify(vertexFusion, null, 2)}

Output ONLY a JSON object with this structure:
{
  "source_timestamp": "${vertexFusion.timestamp}",
  "overall_dome_status": "string",
  "ring1_actions": [
    { "command": "INCREASE_ANCHOR_SUPPORT", "parameters": {}, "reason": "string" }
  ],
  "ring2_actions": [
    { "command": "REPOSITION_SWARM", "parameters": {}, "reason": "string" }
  ],
  "ring3_actions": [
    { "command": "DAMPEN_HARMONIC_BAND", "parameters": {}, "reason": "string" }
  ],
  "alerts": [
    { "id": "alert-1", "ring": 1, "severity": "INFO", "description": "string" }
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

    async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
        if (!this.model) {
            return { healthy: false, message: 'Not initialized' };
        }
        return { healthy: true };
    }
}
