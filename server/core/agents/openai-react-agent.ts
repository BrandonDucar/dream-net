/**
 * OpenAI ReAct Agent
 * Uses OpenAI Agents SDK to create a reasoning + acting agent
 */

import type { Agent, AgentContext, AgentResult } from "../types";

// Dynamic import for OpenAI Agents SDK
let Agent: any = null;
let Runner: any = null;
let OpenAI: any = null;

try {
  const agentsModule = require('@openai/agents');
  Agent = agentsModule.Agent;
  Runner = agentsModule.Runner;
  OpenAI = require('openai').default || require('openai');
} catch {
  // SDKs not installed
}

export const OpenAIReActAgent: Agent = {
  name: "openai-react-agent",
  description: "OpenAI ReAct agent - Reasoning + Acting pattern using OpenAI Agents SDK",
  
  async run(ctx: AgentContext, input: unknown): Promise<AgentResult> {
    ctx.log("[OpenAI ReAct] Starting...");

    if (!Agent || !Runner || !OpenAI) {
      return {
        ok: false,
        agent: "openai-react-agent",
        result: { error: "OpenAI Agents SDK not installed. Run: pnpm add @openai/agents openai" },
        messages: ["Install @openai/agents and openai packages"]
      };
    }

    if (!process.env.OPENAI_API_KEY) {
      return {
        ok: false,
        agent: "openai-react-agent",
        result: { error: "OPENAI_API_KEY not set" },
        messages: ["Set OPENAI_API_KEY environment variable"]
      };
    }

    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      // Create ReAct agent
      const agent = new Agent({
        name: "DreamNet ReAct Agent",
        instructions: `You are a DreamNet agent that uses reasoning and acting to solve problems.

Reasoning + Acting (ReAct) Pattern:
1. Think: Analyze the problem and plan your approach
2. Act: Execute actions or use tools
3. Observe: Review the results
4. Repeat until solved

You help users create, manage, and deploy dreams in DreamNet.`,
        model: "gpt-4o",
        tools: [
          // Add DreamNet tools here
        ]
      });

      // Extract task from input
      const task = typeof input === 'string' 
        ? input 
        : typeof input === 'object' && input !== null && 'task' in input
        ? String((input as any).task)
        : JSON.stringify(input);

      ctx.log(`[OpenAI ReAct] Executing task: ${task}`);

      // Run the agent
      const result = await Runner.run(agent, task);

      return {
        ok: true,
        agent: "openai-react-agent",
        result: {
          output: result,
          agentName: agent.name,
          model: "gpt-4o"
        },
        messages: ["ReAct agent completed successfully"]
      };
    } catch (error: any) {
      ctx.log(`[OpenAI ReAct] Error: ${error.message}`);
      return {
        ok: false,
        agent: "openai-react-agent",
        result: { error: error.message },
        messages: [`Error: ${error.message}`]
      };
    }
  },
};

