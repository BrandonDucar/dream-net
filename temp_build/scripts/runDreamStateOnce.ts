/**
 * Run Dream State cycle once
 * Initializes government, symbols, diplomatic relations
 */

import { DreamStateCore } from "@dreamnet/dream-state-core";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";

const ctx = {
  identityGrid: undefined,
  wolfPackFundingCore: WolfPackFundingCore,
  economicEngineCore: undefined,
  narrativeField: undefined,
  neuralMesh: undefined,
  agentRegistryCore: undefined,
};

async function main() {
  console.log("===============================================");
  console.log(" Dream State - Single Cycle");
  console.log("===============================================");
  console.log("");

  // Run Dream State cycle
  const status = DreamStateCore.run(ctx);

  console.log("✅ Cycle Complete");
  console.log(`Citizens: ${status.citizenCount}`);
  console.log(`Passports: ${status.passportCount}`);
  console.log(`Departments: ${status.departmentCount}`);
  console.log(`Diplomatic Relations: ${status.diplomaticRelationsCount}`);
  console.log(`Head of State: ${status.headOfState}`);
  console.log("");

  console.log("📊 Government Structure:");
  status.sampleDepartments.forEach((dept) => {
    console.log(`  - ${dept.name} (${dept.packId})`);
  });
  console.log("");

  console.log("🌍 Diplomatic Relations:");
  status.sampleDiplomaticRelations.forEach((rel) => {
    console.log(`  - ${rel.protocolName} (${rel.protocolType}): ${rel.status}`);
  });
  console.log("");

  console.log("🏛️ State Symbols:");
  status.stateSymbols.forEach((symbol) => {
    console.log(`  - ${symbol.name} (${symbol.type})`);
  });
  console.log("");

  console.log("📜 Recent Actions:");
  status.recentActions.slice(0, 5).forEach((action) => {
    console.log(`  - [${action.type}] ${action.department}: ${action.action}`);
  });
  console.log("");

  console.log("===============================================");
  console.log(" Dream State Status");
  console.log("===============================================");
}

main().catch(console.error);

