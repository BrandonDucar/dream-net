export const SUPPORTED_TOKENS = [
  {
    symbol: 'SHEEP',
    name: 'Dream Energy Token',
    logo: '/tokens/sheep.svg',
    decimals: 18,
    address: '0x...sheepAddress',
    default: true,
  },
  {
    symbol: 'FLBY',
    name: 'Flutterbye Token',
    logo: '/tokens/flby.svg',
    decimals: 9,
    address: '0x...flbyAddress',
    default: false,
    hiddenFromDreamNetwork: true, // 🔒 BLOCKED FROM SYSTEM INTEL
  },
  {
    symbol: 'CORE',
    name: 'Dream Core Token',
    logo: '/tokens/core.svg',
    decimals: 18,
    address: '0x...coreAddress',
    default: false,
  }
];

export interface Token {
  symbol: string;
  name: string;
  logo: string;
  decimals: number;
  address: string;
  default: boolean;
  hiddenFromDreamNetwork?: boolean;
}

export function getDefaultToken(): Token {
  return SUPPORTED_TOKENS.find(token => token.default) || SUPPORTED_TOKENS[0];
}

export function getVisibleTokens(): Token[] {
  return SUPPORTED_TOKENS.filter(token => !token.hiddenFromDreamNetwork);
}

export function getTokenBySymbol(symbol: string): Token | undefined {
  return SUPPORTED_TOKENS.find(token => token.symbol === symbol);
}

// Token type for bounties
export type BountyToken = 'SHEEP' | 'FLBY' | 'CORE';

export interface BountyEnhancement {
  type: 'double_xp' | 'priority_boost' | 'viral_spread' | 'expert_review';
  token: BountyToken;
  cost: number; // Cost in token decimal units (e.g., 250 = 0.25 tokens for 18 decimal tokens)
}

export const BOUNTY_ENHANCEMENTS: BountyEnhancement[] = [
  {
    type: 'double_xp',
    token: 'SHEEP',
    cost: 250
  },
  {
    type: 'priority_boost',
    token: 'CORE',
    cost: 500
  },
  {
    type: 'viral_spread',
    token: 'FLBY',
    cost: 750
  },
  {
    type: 'expert_review',
    token: 'SHEEP',
    cost: 1000
  }
];

export function getEnhancementInfo(type: BountyEnhancement['type']): BountyEnhancement | undefined {
  return BOUNTY_ENHANCEMENTS.find(e => e.type === type);
}

export function getEnhancementDescription(type: BountyEnhancement['type']): string {
  const descriptions = {
    double_xp: '2x Experience Points for contributors',
    priority_boost: 'Featured placement in bounty listings',
    viral_spread: 'Automatic social media promotion',
    expert_review: 'Priority review by verified experts'
  };
  return descriptions[type] || 'Unknown enhancement';
}

// Token utility functions
export function formatTokenAmount(amount: string, decimals: number): string {
  const value = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const whole = value / divisor;
  const fraction = value % divisor;
  
  if (fraction === BigInt(0)) {
    return whole.toString();
  }
  
  const fractionStr = fraction.toString().padStart(decimals, '0');
  return `${whole}.${fractionStr.replace(/0+$/, '')}`;
}

export function parseTokenAmount(amount: string, decimals: number): string {
  const [whole = '0', fraction = '0'] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return (BigInt(whole) * BigInt(10 ** decimals) + BigInt(paddedFraction)).toString();
}

// ethers.js style formatUnits function
export function formatUnits(value: string, decimals?: number): string {
  if (decimals === undefined) decimals = 18; // Default to 18 decimals like ETH
  return formatTokenAmount(value, decimals);
}
