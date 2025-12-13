/**
 * OpenAI Code Agent
 * Specialized agent for code generation and analysis
 */

import type { Agent, AgentContext, AgentResult } from "../types";

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

export const OpenAICodeAgent: Agent = {
  name: "openai-code-agent",
  description: "OpenAI agent specialized for code generation, analysis, and debugging",
  
  async run(ctx: AgentContext, input: unknown): Promise<AgentResult> {
    ctx.log("[OpenAI Code] Starting...");

    if (!Agent || !Runner || !OpenAI) {
      return {
        ok: false,
        agent: "openai-code-agent",
        result: { error: "OpenAI Agents SDK not installed. Run: pnpm add @openai/agents openai" },
        messages: ["Install @openai/agents and openai packages"]
      };
    }

    if (!process.env.OPENAI_API_KEY) {
      return {
        ok: false,
        agent: "openai-code-agent",
        result: { error: "OPENAI_API_KEY not set" },
        messages: ["Set OPENAI_API_KEY environment variable"]
      };
    }

    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      // Extract code task
      const task = typeof input === 'string' 
        ? input 
        : typeof input === 'object' && input !== null && 'task' in input
        ? String((input as any).task)
        : JSON.stringify(input);

      const codeContext = typeof input === 'object' && input !== null && 'code' in input
        ? String((input as any).code)
        : undefined;

      ctx.log(`[OpenAI Code] Processing code task...`);

      // Create code-focused agent
      const agent = new Agent({
        name: "DreamNet Code Agent",
        instructions: `You are a DreamNet code agent specialized in:
- Code generation (TypeScript, JavaScript, Solidity)
- Code analysis and review
- Debugging and fixing errors
- Refactoring and optimization
- Architecture suggestions

You work with DreamNet's codebase which uses:
- TypeScript/Node.js
- Solidity for smart contracts
- Express.js for backend
- React/Vite for frontend
- pnpm workspaces

Be precise, follow best practices, and provide working code.`,
        model: "gpt-4o",
        tools: [
          // Code execution tools can be added here
        ]
      });

      // Build prompt with code context if provided
      const fullPrompt = codeContext 
        ? `Code Context:\n\`\`\`typescript\n${codeContext}\n\`\`\`\n\nTask: ${task}`
        : task;

      // Run the agent
      const result = await Runner.run(agent, fullPrompt);

      return {
        ok: true,
        agent: "openai-code-agent",
        result: {
          output: result,
          agentName: agent.name,
          model: "gpt-4o",
          codeContext: codeContext ? "provided" : "none"
        },
        messages: ["Code agent completed successfully"]
      };
    } catch (error: any) {
      ctx.log(`[OpenAI Code] Error: ${error.message}`);
      return {
        ok: false,
        agent: "openai-code-agent",
        result: { error: error.message },
        messages: [`Error: ${error.message}`]
      };
    }
  },
};

