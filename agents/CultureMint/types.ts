/**
 * CultureMint Agent Types
 * Mints culturecoins and manages token creation
 */

export interface CultureMintTask {
  mint: {
    name: string;
    symbol: string;
    supply?: number;
    metadata?: any;
  };
  deploy: {
    contract: string;
    network?: string;
  };
}

export interface CultureMintOutput {
  mint: {
    tokenAddress: string;
    transactionHash: string;
    metadata: any;
  };
  deploy: {
    contractAddress: string;
    network: string;
    status: string;
  };
}


