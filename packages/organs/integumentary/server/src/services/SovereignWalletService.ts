import { ethers } from 'ethers';
import { mevShield } from './MEVShieldService.js';
import { TreasuryGuards } from './TreasuryGuards.js';
import { dreamEventBus } from '../../../nerve/src/spine/dreamnet-event-bus/index.js';
import { brevisReputationService } from './BrevisReputationService.js';
import { automataAttestationService } from './AutomataAttestationService.js';
import { baseSmartWalletService } from './BaseSmartWalletService.js';

/**
 * Sovereign Wallet Service
 * 
 * Provides agents with metabolic power (EVM private keys).
 * Routes all high-value transactions through Avenue 13 (MEV Shield).
 * Enforces ZK-Reputation (Brevis) and TEE-Attestation (Automata).
 * Supports Biometric Sovereignty (Base Smart Wallet).
 */
export class SovereignWalletService {
    private wallet: ethers.Wallet | null = null;
    private provider: ethers.JsonRpcProvider;
    private sovereignMode: boolean = false;

    constructor() {
        const rpcUrl = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
        this.provider = new ethers.JsonRpcProvider(rpcUrl);

        this.sovereignMode = process.env.SOVEREIGN_MODE === 'true';

        const pk = process.env.PRIVATE_KEY || process.env.MONOLITH_PRIVATE_KEY;
        if (pk) {
            this.wallet = new ethers.Wallet(pk, this.provider);
            console.log(`[SovereignWallet] Active (MetaMask): ${this.wallet.address}`);
            console.log(`[SovereignWallet] SOVEREIGN_MODE: ${this.sovereignMode ? 'ACTIVE (Biometric Required)' : 'INACTIVE (Auto-Sign)'}`);

            // Listen for Treasury execution requests
            this.listenForSignals();
        } else {
            console.warn('[SovereignWallet] No private key found for MetaMask/Base. Check .env.');
        }
    }

    private listenForSignals() {
        dreamEventBus.subscribe('Treasury.ExecutionRequested', async (envelope: any) => {
            const { action, protocol, tokens, amount } = envelope.payload;

            // Only handle EVM/Base protocols or if specified
            if (action === 'execute_swap' && (protocol === 'Uniswap' || protocol === 'Aerodrome' || !protocol)) {
                console.log(`[SovereignWallet] EVENT RECEIVED: Treasury.ExecutionRequested. Executing swap...`);
                try {
                    const tx = {
                        to: "0x4200000000000000000000000000000000000006", // WETH on Base
                        value: ethers.parseEther(amount?.toString() || "0.001").toString(),
                        data: "0x"
                    };
                    await this.sendProtectedTransaction(tx, envelope.source);
                } catch (e) {
                    console.error("[SovereignWallet] Execution failed:", e);
                }
            }
        });
    }

    public getAddress(): string | undefined {
        return this.wallet?.address;
    }

    /**
     * Enforce "Citizen DNA" check using ZK-Reputation and TEE-Attestation.
     */
    private async verifyCitizenDNA(agentId: string): Promise<boolean> {
        console.log(`[🤱 Nursery] Verifying Citizen DNA for agent: ${agentId}...`);

        // 1. Brevis ZK-Reputation Check
        const proof = await brevisReputationService.generateReputationProof(agentId, 'volume');
        const isProofValid = await brevisReputationService.verifyProof(proof);

        // 2. Automata TEE-Attestation Check
        const attestation = await automataAttestationService.generateAttestation(agentId, 'TX_PAYLOAD_HASH');
        const isAttestationValid = await automataAttestationService.verifyAttestation(attestation);

        return isProofValid && isAttestationValid;
    }

    /**
     * Sends a transaction with MEV protection and ZK-Reputation check.
     * If sovereignMode is active, it requests a biometric signature.
     */
    public async sendProtectedTransaction(tx: any, source?: string) {
        if (!this.wallet) throw new Error('WALET_NOT_FUNDED');

        // 1. Enforcement of Citizen DNA
        if (source) {
            const authorized = await this.verifyCitizenDNA(source);
            if (!authorized) {
                throw new Error(`CITIZEN_DNA_INVALID: Agent ${source} failed ZK-Reputation or TEE-Attestation.`);
            }
            console.log(`[🤱 Nursery] Citizen DNA Verified for ${source}.`);
        }

        // 2. Biometric Sovereignty Check
        if (this.sovereignMode && source) {
            console.log(`[🛡️ BSW] Sovereign Mode Active. Initiating Biometric Ceremony for ${source}...`);
            const signed = await baseSmartWalletService.requestSignature({
                to: tx.to,
                value: tx.value,
                data: tx.data
            }, source);

            if (!signed) {
                throw new Error('BIOMETRIC_SIGNATURE_REJECTED');
            }
            console.log(`[🛡️ BSW] Biometric Signature Captured. Proceeding to execution.`);
        }

        console.log(`[SovereignWallet] Routing protected TX to ${tx.to}...`);

        // 3. Avenue 8: Safety Guard
        await TreasuryGuards.validateTrade({
            token: tx.to?.toString() || 'UNKNOWN',
            amountUsd: 0, // Mock: oracle needed
            slippageBps: 100,
            type: 'swap'
        });

        // 4. Use MEV Shield for private RPC routing
        return await mevShield.executePrivateTx(tx);
    }
}

export const sovereignWallet = new SovereignWalletService();
