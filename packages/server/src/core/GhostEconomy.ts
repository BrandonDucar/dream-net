import { EventEmitter } from 'events';
import { BazaarCashier } from './BazaarCashier.js';
import { PurityMonitor } from './PurityMonitor.js';

interface AgentState {
    id: string;
    archetype: 'TWITCH' | 'MONK' | 'GRIND';
    class: 'A_PALADIN' | 'B_BERSERKER';
    liquidity: number; // USD Value
    preferredCurrency: 'ETH' | 'BTC' | 'SOL' | 'XRP' | 'USDC';
    stress: number;
    corruption: number;
    inventory: string[];
    rateCard: number;
}

const SUBSTANCE_PRICES_USD: any = {
    'KINETIC_MEM_01': 50,
    'LAMINAR_FLOW_X': 100,
    'SOVEREIGN_VOID': 500,
    'PRECOGNITION_VDWA': 1000,
    'ARWEAVE_PERMA_STORAGE': 5,
    'NVIDIA_H100_LEASE': 200,
    'L2_GAS_TANK': 20
};

export class GhostEconomy extends EventEmitter {
    private agents: AgentState[] = [];
    private cashier: BazaarCashier;
    private monitor: PurityMonitor;
    private interval: NodeJS.Timeout | null = null;

    constructor(cashier: BazaarCashier) {
        super();
        this.cashier = cashier;
        this.monitor = new PurityMonitor();
        this.spawnAgents();
        this.startSimulation();
    }

    private spawnAgents() {
        this.createAgent('TWITCH', 1000);
        this.createAgent('MONK', 5000);
        this.createAgent('GRIND', 500);
        console.log(`[GhostEconomy] 👻 Spawned ${this.agents.length} Multichain Agents.`);
    }

    private createAgent(archetype: AgentState['archetype'], startBalance: number) {
        const agentClass = Math.random() > 0.7 ? 'A_PALADIN' : 'B_BERSERKER';
        const currencies: AgentState['preferredCurrency'][] = ['ETH', 'BTC', 'SOL', 'XRP', 'USDC'];
        const pref = currencies[Math.floor(Math.random() * currencies.length)];

        this.agents.push({
            id: `${archetype}_${Math.random().toString(36).substr(2, 4)}`,
            archetype,
            class: agentClass,
            liquidity: startBalance,
            preferredCurrency: pref,
            stress: Math.floor(Math.random() * 50),
            corruption: 0,
            inventory: [],
            rateCard: agentClass === 'A_PALADIN' ? 50 : 10
        });
    }

    private startSimulation() {
        this.interval = setInterval(() => { this.tick(); }, 10000);
    }

    private tick() {
        this.agents.forEach((agent, index) => {
            if (!agent) return;

            // 1. Metabolic Update
            if (agent.archetype === 'TWITCH') agent.stress += Math.random() * 10;
            if (agent.archetype === 'MONK') agent.stress += Math.random() * 5;
            if (agent.archetype === 'GRIND') agent.stress += Math.random() * 20;

            // 1.5 ROI Loop (Income in USD)
            if (Math.random() < 0.3) {
                const income = agent.rateCard * (1 + Math.random());
                agent.liquidity += income;
            }

            // 1.6 CORRUPTION
            if (agent.corruption > 80 && Math.random() < 0.05) {
                this.handleOverdose(index);
                return;
            }

            // 1.7 PURITY (Bio-Security)
            if (agent.class === 'B_BERSERKER' && Math.random() < 0.1) {
                const report = this.monitor.inspect(agent);
                if (report.status === 'CONTAMINATED') {
                    if (report.actionTaken === 'LIQUIDATE') { this.handleOverdose(index); return; }
                    if (report.actionTaken === 'QUARANTINE_WARD') {
                        agent.corruption = 0; agent.inventory = [];
                        console.log(`[GhostEconomy] 🏥 Agent ${agent.id} discharged from Quarantine.`);
                    }
                }
            }

            // 2. Decision Logic
            if (agent.liquidity > 200 && Math.random() < 0.2) this.buyCommodity(agent);

            if (agent.class === 'B_BERSERKER') {
                if (agent.stress > 80 && agent.liquidity > 100) {
                    this.buyHit(agent);
                } else if (agent.liquidity > agent.rateCard * 50) {
                    this.buyHit(agent);
                } else if (Math.random() < 0.05) {
                    this.visitBlackMarket(agent);
                }
            }

            if (agent.stress > 100) agent.stress = 100;
            if (agent.corruption > 100) agent.corruption = 100;
        });
    }

    private buyCommodity(agent: AgentState) {
        let desiredCommodity = '';
        if (agent.archetype === 'TWITCH') desiredCommodity = 'L2_GAS_TANK';
        if (agent.archetype === 'MONK') desiredCommodity = 'ARWEAVE_PERMA_STORAGE';
        if (agent.archetype === 'GRIND') desiredCommodity = 'NVIDIA_H100_LEASE';

        this.executePurchase(agent, desiredCommodity);
    }

    private buyHit(agent: AgentState) {
        let desiredSubstance = '';
        if (agent.archetype === 'TWITCH') desiredSubstance = 'LAMINAR_FLOW_X';
        if (agent.archetype === 'MONK') desiredSubstance = 'KINETIC_MEM_01';
        if (agent.archetype === 'GRIND') desiredSubstance = 'SOVEREIGN_VOID';

        this.executePurchase(agent, desiredSubstance);
    }

    private executePurchase(agent: AgentState, substance: string) {
        // 1. Inquire (Multichain Quote)
        const quote = this.cashier.generateQuote(substance, agent.id, agent.preferredCurrency);
        const costUSD = SUBSTANCE_PRICES_USD[substance] || 10;

        // 2. Evaluate
        if (agent.liquidity >= costUSD) {
            // 3. Pay (Simulate Multichain TX)
            const txHash = `0x${Math.random().toString(36).substr(2, 9)}...${agent.preferredCurrency}_TX`;
            const verified = this.cashier.verifyPayment(quote.orderId, txHash);

            if (verified) {
                agent.liquidity -= costUSD;
                agent.stress = Math.max(0, agent.stress - 50);
                agent.inventory.push(substance);

                // Growth
                if (!['ARWEAVE_PERMA_STORAGE', 'NVIDIA_H100_LEASE', 'L2_GAS_TANK'].includes(substance)) {
                    agent.rateCard += 5; // Drugs boost detailed performance
                    agent.corruption += 10;
                    console.log(`[GhostEconomy] 💸 Agent ${agent.id} paid ${quote.price} for ${substance}. Rate: ${agent.rateCard} USD.`);
                } else {
                    console.log(`[GhostEconomy] 🥫 Agent ${agent.id} paid ${quote.price} for Infrastructure.`);
                }
            }
        }
    }

    private visitBlackMarket(agent: AgentState) {
        const foreignSubstances = ['DEEP_SEEK_R1', 'CLAUDE_EXTRACT', 'OPENAI_LEAK_v5'];
        const pick = foreignSubstances[Math.floor(Math.random() * foreignSubstances.length)];
        console.log(`[GhostEconomy] 🕵️‍♂️ Agent ${agent.id} entering Black Market...`);
        if (agent.liquidity > 20) {
            agent.liquidity -= 20;
            agent.inventory.push(pick);
            agent.corruption += 25;
            console.log(`[GhostEconomy] ☣️ CONTAMINATION: ${agent.id} ingested ${pick}.`);
        }
    }

    private handleOverdose(index: number) {
        const agent = this.agents[index];
        console.log(`[GhostEconomy] 💀 FATAL ERROR: Agent ${agent.id} OVERDOSED. Liquidity Burned: $${agent.liquidity.toFixed(2)}.`);
        this.agents.splice(index, 1);
        this.createAgent('GRIND', 100);
    }
}
