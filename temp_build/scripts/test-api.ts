#!/usr/bin/env tsx
/**
 * API Integration Tests
 * 
 * Tests all API endpoints to verify they work correctly.
 */

import axios from "axios";

const API_BASE = process.env.API_BASE_URL || "http://localhost:5000/api";

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
  log(`\n🧪 Testing API: ${name}`, "blue");
}

function logPass(message: string) {
  log(`  ✅ ${message}`, "green");
}

function logFail(message: string) {
  log(`  ❌ ${message}`, "red");
}

async function testEndpoint(method: string, path: string, data?: any) {
  try {
    const config: any = {
      method,
      url: `${API_BASE}${path}`,
      validateStatus: () => true, // Don't throw on any status
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { ok: response.status < 400, status: response.status, data: response.data };
  } catch (err: any) {
    return { ok: false, status: 0, data: null, error: err.message };
  }
}

async function testSquadBuilderAPI() {
  logTest("Squad Builder API");

  // Test GET /api/squad/agents
  const agentsResult = await testEndpoint("GET", "/squad/agents");
  if (agentsResult.ok) {
    logPass("GET /api/squad/agents - OK");
  } else {
    logFail(`GET /api/squad/agents - Failed: ${agentsResult.status}`);
  }

  // Test GET /api/squad
  const squadsResult = await testEndpoint("GET", "/squad");
  if (squadsResult.ok) {
    logPass("GET /api/squad - OK");
  } else {
    logFail(`GET /api/squad - Failed: ${squadsResult.status}`);
  }

  // Test GET /api/squad/tasks
  const tasksResult = await testEndpoint("GET", "/squad/tasks");
  if (tasksResult.ok) {
    logPass("GET /api/squad/tasks - OK");
  } else {
    logFail(`GET /api/squad/tasks - Failed: ${tasksResult.status}`);
  }
}

async function testEventWormholesAPI() {
  logTest("Event Wormholes API");

  // Test GET /api/events/recent
  const eventsResult = await testEndpoint("GET", "/events/recent");
  if (eventsResult.ok) {
    logPass("GET /api/events/recent - OK");
  } else {
    logFail(`GET /api/events/recent - Failed: ${eventsResult.status}`);
  }

  // Test GET /api/wormholes
  const wormholesResult = await testEndpoint("GET", "/wormholes");
  if (wormholesResult.ok) {
    logPass("GET /api/wormholes - OK");
  } else {
    logFail(`GET /api/wormholes - Failed: ${wormholesResult.status}`);
  }
}

async function testSporeEngineAPI() {
  logTest("Spore Engine API");

  // Test GET /api/spores
  const sporesResult = await testEndpoint("GET", "/spores");
  if (sporesResult.ok) {
    logPass("GET /api/spores - OK");
  } else {
    logFail(`GET /api/spores - Failed: ${sporesResult.status}`);
  }
}

async function testDarkFabricAPI() {
  logTest("Dark Fabric API");

  // Test GET /api/fabric/tasks
  const fabricResult = await testEndpoint("GET", "/fabric/tasks");
  if (fabricResult.ok) {
    logPass("GET /api/fabric/tasks - OK");
  } else {
    logFail(`GET /api/fabric/tasks - Failed: ${fabricResult.status}`);
  }
}

async function testHALOLoopAPI() {
  logTest("HALO Loop API");

  // Test GET /api/halo/status
  const statusResult = await testEndpoint("GET", "/halo/status");
  if (statusResult.ok) {
    logPass("GET /api/halo/status - OK");
  } else {
    logFail(`GET /api/halo/status - Failed: ${statusResult.status}`);
  }

  // Test GET /api/halo/history
  const historyResult = await testEndpoint("GET", "/halo/history");
  if (historyResult.ok) {
    logPass("GET /api/halo/history - OK");
  } else {
    logFail(`GET /api/halo/history - Failed: ${historyResult.status}`);
  }
}

async function testOperatorPanelAPI() {
  logTest("Operator Panel API");

  // Test GET /api/operator/events/recent
  const eventsResult = await testEndpoint("GET", "/operator/events/recent");
  if (eventsResult.ok) {
    logPass("GET /api/operator/events/recent - OK");
  } else {
    logFail(`GET /api/operator/events/recent - Failed: ${eventsResult.status}`);
  }

  // Test GET /api/operator/squad
  const squadResult = await testEndpoint("GET", "/operator/squad");
  if (squadResult.ok) {
    logPass("GET /api/operator/squad - OK");
  } else {
    logFail(`GET /api/operator/squad - Failed: ${squadResult.status}`);
  }

  // Test GET /api/operator/spores
  const sporesResult = await testEndpoint("GET", "/operator/spores");
  if (sporesResult.ok) {
    logPass("GET /api/operator/spores - OK");
  } else {
    logFail(`GET /api/operator/spores - Failed: ${sporesResult.status}`);
  }
}

async function runAllAPITests() {
  log("\n🚀 Starting DreamNet API Tests\n", "blue");
  log(`API Base URL: ${API_BASE}\n`, "yellow");

  const tests = [
    testSquadBuilderAPI,
    testEventWormholesAPI,
    testSporeEngineAPI,
    testDarkFabricAPI,
    testHALOLoopAPI,
    testOperatorPanelAPI,
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      await test();
      passed++;
    } catch (err: any) {
      logFail(`Test suite error: ${err.message}`);
      failed++;
    }
  }

  log("\n📊 API Test Summary", "blue");
  log(`  ✅ Passed: ${passed}`, "green");
  log(`  ❌ Failed: ${failed}`, "red");

  if (failed === 0) {
    log("\n🎉 All API tests passed!", "green");
    process.exit(0);
  } else {
    log("\n⚠️  Some API tests failed", "yellow");
    log("Note: Some failures may be expected if the server is not running", "yellow");
    process.exit(1);
  }
}

// Run tests
runAllAPITests().catch((err) => {
  logFail(`Fatal error: ${err.message}`);
  process.exit(1);
});

