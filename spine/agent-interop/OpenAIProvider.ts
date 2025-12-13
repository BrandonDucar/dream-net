/**
 * OpenAI Provider - Full implementation for OpenAI agent integration
 * 
 * Integrates OpenAI's Agents SDK (@openai/agents) and standard OpenAI SDK
 * with DreamNet's Interop Spine.
 * 
 * Usage:
 * 1. Install: pnpm add @openai/agents openai
 * 2. Set OPENAI_API_KEY in environment
 * 3. Register provider in AgentInteropRegistry
 */

import type { ProviderDescriptor } from "./ProviderDescriptor.js";
import type { AgentInteropRequest, AgentInteropResponse } from "./AgentInteropTypes.js";

// Dynamic imports to handle optional dependencies
let OpenAI: any = null;
let Agent: any = null;
let Runner: any = null;

try {
  OpenAI = require('openai').default || require('openai');
} catch {
  // OpenAI SDK not installed
}

try {
  const agentsModule = require('@openai/agents');
  Agent = agentsModule.Agent;
  Runner = agentsModule.Runner;
} catch {
  // Agents SDK not installed
}

/**
 * OpenAI Provider - Integrates OpenAI Agents SDK and OpenAI SDK with DreamNet
 * 
 * Supports:
 * - OpenAI Agents SDK (@openai/agents) for agentic workflows
 * - OpenAI SDK (openai) for standard API calls
 * - Tool integration with DreamNet systems
 */
export class OpenAIProvider {
  private descriptor: ProviderDescriptor;
  private initialized: boolean = false;
  private client: any = null;
  private agent: any = null;
  private useAgentsSDK: boolean = false;

  constructor(descriptor: ProviderDescriptor) {
    this.descriptor = descriptor;
    this.useAgentsSDK = descriptor.config?.useAgentsSDK === true;
  }

  /**
   * Initialize provider
   */
  async initialize(): Promise<void> {
    const apiKey = (this.descriptor.auth?.config?.apiKey as string) || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error("OpenAI API key required. Set OPENAI_API_KEY environment variable or provide in descriptor.auth.config.apiKey");
    }

    if (!OpenAI) {
      throw new Error("OpenAI SDK not installed. Run: pnpm add openai");
    }

    // Initialize OpenAI client
    this.client = new OpenAI({ apiKey });

    // Verify connection
    try {
      await this.client.models.list();
      console.log("✅ [OpenAI Provider] Initialized successfully");
    } catch (error: any) {
      throw new Error(`OpenAI initialization failed: ${error.message}`);
    }

    // Initialize Agents SDK if requested and available
    if (this.useAgentsSDK) {
      if (!Agent || !Runner) {
        console.warn("⚠️ [OpenAI Provider] Agents SDK requested but not installed. Run: pnpm add @openai/agents");
        console.warn("⚠️ [OpenAI Provider] Falling back to standard OpenAI SDK");
        this.useAgentsSDK = false;
      } else {
        // Create default agent
        this.agent = new Agent({
          name: this.descriptor.name || "DreamNet Agent",
          instructions: this.descriptor.config?.instructions || "You are a DreamNet agent assistant that helps users create, manage, and deploy dreams.",
          model: this.descriptor.config?.model || "gpt-4o",
          tools: this.descriptor.config?.tools || []
        });
        console.log("✅ [OpenAI Provider] Agents SDK initialized");
      }
    }

    this.initialized = true;
  }

  /**
   * Execute agent task using OpenAI SDK or Agents SDK
   */
  async executeTask(task: AgentInteropRequest): Promise<AgentInteropResponse> {
    if (!this.initialized || !this.client) {
      throw new Error("Provider not initialized. Call initialize() first.");
    }

    try {
      // Use Agents SDK if available and enabled
      if (this.useAgentsSDK && this.agent && Runner) {
        return await this.executeTaskWithAgent(task);
      }

      // Fall back to standard OpenAI SDK
      return await this.executeTaskWithSDK(task);
    } catch (error: any) {
      return {
        requestId: task.id,
        agentId: this.descriptor.id,
        status: "error",
        error: {
          code: error.code || "EXECUTION_ERROR",
          message: error.message || "Task execution failed"
        },
        timestamp: Date.now()
      };
    }
  }

  /**
   * Execute task (simplified interface)
   */
  async execute(input: string | Record<string, unknown>): Promise<string> {
    const task: AgentInteropRequest = {
      id: `task-${Date.now()}`,
      sourceAgent: "user",
      type: "task",
      payload: typeof input === 'string' ? { message: input } : input,
      timestamp: Date.now()
    };

    const result = await this.executeTask(task);
    
    if (result.status === "error") {
      throw new Error(result.error?.message || "Task execution failed");
    }

    return typeof result.payload?.content === 'string' 
      ? result.payload.content 
      : JSON.stringify(result.payload);
  }

  /**
   * Execute task using standard OpenAI SDK
   */
  private async executeTaskWithSDK(task: AgentInteropRequest): Promise<AgentInteropResponse> {
    const model = (this.descriptor.config?.model as string) || "gpt-4o";
    const systemMessage = (this.descriptor.config?.systemMessage as string) || "You are a DreamNet agent assistant.";
    
    // Extract user content from payload
    let userContent: string;
    if (typeof task.payload === 'string') {
      userContent = task.payload;
    } else if (task.payload.message) {
      userContent = String(task.payload.message);
    } else {
      userContent = JSON.stringify(task.payload);
    }

    const response = await this.client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userContent }
      ],
      temperature: this.descriptor.config?.temperature || 0.7,
      max_tokens: this.descriptor.config?.maxTokens || 2000
    });

    return {
      requestId: task.id,
      agentId: this.descriptor.id,
      status: "success",
      payload: {
        content: response.choices[0]?.message?.content,
        model: response.model,
        usage: response.usage,
        finishReason: response.choices[0]?.finish_reason
      },
      timestamp: Date.now()
    };
  }

  /**
   * Execute task using OpenAI Agents SDK
   */
  async executeTaskWithAgent(task: AgentInteropRequest): Promise<AgentInteropResponse> {
    if (!this.agent || !Runner) {
      throw new Error("Agents SDK not available. Install @openai/agents or disable useAgentsSDK");
    }

    // Extract user input from payload
    let userInput: string;
    if (typeof task.payload === 'string') {
      userInput = task.payload;
    } else if (task.payload.message) {
      userInput = String(task.payload.message);
    } else {
      userInput = JSON.stringify(task.payload);
    }

    const result = await Runner.run(this.agent, userInput);

    return {
      requestId: task.id,
      agentId: this.descriptor.id,
      status: "success",
      payload: {
        result: result,
        agentName: this.agent.name
      },
      timestamp: Date.now()
    };
  }

  /**
   * Create a new agent with custom configuration
   */
  createAgent(config: {
    name: string;
    instructions: string;
    model?: string;
    tools?: any[];
  }): void {
    if (!Agent) {
      throw new Error("Agents SDK not installed. Run: pnpm add @openai/agents");
    }

    this.agent = new Agent({
      name: config.name,
      instructions: config.instructions,
      model: config.model || "gpt-4o",
      tools: config.tools || []
    });

    this.useAgentsSDK = true;
    console.log(`✅ [OpenAI Provider] Created agent: ${config.name}`);
  }

  /**
   * Get provider capabilities
   */
  getCapabilities(): string[] {
    const base = this.descriptor.capabilities || ["chat", "completions"];
    if (this.useAgentsSDK && Agent) {
      return [...base, "agents", "tools", "workflows"];
    }
    return base;
  }

  /**
   * Check if provider is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get the OpenAI client (for advanced usage)
   */
  getClient(): any {
    return this.client;
  }

  /**
   * Get the agent instance (if using Agents SDK)
   */
  getAgent(): any {
    return this.agent;
  }
}
