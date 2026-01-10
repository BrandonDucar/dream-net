import { swarmLog } from '../server.js';
import { Connection, Keypair, PublicKey, VersionedTransaction } from '@solana/web3.js';
import bs58 from 'bs58';

/**
 * SOLANA SUIT (The Speedster)
 * 
 * Pilot: COIN SENSEI (DeFi Alpha Strain)
 * Capabilities:
 * - High-speed RPC connection to Solana Mainnet
 * - Phantom Wallet Key Management
 * - Raydium/Jupiter Sniping (Base infrastructure)
 */
export class SolanaSuit {
    private connection: Connection;
    private keypair: Keypair | null = null;
    public activeMode: 'PASSIVE' | 'SNIPER' = 'SNIPER';
    private pilotName: string = 'COIN SENSEI';

    constructor() {
        // Use a high-quality RPC if available, fallback to public
        const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
        this.connection = new Connection(rpcUrl, 'confirmed');
    }

    /**
     * WAKE: Connect Coin Sensei to the Solana Grid
     */
    public async wake() {
        try {
            swarmLog('SOLANA_SUIT', `[${this.pilotName}] Jacking in...`);

            // Load Phantom Key (Format: Base58 string)
            const privateKey = process.env.PHANTOM_PRIVATE_KEY || process.env.SOLANA_PRIVATE_KEY;

            if (privateKey) {
                try {
                    // Handle both Byte Array and Base58 formats
                    if (privateKey.includes('[')) {
                        const feePayer = Uint8Array.from(JSON.parse(privateKey));
                        this.keypair = Keypair.fromSecretKey(feePayer);
                    } else {
                        // Assuming Base58 (Phantom export default)
                        this.keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
                    }

                    swarmLog('SOLANA_SUIT', `[${this.pilotName}] Phantom Link Established: ${this.keypair.publicKey.toBase58().slice(0, 8)}...`);
                    await this.checkBalance();
                } catch (e: any) {
                    swarmLog('SOLANA_SUIT_ERROR', `Key Parsing Failed: ${e.message}`);
                }
            } else {
                swarmLog('SOLANA_SUIT', `[${this.pilotName}] ⚠️ No Private Key found. Running in READ-ONLY mode.`);
            }

            swarmLog('SOLANA_SUIT', `[${this.pilotName}] Grid Connection: STABLE.`);

        } catch (error: any) {
            swarmLog('SOLANA_SUIT_ERROR', `Failed to wake: ${error.message}`);
        }
    }

    /**
     * CHECK BALANCE: Verify War Chest
     */
    public async checkBalance() {
        if (!this.keypair) return;
        try {
            const balance = await this.connection.getBalance(this.keypair.publicKey);
            const sol = balance / 1000000000;
            swarmLog('SOLANA_SUIT', `[${this.pilotName}] War Chest: ${sol.toFixed(4)} SOL`);

            if (sol < 0.01) {
                swarmLog('SOLANA_SUIT', `[${this.pilotName}] ⚠️ LOW FUEL. Refill required for sniping.`);
            }
        } catch (e: any) {
            swarmLog('SOLANA_SUIT_ERROR', `Balance check failed: ${e.message}`);
        }
    }

    public async executeSnipe(inputMint: string, outputMint: string, amount: number) {
        if (this.activeMode !== 'SNIPER') return;
        if (!this.keypair) {
            swarmLog('SOLANA_SUIT_ERROR', `[${this.pilotName}] Cannot Snipe: No Private Key loaded.`);
            return;
        }

        try {
            swarmLog('SOLANA_SUIT', `[${this.pilotName}] 🎯 SNIPING (LIVE FIRE): ${amount} lamports of ${inputMint} -> ${outputMint}`);

            // 1. Get Quote (Jupiter V6)
            const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`;
            const quoteResponse = await fetch(quoteUrl);
            const quoteData = await quoteResponse.json();

            if (!quoteData || quoteData.error) {
                throw new Error(quoteData.error || 'No quote found');
            }

            swarmLog('SOLANA_SUIT', `[${this.pilotName}] Quote Secured: ${quoteData.outAmount} units out.`);

            // 2. Get Swap Transaction
            const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quoteResponse: quoteData,
                    userPublicKey: this.keypair.publicKey.toBase58(),
                    wrapAndUnwrapSol: true
                })
            });
            const swapData = await swapResponse.json();
            const { swapTransaction } = swapData;

            // 3. Deserialize and Sign
            const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');

            swarmLog('SOLANA_SUIT', `[${this.pilotName}] ⚠️ SIGNING TRANSACTION...`);

            // LETHAL MODE ENGAGED:
            const tx = VersionedTransaction.deserialize(swapTransactionBuf);
            tx.sign([this.keypair]);
            const rawTransaction = tx.serialize();

            // FIRE
            const txid = await this.connection.sendRawTransaction(rawTransaction);
            swarmLog('SOLANA_SUIT', `[${this.pilotName}] 🔫 SHOT FIRED! TXID: ${txid}`);

        } catch (e: any) {
            swarmLog('SOLANA_SUIT_ERROR', `Snipe Failed: ${e.message}`);
        }
    }
}
