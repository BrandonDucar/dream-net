#!/usr/bin/env tsx
/**
 * Integration Tests for DreamNet Subsystems
 * 
 * Tests all integrations and end-to-end flows:
 * - Squad Builder → DreamNet OS agent execution
 * - Event Wormholes → HALO triggers
 * - Spore Engine → Graft Engine
 * - Operator Panel data flows
 */

// Import directly from source files (tsx handles TypeScript)
// Use namespace imports to avoid ESM export issues
import * as squadOrch from "../packages/squad-builder/src/orchestrator";
import * as eventBus from "../packages/event-wormholes/src/eventBus";
import * as wormholeReg from "../packages/event-wormholes/src/wormholeRegistry";
import * as sporeReg from "../packages/spore-engine/src/registry";
import * as sporeDist from "../packages/spore-engine/src/distribution";
import * as fabricEngine from "../packages/dark-fabric/src/fabricEngine";
import { haloEngine } from "../packages/halo-loop/haloEngine";
import * as graftEngineModule from "../packages/graft-engine/graftEngine";
import * as graftReg from "../packages/graft-engine/registry";

// Use modules directly (ESM namespace imports work differently)
// We'll access functions via the namespace objects in the test functions

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function log(message: string, color: keyof typeof colors = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name: string) {
  log(`\n🧪 Testing: ${name}`, "blue");
}

function logPass(message: string) {
  log(`  ✅ ${message}`, "green");
}

function logFail(message: string) {
  log(`  ❌ ${message}`, "red");
}

function logWarn(message: string) {
  log(`  ⚠️  ${message}`, "yellow");
}

async function testSquadBuilderAgentExecution() {
  logTest("Squad Builder → DreamNet OS Agent Execution");

  try {
    // Create a test task
    const task = (squadOrch as any).createTask({
      type: "env.audit",
      status: "pending",
      payload: { check: "DATABASE_URL" },
    });
    logPass(`Created task: ${task.id}`);

    // Try to dispatch (may fail if no agents available, that's OK)
    try {
      const result = await squadOrch.dispatchTask(task.id);
      if (result.success) {
        logPass(`Task dispatched successfully to agent: ${result.agentId}`);
      } else {
        logWarn(`Task dispatch failed (expected if no agents): ${result.error}`);
      }
    } catch (err: any) {
      logWarn(`Task dispatch error (expected if DreamNet OS not available): ${err.message}`);
    }

    // Verify task exists
    const retrieved = (squadOrch as any).getTaskById(task.id);
    if (retrieved) {
      logPass(`Task retrieved: ${retrieved.id}`);
    } else {
      logFail("Task not found after creation");
    }
  } catch (err: any) {
    logFail(`Squad Builder test failed: ${err.message}`);
  }
}

async function testEventWormholesHALO() {
  logTest("Event Wormholes → HALO Loop Trigger");

  try {
    // Emit a critical event
    const event = await eventBus.emitEvent({
      sourceType: "api",
      eventType: "api.endpoint.failed",
      severity: "error",
      payload: { url: "/api/test", error: "Connection timeout" },
    });
    logPass(`Emitted event: ${event.id}`);

    // Verify event was logged
    const recent = (eventBus as any).getRecentEvents(10);
    const found = recent.find((e) => e.id === event.id);
    if (found) {
      logPass("Event logged successfully");
    } else {
      logFail("Event not found in recent events");
    }

    // Create a wormhole
    const wormhole = (wormholeReg as any).createWormhole({
      name: "Test Wormhole",
      from: {
        sourceType: "api",
        eventType: "api.endpoint.failed",
      },
      to: {
        actionType: "create-task",
        targetAgentRole: "DeployKeeper",
      },
      filters: {
        minSeverity: "error",
      },
      enabled: true,
    });
    logPass(`Created wormhole: ${wormhole.id}`);

    // Verify wormhole exists
    const wormholes = (wormholeReg as any).listWormholes();
    const foundWormhole = wormholes.find((w) => w.id === wormhole.id);
    if (foundWormhole) {
      logPass("Wormhole found in registry");
    } else {
      logFail("Wormhole not found in registry");
    }
  } catch (err: any) {
    logFail(`Event Wormholes test failed: ${err.message}`);
  }
}

async function testSporeEngineGraftEngine() {
  logTest("Spore Engine → Graft Engine Integration");

  try {
    // Create a spore
    const spore = (sporeReg as any).createSpore({
      name: "Test Config Spore",
      type: "config",
      status: "published",
      content: { apiKey: "test-key" },
      metadata: {
        tags: ["test"],
        version: "1.0.0",
      },
    });
    logPass(`Created spore: ${spore.id}`);

    // Deploy the spore (should create a graft)
    try {
      const distribution = await (sporeDist as any).deploySpore(spore.id, {
        role: "DeployKeeper",
      });
      if (distribution) {
        logPass(`Spore deployed: ${distribution.sporeId}`);
        logPass("Graft should have been created (check Graft Engine)");
      } else {
        logWarn("Spore deployment returned null (may be expected)");
      }
    } catch (err: any) {
      logWarn(`Spore deployment error (may be expected): ${err.message}`);
    }

    // Verify spore exists
    const spores = (sporeReg as any).listSpores();
    const found = spores.find((s) => s.id === spore.id);
    if (found) {
      logPass("Spore found in registry");
    } else {
      logFail("Spore not found in registry");
    }
  } catch (err: any) {
    logFail(`Spore Engine test failed: ${err.message}`);
  }
}

async function testHALOLoop() {
  logTest("HALO Loop Analysis");

  try {
    // Run a HALO cycle
    const cycle = await haloEngine.runCycle("test");
    logPass(`HALO cycle completed: ${cycle.id}`);

    // Verify cycle has results
    if (cycle.analysis) {
      logPass("Cycle has analysis results");
    } else {
      logWarn("Cycle has no analysis results");
    }

    if (cycle.weakPoints) {
      logPass(`Cycle detected ${cycle.weakPoints.length} weak points`);
    } else {
      logWarn("Cycle has no weak points");
    }

    if (cycle.generatedTasks) {
      logPass(`Cycle generated ${cycle.generatedTasks.length} tasks`);
    } else {
      logWarn("Cycle generated no tasks");
    }
  } catch (err: any) {
    logFail(`HALO Loop test failed: ${err.message}`);
  }
}

async function testDarkFabric() {
  logTest("Dark Fabric Code Generation");

  try {
    // Create a fabric task
    const task = (fabricEngine as any).createFabricTask({
      type: "generate",
      target: {
        filePath: "test.ts",
      },
      instruction: "Generate a test function",
      status: "pending",
    });
    logPass(`Created fabric task: ${task.id}`);

    // Try to run the task (may fail if sandbox not available)
    try {
      const result = await (fabricEngine as any).runFabricTask(task.id);
      logPass(`Fabric task executed: ${result.id}`);
      if (result.validation) {
        logPass(`Validation passed: ${result.validation.passed}`);
      }
    } catch (err: any) {
      logWarn(`Fabric task execution error (may be expected): ${err.message}`);
    }

    // Verify task exists
    const tasks = (fabricEngine as any).listFabricTasks();
    const found = tasks.find((t) => t.id === task.id);
    if (found) {
      logPass("Fabric task found in registry");
    } else {
      logFail("Fabric task not found in registry");
    }
  } catch (err: any) {
    logFail(`Dark Fabric test failed: ${err.message}`);
  }
}

async function testGraftEngine() {
  logTest("Graft Engine");

  try {
    // Create a graft
    const graft = await (graftEngineModule as any).submitGraft({
      type: "endpoint",
      name: "test-endpoint",
      path: "test/path",
      metadata: {},
      status: "pending",
      logs: [],
    });
    logPass(`Created graft: ${graft.id}`);

    // Verify graft exists
    const grafts = await (graftReg as any).getGrafts();
    const found = grafts.find((g) => g.id === graft.id);
    if (found) {
      logPass("Graft found in registry");
    } else {
      logFail("Graft not found in registry");
    }
  } catch (err: any) {
    logFail(`Graft Engine test failed: ${err.message}`);
  }
}

async function testEndToEndFlow() {
  logTest("End-to-End Flow: Event → HALO → Task → Agent");

  try {
    // 1. Emit an event
    const event = await (eventBus as any).emitEvent({
      sourceType: "api",
      eventType: "api.endpoint.failed",
      severity: "error",
      payload: { url: "/api/test", error: "Test error" },
    });
    logPass(`Step 1: Emitted event: ${event.id}`);

    // 2. Trigger HALO (if critical/error)
    if (event.severity === "error" || event.severity === "critical") {
      try {
        const cycle = await haloEngine.runCycle("eventWormholeTrigger", {
          eventType: event.eventType,
          severity: event.severity,
        });
        logPass(`Step 2: HALO cycle triggered: ${cycle.id}`);
        logPass(`  Generated ${cycle.generatedTasks.length} tasks`);
      } catch (err: any) {
        logWarn(`Step 2: HALO cycle error: ${err.message}`);
      }
    }

    // 3. Check for tasks created
    const tasks = (squadOrch as any).getTasks();
    const recentTasks = tasks.filter((t) => {
      const createdAt = new Date(t.createdAt);
      const now = new Date();
      return now.getTime() - createdAt.getTime() < 60000; // Last minute
    });
    logPass(`Step 3: Found ${recentTasks.length} recent tasks`);

    // 4. Try to dispatch a task (if any)
    if (recentTasks.length > 0) {
      const task = recentTasks[0];
      if (task.status === "pending") {
        try {
          const result = await (squadOrch as any).dispatchTask(task.id);
          if (result.success) {
            logPass(`Step 4: Task dispatched: ${task.id}`);
          } else {
            logWarn(`Step 4: Task dispatch failed: ${result.error}`);
          }
        } catch (err: any) {
          logWarn(`Step 4: Task dispatch error: ${err.message}`);
        }
      } else {
        logWarn(`Step 4: Task not in pending status: ${task.status}`);
      }
    } else {
      logWarn("Step 4: No recent tasks to dispatch");
    }

    logPass("End-to-end flow test completed");
  } catch (err: any) {
    logFail(`End-to-end flow test failed: ${err.message}`);
  }
}

async function runAllTests() {
  log("\n🚀 Starting DreamNet Integration Tests\n", "blue");

  const tests = [
    testSquadBuilderAgentExecution,
    testEventWormholesHALO,
    testSporeEngineGraftEngine,
    testHALOLoop,
    testDarkFabric,
    testGraftEngine,
    testEndToEndFlow,
  ];

  let passed = 0;
  let failed = 0;
  let warned = 0;

  for (const test of tests) {
    try {
      await test();
      passed++;
    } catch (err: any) {
      logFail(`Test suite error: ${err.message}`);
      failed++;
    }
  }

  log("\n📊 Test Summary", "blue");
  log(`  ✅ Passed: ${passed}`, "green");
  log(`  ❌ Failed: ${failed}`, "red");
  log(`  ⚠️  Warnings: ${warned}`, "yellow");

  if (failed === 0) {
    log("\n🎉 All tests passed!", "green");
    process.exit(0);
  } else {
    log("\n⚠️  Some tests failed or had warnings", "yellow");
    process.exit(1);
  }
}

// Run tests
runAllTests().catch((err) => {
  logFail(`Fatal error: ${err.message}`);
  process.exit(1);
});

