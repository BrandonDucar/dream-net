# 🔧 OPENCLAW INJECTOR: IMPLEMENTATION GUIDE FOR 1159+ AGENTS

**Status**: READY FOR BUILD  
**Target**: Dynamic runtime code injection for swarm agents  
**Timeline**: 1 week to MVP  

---

## 📁 DIRECTORY STRUCTURE

```
packages/organs/endocrine/
├── openclaw-injector/
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── src/
│   │   ├── index.ts                    # Main server
│   │   ├── types.ts                    # Type definitions
│   │   ├── docker-client.ts            # Docker API wrapper
│   │   ├── compiler/
│   │   │   ├── index.ts
│   │   │   ├── ast-parser.ts           # Parse instructions to AST
│   │   │   └── bytecode-generator.ts   # Generate bytecode
│   │   ├── injector/
│   │   │   ├── index.ts
│   │   │   ├── volume-injector.ts      # Shared volume strategy
│   │   │   └── rpc-injector.ts         # RPC strategy (future)
│   │   ├── tracer/
│   │   │   ├── index.ts
│   │   │   ├── execution-tracer.ts     # Capture execution
│   │   │   └── trace-storage.ts        # Store traces in Redis
│   │   └── routes/
│   │       ├── inject.ts               # POST /inject
│   │       ├── inject-swarm.ts         # POST /inject-swarm
│   │       ├── history.ts              # GET /history/:agentId
│   │       └── health.ts               # GET /health
│   └── README.md
```

---

## 🔨 STEP 1: CREATE PACKAGE.JSON

```json
{
  "name": "@dreamnet/openclaw-injector",
  "version": "1.0.0",
  "type": "module",
  "description": "Runtime code injection system for 1159+ agent swarm",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx --experimental-specifier-resolution=node src/index.ts",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src/**/*.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "redis": "^4.6.0",
    "dockerode": "^4.0.2",
    "ts-node": "^10.9.1",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.7.0"
  }
}
```

---

## 🏗️ STEP 2: TYPE DEFINITIONS

```typescript
// packages/organs/endocrine/openclaw-injector/src/types.ts

import { Express } from 'express';

export interface Instruction {
  id: string;
  agentId: string | string[];  // Single or batch
  program: string;              // DSL or bytecode
  context?: Record<string, any>;
  timestamp: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface InjectionResult {
  agentId: string;
  success: boolean;
  bytecode?: string;
  error?: string;
  executionTime: number;
  trace?: ExecutionTrace;
}

export interface ExecutionTrace {
  agentId: string;
  injectionId: string;
  steps: ExecutionStep[];
  memoryUsage: {
    initial: number;
    final: number;
    peak: number;
  };
  cpuUsage: number;
  errors: string[];
  startTime: number;
  endTime: number;
  duration: number;
}

export interface ExecutionStep {
  instruction: string;
  step: number;
  state?: Record<string, any>;
  timestamp: number;
  status: 'executing' | 'completed' | 'error';
}

export interface AgentRegistry {
  agentId: string;
  containerId: string;
  containerName: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  lastHeartbeat: number;
  currentProgram?: string;
  injectionHistory: string[];  // Array of injection IDs
}

export interface InjectorServer {
  app: Express;
  port: number;
  start(): Promise<void>;
  stop(): Promise<void>;
}
```

---

## 🐳 STEP 3: DOCKER CLIENT WRAPPER

```typescript
// packages/organs/endocrine/openclaw-injector/src/docker-client.ts

import Docker from 'dockerode';
import { AgentRegistry } from './types';
import { Redis } from 'redis';

export class DockerClient {
  private docker: Docker;
  private redis: Redis;

  constructor(redis: Redis) {
    this.docker = new Docker();
    this.redis = redis;
  }

  /**
   * Find a container by agent ID (looks in Redis registry first)
   */
  async findContainer(agentId: string): Promise<Docker.Container | null> {
    // Check Redis registry first
    const registryKey = `agent:${agentId}`;
    const registry = await this.redis.get(registryKey);
    
    if (registry) {
      const agent: AgentRegistry = JSON.parse(registry);
      try {
        return this.docker.getContainer(agent.containerId);
      } catch (err) {
        // Container not found, try discovering
      }
    }

    // Fallback: search all containers for matching label
    const containers = await this.docker.listContainers({
      filters: {
        label: [`dreamnet.agent=${agentId}`]
      }
    });

    if (containers.length > 0) {
      return this.docker.getContainer(containers[0].Id);
    }

    return null;
  }

  /**
   * List all dreamnet agent containers
   */
  async listAgentContainers(): Promise<Docker.Container[]> {
    const containers = await this.docker.listContainers({
      filters: {
        label: ['dreamnet.role=agent']
      }
    });
    return containers.map(c => this.docker.getContainer(c.Id));
  }

  /**
   * Register agent in Redis
   */
  async registerAgent(agentId: string, container: Docker.Container): Promise<void> {
    const info = await container.inspect();
    
    const registry: AgentRegistry = {
      agentId,
      containerId: info.Id,
      containerName: info.Name,
      status: 'healthy',
      lastHeartbeat: Date.now(),
      injectionHistory: []
    };

    await this.redis.setEx(
      `agent:${agentId}`,
      86400,  // 24 hour TTL
      JSON.stringify(registry)
    );
  }

  /**
   * Inject bytecode into agent via shared volume
   */
  async injectViaVolume(container: Docker.Container, bytecode: string): Promise<void> {
    const fs = require('fs').promises;
    const path = require('path');

    // Bytecode path inside container
    const containerBytecodeDir = '/app/injected-programs';
    
    // Create local temp file
    const injectionId = require('uuid').v4();
    const bytecodeFile = path.join('/tmp', `${injectionId}.bc`);
    
    await fs.writeFile(bytecodeFile, bytecode);

    // Copy file into container
    const tarStream = require('tar-stream');
    const tar = tarStream.pack();
    
    const entry = tar.entry({ name: 'program.bc' }, bytecode, (err: any) => {
      if (err) throw err;
      tar.finalize();
    });

    await new Promise((resolve, reject) => {
      container.putArchive(tar, { path: containerBytecodeDir })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Send command to container to reload program
   */
  async reloadProgram(container: Docker.Container): Promise<string> {
    const exec = await this.docker.getExec({
      Id: container.id,
      Cmd: ['sh', '-c', 'touch /app/injected-programs/RELOAD_SIGNAL']
    });

    await exec.start({ Detach: false });
    return 'reload_signal_sent';
  }

  /**
   * Capture execution traces from container
   */
  async captureTraces(container: Docker.Container, durationMs: number = 30000): Promise<string[]> {
    const exec = await this.docker.getExec({
      Id: container.id,
      Cmd: ['sh', '-c', `tail -f /app/logs/execution.log`]
    });

    return new Promise((resolve, reject) => {
      const traces: string[] = [];
      const timeout = setTimeout(() => {
        resolve(traces);
      }, durationMs);

      exec.start({ stream: true, stdout: true }, (err: any, stream: any) => {
        if (err) {
          clearTimeout(timeout);
          reject(err);
        }

        stream.on('data', (chunk: Buffer) => {
          traces.push(chunk.toString());
        });

        stream.on('end', () => {
          clearTimeout(timeout);
          resolve(traces);
        });
      });
    });
  }

  /**
   * Get container health status
   */
  async getHealth(container: Docker.Container): Promise<'healthy' | 'unhealthy'> {
    try {
      const info = await container.inspect();
      return info.State.Health?.Status === 'healthy' ? 'healthy' : 'unhealthy';
    } catch {
      return 'unhealthy';
    }
  }
}
```

---

## 🔄 STEP 4: BYTECODE COMPILER

```typescript
// packages/organs/endocrine/openclaw-injector/src/compiler/index.ts

import { ASTParser } from './ast-parser';
import { BytecodeGenerator } from './bytecode-generator';

export interface CompilationOptions {
  optimize?: boolean;
  debug?: boolean;
  target?: 'node' | 'browser';
}

export class InstructionCompiler {
  private parser: ASTParser;
  private generator: BytecodeGenerator;

  constructor() {
    this.parser = new ASTParser();
    this.generator = new BytecodeGenerator();
  }

  /**
   * Compile instruction DSL to bytecode
   * 
   * Example instruction:
   * ```
   * REDUCE_COSTS BY 15% {
   *   TARGET: optimization_agents
   *   DEADLINE: 2h
   *   BUDGET: $500
   *   METRICS: latency, memory, cpu
   * }
   * ```
   */
  compile(instruction: string, context?: Record<string, any>, options?: CompilationOptions): string {
    // Parse instruction to AST
    const ast = this.parser.parse(instruction, context);
    
    // Validate AST
    this.validateAST(ast);
    
    // Generate bytecode
    let bytecode = this.generator.generate(ast);
    
    // Optimize if requested
    if (options?.optimize) {
      bytecode = this.optimize(bytecode);
    }
    
    return bytecode;
  }

  private validateAST(ast: any): void {
    // TODO: Implement AST validation
    // Check for:
    // - Undefined variables
    // - Type mismatches
    // - Invalid operations
  }

  private optimize(bytecode: string): string {
    // TODO: Implement bytecode optimization
    // - Remove dead code
    // - Inline functions
    // - Constant folding
    return bytecode;
  }
}
```

---

## 📝 STEP 5: MAIN SERVER

```typescript
// packages/organs/endocrine/openclaw-injector/src/index.ts

import express from 'express';
import { createClient } from 'redis';
import { DockerClient } from './docker-client';
import { InstructionCompiler } from './compiler';
import { ExecutionTracer } from './tracer';
import { v4 as uuid } from 'uuid';
import { Instruction, InjectionResult } from './types';

const app = express();
const PORT = process.env.PORT || 7005;

// Initialize clients
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

const docker = new DockerClient(redis);
const compiler = new InstructionCompiler();
const tracer = new ExecutionTracer(redis);

app.use(express.json());

// ====================================================================
// POST /inject - Inject instruction into single agent
// ====================================================================
app.post('/inject', async (req, res) => {
  const { agentId, instruction, context, priority = 'medium' } = req.body;

  if (!agentId || !instruction) {
    return res.status(400).json({ error: 'Missing agentId or instruction' });
  }

  const injectionId = uuid();
  const startTime = Date.now();

  try {
    console.log(`[INJECT] ${injectionId} → ${agentId}: ${instruction.substring(0, 50)}...`);

    // 1. Compile instruction
    const bytecode = compiler.compile(instruction, context);
    console.log(`[COMPILE] ${injectionId}: Generated ${bytecode.length} bytes`);

    // 2. Find agent container
    const container = await docker.findContainer(agentId);
    if (!container) {
      return res.status(404).json({ error: `Agent ${agentId} not found` });
    }

    // 3. Inject bytecode
    await docker.injectViaVolume(container, bytecode);
    console.log(`[VOLUME] ${injectionId}: Bytecode written to container`);

    // 4. Trigger reload
    await docker.reloadProgram(container);
    console.log(`[RELOAD] ${injectionId}: Reload signal sent`);

    // 5. Capture traces (30 second window)
    const traces = await docker.captureTraces(container, 30000);
    console.log(`[TRACE] ${injectionId}: Captured ${traces.length} trace entries`);

    // 6. Store execution trace
    const trace = await tracer.capture(agentId, injectionId, traces);
    await tracer.store(trace);

    const result: InjectionResult = {
      agentId,
      success: true,
      bytecode,
      executionTime: Date.now() - startTime,
      trace
    };

    // 7. Store in Redis for history
    await redis.hSet(
      `injections:${agentId}`,
      injectionId,
      JSON.stringify(result)
    );

    res.json(result);
  } catch (error: any) {
    console.error(`[ERROR] ${injectionId}:`, error.message);

    res.status(500).json({
      agentId,
      success: false,
      error: error.message,
      executionTime: Date.now() - startTime
    });
  }
});

// ====================================================================
// POST /inject-swarm - Batch inject to multiple agents
// ====================================================================
app.post('/inject-swarm', async (req, res) => {
  const { agents, instruction, context, priority = 'high' } = req.body;

  if (!agents || !Array.isArray(agents) || agents.length === 0) {
    return res.status(400).json({ error: 'Invalid agents array' });
  }

  console.log(`[SWARM] Injecting to ${agents.length} agents: ${instruction.substring(0, 50)}...`);

  // Parallel injection (5 at a time to avoid overload)
  const batchSize = 5;
  const results: InjectionResult[] = [];
  
  for (let i = 0; i < agents.length; i += batchSize) {
    const batch = agents.slice(i, i + batchSize);
    
    const batchResults = await Promise.allSettled(
      batch.map(agentId =>
        fetch(`http://localhost:${PORT}/inject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentId, instruction, context, priority })
        }).then(r => r.json())
      )
    );

    batchResults.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({
          agentId: batch[idx],
          success: false,
          error: result.reason?.message || 'Unknown error',
          executionTime: 0
        });
      }
    });

    console.log(`[SWARM] Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(agents.length / batchSize)} complete (${results.length}/${agents.length})`);
  }

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  res.json({
    instruction,
    totalAgents: agents.length,
    successful,
    failed,
    results,
    summary: `${successful} injected, ${failed} failed`
  });
});

// ====================================================================
// GET /history/:agentId - Get injection history for agent
// ====================================================================
app.get('/history/:agentId', async (req, res) => {
  const { agentId } = req.params;
  const limit = parseInt(req.query.limit as string) || 100;

  try {
    const history = await redis.hGetAll(`injections:${agentId}`);
    const entries = Object.values(history)
      .map(h => JSON.parse(h))
      .sort((a, b) => b.executionTime - a.executionTime)
      .slice(0, limit);

    res.json({
      agentId,
      total: Object.keys(history).length,
      showing: entries.length,
      history: entries
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ====================================================================
// GET /health - Health check
// ====================================================================
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ====================================================================
// Error handler
// ====================================================================
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ====================================================================
// Start server
// ====================================================================
async function start() {
  try {
    await redis.connect();
    console.log('✅ Redis connected');

    app.listen(PORT, () => {
      console.log(`✅ OpenClaw Injector running on port ${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/health`);
      console.log(`   POST /inject - Single agent injection`);
      console.log(`   POST /inject-swarm - Batch injection`);
      console.log(`   GET /history/:agentId - Injection history`);
    });
  } catch (error) {
    console.error('❌ Failed to start:', error);
    process.exit(1);
  }
}

start();
```

---

## 🐳 STEP 6: DOCKERFILE

```dockerfile
# packages/organs/endocrine/openclaw-injector/Dockerfile

FROM node:22-alpine

WORKDIR /app

# Install tools
RUN apk add --no-cache curl docker-cli tar-stream

# Copy package files
COPY packages/organs/endocrine/openclaw-injector/package.json ./
COPY packages/organs/endocrine/openclaw-injector/tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source
COPY packages/organs/endocrine/openclaw-injector/src ./src

# Build TypeScript
RUN npm run build

# Non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser:appgroup

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:7005/health || exit 1

EXPOSE 7005

CMD ["node", "dist/index.js"]
```

---

## 🐳 STEP 7: ADD TO DOCKER COMPOSE

```yaml
# In docker-compose.yml, add after clawedette-api:

  openclaw-injector:
    build:
      context: .
      dockerfile: packages/organs/endocrine/openclaw-injector/Dockerfile
    container_name: dreamnet_openclaw_injector
    restart: unless-stopped
    labels:
      - "dreamnet.role=programmer"
      - "dreamnet.protection=max"
    depends_on:
      - clawedette-api
      - nerve
    environment:
      - NODE_ENV=production
      - PORT=7005
      - REDIS_URL=redis://nerve:6379
      - DOCKER_HOST=unix:///var/run/docker.sock
      - GOVERNOR_URL=http://clawedette-api:3100
      - TRACER_RETENTION=7d
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - injector_data:/app/data
    ports:
      - "7005:7005"
    networks:
      - dream_network

volumes:
  # ... existing ...
  injector_data:
```

---

## 🧪 STEP 8: TEST INJECTION

```bash
# Start the injector
docker-compose up openclaw-injector

# Test single agent injection
curl -X POST http://localhost:7005/inject \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "test-agent-1",
    "instruction": "REDUCE_COSTS BY 15%",
    "context": {
      "deadline": "2h",
      "budget": 500
    },
    "priority": "high"
  }'

# Test batch injection
curl -X POST http://localhost:7005/inject-swarm \
  -H "Content-Type: application/json" \
  -d '{
    "agents": ["agent-1", "agent-2", "agent-3"],
    "instruction": "OPTIMIZE_THROUGHPUT",
    "priority": "high"
  }'

# Get history
curl http://localhost:7005/history/test-agent-1

# Health check
curl http://localhost:7005/health
```

---

## 📈 NEXT STEPS

1. **Build the bytecode compiler** - Most complex part (AST parsing, code generation)
2. **Implement execution tracer** - Capture and store execution traces
3. **Test with 5-10 agents** first
4. **Scale to 50, then 100, then 1159**
5. **Integrate with Governor** for automated decision-making
6. **Add Starfleet Academy** for specialized agent training

---

**Status**: Ready to build  
**Timeline**: 3 days for MVP  
**Owner**: You (with this guide)

Let me know if you need help with any of the implementation steps!

