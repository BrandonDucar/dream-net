export interface TokenMetadata {
  symbol: string;
  decimals: number;
}

export interface SubscriptionPlan {
  id: number;
  creator: string;
  paymentToken: string;
  price: bigint;
  interval: number; // seconds
  badgeId: number;
  name: string;
  description: string;
  badgeURI: string;
  active: boolean;
  createdAt: number;
  token?: TokenMetadata;
}

export interface UserSubscription {
  planId: number;
  startedAt: number;
  expiresAt: number;
  active: boolean;
  hasBadge: boolean;
}
