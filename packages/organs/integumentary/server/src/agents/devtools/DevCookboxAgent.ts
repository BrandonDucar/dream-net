import { Agent, AgentInvocationContext } from '../core/types';

export interface DevCookboxInput {
    intent: string;
    contextSummary?: string;
    targetLayer?: 'agent' | 'miniapp' | 'route' | 'config' | 'other';
}

export interface DevCookboxOutput {
    summary: string;
    files: Array<{
        path: string;
        description: string;
        contents: string;
    }>;
    steps: string[];
}

export class DevCookboxAgent implements Agent<DevCookboxInput, DevCookboxOutput> {
    id = 'dreamdev-cookbox' as const;
    name = 'DreamDev Cookbox';
    description = 'Dev recipe agent that generates DreamNet-style code scaffolds and file patches';
    category = 'utility' as const;
    version = '1.0.0';

    private genAI?: any;
    private model?: any;

    async initialize(): Promise<void> {
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
            console.warn('⚠️ GOOGLE_AI_API_KEY not set, Dev Cookbox will be disabled');
            return;
        }

        try {
            const { GoogleGenerativeAI } = await import('@google/generative-ai');
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({
                model: 'gemini-pro',
                systemInstruction: `You are DreamDev Cookbox: the code generation agent for DreamNet.
You generate TypeScript code, API routes, and configuration following DreamNet v13 patterns.
Output ONLY valid JSON in the dev_cookbox_output format.`,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 8192,
                }
            });
        } catch (error) {
            console.error('Failed to initialize Dev Cookbox:', error);
        }
    }

    async run(input: DevCookboxInput, ctx: AgentInvocationContext): Promise<DevCookboxOutput> {
        if (!this.model) {
            // Return stub data if not initialized
            return {
                summary: 'AI not initialized - cannot generate code',
                files: [],
                steps: []
            };
        }

        const prompt = `Generate DreamNet v13 code for this dev intent:

Intent: ${input.intent}
Context: ${input.contextSummary || 'N/A'}
Target Layer: ${input.targetLayer || 'unknown'}

Follow DreamNet v13 patterns:
- Agent Core: types.ts, registry.ts, executor.ts
- Agents: implement Agent<TInput, TOutput> interface
- DreamHub: mini apps that call runAgent()
- Routes: /api/dreamhub/miniapps, /api/dreamhub/run

Output ONLY a JSON object with this structure:
{
  "summary": "string",
  "files": [
    {
      "path": "server/agents/newAgent.ts",
      "description": "string",
      "contents": "// TypeScript code here"
    }
  ],
  "steps": [
    "1. Create the agent file",
    "2. Register in bootstrap.ts",
    "3. Add mini app entry"
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
