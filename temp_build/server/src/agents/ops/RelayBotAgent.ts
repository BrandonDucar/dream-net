import { Agent, AgentInvocationContext } from '../core/types';

export interface RelayBotInput {
    target: string;
    purpose: string;
    tone: string;
    keyPoints: string[];
    channel: 'EMAIL' | 'SMS' | 'TELEGRAM' | 'X';
}

export interface RelayBotOutput {
    relaybot_plan: {
        messages: Array<{
            channel: string;
            recipient: string;
            subject?: string;
            body: string;
            status: 'DRAFT' | 'READY';
        }>;
    };
}

export class RelayBotAgent implements Agent<RelayBotInput, RelayBotOutput> {
    id = 'relaybot-dispatcher' as const;
    name = 'RelayBot Dispatcher';
    description = 'Formats messages for people across channels';
    category = 'action' as const;
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
                systemInstruction: `You are RelayBot: the message dispatcher for DreamNet.
Format messages based on intent, tone, and channel.
Output ONLY valid JSON in the relaybot_plan format.`,
            });
        } catch (error) {
            console.error('Failed to initialize RelayBot:', error);
        }
    }

    async run(input: RelayBotInput, ctx: AgentInvocationContext): Promise<RelayBotOutput> {
        if (!this.model) {
            return {
                relaybot_plan: {
                    messages: [{
                        channel: input.channel,
                        recipient: input.target,
                        subject: `Message regarding ${input.purpose}`,
                        body: `[Stub] ${input.keyPoints.join(', ')}`,
                        status: 'DRAFT'
                    }]
                }
            };
        }

        const prompt = `Draft a message:
Target: ${input.target}
Purpose: ${input.purpose}
Tone: ${input.tone}
Channel: ${input.channel}
Key Points: ${JSON.stringify(input.keyPoints)}

Output ONLY JSON:
{
  "relaybot_plan": {
    "messages": [
      { "channel": "${input.channel}", "recipient": "${input.target}", "subject": "...", "body": "...", "status": "READY" }
    ]
  }
}`;

        const result = await this.model.generateContent(prompt);
        const response = result.response.text();
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { relaybot_plan: { messages: [] } };
    }
}
