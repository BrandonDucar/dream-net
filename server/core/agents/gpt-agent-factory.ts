/**
 * GPT Agent Factory
 * 
 * Creates DreamNet agents from Custom GPT registry entries.
 * Each GPT becomes a fully functional DreamNet agent using OpenAI's Assistants API.
 */

import type { Agent, AgentContext, AgentResult } from "../types";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// Dynamic imports
let OpenAI: any = null;
try {
  OpenAI = require('openai').default || require('openai');
} catch {
  // OpenAI SDK not installed
}

export interface CustomGPT {
  name: string;
  link: string | null;
  category: string;
  purpose: string;
  status: "Active" | "Draft";
  date_added: string;
}

/**
 * Create a DreamNet agent from a Custom GPT
 */
export function createGPTAgent(gpt: CustomGPT): Agent {
  const agentId = `gpt-${gpt.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  
  return {
    name: agentId,
    description: `${gpt.purpose} (${gpt.category})`,
    
    async run(ctx: AgentContext, input: unknown): Promise<AgentResult> {
      ctx.log(`[${gpt.name}] Starting...`);

      if (!OpenAI) {
        return {
          ok: false,
          agent: agentId,
          result: { error: "OpenAI SDK not installed. Run: pnpm add openai" },
          messages: ["Install openai package"]
        };
      }

      if (!process.env.OPENAI_API_KEY) {
        return {
          ok: false,
          agent: agentId,
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

        ctx.log(`[${gpt.name}] Processing task: ${task.substring(0, 100)}...`);

        // Create or retrieve assistant
        const assistantId = (input as any)?.assistantId || await getOrCreateAssistant(openai, gpt);
        
        // Create thread
        const thread = await openai.beta.threads.create();

        // Add message
        await openai.beta.threads.messages.create(thread.id, {
          role: "user",
          content: task
        });

        // Run assistant
        const run = await openai.beta.threads.runs.create(thread.id, {
          assistant_id: assistantId
        });

        // Wait for completion
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        let attempts = 0;
        while ((runStatus.status === 'queued' || runStatus.status === 'in_progress') && attempts < 60) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
          attempts++;
        }

        // Get messages
        const messages = await openai.beta.threads.messages.list(thread.id);
        const assistantMessage = messages.data.find(m => m.role === 'assistant');

        const response = assistantMessage?.content[0]?.type === 'text' 
          ? assistantMessage.content[0].text.value 
          : JSON.stringify(assistantMessage?.content);

        return {
          ok: runStatus.status === 'completed',
          agent: agentId,
          result: {
            gptName: gpt.name,
            category: gpt.category,
            assistantId,
            threadId: thread.id,
            runId: run.id,
            response,
            status: runStatus.status
          },
          messages: [`${gpt.name} ${runStatus.status}`]
        };
      } catch (error: any) {
        ctx.log(`[${gpt.name}] Error: ${error.message}`);
        return {
          ok: false,
          agent: agentId,
          result: { error: error.message },
          messages: [`Error: ${error.message}`]
        };
      }
    },
  };
}

/**
 * Get or create OpenAI Assistant for a GPT
 */
async function getOrCreateAssistant(openai: any, gpt: CustomGPT): Promise<string> {
  // Try to find existing assistant by name
  const assistants = await openai.beta.assistants.list({ limit: 100 });
  const existing = assistants.data.find((a: any) => a.name === gpt.name);
  
  if (existing) {
    return existing.id;
  }

  // Create new assistant
  const assistant = await openai.beta.assistants.create({
    name: gpt.name,
    instructions: buildInstructions(gpt),
    model: "gpt-4o",
    tools: getToolsForCategory(gpt.category),
  });

  return assistant.id;
}

/**
 * Build instructions for GPT assistant
 */
function buildInstructions(gpt: CustomGPT): string {
  return `You are ${gpt.name}, a DreamNet agent specialized in: ${gpt.purpose}

Category: ${gpt.category}
Status: ${gpt.status}

You are integrated into DreamNet, a biomimetic agent orchestration platform. You can:
- Execute tasks autonomously
- Communicate with other DreamNet agents
- Access DreamNet systems and APIs
- Create and manage dreams

Your specific purpose: ${gpt.purpose}

Be helpful, precise, and action-oriented. When you need to interact with DreamNet systems, use the available tools.`;
}

/**
 * Get tools for GPT category
 */
function getToolsForCategory(category: string): any[] {
  const tools: any[] = [
    {
      type: "code_interpreter"
    }
  ];

  // Add function calling for specific categories
  if (category === "Core" || category === "Atlas" || category === "Automation") {
    tools.push({
      type: "function",
      function: {
        name: "execute_dreamnet_action",
        description: "Execute an action in DreamNet",
        parameters: {
          type: "object",
          properties: {
            action: { type: "string", description: "Action to execute" },
            params: { type: "object", description: "Action parameters" }
          },
          required: ["action"]
        }
      }
    });
  }

  return tools;
}

/**
 * Load all GPTs from registry and create agents
 */
export function loadAllGPTAgents(): Agent[] {
  const agents: Agent[] = [];
  
  try {
    const registryPath = join(process.cwd(), "registry.json");
    if (!existsSync(registryPath)) {
      console.warn(`⚠️ [GPT Agent Factory] registry.json not found at ${registryPath}`);
      return agents;
    }

    const registryData = JSON.parse(readFileSync(registryPath, "utf-8"));
    const gpts = registryData as CustomGPT[];

    // Only create agents for Active GPTs
    const activeGPTs = gpts.filter(gpt => gpt.status === "Active");
    
    for (const gpt of activeGPTs) {
      try {
        const agent = createGPTAgent(gpt);
        agents.push(agent);
      } catch (error: any) {
        console.warn(`⚠️ [GPT Agent Factory] Failed to create agent for ${gpt.name}: ${error.message}`);
      }
    }

    console.log(`✅ [GPT Agent Factory] Created ${agents.length} agents from ${activeGPTs.length} Active GPTs`);
  } catch (error: any) {
    console.error(`❌ [GPT Agent Factory] Failed to load GPTs: ${error.message}`);
  }

  return agents;
}

