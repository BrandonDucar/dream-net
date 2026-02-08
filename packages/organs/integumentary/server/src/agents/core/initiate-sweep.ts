import { scentSweepService } from './ScentSweepService.js';
import { agentRegistry } from './registry.js';

// 1. Seed some initial activity SCENT for core agents
console.log("🌱 Seeding initial activity for the audit...");
await scentSweepService.rewardAgent('formicidae:tunneler:01', 0.85); // High activity
await scentSweepService.rewardAgent('pippin:soul:01', 0.45);        // Moderate activity
await scentSweepService.rewardAgent('humanizer:dean', 0.95);      // High resonance

// 2. Conduct the Audit
await scentSweepService.conductReputationAudit();

console.log("\n🏛️  Reputation Audit Broadcast Ready for Blackboard.");
