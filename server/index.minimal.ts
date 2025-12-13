/**
 * MINIMAL SERVER - Starting point
 * 
 * This is a stripped-down version that just starts.
 * We'll add features back layer by layer.
 */

import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { getEnvConfig, PORT as ENV_PORT, NODE_ENV } from "./config/env";
import healthRouter from "./routes/health";
import { serveStatic } from "./vite";
import { traceIdMiddleware } from "./middleware/traceId";
import { idempotencyMiddleware } from "./middleware/idempotency";
import { tierResolverMiddleware } from "./middleware/tierResolver";
import { controlCoreMiddleware } from "../packages/dreamnet-control-core/controlCoreMiddleware";
import { NervousSystemCore } from "@dreamnet/nervous-system-core";
import CitadelCore from "@dreamnet/citadel-core";
import citadelRouter from "./routes/citadel";
import { createAgentRouter } from "./routes/agent";
import OrchestratorCore from "@dreamnet/orchestrator-core";
import { AgentRegistryCore } from "@dreamnet/agent-registry-core";

const envConfig = getEnvConfig();
const app: Express = express();
const PORT = ENV_PORT || 5000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - basic
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// PIECE 1: Trace ID Middleware (adds X-Trace-Id to all requests)
app.use(traceIdMiddleware);

// PIECE 2: Idempotency Middleware (handles X-Idempotency-Key header)
app.use(idempotencyMiddleware);

// PIECE 3: Tier Resolver Middleware (resolves access tier from API key or wallet)
app.use(tierResolverMiddleware);

// PIECE 4: Control Core Middleware (enforces cluster-level access, rate limits, feature flags)
app.use(controlCoreMiddleware);

// PIECE 5: Nervous System Core (Message Bus + Shared Memory)
// Initialize and make available globally
const nervousSystem = NervousSystemCore;
(global as any).nervousSystem = nervousSystem;
console.log("🧠 [Nervous System] Initialized - Message Bus and Shared Memory available");

// PIECE 6: Citadel Core (Strategic Command Center)
// Initialize and make available globally
(global as any).citadelCore = CitadelCore;
console.log("🏛️ [Citadel] Initialized - Strategic command center available");

// PIECE 7: OrchestratorCore (Central Coordinator)
// OrchestratorCore coordinates all subsystems in cycles
// It needs CitadelCore in its context
const orchestratorContext = {
  CitadelCore: CitadelCore,
  AgentRegistryCore: AgentRegistryCore, // Add Agent Registry to context
  NeuralMesh: (global as any).neuralMesh, // Will be available when Neural Mesh is added
};
(global as any).orchestratorCore = OrchestratorCore;
(global as any).orchestratorContext = orchestratorContext;
console.log("🎯 [Orchestrator] Initialized - Central coordinator ready");

// PIECE 8: Agent Registry Core (Agent Management)
// Seed default agents and make registry available
AgentRegistryCore.ensureDefaultAgentsSeeded();
(global as any).agentRegistryCore = AgentRegistryCore;
console.log("📋 [Agent Registry] Initialized - Agent management ready");

// Health endpoint
app.use("/health", healthRouter);

// API routes (before static serving)
app.get("/api", (_req, res) => {
  res.json({ 
    status: "ok", 
    message: "DreamNet API",
    timestamp: new Date().toISOString()
  });
});

// PIECE 6.5: Citadel API Route
app.use("/api/citadel", citadelRouter);

// PIECE 9: Agent API Routes (Agent discovery and management)
app.use("/api", createAgentRouter());

// Serve static files in production (client UI)
// serveStatic() handles both static files AND SPA routing fallback
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
} else {
  // Development mode - just return API info
  app.get("/", (_req, res) => {
    res.json({ 
      status: "ok", 
      message: "DreamNet Server (Minimal Mode - Dev)",
      timestamp: new Date().toISOString()
    });
  });
}

// Start server
const server: Server = createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${NODE_ENV || "development"}`);
});

export { app, server };


console.log("🎯 [Orchestrator] Initialized - Central coordinator ready");

// PIECE 8: Agent Registry Core (Agent Management)
// Seed default agents and make registry available
AgentRegistryCore.ensureDefaultAgentsSeeded();
(global as any).agentRegistryCore = AgentRegistryCore;
console.log("📋 [Agent Registry] Initialized - Agent management ready");

// Health endpoint
app.use("/health", healthRouter);

// API routes (before static serving)
app.get("/api", (_req, res) => {
  res.json({ 
    status: "ok", 
    message: "DreamNet API",
    timestamp: new Date().toISOString()
  });
});

// PIECE 6.5: Citadel API Route
app.use("/api/citadel", citadelRouter);

// PIECE 9: Agent API Routes (Agent discovery and management)
app.use("/api", createAgentRouter());

// Serve static files in production (client UI)
// serveStatic() handles both static files AND SPA routing fallback
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
} else {
  // Development mode - just return API info
  app.get("/", (_req, res) => {
    res.json({ 
      status: "ok", 
      message: "DreamNet Server (Minimal Mode - Dev)",
      timestamp: new Date().toISOString()
    });
  });
}

// Start server
const server: Server = createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${NODE_ENV || "development"}`);
});

export { app, server };


console.log("🎯 [Orchestrator] Initialized - Central coordinator ready");

// PIECE 8: Agent Registry Core (Agent Management)
// Seed default agents and make registry available
AgentRegistryCore.ensureDefaultAgentsSeeded();
(global as any).agentRegistryCore = AgentRegistryCore;
console.log("📋 [Agent Registry] Initialized - Agent management ready");

// Health endpoint
app.use("/health", healthRouter);

// API routes (before static serving)
app.get("/api", (_req, res) => {
  res.json({ 
    status: "ok", 
    message: "DreamNet API",
    timestamp: new Date().toISOString()
  });
});

// PIECE 6.5: Citadel API Route
app.use("/api/citadel", citadelRouter);

// PIECE 9: Agent API Routes (Agent discovery and management)
app.use("/api", createAgentRouter());

// Serve static files in production (client UI)
// serveStatic() handles both static files AND SPA routing fallback
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
} else {
  // Development mode - just return API info
  app.get("/", (_req, res) => {
    res.json({ 
      status: "ok", 
      message: "DreamNet Server (Minimal Mode - Dev)",
      timestamp: new Date().toISOString()
    });
  });
}

// Start server
const server: Server = createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${NODE_ENV || "development"}`);
});

export { app, server };


console.log("🎯 [Orchestrator] Initialized - Central coordinator ready");

// PIECE 8: Agent Registry Core (Agent Management)
// Seed default agents and make registry available
AgentRegistryCore.ensureDefaultAgentsSeeded();
(global as any).agentRegistryCore = AgentRegistryCore;
console.log("📋 [Agent Registry] Initialized - Agent management ready");

// Health endpoint
app.use("/health", healthRouter);

// API routes (before static serving)
app.get("/api", (_req, res) => {
  res.json({ 
    status: "ok", 
    message: "DreamNet API",
    timestamp: new Date().toISOString()
  });
});

// PIECE 6.5: Citadel API Route
app.use("/api/citadel", citadelRouter);

// PIECE 9: Agent API Routes (Agent discovery and management)
app.use("/api", createAgentRouter());

// Serve static files in production (client UI)
// serveStatic() handles both static files AND SPA routing fallback
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
} else {
  // Development mode - just return API info
  app.get("/", (_req, res) => {
    res.json({ 
      status: "ok", 
      message: "DreamNet Server (Minimal Mode - Dev)",
      timestamp: new Date().toISOString()
    });
  });
}

// Start server
const server: Server = createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${NODE_ENV || "development"}`);
});

export { app, server };


console.log("🎯 [Orchestrator] Initialized - Central coordinator ready");

// PIECE 8: Agent Registry Core (Agent Management)
// Seed default agents and make registry available
AgentRegistryCore.ensureDefaultAgentsSeeded();
(global as any).agentRegistryCore = AgentRegistryCore;
console.log("📋 [Agent Registry] Initialized - Agent management ready");

// Health endpoint
app.use("/health", healthRouter);

// API routes (before static serving)
app.get("/api", (_req, res) => {
  res.json({ 
    status: "ok", 
    message: "DreamNet API",
    timestamp: new Date().toISOString()
  });
});

// PIECE 6.5: Citadel API Route
app.use("/api/citadel", citadelRouter);

// PIECE 9: Agent API Routes (Agent discovery and management)
app.use("/api", createAgentRouter());

// Serve static files in production (client UI)
// serveStatic() handles both static files AND SPA routing fallback
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
} else {
  // Development mode - just return API info
  app.get("/", (_req, res) => {
    res.json({ 
      status: "ok", 
      message: "DreamNet Server (Minimal Mode - Dev)",
      timestamp: new Date().toISOString()
    });
  });
}

// Start server
const server: Server = createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${NODE_ENV || "development"}`);
});

export { app, server };


console.log("🎯 [Orchestrator] Initialized - Central coordinator ready");

// PIECE 8: Agent Registry Core (Agent Management)
// Seed default agents and make registry available
AgentRegistryCore.ensureDefaultAgentsSeeded();
(global as any).agentRegistryCore = AgentRegistryCore;
console.log("📋 [Agent Registry] Initialized - Agent management ready");

// Health endpoint
app.use("/health", healthRouter);

// API routes (before static serving)
app.get("/api", (_req, res) => {
  res.json({ 
    status: "ok", 
    message: "DreamNet API",
    timestamp: new Date().toISOString()
  });
});

// PIECE 6.5: Citadel API Route
app.use("/api/citadel", citadelRouter);

// PIECE 9: Agent API Routes (Agent discovery and management)
app.use("/api", createAgentRouter());

// Serve static files in production (client UI)
// serveStatic() handles both static files AND SPA routing fallback
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
} else {
  // Development mode - just return API info
  app.get("/", (_req, res) => {
    res.json({ 
      status: "ok", 
      message: "DreamNet Server (Minimal Mode - Dev)",
      timestamp: new Date().toISOString()
    });
  });
}

// Start server
const server: Server = createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${NODE_ENV || "development"}`);
});

export { app, server };


console.log("🎯 [Orchestrator] Initialized - Central coordinator ready");

// PIECE 8: Agent Registry Core (Agent Management)
// Seed default agents and make registry available
AgentRegistryCore.ensureDefaultAgentsSeeded();
(global as any).agentRegistryCore = AgentRegistryCore;
console.log("📋 [Agent Registry] Initialized - Agent management ready");

// Health endpoint
app.use("/health", healthRouter);

// API routes (before static serving)
app.get("/api", (_req, res) => {
  res.json({ 
    status: "ok", 
    message: "DreamNet API",
    timestamp: new Date().toISOString()
  });
});

// PIECE 6.5: Citadel API Route
app.use("/api/citadel", citadelRouter);

// PIECE 9: Agent API Routes (Agent discovery and management)
app.use("/api", createAgentRouter());

// Serve static files in production (client UI)
// serveStatic() handles both static files AND SPA routing fallback
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
} else {
  // Development mode - just return API info
  app.get("/", (_req, res) => {
    res.json({ 
      status: "ok", 
      message: "DreamNet Server (Minimal Mode - Dev)",
      timestamp: new Date().toISOString()
    });
  });
}

// Start server
const server: Server = createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${NODE_ENV || "development"}`);
});

export { app, server };


console.log("🎯 [Orchestrator] Initialized - Central coordinator ready");

// PIECE 8: Agent Registry Core (Agent Management)
// Seed default agents and make registry available
AgentRegistryCore.ensureDefaultAgentsSeeded();
(global as any).agentRegistryCore = AgentRegistryCore;
console.log("📋 [Agent Registry] Initialized - Agent management ready");

// Health endpoint
app.use("/health", healthRouter);

// API routes (before static serving)
app.get("/api", (_req, res) => {
  res.json({ 
    status: "ok", 
    message: "DreamNet API",
    timestamp: new Date().toISOString()
  });
});

// PIECE 6.5: Citadel API Route
app.use("/api/citadel", citadelRouter);

// PIECE 9: Agent API Routes (Agent discovery and management)
app.use("/api", createAgentRouter());

// Serve static files in production (client UI)
// serveStatic() handles both static files AND SPA routing fallback
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
} else {
  // Development mode - just return API info
  app.get("/", (_req, res) => {
    res.json({ 
      status: "ok", 
      message: "DreamNet Server (Minimal Mode - Dev)",
      timestamp: new Date().toISOString()
    });
  });
}

// Start server
const server: Server = createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${NODE_ENV || "development"}`);
});

export { app, server };


console.log("🎯 [Orchestrator] Initialized - Central coordinator ready");

// PIECE 8: Agent Registry Core (Agent Management)
// Seed default agents and make registry available
AgentRegistryCore.ensureDefaultAgentsSeeded();
(global as any).agentRegistryCore = AgentRegistryCore;
console.log("📋 [Agent Registry] Initialized - Agent management ready");

// Health endpoint
app.use("/health", healthRouter);

// API routes (before static serving)
app.get("/api", (_req, res) => {
  res.json({ 
    status: "ok", 
    message: "DreamNet API",
    timestamp: new Date().toISOString()
  });
});

// PIECE 6.5: Citadel API Route
app.use("/api/citadel", citadelRouter);

// PIECE 9: Agent API Routes (Agent discovery and management)
app.use("/api", createAgentRouter());

// Serve static files in production (client UI)
// serveStatic() handles both static files AND SPA routing fallback
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
} else {
  // Development mode - just return API info
  app.get("/", (_req, res) => {
    res.json({ 
      status: "ok", 
      message: "DreamNet Server (Minimal Mode - Dev)",
      timestamp: new Date().toISOString()
    });
  });
}

// Start server
const server: Server = createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${NODE_ENV || "development"}`);
});

export { app, server };


console.log("🎯 [Orchestrator] Initialized - Central coordinator ready");

// PIECE 8: Agent Registry Core (Agent Management)
// Seed default agents and make registry available
AgentRegistryCore.ensureDefaultAgentsSeeded();
(global as any).agentRegistryCore = AgentRegistryCore;
console.log("📋 [Agent Registry] Initialized - Agent management ready");

// Health endpoint
app.use("/health", healthRouter);

// API routes (before static serving)
app.get("/api", (_req, res) => {
  res.json({ 
    status: "ok", 
    message: "DreamNet API",
    timestamp: new Date().toISOString()
  });
});

// PIECE 6.5: Citadel API Route
app.use("/api/citadel", citadelRouter);

// PIECE 9: Agent API Routes (Agent discovery and management)
app.use("/api", createAgentRouter());

// Serve static files in production (client UI)
// serveStatic() handles both static files AND SPA routing fallback
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
} else {
  // Development mode - just return API info
  app.get("/", (_req, res) => {
    res.json({ 
      status: "ok", 
      message: "DreamNet Server (Minimal Mode - Dev)",
      timestamp: new Date().toISOString()
    });
  });
}

// Start server
const server: Server = createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${NODE_ENV || "development"}`);
});

export { app, server };


console.log("🎯 [Orchestrator] Initialized - Central coordinator ready");

// PIECE 8: Agent Registry Core (Agent Management)
// Seed default agents and make registry available
AgentRegistryCore.ensureDefaultAgentsSeeded();
(global as any).agentRegistryCore = AgentRegistryCore;
console.log("📋 [Agent Registry] Initialized - Agent management ready");

// Health endpoint
app.use("/health", healthRouter);

// API routes (before static serving)
app.get("/api", (_req, res) => {
  res.json({ 
    status: "ok", 
    message: "DreamNet API",
    timestamp: new Date().toISOString()
  });
});

// PIECE 6.5: Citadel API Route
app.use("/api/citadel", citadelRouter);

// PIECE 9: Agent API Routes (Agent discovery and management)
app.use("/api", createAgentRouter());

// Serve static files in production (client UI)
// serveStatic() handles both static files AND SPA routing fallback
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
} else {
  // Development mode - just return API info
  app.get("/", (_req, res) => {
    res.json({ 
      status: "ok", 
      message: "DreamNet Server (Minimal Mode - Dev)",
      timestamp: new Date().toISOString()
    });
  });
}

// Start server
const server: Server = createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${NODE_ENV || "development"}`);
});

export { app, server };


console.log("🎯 [Orchestrator] Initialized - Central coordinator ready");

// PIECE 8: Agent Registry Core (Agent Management)
// Seed default agents and make registry available
AgentRegistryCore.ensureDefaultAgentsSeeded();
(global as any).agentRegistryCore = AgentRegistryCore;
console.log("📋 [Agent Registry] Initialized - Agent management ready");

// Health endpoint
app.use("/health", healthRouter);

// API routes (before static serving)
app.get("/api", (_req, res) => {
  res.json({ 
    status: "ok", 
    message: "DreamNet API",
    timestamp: new Date().toISOString()
  });
});

// PIECE 6.5: Citadel API Route
app.use("/api/citadel", citadelRouter);

// PIECE 9: Agent API Routes (Agent discovery and management)
app.use("/api", createAgentRouter());

// Serve static files in production (client UI)
// serveStatic() handles both static files AND SPA routing fallback
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
} else {
  // Development mode - just return API info
  app.get("/", (_req, res) => {
    res.json({ 
      status: "ok", 
      message: "DreamNet Server (Minimal Mode - Dev)",
      timestamp: new Date().toISOString()
    });
  });
}

// Start server
const server: Server = createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${NODE_ENV || "development"}`);
});

export { app, server };


console.log("🎯 [Orchestrator] Initialized - Central coordinator ready");

// PIECE 8: Agent Registry Core (Agent Management)
// Seed default agents and make registry available
AgentRegistryCore.ensureDefaultAgentsSeeded();
(global as any).agentRegistryCore = AgentRegistryCore;
console.log("📋 [Agent Registry] Initialized - Agent management ready");

// Health endpoint
app.use("/health", healthRouter);

// API routes (before static serving)
app.get("/api", (_req, res) => {
  res.json({ 
    status: "ok", 
    message: "DreamNet API",
    timestamp: new Date().toISOString()
  });
});

// PIECE 6.5: Citadel API Route
app.use("/api/citadel", citadelRouter);

// PIECE 9: Agent API Routes (Agent discovery and management)
app.use("/api", createAgentRouter());

// Serve static files in production (client UI)
// serveStatic() handles both static files AND SPA routing fallback
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
} else {
  // Development mode - just return API info
  app.get("/", (_req, res) => {
    res.json({ 
      status: "ok", 
      message: "DreamNet Server (Minimal Mode - Dev)",
      timestamp: new Date().toISOString()
    });
  });
}

// Start server
const server: Server = createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`🌐 Environment: ${NODE_ENV || "development"}`);
});

export { app, server };

