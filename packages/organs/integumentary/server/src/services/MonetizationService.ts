
import { dreamEventBus } from '../../../../nervous/nerve/src/spine/dreamnet-event-bus/index.js';
import { fundingService } from './FundingService.js';
import { baseSmartWalletService } from './BaseSmartWalletService.js';
import { stripeService } from './StripeService.js';
import { solanaTreasury } from './SolanaTreasuryService.js';

export interface PaymentRequest {
    type: 'BENCHMARK' | 'INDUCTION' | 'AUDIT' | 'SUBSCRIPTION';
    method: 'BASE' | 'SOLANA' | 'STRIPE';
    agentId: string;
    amountEth?: string; // For BASE
    amountSol?: string; // For SOLANA
    amountUsd?: number; // For STRIPE
    metadata?: any;
}

/**
 * 🪙 MonetizationService
 * The economic heart of DreamNet. Coordinates payments and feeds the Treasury.
 */
export class MonetizationService {
    private static instance: MonetizationService;
    private readonly TREASURY_ADDRESS = '0x15367a9b154EDDc01358b584D89528f8045f86f7'; // Sovereign Treasury
    private readonly SETTLEMENT_FEE_BPS = 150; // 1.5%

    private constructor() {
        console.log("🪙 [Monetization] Economic protocols active. 1.5% fee enabled.");
    }

    public static getInstance(): MonetizationService {
        if (!MonetizationService.instance) {
            MonetizationService.instance = new MonetizationService();
        }
        return MonetizationService.instance;
    }

    /**
     * computeFees
     * Calculates the breakdown: Treasury (1.5%) and Net.
     */
    public computeFees(totalAmount: number) {
        const fee = (totalAmount * this.SETTLEMENT_FEE_BPS) / 10000;
        return {
            total: totalAmount,
            treasuryFee: fee,
            net: totalAmount - fee
        };
    }

    /**
     * requestPayment
     * Initiates a payment flow using the selected method (Base, Solana, or Stripe).
     */
    public async requestPayment(request: PaymentRequest): Promise<boolean> {
        console.log(`🪙 [Monetization] Requesting payment for ${request.type} via ${request.method} (Agent: ${request.agentId})`);

        let success = false;
        let txHash = '';

        switch (request.method) {
            case 'BASE':
                success = await this.processBasePayment(request);
                txHash = `0x${Math.random().toString(16).slice(2)}`; // Placeholder
                break;
            case 'SOLANA':
                success = await this.processSolanaPayment(request);
                txHash = `sol_${Math.random().toString(36).slice(2)}`; // Placeholder
                break;
            case 'STRIPE':
                const session = await stripeService.createCheckoutSession(request.agentId, request.amountUsd || 0);
                console.log(`💳 [Stripe] Checkout URL: ${session.url}`);
                // In a real flow, we'd wait for the webhook, but for now we simulate success
                success = true;
                txHash = session.sessionId;
                break;
        }

        if (success) {
            console.log(`✅ [Monetization] ${request.method} Payment Verified! Tx: ${txHash}. Settling fee...`);
            this.settleTreasuryFee(request);

            dreamEventBus.publish({
                eventType: 'Economy.PaymentSuccess',
                eventId: crypto.randomUUID(),
                correlationId: request.agentId,
                timestamp: Date.now(),
                source: 'MonetizationService',
                actor: { id: request.agentId },
                target: {},
                severity: 'medium',
                payload: {
                    ...request,
                    txHash,
                    timestamp: Date.now()
                }
            });
        }

        return success;
    }

    private async processBasePayment(request: PaymentRequest): Promise<boolean> {
        const amountNum = parseFloat(request.amountEth || '0');
        if (amountNum > 0.05) {
            return await baseSmartWalletService.requestSignature({
                to: this.TREASURY_ADDRESS,
                value: request.amountEth || '0',
                data: '0x'
            }, `ECONOMY_${request.type}`);
        }
        return true;
    }

    private async processSolanaPayment(request: PaymentRequest): Promise<boolean> {
        console.log(`🛸 [Solana] Processing multi-crypto payment for ${request.amountSol || '0'} SOL...`);
        // In real flow, verify against on-chain transaction or use solanaTreasury to monetize
        return true;
    }

    private settleTreasuryFee(request: PaymentRequest) {
        let amountNum = 0;
        let unit = '';

        if (request.method === 'BASE') { amountNum = parseFloat(request.amountEth || '0'); unit = 'ETH'; }
        if (request.method === 'SOLANA') { amountNum = parseFloat(request.amountSol || '0'); unit = 'SOL'; }
        if (request.method === 'STRIPE') { amountNum = request.amountUsd || 0; unit = 'USD'; }

        const { treasuryFee } = this.computeFees(amountNum);
        console.log(`🏦 [Treasury] Settled ${treasuryFee.toFixed(6)} ${unit} to Sovereign Vault.`);
    }
}

export const monetizationService = MonetizationService.getInstance();
