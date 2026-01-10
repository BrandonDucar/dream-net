
import fs from 'fs';
import path from 'path';
import { getAgentWalletManager, OctopusController } from '@dreamnet/agent-wallet-manager';
import dotenv from 'dotenv';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '../../.env.gcp') });

export class MetabolicRecommender {
    private inventoryPath = path.resolve(process.cwd(), 'audit_results.json');
    private manager;
    private octopus;

    constructor() {
        const mnemonic = process.env.MNEMONIC || "test test test test test test test test test test test junk";
        this.manager = getAgentWalletManager(mnemonic);
        this.octopus = new OctopusController(this.manager, "dreamnet_brain");
    }

    public async analyze() {
        if (!fs.existsSync(this.inventoryPath)) {
            console.error("[Recommender] No audit_results.json found. Run Auditor first.");
            return;
        }

        const inventory = JSON.parse(fs.readFileSync(this.inventoryPath, 'utf8'));
        await this.octopus.awaken();
        const arms = this.octopus.getArmStatus();

        console.log(`\n🧠 [Metabolic Recommender] Analyzing ${inventory.length} assets...`);
        console.log(`----------------------------------------------------------`);

        const proposals: any[] = [];

        // 1. Identify "Fuelable" ETH (Idle small amounts)
        const idleEth = inventory.filter((i: any) => i.symbol === 'ETH' && i.usdValue > 1 && i.usdValue < 10);
        if (idleEth.length > 0) {
            const opsArm = arms.find(a => a.type === 'OPERATIONS_FUND');
            proposals.push({
                type: "FUELING",
                asset: "ETH",
                source: idleEth[0].purpose,
                target: `Agent: OPERATIONS_FUND (${opsArm?.address})`,
                amount: "0.0005 ETH",
                reason: "Provide gas for server-side agent operations."
            });
        }

        // 2. Identify SOL for Experimentation (User specifically requested this)
        const solBalance = inventory.find((i: any) => i.symbol === 'SOL');
        if (solBalance) {
            const researchArm = arms.find(a => a.type === 'RESEARCH_GRANT');
            proposals.push({
                type: "EXPERIMENTATION",
                asset: "SOL",
                source: "PHANTOM",
                target: `Agent: RESEARCH_GRANT (${researchArm?.address})`,
                amount: solBalance.balance,
                reason: "Full handover of Phantom SOL for agentic trading experiments."
            });
        }

        // 3. Strategic Yield (Liquidity Seeding)
        const usdc = inventory.find((i: any) => i.symbol === 'USDC' && i.chain === 'Base');
        if (usdc) {
            const defiArm = arms.find(a => a.type === 'DEFI_LIQUIDITY');
            proposals.push({
                type: "STRATEGIC_YIELD",
                asset: "USDC",
                source: "BASE",
                target: `Agent: DEFI_LIQUIDITY (${defiArm?.address})`,
                amount: "1.00 USDC",
                reason: "Seed SLU liquidity pool testing."
            });
        }

        // Display Proposals
        proposals.forEach((p, idx) => {
            console.log(`\n[Proposal #${idx + 1}] [${p.type}]`);
            console.log(`   Action: Move ${p.amount} ${p.asset} from ${p.source}`);
            console.log(`   Target: ${p.target}`);
            console.log(`   Reason: ${p.reason}`);
        });

        console.log(`\n[Summary] Total Actionable Proposals: ${proposals.length}`);
        console.log(`[Next Step] Use the Sovereign HUD to approve these metabolic transfers.`);
    }
}

if (import.meta.url.includes(process.argv[1].replace(/\\/g, '/')) || process.argv[1].endsWith('MetabolicRecommender.ts')) {
    new MetabolicRecommender().analyze().catch(console.error);
}
