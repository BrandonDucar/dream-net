# Agent LangChain - Complete Documentation

**Package**: `@dreamnet/agent-langchain`  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

Agent LangChain provides **LangChain integration** for DreamNet agents, enabling DreamNet agents to be executed using LangChain's agent patterns and tool system. This bridge allows DreamNet agents to leverage LangChain's agent executor, tool system, and streaming capabilities.

### Key Features

- **LangChain Agent Executor**: Wraps LangChain's agent execution patterns
- **DreamNet Bridge**: Converts DreamNet tools to LangChain tools
- **Streaming Support**: Stream agent execution for real-time responses
- **Tool Integration**: Add tools dynamically to agents
- **OpenAI Integration**: Uses OpenAI models via LangChain

---

## Architecture

### How It Works

```
DreamNet Agent → DreamNet LangChain Bridge → LangChain Agent Executor → OpenAI → Response
```

1. **Agent Definition**: DreamNet agent with tools and system prompt
2. **Tool Conversion**: DreamNet tools converted to LangChain StructuredTool format
3. **Agent Creation**: LangChain agent created with OpenAI LLM
4. **Execution**: Agent executor runs agent with input
5. **Response**: Returns output with intermediate steps

### Why This Design

- **Interoperability**: Enables DreamNet agents to use LangChain ecosystem
- **Tool Reusability**: DreamNet tools can be used in LangChain agents
- **Streaming**: Real-time response streaming for better UX
- **Extensibility**: Easy to add new tools and agents

---

## API Reference

### Types

```typescript
export interface LangChainAgentConfig {
  modelName?: string; // Default: "gpt-4"
  temperature?: number; // Default: 0.7
  maxTokens?: number;
  tools?: StructuredTool[];
  systemPrompt?: string;
  memory?: boolean; // Default: true
}

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
```

### Classes

#### `LangChainAgentExecutor`

Wraps LangChain's agent execution patterns.

**Constructor**:
```typescript
constructor(config: LangChainAgentConfig = {})
```

**Methods**:

- **`initialize(): Promise<void>`**
  - Initialize the agent executor with LLM and tools
  - Creates OpenAI LLM, prompt template, and agent executor

- **`execute(input: string): Promise<{ output: string; intermediateSteps?: any[]; error?: string }>`**
  - Execute agent with input
  - Returns output and intermediate steps

- **`stream(input: string): AsyncGenerator<string, void, unknown>`**
  - Stream agent execution for real-time responses
  - Yields chunks of agent output

- **`addTool(tool: StructuredTool): void`**
  - Add tool to agent dynamically
  - Reinitializes executor if already initialized

- **`getStatus(): { initialized: boolean; toolCount: number; modelName: string }`**
  - Get agent status (initialized, tool count, model name)

#### `DreamNetLangChainBridge`

Bridges DreamNet agent system to LangChain execution patterns.

**Methods**:

- **`executeAgent(agent: DreamNetAgent, input: string): Promise<{ output: string; intermediateSteps?: any[]; error?: string }>`**
  - Execute DreamNet agent using LangChain
  - Creates or reuses executor for agent

- **`streamAgentExecution(agent: DreamNetAgent, input: string): AsyncGenerator<string, void, unknown>`**
  - Stream agent execution
  - Yields chunks of output

- **`addToolToAgent(agentId: string, tool: DreamNetTool): void`**
  - Add tool to agent
  - Converts DreamNet tool to LangChain tool

- **`getAgentStatus(agentId: string): { initialized: boolean; toolCount: number; modelName: string } | null`**
  - Get agent status
  - Returns null if agent not found

### Functions

#### `convertDreamNetToolsToLangChain(tools: DreamNetTool[]): StructuredTool[]`

Converts DreamNet tools to LangChain StructuredTool format.

**Example**:
```typescript
import { convertDreamNetToolsToLangChain } from "@dreamnet/agent-langchain";

const dreamNetTools: DreamNetTool[] = [
  {
    id: "get-weather",
    name: "getWeather",
    description: "Get weather",
    parameters: { location: { type: "string" } },
    execute: async (params) => ({ temp: 72 })
  }
];

const langchainTools = convertDreamNetToolsToLangChain(dreamNetTools);
```

---

## Integration Points

### Consumes

- **LangChain**: Agent executor, tools, prompts
- **OpenAI**: LLM models via LangChain
- **DreamNet Tools**: Converted to LangChain tools

### Produces

- **Agent Executions**: LangChain agent execution results
- **Streaming Responses**: Real-time agent response streams

---

## Usage Examples

### Basic Agent Execution

```typescript
import { LangChainAgentExecutor } from "@dreamnet/agent-langchain";

const executor = new LangChainAgentExecutor({
  modelName: "gpt-4",
  temperature: 0.7,
  systemPrompt: "You are a helpful assistant.",
});

await executor.initialize();

const result = await executor.execute("What is 2+2?");
console.log(result.output); // "4"
```

### Streaming Agent Execution

```typescript
const executor = new LangChainAgentExecutor({
  modelName: "gpt-4",
});

await executor.initialize();

for await (const chunk of executor.stream("Explain quantum computing")) {
  process.stdout.write(chunk);
}
```

### DreamNet Agent Bridge

```typescript
import { DreamNetLangChainBridge } from "@dreamnet/agent-langchain";

const bridge = new DreamNetLangChainBridge();

const agent: DreamNetAgent = {
  id: "calculator",
  name: "Calculator Agent",
  description: "Performs calculations",
  tools: [
    {
      id: "add",
      name: "add",
      description: "Add two numbers",
      parameters: {
        a: { type: "number" },
        b: { type: "number" }
      },
      execute: async ({ a, b }) => a + b
    }
  ]
};

const result = await bridge.executeAgent(agent, "What is 5 + 3?");
console.log(result.output);
```

### Dynamic Tool Addition

```typescript
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const executor = new LangChainAgentExecutor();
await executor.initialize();

// Add tool dynamically
executor.addTool(new DynamicStructuredTool({
  name: "multiply",
  description: "Multiply two numbers",
  schema: z.object({
    a: z.number(),
    b: z.number()
  }),
  func: async ({ a, b }) => a * b
}));

const result = await executor.execute("What is 4 * 6?");
```

---

## Best Practices

1. **Initialize Before Use**: Always call `initialize()` before executing agents
2. **Error Handling**: Check for errors in execution results
3. **Tool Descriptions**: Provide clear tool descriptions for better agent understanding
4. **Parameter Types**: Use correct parameter types (string, number, boolean, array, object)
5. **Streaming**: Use streaming for long-running operations
6. **Tool Reuse**: Reuse executors for same agents to avoid reinitialization

---

## Security Considerations

- **API Keys**: OpenAI API keys must be set in environment variables
- **Tool Execution**: Tools execute with full permissions - validate inputs
- **Rate Limiting**: Consider rate limits for OpenAI API calls
- **Cost Management**: Monitor token usage and costs
- **Input Validation**: Validate all inputs before tool execution

---

## Related Systems

- **LangChain**: Agent framework
- **OpenAI**: LLM provider
- **DreamNet Agents**: Agent definitions
- **Agent Gateway**: Tool execution gateway

---

**Status**: ✅ Implemented  
**Next**: Add more tool types and agent patterns
