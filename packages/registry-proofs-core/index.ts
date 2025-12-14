/**
 * Registry Proofs Core
 * 
 * On-chain KYC/KYB attestations for RWA readiness + DIN-style node operator verification
 * 
 * Features:
 * - Bitmap-based registry flags
 * - Attester adapter for KYC/KYB providers
 * - Proof verification
 * - Integration with Identity Grid and Dream State
 */

export { registryAttester } from './attester';
export { registryProofVerifier } from './verifier';
export type {
  RegistryFlag,
  RegistryProof,
  KYCData,
  KYBData,
  AttestationResult,
  SanctionsCheck,
  RegistryProofsStatus,
} from './types';

import { registryAttester } from './attester';
import { registryProofVerifier } from './verifier';

export const RegistryProofsCore = {
  /**
   * Verify KYC and issue attestation
   */
  async verifyKYC(walletAddress: string, kycData: import('./types').KYCData) {
    return registryAttester.verifyKYC(walletAddress, kycData);
  },

  /**
   * Verify KYB and issue attestation
   */
  async verifyKYB(companyAddress: string, kybData: import('./types').KYBData) {
    return registryAttester.verifyKYB(companyAddress, kybData);
  },

  /**
   * Check sanctions
   */
  async checkSanctions(walletAddress: string) {
    return registryAttester.checkSanctions(walletAddress);
  },

  /**
   * Verify registry proof
   */
  async verifyProof(account: string, requiredFlags: import('./types').RegistryFlag[]) {
    return registryProofVerifier.verifyProof(account, requiredFlags);
  },

  /**
   * Check if account has flag
   */
  async hasFlag(account: string, flag: import('./types').RegistryFlag) {
    return registryProofVerifier.hasFlag(account, flag);
  },

  /**
   * Get all flags for account
   */
  async getFlags(account: string) {
    return registryProofVerifier.getFlags(account);
  },
};

export default RegistryProofsCore;

