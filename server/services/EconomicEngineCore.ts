/**
 * 💹 EconomicEngineCore
 * Manages the treasury, revenue calibration, and agent rewards for the DreamNet Swarm.
 */
export interface Transaction {
  id: string;
  source: string;
  amount: number;
  currency: string;
  timestamp: string;
  category: "grant" | "reward" | "trading" | "publication";
}

export class EconomicEngineCore {
  private treasuryBalance: number = 0;
  private transactions: Transaction[] = [];
  private monthlyBurn: number = 500; // Estimated burn for 17k agents (compute + API)
  private monthlyRevenue: number = 0;

  constructor() {
    console.log("💹 [EconomicEngineCore] Initializing Treasury...");
  }

  public async init() {
    // In production, fetch initial balance from on-chain wallet or db
    this.treasuryBalance = 10000; // Seeded for sustainability
    console.log(`💹 [EconomicEngineCore] Treasury initialized. Current Balance: ${this.treasuryBalance} USDC.`);
  }

  public async deposit(source: string, amount: number, category: Transaction["category"]) {
    const tx: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      source,
      amount,
      currency: "USDC",
      timestamp: new Date().toISOString(),
      category
    };

    this.transactions.push(tx);
    this.treasuryBalance += amount;
    
    if (category !== "grant") {
        this.monthlyRevenue += amount;
    }

    console.log(`💰 [EconomicEngineCore] Deposit: +${amount} ${tx.currency} from ${source} (${category})`);
    return tx;
  }

  public getSustainabilityScore() {
    // Ratio of revenue to burn. 1.0 = breaking even.
    if (this.monthlyBurn === 0) return 1.0;
    return Math.min(2.0, this.monthlyRevenue / this.monthlyBurn);
  }

  public getBalance() {
    return this.treasuryBalance;
  }

  public getRecentTransactions(limit: number = 10) {
    return this.transactions.slice(-limit).reverse();
  }

  public async run() {
    const sustainability = this.getSustainabilityScore();
    
    return {
      status: "active",
      balance: this.treasuryBalance,
      txCount: this.transactions.length,
      revenue: this.monthlyRevenue,
      burn: this.monthlyBurn,
      sustainability,
      health: sustainability >= 1.0 ? 1.0 : sustainability
    };
  }
}

export const economicEngineCore = new EconomicEngineCore();
