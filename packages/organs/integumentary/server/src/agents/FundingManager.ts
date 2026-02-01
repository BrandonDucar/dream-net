
import { ethers } from 'ethers';
import { getAgentWalletManager, OctopusController } from '@dreamnet/agent-wallet-manager';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '../../.env.gcp') });

export class FundingManager {
    private manager;
    private octopus;

    constructor() {
        const mnemonic = process.env.MNEMONIC || "test test test test test test test test test test test junk";
        this.manager = getAgentWalletManager(mnemonic);
        this.octopus = new OctopusController(this.manager, "dreamnet_brain");
    }

    public async displayFuelingStation() {
        console.log(`\n🐙 [Octopus] Metabolic Fueling Station`);
        console.log(`-------------------------------------------`);

        await this.octopus.awaken();
        const arms = this.octopus.getArmStatus();

        console.log(`\n[Funding] ⚡ PROPOSED TOP-UP TARGETS:`);

        const targets = [
            { arm: "OPERATIONS_FUND", amount: "0.0005 ETH", chain: "Base", reason: "Server gas & upkeep" },
            { arm: "DEFI_LIQUIDITY", amount: "1.00 USDC", chain: "Base", reason: "SLU Seed testing" },
            { arm: "ZORA_MINTING", amount: "0.0002 ETH", chain: "Base", reason: "Memory preservation" },
            { arm: "RESEARCH_GRANT", amount: "0.004 SOL", chain: "Solana", reason: "Phantom experimentation" }
        ];

        targets.forEach(t => {
            const arm = arms.find(a => a.type === t.arm);
            if (arm) {
                console.log(`\n📍 ${t.arm}`);
                console.log(`   Address: ${arm.address}`);
                console.log(`   Target:  ${t.amount} (${t.chain})`);
                console.log(`   Purpose: ${t.reason}`);
            }
        });

        console.log(`\n[Funding] 💡 INSTRUCTION: Send the micro-balances found by the Auditor to these addresses to activate the agent fleet.`);
    }
}

if (import.meta.url.includes(process.argv[1].replace(/\\/g, '/')) || process.argv[1].endsWith('FundingManager.ts')) {
    new FundingManager().displayFuelingStation().catch(console.error);
}
