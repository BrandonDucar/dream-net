// Shared token definitions
export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address?: string;
  chainId?: number;
  visible: boolean;
}

export const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    visible: true,
  },
  {
    symbol: 'DREAM',
    name: 'DreamNet',
    decimals: 18,
    visible: true,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    visible: true,
  },
];

export function getDefaultToken(): Token {
  return SUPPORTED_TOKENS[0];
}

export function getVisibleTokens(): Token[] {
  return SUPPORTED_TOKENS.filter(token => token.visible);
}

export function getTokenBySymbol(symbol: string): Token | undefined {
  return SUPPORTED_TOKENS.find(token => token.symbol === symbol);
}

export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
  const [whole, fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole + paddedFraction);
}

export function formatUnits(amount: bigint, decimals: number = 18): string {
  const amountStr = amount.toString();
  if (decimals === 0) return amountStr;

  if (amountStr.length <= decimals) {
    return `0.${amountStr.padStart(decimals, '0')}`;
  }

  const whole = amountStr.slice(0, -decimals);
  const fraction = amountStr.slice(-decimals);
  return `${whole}.${fraction}`;
}

export interface BountyEnhancement {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  cost: bigint;
  duration: number; // in hours
}

export const BOUNTY_ENHANCEMENTS: BountyEnhancement[] = [
  {
    id: 'speed',
    name: 'Speed Boost',
    description: 'Increases completion speed by 50%',
    multiplier: 1.5,
    cost: parseTokenAmount('10'),
    duration: 24,
  },
  {
    id: 'quality',
    name: 'Quality Boost',
    description: 'Improves result quality by 25%',
    multiplier: 1.25,
    cost: parseTokenAmount('15'),
    duration: 48,
  },
  {
    id: 'priority',
    name: 'Priority Queue',
    description: 'Moves to front of processing queue',
    multiplier: 2.0,
    cost: parseTokenAmount('25'),
    duration: 12,
  },
];

export function getEnhancementDescription(id: string): string {
  const enhancement = BOUNTY_ENHANCEMENTS.find(e => e.id === id);
  return enhancement?.description || 'Unknown enhancement';
}
