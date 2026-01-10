#!/usr/bin/env tsx
/**
 * Seed the heartbeat.lost wormhole preset
 * 
 * This script creates a wormhole that listens for heartbeat.lost events
 * and creates suggested repair tasks.
 */

// Use dynamic import to avoid ESM issues
async function getWormholeFunctions() {
  const mod = await import("../packages/event-wormholes/src/wormholeRegistry");
  return {
    createWormhole: (mod as any).createWormhole,
    listWormholes: (mod as any).listWormholes,
  };
}

const HEARTBEAT_WORMHOLE = {
  name: "Heartbeat lost → repair suggestion",
  description: "Automatically creates a suggested repair task when heartbeat is lost",
  from: {
    sourceType: "system",
    eventType: "heartbeat.lost",
  },
  to: {
    actionType: "create-task",
    targetAgentRole: "DeployKeeper",
  },
  filters: {
    minSeverity: "warning",
  },
  enabled: true,
};

async function seedHeartbeatWormhole() {
  try {
    const { createWormhole, listWormholes } = await getWormholeFunctions();
    
    // Check if wormhole already exists
    const existing = listWormholes().find(
      (w: any) => w.from.sourceType === "system" && w.from.eventType === "heartbeat.lost",
    );

    if (existing) {
      console.log("✅ Heartbeat wormhole already exists:", existing.id);
      return;
    }

    // Create the wormhole
    const wormhole = createWormhole(HEARTBEAT_WORMHOLE as any);
    console.log("✅ Created heartbeat wormhole:", wormhole.id);
    console.log("   Name:", wormhole.name);
    console.log("   Enabled:", wormhole.enabled);
  } catch (error) {
    console.error("❌ Failed to seed heartbeat wormhole:", error);
    process.exit(1);
  }
}

seedHeartbeatWormhole();

