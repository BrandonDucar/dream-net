/**
 * VeChain Core Types
 * Type definitions for VeChain integration
 */

export type VeChainNetwork = 'mainnet' | 'testnet';

export interface VeChainConfig {
  network: VeChainNetwork;
  rpcUrl: string;
  walletAddress?: string;
}

export interface DreamProduct {
  dreamId: string;
  productId: string;
  vechainTxHash: string;
  manufacturing: {
    location: string;
    timestamp: Date;
    certifications: string[];
  };
  shipping: {
    currentLocation: string;
    estimatedDelivery: Date;
    trackingEvents: TrackingEvent[];
  };
  authenticity: {
    verified: boolean;
    verificationDate: Date;
    qrCode: string;
  };
}

export interface TrackingEvent {
  location: string;
  timestamp: Date;
  status: 'manufactured' | 'shipped' | 'in-transit' | 'delivered' | 'returned';
  notes?: string;
}

export interface SustainabilityRecord {
  dreamId: string;
  carbonOffset: number; // kg CO2
  energySaved: number; // kWh
  vechainTxHash: string;
  verifiedBy: string; // VeBetter DAO
  timestamp: Date;
}

export interface DreamNFT {
  dreamId: string;
  vechainTokenId: string;
  owner: string;
  metadata: {
    dream: DreamMetadata;
    tokens?: TokenBalance[];
    physicalProduct?: ProductClaim;
    governance?: GovernanceRights;
  };
  programmable: {
    autoEvolve: boolean;
    rewardDistribution?: RewardRule[];
    eventHandlers?: EventHandler[];
  };
}

export interface DreamMetadata {
  title: string;
  description: string;
  creator: string;
  createdAt: Date;
  dreamCloud?: string;
  tags?: string[];
}

export interface TokenBalance {
  symbol: string;
  amount: string;
  address: string;
}

export interface ProductClaim {
  productId: string;
  claimable: boolean;
  claimed: boolean;
  claimDeadline?: Date;
}

export interface GovernanceRights {
  votingPower: number;
  proposals: string[];
}

export interface RewardRule {
  trigger: string;
  amount: string;
  token: string;
}

export interface EventHandler {
  event: string;
  action: string;
  condition?: string;
}

export interface IoTDevice {
  deviceId: string;
  dreamId: string;
  deviceType: 'sensor' | 'tracker' | 'actuator';
  vechainAddress: string;
  dataStream: {
    endpoint: string;
    frequency: number; // Hz
    lastUpdate: Date;
  };
}

export interface SensorData {
  deviceId: string;
  timestamp: Date;
  values: Record<string, number | string>;
  unit?: string;
}

export interface ProductDetails {
  name: string;
  description: string;
  manufacturer: string;
  location: string;
  certifications?: string[];
}

export interface SustainabilityMetrics {
  carbonOffset: number;
  energySaved: number;
  waterSaved?: number;
  wasteReduced?: number;
}

