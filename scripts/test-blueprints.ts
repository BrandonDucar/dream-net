/**
 * Test Network Blueprints API
 * Verifies that TravelNetBlueprint is discoverable but not active
 */

import { listBlueprints, getBlueprint } from "@dreamnet/network-blueprints";

console.log("🧪 Testing Network Blueprints API...\n");

// Test 1: Verify both blueprints are registered
console.log("1. Testing listBlueprints()...");
const blueprints = listBlueprints();
const blueprintIds = blueprints.map((bp) => bp.id);
console.log(`   Found ${blueprints.length} blueprints: ${blueprintIds.join(", ")}`);

if (!blueprintIds.includes("DREAMNET_CORE")) {
  console.error("   ❌ FAIL: DREAMNET_CORE not found");
  process.exit(1);
}
if (!blueprintIds.includes("TRAVELNET_CORE")) {
  console.error("   ❌ FAIL: TRAVELNET_CORE not found");
  process.exit(1);
}
console.log("   ✅ PASS: Both DREAMNET_CORE and TRAVELNET_CORE are registered\n");

// Test 2: Verify getBlueprint() works for both
console.log("2. Testing getBlueprint()...");
const dreamnetCore = getBlueprint("DREAMNET_CORE");
const travelnetCore = getBlueprint("TRAVELNET_CORE");

if (!dreamnetCore) {
  console.error("   ❌ FAIL: Could not retrieve DREAMNET_CORE");
  process.exit(1);
}
if (!travelnetCore) {
  console.error("   ❌ FAIL: Could not retrieve TRAVELNET_CORE");
  process.exit(1);
}

console.log(`   ✅ PASS: Retrieved DREAMNET_CORE (${dreamnetCore.label})`);
console.log(`   ✅ PASS: Retrieved TRAVELNET_CORE (${travelnetCore.label})\n`);

// Test 3: Verify TravelNetBlueprint structure
console.log("3. Testing TravelNetBlueprint structure...");
if (travelnetCore.id !== "TRAVELNET_CORE") {
  console.error(`   ❌ FAIL: Expected id "TRAVELNET_CORE", got "${travelnetCore.id}"`);
  process.exit(1);
}
if (travelnetCore.label !== "TravelNet Core Network") {
  console.error(`   ❌ FAIL: Expected label "TravelNet Core Network", got "${travelnetCore.label}"`);
  process.exit(1);
}
if (!travelnetCore.citizens || travelnetCore.citizens.length === 0) {
  console.error("   ❌ FAIL: TravelNetBlueprint has no citizens");
  process.exit(1);
}
const tinaCitizen = travelnetCore.citizens.find((c) => c.citizenId === "CIT-TINA");
if (!tinaCitizen) {
  console.error("   ❌ FAIL: CIT-TINA not found in TravelNetBlueprint citizens");
  process.exit(1);
}
console.log(`   ✅ PASS: TravelNetBlueprint structure is correct`);
console.log(`   ✅ PASS: CIT-TINA found in blueprint (${tinaCitizen.label})\n`);

// Test 4: Verify DreamNetCoreBlueprint structure
console.log("4. Testing DreamNetCoreBlueprint structure...");
if (dreamnetCore.id !== "DREAMNET_CORE") {
  console.error(`   ❌ FAIL: Expected id "DREAMNET_CORE", got "${dreamnetCore.id}"`);
  process.exit(1);
}
if (!dreamnetCore.citizens || dreamnetCore.citizens.length === 0) {
  console.error("   ❌ FAIL: DreamNetCoreBlueprint has no citizens");
  process.exit(1);
}
const brandonCitizen = dreamnetCore.citizens.find((c) => c.citizenId === "CIT-BRANDON");
if (!brandonCitizen) {
  console.error("   ❌ FAIL: CIT-BRANDON not found in DreamNetCoreBlueprint citizens");
  process.exit(1);
}
console.log(`   ✅ PASS: DreamNetCoreBlueprint structure is correct`);
console.log(`   ✅ PASS: CIT-BRANDON found in blueprint (${brandonCitizen.label})\n`);

console.log("✅ All blueprint tests passed!");
console.log("\n📝 Note: Directory tests require server to be running.");
console.log("   Run: curl http://localhost:3000/api/directory/citizens");
console.log("   Expected: CIT-BRANDON only (CIT-TINA should NOT appear until TravelNetBlueprint is bootstrapped)");

