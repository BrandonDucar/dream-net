/**
 * Registry Proofs Core Types
 * On-chain KYC/KYB attestations for RWA readiness + DIN-style node operator verification
 */

export type RegistryFlag = 
  | 'KYC'                    // bit 0: Know Your Customer verified
  | 'KYB'                    // bit 1: Know Your Business verified
  | 'ACCREDITED'             // bit 2: Accredited investor
  | 'REGION_US'              // bit 3: US region verified
  | 'REGION_EU'              // bit 4: EU region verified
  | 'SANCTIONS_CLEAR'        // bit 5: Sanctions screening passed
  | 'PROFESSIONAL_INVESTOR'  // bit 6: Professional investor status
  | 'NODE_OPERATOR';         // bit 7: DIN-style operator verification

export interface RegistryProof {
  account: string;
  flags: RegistryFlag[];
  attestationHash: string;
  attester: string;
  timestamp: number;
  expiryDate?: number;
}

export interface KYCData {
  name: string;
  address: string;
  documentHash: string;
  walletAddress: string;
  country?: string;
}

export interface KYBData {
  companyName: string;
  registrationNumber: string;
  address: string;
  walletAddress: string;
  country?: string;
}

export interface AttestationResult {
  success: boolean;
  flags: RegistryFlag[];
  attestationHash?: string;
  error?: string;
}

export interface SanctionsCheck {
  cleared: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  details?: string;
}

export interface RegistryProofsStatus {
  totalAccounts: number;
  totalAttestations: number;
  flagsByType: Record<RegistryFlag, number>;
  attesters: string[];
}

