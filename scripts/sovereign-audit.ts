import { BaseAgent } from '../packages/organs/nervous/trading-organ/BaseAgent.js';
import { SolanaAgent } from '../packages/organs/nervous/trading-organ/SolanaAgent.js';

// Load keys from ENV
const METAMASK_PK = '83a901f657e80f470d63e2be5baa753da5b81ec31a55195862a9c32e469e8c80';
const PHANTOM_PK = '2JKguBFypiuPKs2AjReuuiyyaCaJvw9zY4m9je4XDu6ZmUyPHeR68MqwRKpXhjCYoYfxxZmw4fkevZNfeaj6FKkk';

async function performUnifiedAudit() {
    console.log("💎 [Sovereign Audit] Initiating Unified Multi-Chain Health Check...");

    const baseAgent = new BaseAgent(METAMASK_PK);
    const solanaAgent = new SolanaAgent(PHANTOM_PK);

    try {
        console.log("\n🔵 [BASE AUDIT]");
        const baseAssets = await baseAgent.fullAudit();
        console.table(baseAssets);
    } catch (e: any) {
        console.error(`❌ [BASE] Audit Failed: ${e.message}`);
    }

    try {
        console.log("\n🟣 [SOLANA AUDIT]");
        const solAssets = await solanaAgent.fullAudit();
        console.table(solAssets);
    } catch (e: any) {
        console.error(`❌ [SOLANA] Audit Failed: ${e.message}`);
    }

    console.log("\n✅ Audit Complete. All citizens aligned.");
}

performUnifiedAudit().catch(console.error);
