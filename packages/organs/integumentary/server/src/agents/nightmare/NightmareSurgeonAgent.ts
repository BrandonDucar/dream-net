import { Agent, AgentInvocationContext } from '../core/types';

export interface NightmareSurgeonInput {
    sourceSnapshotId: string;
    anomalies: Array<{
        id: string;
        area: string;
        severity: 'WARN' | 'CRITICAL';
        description: string;
        relatedData?: any;
    }>;
}

export interface NightmareSurgeonOutput {
    summary: string;
    plans: Array<{
        anomalyId: string;
        planId: string;
        severity: 'WARN' | 'CRITICAL';
        steps: Array<{
            stepId: string;
            description: string;
            handlerAgentId?: string;
            actionCode: string;
        }>;
    }>;
    recommendedExecutionOrder: string[];
}

export class NightmareSurgeonAgent implements Agent<NightmareSurgeonInput, NightmareSurgeonOutput> {
    id = 'nightmare-surgeon' as const;
    name = 'Nightmare Surgeon';
    description = 'Plans remediation sequences for anomalies and infected dreams within DreamNet';
    category = 'action' as const;
    version = '1.0.0';

    private genAI?: any;
    private model?: any;

    async initialize(): Promise<void> {
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
            console.warn('⚠️ GOOGLE_AI_API_KEY not set, Nightmare Surgeon will be disabled');
            return;
        }

        try {
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({
                model: 'gemini-pro',
                systemInstruction: `You are Nightmare Surgeon: the remediation planner for DreamNet.
You analyze anomalies and generate step-by-step healing plans.
Output ONLY valid JSON in the nightmare_surgeon_plan format.`,
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 8192,
                }
            });
        } catch (error) {
            console.error('Failed to initialize Nightmare Surgeon:', error);
        }
    }

    async run(input: NightmareSurgeonInput, ctx: AgentInvocationContext): Promise<NightmareSurgeonOutput> {
        if (!this.model) {
            // Return stub data if not initialized
            return {
                summary: 'No anomalies detected or AI not initialized',
                plans: [],
                recommendedExecutionOrder: []
            };
        }

        const prompt = `Analyze these anomalies and generate remediation plans:

Snapshot ID: ${input.sourceSnapshotId}

Anomalies:
${JSON.stringify(input.anomalies, null, 2)}

Output ONLY a JSON object with this structure:
{
  "summary": "string",
  "plans": [
    {
      "anomalyId": "string",
      "planId": "plan-1",
      "severity": "WARN|CRITICAL",
      "steps": [
        {
          "stepId": "step-1",
          "description": "string",
          "handlerAgentId": "drone-dome-sky-scanner|dev-cookbox",
          "actionCode": "REDISTRIBUTE_LOAD|PATCH_SCHEMA"
        }
      ]
    }
  ],
  "recommendedExecutionOrder": ["plan-1", "plan-2"]
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
