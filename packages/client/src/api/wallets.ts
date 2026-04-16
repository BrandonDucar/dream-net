/**
 * Wallets & CoinSensei API Helpers
 * Functions to fetch wallet and portfolio data
 */

export interface WalletData {
  address: string;
  balance?: number;
  tokens?: Array<{
    symbol: string;
    amount: number;
    value: number;
  }>;
  chains?: string[];
  lastUpdated?: number;
}

/**
 * Get wallet portfolio data
 */
export async function getWalletPortfolio(address: string): Promise<WalletData | null> {
  try {
    const response = await fetch(`/api/coinsensei/wallet/${address}`);
    if (!response.ok) throw new Error('Failed to fetch wallet portfolio');
    return await response.json();
  } catch (error) {
    console.error('Error fetching wallet portfolio:', error);
    return null;
  }
}

/**
 * Get all tracked wallets summary
 */
export async function getTrackedWalletsSummary() {
  try {
    const response = await fetch('/api/coinsensei/wallets/summary');
    if (!response.ok) throw new Error('Failed to fetch wallets summary');
    return await response.json();
  } catch (error) {
    console.error('Error fetching wallets summary:', error);
    return {
      totalWallets: 0,
      totalValue: 0,
      lastUpdated: null,
    };
  }
}

