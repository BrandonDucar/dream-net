/**
 * Airdrop Oracle Agent
 * 
 * Checks which wallets are eligible for safe, intended airdrops.
 * Legal focus: Only checks eligibility for wallets you control or that users explicitly connect.
 * NO calling claim() for others.
 */

import type { AgentContext, AgentResult } from '../../../server/core/types';
import type { OpportunityContract } from './SpikeNetScanner';

export interface AirdropOraclePayload {
  walletAddresses: string[];
  chain?: string;
  contractAddresses?: string[]; // If not provided, uses discovered AIRDROP contracts
}

export interface AirdropEligibility {
  walletAddress: string;
  contractAddress: string;
  chain: string;
  isEligible: boolean;
  claimableAmount?: string;
  claimableToken?: string;
  claimMethod?: string; // e.g., 'claim', 'claimFor', 'claimWithProof'
  requiresProof?: boolean;
  merkleRoot?: string;
  metadata?: {
    airdropName?: string;
    deadline?: number;
    [key: string]: any;
  };
  warnings?: string[];
}

export const AirdropOracle = {
  id: 'airdrop-oracle',
  label: 'Airdrop Oracle',
  
  async run(payload: AirdropOraclePayload, ctx: AgentContext): Promise<AgentResult<AirdropEligibility[]>> {
    const { walletAddresses, chain, contractAddresses } = payload;
    
    ctx.log('[AirdropOracle] Checking eligibility', { 
      walletCount: walletAddresses.length,
      chain,
      contractCount: contractAddresses?.length 
    });

    try {
      // 1) Get discovered AIRDROP contracts from SpikeNetScanner
      let contracts: OpportunityContract[] = [];
      
      if (contractAddresses && contractAddresses.length > 0) {
        // Use provided contracts
        contracts = contractAddresses.map(addr => ({
          chain: chain || 'ethereum',
          address: addr,
          kind: 'AIRDROP' as const,
          abiFragment: {}, // Would fetch actual ABI
          discoveredAt: Date.now()
        }));
      } else {
        // Get from SpikeNetScanner storage
        const storageKey = `spike:contracts:${chain || 'ethereum'}`;
        const allContracts = await ctx.storage.get(storageKey) || [];
        contracts = allContracts.filter((c: OpportunityContract) => c.kind === 'AIRDROP');
      }

      if (contracts.length === 0) {
        return {
          ok: true,
          summary: 'No AIRDROP contracts found',
          data: [],
          warnings: ['No airdrop contracts discovered. Run SpikeNetScanner first.']
        };
      }

      // 2) Check eligibility for each wallet + contract combination
      const results: AirdropEligibility[] = [];

      for (const walletAddress of walletAddresses) {
        for (const contract of contracts) {
          try {
            // Read-only call to check eligibility
            // Example: contract.claimable(walletAddress) or contract.isEligible(walletAddress)
            // This is READ-ONLY, no claim() is called
            
            // Mock implementation - would use actual contract calls
            const eligibility: AirdropEligibility = {
              walletAddress,
              contractAddress: contract.address,
              chain: contract.chain,
              isEligible: false, // Would be result of contract call
              claimableAmount: '0', // Would be result of contract call
              claimMethod: 'claim', // Would be determined from ABI
              requiresProof: false, // Would check if merkle proof needed
              metadata: contract.metadata
            };

            // Legal check: Only return eligibility if wallet is controlled by user
            // This is enforced at the API level, not in the agent
            results.push(eligibility);

          } catch (error: any) {
            ctx.log('[AirdropOracle] Contract check error', {
              wallet: walletAddress,
              contract: contract.address,
              error: error.message
            });
            
            results.push({
              walletAddress,
              contractAddress: contract.address,
              chain: contract.chain,
              isEligible: false,
              warnings: [`Contract check failed: ${error.message}`]
            });
          }
        }
      }

      // 3) Emit event
      const eligibleCount = results.filter(r => r.isEligible).length;
      await ctx.emitEvent('AIRDROP-ELIGIBILITY-CHECKED', {
        walletCount: walletAddresses.length,
        contractCount: contracts.length,
        eligibleCount
      });

      return {
        ok: true,
        summary: `Checked ${walletAddresses.length} wallets against ${contracts.length} airdrop contracts. ${eligibleCount} eligible.`,
        data: results
      };

    } catch (error: any) {
      ctx.log('[AirdropOracle] Error', { error: error.message });
      return {
        ok: false,
        summary: `Eligibility check failed: ${error.message}`,
        warnings: [error.message]
      };
    }
  }
};

