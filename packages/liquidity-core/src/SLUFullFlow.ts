/**
 * SLU Full Flow - Complete flow from SPK to LP
 * 
 * This orchestrates the entire process:
 * 1. SPK → stSPK (staking)
 * 2. stSPK + paired token → SLU pool (adding liquidity)
 * 3. Optional: Claim rewards, auto-compound
 */

import { ethers } from 'ethers';
import { StakeSPKClient, type StakeConfig } from './StakeSPKClient.js';
import { SLUSystem, type SLUPoolConfig } from './SLUSystem.js';
import { SLUSeeder, type SeedingConfig } from './SLUSeeder.js';

export interface FullFlowConfig {
    // Staking config
    stSPKContractAddress: string;
    spkTokenAddress: string;

    // Pool configs
    pools: SLUPoolConfig[];

    // Amounts
    spkAmountToStake: bigint;
    pairedTokenAmounts: Map<string, bigint>; // poolAddress => amount

    // Options
    lockDuration?: number; // Lock stSPK for X seconds (0 = no lock)
    useMEVProtection?: boolean;
}

export interface FullFlowResult {
    step: 'staking' | 'approving' | 'adding-liquidity';
    success: boolean;
    txHash?: string;
    stSPKReceived?: bigint;
    liquidityReceived?: bigint;
    error?: string;
}

/**
 * SLU Full Flow - Complete orchestration
 */
export class SLUFullFlow {
    private stakeClient: StakeSPKClient;
    private sluSystem: SLUSystem;
    private seeder: SLUSeeder;
    private provider: ethers.Provider;
    private signer?: ethers.Signer;

    constructor(
        config: FullFlowConfig,
        provider: ethers.Provider,
        signer?: ethers.Signer
    ) {
        this.provider = provider;
        this.signer = signer;

        // Initialize clients
        this.stakeClient = new StakeSPKClient(
            {
                stSPKContractAddress: config.stSPKContractAddress,
                spkTokenAddress: config.spkTokenAddress,
                lockDuration: config.lockDuration,
            },
            provider,
            signer
        );

        this.sluSystem = new SLUSystem(provider, signer);
        this.seeder = new SLUSeeder(provider, signer, config.useMEVProtection);

        // Register pools
        config.pools.forEach(pool => {
            this.sluSystem.registerPool(pool);
        });
        this.seeder.registerPools(config.pools);
    }

    /**
     * Execute full flow: SPK → stSPK → LP
     */
    async executeFullFlow(config: FullFlowConfig): Promise<FullFlowResult[]> {
        const results: FullFlowResult[] = [];

        if (!this.signer) {
            throw new Error('Signer required for full flow');
        }

        try {
            // Step 1: Stake SPK to get stSPK
            console.log('Step 1: Staking SPK to get stSPK...');
            const stakeResult = await this.stakeClient.stakeSPK(
                config.spkAmountToStake,
                config.lockDuration || 0
            );

            results.push({
                step: 'staking',
                success: true,
                txHash: stakeResult.txHash,
                stSPKReceived: stakeResult.stSPKReceived,
            });

            console.log(`✅ Staked ${ethers.formatEther(config.spkAmountToStake)} SPK`);
            console.log(`   Received ${ethers.formatEther(stakeResult.stSPKReceived)} stSPK`);
            console.log(`   TX: ${stakeResult.txHash}`);

            // Step 2: Add liquidity to each pool
            const stSPKPerPool = stakeResult.stSPKReceived / BigInt(config.pools.length);

            for (const pool of config.pools) {
                const pairedAmount = config.pairedTokenAmounts.get(pool.poolAddress);
                if (!pairedAmount) {
                    results.push({
                        step: 'adding-liquidity',
                        success: false,
                        error: `Missing paired token amount for pool ${pool.poolAddress}`,
                    });
                    continue;
                }

                try {
                    console.log(`\nStep 2: Adding liquidity to ${pool.label}...`);
                    console.log(`   stSPK: ${ethers.formatEther(stSPKPerPool)}`);
                    console.log(`   ${pool.pairedTokenSymbol}: ${ethers.formatEther(pairedAmount)}`);

                    const liquidityResult = await this.sluSystem.addLiquidity(
                        pool.poolAddress,
                        stSPKPerPool,
                        pairedAmount
                    );

                    results.push({
                        step: 'adding-liquidity',
                        success: true,
                        txHash: liquidityResult.txHash,
                        liquidityReceived: liquidityResult.liquidity,
                    });

                    console.log(`✅ Added liquidity to ${pool.label}`);
                    console.log(`   Received ${ethers.formatEther(liquidityResult.liquidity)} SLU tokens`);
                    console.log(`   TX: ${liquidityResult.txHash}`);
                } catch (error: any) {
                    results.push({
                        step: 'adding-liquidity',
                        success: false,
                        error: error.message || 'Failed to add liquidity',
                    });
                    console.error(`❌ Failed to add liquidity to ${pool.label}:`, error.message);
                }
            }

            return results;
        } catch (error: any) {
            results.push({
                step: 'staking',
                success: false,
                error: error.message || 'Staking failed',
            });
            return results;
        }
    }

    /**
     * Quick helper: Just stake SPK (if you already have stSPK, skip this)
     */
    async justStakeSPK(amount: bigint, lockDuration: number = 0): Promise<FullFlowResult> {
        try {
            const result = await this.stakeClient.stakeSPK(amount, lockDuration);
            return {
                step: 'staking',
                success: true,
                txHash: result.txHash,
                stSPKReceived: result.stSPKReceived,
            };
        } catch (error: any) {
            return {
                step: 'staking',
                success: false,
                error: error.message || 'Staking failed',
            };
        }
    }

    /**
     * Quick helper: Just add liquidity (if you already have stSPK)
     */
    async justAddLiquidity(
        poolAddress: string,
        stSPKAmount: bigint,
        pairedAmount: bigint
    ): Promise<FullFlowResult> {
        try {
            const result = await this.sluSystem.addLiquidity(
                poolAddress,
                stSPKAmount,
                pairedAmount
            );
            return {
                step: 'adding-liquidity',
                success: true,
                txHash: result.txHash,
                liquidityReceived: result.liquidity,
            };
        } catch (error: any) {
            return {
                step: 'adding-liquidity',
                success: false,
                error: error.message || 'Adding liquidity failed',
            };
        }
    }
}
