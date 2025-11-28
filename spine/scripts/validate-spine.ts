/**
 * Spine Validation Script
 * 
 * Validates that Spine Phase I components work correctly.
 * Run with: tsx spine/scripts/validate-spine.ts
 */

import { DreamEventBus } from "../dreamnet-event-bus/DreamEventBus.js";
import { createEventEnvelope } from "../dreamnet-event-bus/EventEnvelope.js";
import { RouteTable } from "../bgp-for-agents/RouteTable.js";
import { AgentInteropRegistry } from "../agent-interop/AgentInteropRegistry.js";
import { announceRoute, withdrawRoute } from "../bgp-for-agents/RouteAnnouncements.js";
import type { AgentRoute } from "../bgp-for-agents/AgentBGP.js";
import type { ProviderDescriptor } from "../agent-interop/ProviderDescriptor.js";

async function validateSpine(): Promise<void> {
  console.log("🔍 Validating DreamNet Interop Spine Phase I...\n");

  let passed = 0;
  let failed = 0;

  // Test 1: Event Bus
  console.log("1. Testing Event Bus...");
  try {
    const eventBus = new DreamEventBus();
    let eventReceived = false;

    const unsubscribe = eventBus.subscribe("Test.Event", (event) => {
      eventReceived = true;
      console.log(`   ✅ Event received: ${event.type} (ID: ${event.id})`);
    });

    const testEvent = createEventEnvelope({
      type: "Test.Event",
      source: "ValidationScript",
      payload: { test: true },
    });

    eventBus.publish(testEvent);
    
    if (eventReceived) {
      console.log("   ✅ Event Bus: publish/subscribe works");
      passed++;
    } else {
      throw new Error("Event not received");
    }

    // Test getEnvelope
    const retrieved = eventBus.getEnvelope(testEvent.id);
    if (retrieved && retrieved.id === testEvent.id) {
      console.log("   ✅ Event Bus: getEnvelope works");
      passed++;
    } else {
      throw new Error("getEnvelope failed");
    }

    unsubscribe();
  } catch (error: any) {
    console.error(`   ❌ Event Bus failed: ${error.message}`);
    failed++;
  }

  // Test 2: RouteTable
  console.log("\n2. Testing RouteTable...");
  try {
    const routeTable = new RouteTable();
    
    const testRoute: AgentRoute = {
      prefix: "code.generation",
      agentSystem: "antigravity-core",
      path: ["antigravity-core"],
      nextHop: {
        agentSystem: "antigravity-core",
        priority: 1,
      },
      originTime: Date.now(),
    };

    routeTable.addRoute(testRoute);
    const found = routeTable.lookup("code.generation");
    
    if (found && found.agentSystem === "antigravity-core") {
      console.log("   ✅ RouteTable: addRoute/lookup works");
      passed++;
    } else {
      throw new Error("Route not found");
    }

    const allRoutes = routeTable.getAllRoutes();
    if (allRoutes.length === 1) {
      console.log("   ✅ RouteTable: getAllRoutes works");
      passed++;
    } else {
      throw new Error("getAllRoutes failed");
    }

    routeTable.removeRoute("code.generation");
    const removed = routeTable.lookup("code.generation");
    if (!removed) {
      console.log("   ✅ RouteTable: removeRoute works");
      passed++;
    } else {
      throw new Error("Route not removed");
    }
  } catch (error: any) {
    console.error(`   ❌ RouteTable failed: ${error.message}`);
    failed++;
  }

  // Test 3: Agent Interop Registry
  console.log("\n3. Testing Agent Interop Registry...");
  try {
    const eventBus = new DreamEventBus();
    const registry = new AgentInteropRegistry(eventBus);
    
    let providerRegisteredEvent = false;
    eventBus.subscribe("Interop.Provider.Registered", () => {
      providerRegisteredEvent = true;
    });

    const testProvider: ProviderDescriptor = {
      id: "test-provider",
      type: "custom",
      name: "Test Provider",
      capabilities: ["test.capability"],
    };

    registry.registerProvider(testProvider);
    
    if (providerRegisteredEvent) {
      console.log("   ✅ Registry: registerProvider emits event");
      passed++;
    }

    const found = registry.getProvider("test-provider");
    if (found && found.name === "Test Provider") {
      console.log("   ✅ Registry: getProvider works");
      passed++;
    } else {
      throw new Error("Provider not found");
    }

    const byCapability = registry.supportsCapability("test.capability");
    if (byCapability.length === 1) {
      console.log("   ✅ Registry: supportsCapability works");
      passed++;
    } else {
      throw new Error("supportsCapability failed");
    }
  } catch (error: any) {
    console.error(`   ❌ Registry failed: ${error.message}`);
    failed++;
  }

  // Test 4: Route Announcements
  console.log("\n4. Testing Route Announcements...");
  try {
    const eventBus = new DreamEventBus();
    let routeAnnouncedEvent = false;
    
    eventBus.subscribe("Agent.Route.Announced", () => {
      routeAnnouncedEvent = true;
    });

    const testRoute: AgentRoute = {
      prefix: "test.prefix",
      agentSystem: "test-system",
      path: ["test-system"],
      nextHop: {
        agentSystem: "test-system",
      },
      originTime: Date.now(),
    };

    announceRoute(testRoute, eventBus);
    
    if (routeAnnouncedEvent) {
      console.log("   ✅ Route Announcements: announceRoute emits event");
      passed++;
    } else {
      throw new Error("Event not emitted");
    }

    let routeWithdrawnEvent = false;
    eventBus.subscribe("Agent.Route.Withdrawn", () => {
      routeWithdrawnEvent = true;
    });

    withdrawRoute(testRoute, eventBus);
    
    if (routeWithdrawnEvent) {
      console.log("   ✅ Route Announcements: withdrawRoute emits event");
      passed++;
    } else {
      throw new Error("Withdrawal event not emitted");
    }
  } catch (error: any) {
    console.error(`   ❌ Route Announcements failed: ${error.message}`);
    failed++;
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log("=".repeat(50));

  if (failed === 0) {
    console.log("\n🎉 All Spine Phase I components validated successfully!");
    process.exit(0);
  } else {
    console.log("\n⚠️  Some validations failed. Review errors above.");
    process.exit(1);
  }
}

// Run validation
validateSpine().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

