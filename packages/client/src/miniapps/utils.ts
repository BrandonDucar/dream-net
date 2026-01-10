/**
 * Mini App Utilities
 * Helper functions for Base mini apps
 */

import { ethers } from 'ethers';
import { TokenBalance } from './types.js';

/**
 * Get ERC20 token balance
 */
export async function getTokenBalance(
  provider: ethers.BrowserProvider,
  tokenAddress: string,
  userAddress: string
): Promise<TokenBalance | null> {
  try {
    // ERC20 ABI (minimal - just balanceOf, decimals, symbol)
    const erc20Abi = [
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)',
    ];

    const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
    
    const [balance, decimals, symbol] = await Promise.all([
      contract.balanceOf(userAddress),
      contract.decimals(),
      contract.symbol(),
    ]);

    const formatted = ethers.formatUnits(balance, decimals);

    return {
      address: tokenAddress,
      symbol,
      decimals: Number(decimals),
      balance: balance.toString(),
      formatted,
    };
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return null;
  }
}

/**
 * Format address for display
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format token amount
 */
export function formatTokenAmount(amount: string, decimals = 18, precision = 4): string {
  try {
    const formatted = ethers.formatUnits(amount, decimals);
    const num = parseFloat(formatted);
    return num.toFixed(precision);
  } catch {
    return '0';
  }
}

/**
 * Check if address is valid
 */
export function isValidAddress(address: string): boolean {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Get Base network info
 */
export function getBaseNetworkInfo(chainId: number) {
  const networks = {
    8453: {
      name: 'Base Mainnet',
      explorer: 'https://basescan.org',
      rpc: 'https://mainnet.base.org',
    },
    84532: {
      name: 'Base Sepolia',
      explorer: 'https://sepolia.basescan.org',
      rpc: 'https://sepolia.base.org',
    },
  };

  return networks[chainId as keyof typeof networks] || null;
}

/**
 * Create transaction link
 */
export function getTransactionLink(txHash: string, chainId: number): string {
  const network = getBaseNetworkInfo(chainId);
  if (!network) return '#';
  return `${network.explorer}/tx/${txHash}`;
}

/**
 * Create address link
 */
export function getAddressLink(address: string, chainId: number): string {
  const network = getBaseNetworkInfo(chainId);
  if (!network) return '#';
  return `${network.explorer}/address/${address}`;
}

