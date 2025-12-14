/**
 * LangChain Agent Executor Integration
 * 
 * Wraps LangChain agent patterns for DreamNet agent execution
 */

import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import type { StructuredTool } from "@langchain/core/tools";
import type { BaseMessage } from "@langchain/core/messages";

export interface LangChainAgentConfig {
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: StructuredTool[];
  systemPrompt?: string;
  memory?: boolean;
}

/**
 * LangChain Agent Executor - Wraps LangChain agent execution patterns
 */
export class LangChainAgentExecutor {
  private executor: AgentExecutor | null = null;
  private config: LangChainAgentConfig;
  private llm: ChatOpenAI | null = null;

  constructor(config: LangChainAgentConfig = {}) {
    this.config = {
      modelName: config.modelName || "gpt-4",
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens,
      tools: config.tools || [],
      systemPrompt: config.systemPrompt || "You are a helpful AI agent.",
      memory: config.memory ?? true,
    };
  }

  /**
   * Initialize the agent executor
   */
  async initialize(): Promise<void> {
    try {
      // Initialize LLM
      this.llm = new ChatOpenAI({
        modelName: this.config.modelName,
        temperature: this.config.temperature,
        maxTokens: this.config.maxTokens,
      });

      // Create prompt template
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", this.config.systemPrompt!],
        ["human", "{input}"],
        new MessagesPlaceholder("agent_scratchpad"),
      ]);

      // Create agent
      const agent = await createOpenAIFunctionsAgent({
        llm: this.llm,
        tools: this.config.tools || [],
        prompt,
      });

      // Create executor
      this.executor = new AgentExecutor({
        agent,
        tools: this.config.tools || [],
        verbose: true,
        maxIterations: 15,
      });

      console.log("[LangChainAgentExecutor] Initialized successfully");
    } catch (error: any) {
      console.error("[LangChainAgentExecutor] Initialization failed:", error.message);
      throw error;
    }
  }

  /**
   * Execute agent with input
   */
  async execute(input: string): Promise<{
    output: string;
    intermediateSteps?: any[];
    error?: string;
  }> {
    if (!this.executor) {
      await this.initialize();
    }

    try {
      const result = await this.executor!.invoke({
        input,
      });

      return {
        output: result.output,
        intermediateSteps: result.intermediateSteps,
      };
    } catch (error: any) {
      return {
        output: "",
        error: error.message || "Agent execution failed",
      };
    }
  }

  /**
   * Stream agent execution
   */
  async *stream(input: string): AsyncGenerator<string, void, unknown> {
    if (!this.executor) {
      await this.initialize();
    }

    try {
      const stream = await this.executor!.stream({
        input,
      });

      for await (const chunk of stream) {
        if (chunk.agent?.messages) {
          for (const message of chunk.agent.messages) {
            if (message.content) {
              yield String(message.content);
            }
          }
        }
        if (chunk.tools) {
          yield `[Tool: ${chunk.tools.name}]`;
        }
      }
    } catch (error: any) {
      yield `[Error: ${error.message}]`;
    }
  }

  /**
   * Add tool to agent
   */
  addTool(tool: StructuredTool): void {
    this.config.tools = [...(this.config.tools || []), tool];
    // Reinitialize if already initialized
    if (this.executor) {
      this.initialize().catch((err) => {
        console.error("[LangChainAgentExecutor] Failed to reinitialize with new tool:", err);
      });
    }
  }

  /**
   * Get agent status
   */
  getStatus(): {
    initialized: boolean;
    toolCount: number;
    modelName: string;
  } {
    return {
      initialized: this.executor !== null,
      toolCount: this.config.tools?.length || 0,
      modelName: this.config.modelName || "unknown",
    };
  }
}

