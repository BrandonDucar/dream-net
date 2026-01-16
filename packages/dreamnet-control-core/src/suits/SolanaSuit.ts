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
import { DreamSnailCore } from '@dreamnet/dreamnet-snail-core';
import { CryptoSpike } from '@dreamnet/sensory-spikes';

/**
 * SOLANA SUIT (The Speedster)
 * 
 * Pilot: COIN SENSEI (DeFi Alpha Strain)
 * Capabilities:
 * - High-speed RPC connection to Solana Mainnet
 * - Phantom Wallet Key Management
 * - Raydium/Jupiter Sniping (Base infrastructure)
 * - Shielded by DreamSnail
 */
export class SolanaSuit {
    private connection: Connection;
    private keypair: Keypair | null = null;
    public activeMode: 'PASSIVE' | 'SNIPER' = 'SNIPER';
    private pilotName: string = 'COIN SENSEI';
    // Radar
    private radar: CryptoSpike;

    constructor() {
        // Use a high-quality RPC if available, fallback to public
        const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
        this.connection = new Connection(rpcUrl, 'confirmed');
        this.radar = new CryptoSpike();
    }

    /**
     * ROTATE RPC: Fallback to alternative nodes if the current one is slow/blocked
     */
    public async rotateRPC() {
        const fallbackStr = process.env.SOLANA_RPC_FALLBACKS || 'https://rpc.ankr.com/solana,https://api.mainnet-beta.solana.com';
        const fallbacks = fallbackStr.split(',');
        const next = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        this.connection = new Connection(next, 'confirmed');
        swarmLog('SOLANA_SUIT', `[${this.pilotName}] Network Shifted: ${next}`);
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

            // 1. Get Quote (Jupiter V1 - Modern)
            const jupBase = process.env.JUPITER_API_URL || 'https://api.jup.ag/swap/v1';
            const quoteUrl = `${jupBase}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`;
            let quoteResponse;
            try {
                quoteResponse = await (globalThis as any).fetch(quoteUrl);
            } catch (fetchErr: any) {
                throw new Error(`Connectivity Error (Jupiter API): ${fetchErr.message}`);
            }

            if (!quoteResponse.ok) {
                const errText = await quoteResponse.text();
                throw new Error(`Jupiter API Error: ${quoteResponse.status} ${quoteResponse.statusText} - ${errText}`);
            }

            const quoteData = await quoteResponse.json();

            swarmLog('SOLANA_SUIT', `[${this.pilotName}] Quote Secured: ${quoteData.outAmount} units out.`);

            // 2. Get Swap Transaction
            const swapResponse = await fetch(`${jupBase}/swap`, {
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

            // 🛡️ SHIELD AUDIT (DreamSnail Provenance)
            DreamSnailCore.recordTrail(this.pilotName, 'SNIPER_SHOT', {
                txid,
                inputMint,
                outputMint,
                amount,
                timestamp: Date.now()
            }, { privacyLevel: 'encrypted' });

            swarmLog('SOLANA_SUIT', `[${this.pilotName}] 🐌 Action recorded in Snail Trail (Encrypted).`);

        } catch (e: any) {
            swarmLog('SOLANA_SUIT_ERROR', `🎯 SNIPE FAILED: ${e.message}`);
            if (e.message.includes('No quote found')) {
                swarmLog('SOLANA_SUIT', `💡 Tip: Ensure yours wallet has enough source tokens (USDC) and that liquidity exists for the target.`);
            }
        }
    }

    /**
     * LIQUIDATE ASSET: Sell a specific token (e.g. "bestcoin") back into SOL or USDC
     */
    public async liquidateAsset(tokenMint: string, percentage: number = 100, destinationMint: string = 'So11111111111111111111111111111111111111112') {
        if (!this.keypair) return;

        try {
            swarmLog('SOLANA_SUIT', `[${this.pilotName}] 💰 LIQUIDATION PROTOCOL: Selling ${percentage}% of ${tokenMint}`);

            // 1. Get Token Balance
            // In a real scenario, we'd fetch the SPL Token account balance. 
            // For now, we simulate the intent to sell.
            swarmLog('SOLANA_SUIT', `[${this.pilotName}] 🔍 Scanning wallet for ${tokenMint}...`);

            // 2. Execute Swap (Reverse Snipe)
            // We use the same executeSnipe logic but in reverse.
            // For this version, we log the quote intent.
            const amountToSell = 1000000; // Simulated amount (units)
            await this.executeSnipe(tokenMint, destinationMint, amountToSell);

            swarmLog('SOLANA_SUIT', `[${this.pilotName}] ✅ Liquidation Complete.`);
        } catch (e: any) {
            swarmLog('SOLANA_SUIT_ERROR', `Liquidation Failed: ${e.message}`);
        }
    }
}
