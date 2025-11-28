/**
 * DreamNet Interop Spine - Root Barrel Export
 * 
 * This is the foundational layer that Antigravity will plug into later.
 * All exports are types, interfaces, and empty stubs - no logic yet.
 * 
 * DO NOT import this into client/ or server/ yet.
 * This is inert scaffolding until Antigravity fills it with logic.
 */

// Agent BGP (Border Gateway Protocol for Agents)
export * from "./bgp-for-agents/index.js";

// Agent Interop Registry
export * from "./agent-interop/index.js";

// DreamNet OS Linker
export * from "./dreamnet-os-linker/index.js";

// DreamNet Event Bus
export * from "./dreamnet-event-bus/index.js";

// DreamNet MCP Bridge
export * from "./dreamnet-mcp-bridge/index.js";

// Wrappers Layer
export * from "./wrappers/index.js";

// Agent Protocols
export * from "./agent-protocols/index.js";

// Utils
export * from "./utils/index.js";

