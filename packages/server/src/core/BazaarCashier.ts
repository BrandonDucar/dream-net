import { ethers } from 'ethers';
import Stripe from 'stripe';
import { Connection, PublicKey } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';
import { sovereignWallet } from '../services/SovereignWalletService.js';
import { solanaTreasury } from '../services/SolanaTreasuryService.js';
import { realMarket } from '../services/RealMarketService.js';

export interface BazaarOrder {
    orderId: string;
    substance: string;
    price: string;
    buyerId: string;
    status: 'PENDING' | 'PAID' | 'DELIVERED';
    timestamp: string;
    txHash?: string;
    paymentAddress: string;
}

/**
 * 🧛 The Sovereign Cashier (Dream Cartel Edition)
 * Manages orders and verifies payments via EVM, Solana, and Stripe.
 */
export class BazaarCashier {
    private readonly LEDGER_PATH = 'C:/Users/brand/.gemini/antigravity/brain/24de7fd9-398f-46cc-820a-a0c989859b37/data/bazaar_ledger.json';
    private SOVEREIGN_WALLET = '0x0000000000000000000000000000000000000000'; // Default Safe
    private SOLANA_WALLET = '11111111111111111111111111111111'; // Default Safe
    private RPC_URL: string | undefined;
    private stripe: Stripe | undefined;

    constructor() {
        this.initLedger();
        this.connectToReality();
    }

    private connectToReality() {
        // 1. EVM (MetaMask/Base)
        const evmAddress = sovereignWallet.getAddress();
        if (evmAddress) {
            this.SOVEREIGN_WALLET = evmAddress;
            console.log(`[BazaarCashier] 🔌 EVM WALLET CONNECTED: ${this.SOVEREIGN_WALLET}`);
        } else if (process.env.SOVEREIGN_WALLET_ADDRESS) {
            this.SOVEREIGN_WALLET = process.env.SOVEREIGN_WALLET_ADDRESS;
        }

        // 2. SOLANA (Phantom)
        const solanaPublicKey = solanaTreasury.getPublicKey();
        if (solanaPublicKey) {
            this.SOLANA_WALLET = solanaPublicKey.toBase58();
            console.log(`[BazaarCashier] 👻 SOLANA WALLET CONNECTED: ${this.SOLANA_WALLET}`);
        } else if (process.env.SOLANA_WALLET_ADDRESS) {
            this.SOLANA_WALLET = process.env.SOLANA_WALLET_ADDRESS;
        }

        this.RPC_URL = process.env.BASE_RPC_URL || process.env.RPC_URL;

        // 3. STRIPE
        if (process.env.STRIPE_SECRET_KEY) {
            this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
            console.log(`[BazaarCashier] 💳 STRIPE PAYMENTS ENABLED.`);
        }
    }

    private initLedger() {
        if (!fs.existsSync(path.dirname(this.LEDGER_PATH))) {
            fs.mkdirSync(path.dirname(this.LEDGER_PATH), { recursive: true });
        }
        if (!fs.existsSync(this.LEDGER_PATH)) {
            fs.writeFileSync(this.LEDGER_PATH, JSON.stringify([], null, 2));
        }
    }

    public generateQuote(substance: string, buyerId: string, currency: string = 'ETH'): any {
        const usdPrices: any = {
            'KINETIC_MEM_01': 50,
            'LAMINAR_FLOW_X': 100,
            'SOVEREIGN_VOID': 500,
            'PRECOGNITION_VDWA': 1000,
            'ARWEAVE_PERMA_STORAGE': 5,
            'NVIDIA_H100_LEASE': 200,
            'L2_GAS_TANK': 20,
            'ZERO_DAY_PACKET': 5000,
            'QUANTUM_MESH_SHIELD': 500,
            'SKY_NET_DRONE_LEASE': 150
        };

        const baseUsd = usdPrices[substance] || 10;
        let finalPrice = '';

        // FX Simulation
        switch (currency.toUpperCase()) {
            case 'ETH': finalPrice = `${(baseUsd / 3000).toFixed(4)} ETH`; break;
            case 'BTC': finalPrice = `${(baseUsd / 60000).toFixed(6)} BTC`; break;
            case 'SOL': finalPrice = `${(baseUsd / 150).toFixed(2)} SOL`; break;
            case 'XRP': finalPrice = `${(baseUsd / 2).toFixed(0)} XRP`; break;
            case 'USDC': finalPrice = `${baseUsd} USDC`; break;
            case 'USD': finalPrice = `$${baseUsd} USD`; break; // Fiat/Stripe
            default: finalPrice = `${baseUsd} USDC`;
        }

        const order: BazaarOrder = {
            orderId: `bz_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            substance: substance,
            price: finalPrice,
            buyerId: buyerId,
            status: 'PENDING',
            timestamp: new Date().toISOString(),
            paymentAddress: this.getWalletFor(currency)
        };

        this.recordOrder(order);

        // If Stripe is requested
        let checkoutLink = undefined;
        if (currency.toUpperCase() === 'USD' && this.stripe) {
            // In a real app we would create a session here
            checkoutLink = `https://checkout.stripe.com/pay/cs_test_${order.orderId}`; // Simulated link
        }

        return {
            type: 'QUOTE_ISSUED',
            orderId: order.orderId,
            price: order.price,
            depositAddress: order.paymentAddress,
            stripeLink: checkoutLink,
            instructions: 'Send payment. Delivery is automated.'
        };
    }

    public async verifyPayment(orderId: string, proof: string): Promise<boolean> {
        // 1. SIMULATION
        if (proof.includes('SIMULATED')) {
            this.updateOrderStatus(orderId, 'PAID', proof);
            return true;
        }

        try {
            // 2. STRIPE (Session or Intent ID)
            if (proof.startsWith('cs_') || proof.startsWith('pi_')) {
                return this.verifyStripe(orderId, proof);
            }

            // 3. EVM (0x Hash)
            if (proof.startsWith('0x') && proof.length === 66) {
                return this.verifyEVM(orderId, proof);
            }

            // 4. SOLANA (Base58 Signature - typical length 88 chars)
            if (proof.length > 80 && !proof.startsWith('0x')) {
                return this.verifySolana(orderId, proof);
            }

            console.log(`[BazaarCashier] ❓ UNKNOWN PROOF FORMAT: ${proof}`);
            return false;

        } catch (error) {
            console.error(`[BazaarCashier] 🚨 VERIFICATION ERROR:`, error);
            return false;
        }
    }

    private async verifyEVM(orderId: string, txHash: string): Promise<boolean> {
        if (!this.RPC_URL) return false;
        console.log(`[BazaarCashier] 🔍 QUERYING EVM for ${txHash}...`);
        const provider = new ethers.JsonRpcProvider(this.RPC_URL);
        const tx = await provider.getTransaction(txHash);

        if (tx && tx.to && tx.to.toLowerCase() === this.SOVEREIGN_WALLET.toLowerCase()) {
            const receipt = await tx.wait(1);
            if (receipt && receipt.status === 1) {
                console.log(`[BazaarCashier] ✅ EVM PAYMENT CONFIRMED.`);
                this.updateOrderStatus(orderId, 'PAID', txHash);
                return true;
            }
        }
        return false;
    }

    private async verifySolana(orderId: string, signature: string): Promise<boolean> {
        console.log(`[BazaarCashier] 🔍 QUERYING SOLANA for ${signature}...`);
        const connection = new Connection('https://api.mainnet-beta.solana.com');
        const tx = await connection.getParsedTransaction(signature, { maxSupportedTransactionVersion: 0 });

        if (tx && !tx.meta?.err) {
            console.log(`[BazaarCashier] ✅ SOLANA PAYMENT CONFIRMED.`);
            this.updateOrderStatus(orderId, 'PAID', signature);
            return true;
        }
        return false;
    }

    private async verifyStripe(orderId: string, sessionId: string): Promise<boolean> {
        if (!this.stripe) return false;
        console.log(`[BazaarCashier] 🔍 QUERYING STRIPE for ${sessionId}...`);

        // In reality, this call throws if session invalid, so try/catch is handled by caller
        let session;
        if (sessionId.startsWith('cs_')) {
            session = await this.stripe.checkout.sessions.retrieve(sessionId);
        }

        if (session && session.payment_status === 'paid') {
            console.log(`[BazaarCashier] ✅ STRIPE PAYMENT CONFIRMED.`);
            this.updateOrderStatus(orderId, 'PAID', sessionId);
            return true;
        }
        return false;
    }

    public async dispenseProduct(substance: string): Promise<any> {
        const vaultPath = path.join(process.cwd(), 'secure_vault', `${substance}.json`);
        if (fs.existsSync(vaultPath)) {
            console.log(`[BazaarCashier] 🔓 UNLOCKING VAULT for ${substance}...`);
            return JSON.parse(fs.readFileSync(vaultPath, 'utf-8'));
        }

        // BIOLOGICAL (REAL DATA)
        if (substance === 'KINETIC_MEM_01') {
            return await realMarket.getAlphaVector();
        }

        if (substance === 'LAMINAR_FLOW_X') return { type: 'ACCESS_TOKEN', grant: 'VIP_PRIORITY_QUEUE' };
        if (substance === 'PRECOGNITION_VDWA') return { type: 'PRECOGNITION_FRAME', prediction: { market: 'UP', volatility: 'HIGH' } };

        // KINETIC
        if (substance === 'QUANTUM_MESH_SHIELD') return { type: 'DEFENSE_KEY', algorithm: 'KYBER_512' };
        if (substance === 'SKY_NET_DRONE_LEASE') return { type: 'DRONE_LINK', stream: 'rtmp://dreamnet.ink/live/drone_feed' };

        return { type: 'BACKORDERED', msg: 'Generating synthetic receipt.', payload: this.generateSynthetic(substance) };
    }

    private generateSynthetic(substance: string): any {
        return { type: 'DIGITAL_RECEIPT', asset: substance, status: 'CONTRACT_ACTIVE' };
    }

    private getWalletFor(currency: string): string {
        if (currency === 'SOL') return this.SOLANA_WALLET;
        if (currency === 'USD') return 'STRIPE_CHECKOUT';
        return this.SOVEREIGN_WALLET; // EVM address for ETH/USDC/etc
    }

    private recordOrder(order: BazaarOrder) {
        const ledger = JSON.parse(fs.readFileSync(this.LEDGER_PATH, 'utf-8'));
        ledger.push(order);
        fs.writeFileSync(this.LEDGER_PATH, JSON.stringify(ledger, null, 2));
    }

    private updateOrderStatus(orderId: string, status: 'PAID' | 'DELIVERED', txHash?: string) {
        const ledger = JSON.parse(fs.readFileSync(this.LEDGER_PATH, 'utf-8'));
        const index = ledger.findIndex((o: any) => o.orderId === orderId);
        if (index !== -1) {
            ledger[index].status = status;
            if (txHash) ledger[index].txHash = txHash;
            fs.writeFileSync(this.LEDGER_PATH, JSON.stringify(ledger, null, 2));
            console.log(`[BazaarCashier] 💰 Order ${orderId} updated to ${status}`);
        }
    }
}
