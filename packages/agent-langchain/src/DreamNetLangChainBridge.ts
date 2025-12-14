/**
 * DreamNet LangChain Bridge
 * 
 * Bridges DreamNet agent execution to LangChain patterns
 */

import { LangChainAgentExecutor } from "./LangChainAgentExecutor.js";
import type { StructuredTool } from "@langchain/core/tools";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export interface DreamNetAgent {
  id: string;
  name: string;
  description: string;
  tools?: DreamNetTool[];
  systemPrompt?: string;
}

export interface DreamNetTool {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: Record<string, any>) => Promise<any>;
}

/**
 * Convert DreamNet tools to LangChain tools
 */
export function convertDreamNetToolsToLangChain(
  tools: DreamNetTool[]
): StructuredTool[] {
  return tools.map((tool) => {
    // Convert parameters to Zod schema
    const schema = z.object(
      Object.fromEntries(
        Object.entries(tool.parameters).map(([key, value]) => [
          key,
          inferZodType(value),
        ])
      )
    );

    return new DynamicStructuredTool({
      name: tool.name,
      description: tool.description,
      schema,
      func: async (params: Record<string, any>) => {
        return await tool.execute(params);
      },
    });
  });
}

/**
 * Infer Zod type from parameter definition
 */
function inferZodType(param: any): z.ZodTypeAny {
  if (param.type === "string") {
    return z.string();
  }
  if (param.type === "number") {
    return z.number();
  }
  if (param.type === "boolean") {
    return z.boolean();
  }
  if (param.type === "array") {
    return z.array(z.any());
  }
  if (param.type === "object") {
    return z.record(z.any());
  }
  return z.any();
}

/**
 * DreamNet LangChain Bridge
 * 
 * Bridges DreamNet agent system to LangChain execution patterns
 */
export class DreamNetLangChainBridge {
  private executors: Map<string, LangChainAgentExecutor> = new Map();

  /**
   * Create or get executor for agent
   */
  private getOrCreateExecutor(agent: DreamNetAgent): LangChainAgentExecutor {
    if (this.executors.has(agent.id)) {
      return this.executors.get(agent.id)!;
    }

    const tools = agent.tools
      ? convertDreamNetToolsToLangChain(agent.tools)
      : [];

    const executor = new LangChainAgentExecutor({
      modelName: "gpt-4",
      temperature: 0.7,
      tools,
      systemPrompt:
        agent.systemPrompt ||
        `You are ${agent.name}. ${agent.description}`,
    });

    this.executors.set(agent.id, executor);
    return executor;
  }

  /**
   * Execute DreamNet agent using LangChain patterns
   */
  async executeAgent(
    agent: DreamNetAgent,
    input: string
  ): Promise<{
    output: string;
    intermediateSteps?: any[];
    error?: string;
  }> {
    const executor = this.getOrCreateExecutor(agent);
    await executor.initialize();
    return await executor.execute(input);
  }

  /**
   * Stream agent execution
   */
  async *streamAgentExecution(
    agent: DreamNetAgent,
    input: string
  ): AsyncGenerator<string, void, unknown> {
    const executor = this.getOrCreateExecutor(agent);
    await executor.initialize();
    yield* executor.stream(input);
  }

  /**
   * Add tool to agent
   */
  addToolToAgent(agentId: string, tool: DreamNetTool): void {
    const executor = this.executors.get(agentId);
    if (executor) {
      const langchainTool = convertDreamNetToolsToLangChain([tool])[0];
      executor.addTool(langchainTool);
    }
  }

  /**
   * Get agent status
   */
  getAgentStatus(agentId: string): {
    initialized: boolean;
    toolCount: number;
    modelName: string;
  } | null {
    const executor = this.executors.get(agentId);
    return executor?.getStatus() || null;
  }
}

