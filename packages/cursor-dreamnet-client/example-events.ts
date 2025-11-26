/**
 * Example: Event Streaming
 * 
 * Run with: pnpm tsx packages/cursor-dreamnet-client/example-events.ts
 */

import {
  CursorDreamNetClient,
  CursorEventStream,
  StarbridgeTopic,
  createEventStream,
} from "./index.js";

async function main() {
  console.log("🚀 Cursor DreamNet Event Stream Example\n");

  // Check if API key is set
  const apiKey = process.env.DREAMNET_API_KEY;
  if (!apiKey) {
    console.error("❌ DREAMNET_API_KEY not set in environment");
    console.log("Set it with: export DREAMNET_API_KEY=your_key_here");
    process.exit(1);
  }

  // Create client
  const client = new CursorDreamNetClient({
    apiKey,
    baseUrl: process.env.DREAMNET_API_URL || "https://dreamnet.world",
  });

  // Validate API key first
  console.log("1️⃣ Validating API key...");
  const isValid = await client.validateApiKey();
  if (!isValid) {
    console.error("❌ API key is invalid");
    process.exit(1);
  }
  console.log("   ✅ API key valid\n");

  // Create event stream
  console.log("2️⃣ Creating event stream...");
  const stream = createEventStream(client, {
    topics: [
      StarbridgeTopic.System,
      StarbridgeTopic.Deploy,
      StarbridgeTopic.Governor,
    ],
    replay: true,
    autoReconnect: true,
    reconnectDelay: 5000,
    maxReconnectAttempts: 10,
  });
  console.log("   ✅ Event stream created\n");

  // Subscribe to all events
  console.log("3️⃣ Subscribing to events...");
  const unsubscribeAll = stream.onAll((event) => {
    console.log(`\n📨 Event received:`);
    console.log(`   Topic: ${event.topic}`);
    console.log(`   Type: ${event.type}`);
    console.log(`   Source: ${event.source}`);
    console.log(`   Time: ${event.ts.toISOString()}`);
    if (event.replayed) {
      console.log(`   ⏪ Replayed event`);
    }
    if (event.payload) {
      console.log(`   Payload: ${JSON.stringify(event.payload, null, 2).substring(0, 100)}...`);
    }
  });

  // Subscribe to specific topics
  const unsubscribeSystem = stream.onTopic(StarbridgeTopic.System, (event) => {
    console.log(`\n🔧 System Event: ${event.type}`);
  });

  const unsubscribeDeploy = stream.onTopic(StarbridgeTopic.Deploy, (event) => {
    console.log(`\n🚀 Deploy Event: ${event.type}`);
  });

  // Subscribe to connection events
  stream.on("connected", () => {
    console.log("\n✅ Connected to event stream!");
    const status = stream.getStatus();
    console.log(`   Topics: ${status.topics.join(", ")}`);
  });

  stream.on("disconnected", () => {
    console.log("\n⚠️  Disconnected from event stream");
  });

  // Connect
  console.log("4️⃣ Connecting to event stream...");
  try {
    await stream.connect();
    console.log("   ✅ Connected!\n");
  } catch (error: any) {
    console.error("   ❌ Connection failed:", error.message);
    process.exit(1);
  }

  // Show status
  console.log("5️⃣ Event stream status:");
  const status = stream.getStatus();
  console.log(`   Connected: ${status.connected}`);
  console.log(`   Topics: ${status.topics.join(", ")}`);
  console.log(`   Reconnect attempts: ${status.reconnectAttempts}`);
  if (status.lastEvent) {
    console.log(`   Last event: ${status.lastEvent.toISOString()}`);
  }
  console.log();

  // Keep running
  console.log("📡 Listening for events... (Press Ctrl+C to stop)\n");

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n\n🛑 Shutting down...");
    unsubscribeAll();
    unsubscribeSystem();
    unsubscribeDeploy();
    stream.disconnect();
    console.log("✅ Disconnected");
    process.exit(0);
  });

  // Keep process alive
  await new Promise(() => {});
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
}

