/**
 * OpenAI Assistant Agent
 * Uses OpenAI's Assistants API to create a persistent agent
 */

import type { Agent, AgentContext, AgentResult } from "../types";

let OpenAI: any = null;

try {
  OpenAI = require('openai').default || require('openai');
} catch {
  // SDK not installed
}

export const OpenAIAssistantAgent: Agent = {
  name: "openai-assistant-agent",
  description: "OpenAI Assistant agent using Assistants API",
  
  async run(ctx: AgentContext, input: unknown): Promise<AgentResult> {
    ctx.log("[OpenAI Assistant] Starting...");

    if (!OpenAI) {
      return {
        ok: false,
        agent: "openai-assistant-agent",
        result: { error: "OpenAI SDK not installed. Run: pnpm add openai" },
        messages: ["Install openai package"]
      };
    }

    if (!process.env.OPENAI_API_KEY) {
      return {
        ok: false,
        agent: "openai-assistant-agent",
        result: { error: "OPENAI_API_KEY not set" },
        messages: ["Set OPENAI_API_KEY environment variable"]
      };
    }

    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      // Extract task
      const task = typeof input === 'string' 
        ? input 
        : typeof input === 'object' && input !== null && 'task' in input
        ? String((input as any).task)
        : JSON.stringify(input);

      ctx.log(`[OpenAI Assistant] Creating assistant...`);

      // Create assistant (or reuse existing)
      const assistantId = (input as any)?.assistantId || process.env.OPENAI_ASSISTANT_ID;
      
      let assistant;
      if (assistantId) {
        // Use existing assistant
        assistant = await openai.beta.assistants.retrieve(assistantId);
        ctx.log(`[OpenAI Assistant] Using existing assistant: ${assistantId}`);
      } else {
        // Create new assistant
        assistant = await openai.beta.assistants.create({
          name: "DreamNet Assistant",
          instructions: `You are a DreamNet agent assistant. You help users:
- Create and manage dreams
- Deploy applications
- Analyze code and systems
- Provide technical guidance

Be helpful, concise, and action-oriented.`,
          model: "gpt-4o",
          tools: [
            {
              type: "code_interpreter"
            }
          ]
        });
        ctx.log(`[OpenAI Assistant] Created new assistant: ${assistant.id}`);
      }

      // Create thread
      const thread = await openai.beta.threads.create();

      // Add message
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: task
      });

      // Run assistant
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id
      });

      // Wait for completion
      let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      }

      // Get messages
      const messages = await openai.beta.threads.messages.list(thread.id);
      const assistantMessage = messages.data.find(m => m.role === 'assistant');

      return {
        ok: true,
        agent: "openai-assistant-agent",
        result: {
          assistantId: assistant.id,
          threadId: thread.id,
          runId: run.id,
          response: assistantMessage?.content[0]?.type === 'text' 
            ? assistantMessage.content[0].text.value 
            : JSON.stringify(assistantMessage?.content),
          status: runStatus.status
        },
        messages: [`Assistant ${runStatus.status}`]
      };
    } catch (error: any) {
      ctx.log(`[OpenAI Assistant] Error: ${error.message}`);
      return {
        ok: false,
        agent: "openai-assistant-agent",
        result: { error: error.message },
        messages: [`Error: ${error.message}`]
      };
    }
  },
};

