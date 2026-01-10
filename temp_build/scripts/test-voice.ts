/**
 * Test DreamNet Voice (Twilio SMS)
 * Quick test script to verify SMS integration
 */

import { DreamNetVoiceTwilio } from "@dreamnet/dreamnet-voice-twilio";
import { bridgeToSpiderWeb } from "@dreamnet/dreamnet-operational-bridge";
import { APIKeeperCore } from "@dreamnet/api-keeper-core";

async function testVoice() {
  console.log("🧪 Testing DreamNet Voice (Twilio SMS)...\n");

  // 0. Check for Twilio credentials
  console.log("0️⃣ Checking for Twilio credentials...");
  APIKeeperCore.forceDiscovery(); // Force auto-discovery of keys
  const twilioKeys = APIKeeperCore.listKeysForProvider("twilio");
  console.log(`   Found ${twilioKeys.length} Twilio key(s) in API Keeper`);
  if (twilioKeys.length === 0) {
    console.log("   💡 Checking environment variables directly...");
    if (process.env.TWILIO_ACCOUNT_SID) {
      console.log("   ✅ TWILIO_ACCOUNT_SID found in env");
    } else {
      console.log("   ❌ TWILIO_ACCOUNT_SID not found in env");
    }
    if (process.env.TWILIO_AUTH_TOKEN) {
      console.log("   ✅ TWILIO_AUTH_TOKEN found in env");
    } else {
      console.log("   ❌ TWILIO_AUTH_TOKEN not found in env");
    }
    if (process.env.TWILIO_PHONE_NUMBER) {
      console.log("   ✅ TWILIO_PHONE_NUMBER found in env");
    } else {
      console.log("   ❌ TWILIO_PHONE_NUMBER not found in env");
    }
    console.log("   📱 Recipient: +15613378933 (configured as default)");
  }
  console.log("");

  // 1. Initialize Voice
  console.log("1️⃣ Initializing Voice...");
  const initialized = await DreamNetVoiceTwilio.init();
  if (!initialized) {
    console.error("❌ Voice not initialized. Check Twilio credentials.");
    process.exit(1);
  }
  console.log("✅ Voice initialized\n");

  // 2. Check status
  console.log("2️⃣ Checking status...");
  const status = DreamNetVoiceTwilio.status();
  console.log("Status:", status);
  console.log("");

  // 3. Test direct SMS send
  console.log("3️⃣ Sending test SMS to +15613378933...");
  const result = await DreamNetVoiceTwilio.send({
    to: "+15613378933",
    body: "🧪 Test message from DreamNet Voice - Phase 2 One Mouth is working!",
  });
  
  if (result.success) {
    console.log(`✅ SMS sent successfully! SID: ${result.sid}\n`);
  } else {
    console.error(`❌ Failed to send SMS: ${result.error}\n`);
  }

  // 4. Test event routing (simulate Wolf Pack win)
  console.log("4️⃣ Testing event routing (Wolf Pack win)...");
  const wolfPackEvent = {
    type: "wolf-pack-win",
    severity: "high" as const,
    message: "Wolf Pack found a hot lead",
    metadata: {
      target: "Acme Corp",
      leadScore: 95,
    },
    timestamp: Date.now(),
  };

  const routed = await DreamNetVoiceTwilio.routeEvent(wolfPackEvent);
  if (routed.sent) {
    console.log("✅ Event routed to SMS successfully!\n");
  } else {
    console.log(`⚠️  Event not sent: ${routed.reason}\n`);
  }

  // 5. Test Spider Web bridge (simulate Shield threat)
  console.log("5️⃣ Testing Spider Web bridge (Shield threat)...");
  const shieldEvent = {
    type: "shield-threat",
    severity: "critical" as const,
    message: "Shield Core blocked a critical threat",
    metadata: {
      threatType: "unauthorized_access",
    },
    timestamp: Date.now(),
  };

  bridgeToSpiderWeb(shieldEvent);
  console.log("✅ Event bridged to Spider Web (will route to SMS if configured)\n");

  // 6. Get stats
  console.log("6️⃣ Message statistics:");
  const stats = DreamNetVoiceTwilio.getStats();
  console.log(stats);
  console.log("");

  console.log("✅ Voice test complete!");
}

testVoice().catch(console.error);

