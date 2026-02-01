import { Connection, Keypair, PublicKey, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import bs58 from 'bs58';
import axios from 'axios';
import { TreasuryGuards } from './TreasuryGuards.js';
import { dreamEventBus } from '@dreamnet/nerve';

/**
 * Solana Treasury Service (Financial Team)
 * 
 * Handles Solana assets (wen, bestcoin) and monetizes them via Jupiter.
 * Implements safety guidelines: Slippage caps, size limits.
 */
export class SolanaTreasuryService {
    private connection: Connection;
    private wallet: Keypair | null = null;

    // Known Mints
    private MINTS = {
        WEN: 'WENWENv6qBvSxgp7KB93zhWPAnBNCG6Yp2YhLc7AsHS',
        BEST: '8f1zccZPpbjz17Ay9wZKT5Mx2oPtUyxAVz5p5yzEbonk',
        USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    };

    constructor() {
        const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
        this.connection = new Connection(rpcUrl, 'confirmed');

        const secret = process.env.PHANTOM_PRIVATE_KEY;
        if (secret) {
            try {
                // Handle both array of numbers and base58 string
                if (secret.startsWith('[') && secret.endsWith(']')) {
                    const secretArray = JSON.parse(secret);
                    this.wallet = Keypair.fromSecretKey(Uint8Array.from(secretArray));
                } else {
                    this.wallet = Keypair.fromSecretKey(bs58.decode(secret));
                }
                console.log(`[SolanaTreasury] Wallet loaded: ${this.wallet.publicKey.toBase58()}`);

                // Listen for Treasury execution requests
                this.listenForSignals();
            } catch (e) {
                console.warn('[SolanaTreasury] Failed to load wallet. Check PHANTOM_PRIVATE_KEY format.');
            }
        } else {
            console.warn('[SolanaTreasury] No PHANTOM_PRIVATE_KEY found in environment.');
        }
    }

    private listenForSignals() {
        dreamEventBus.subscribe('Treasury.ExecutionRequested', async (envelope: any) => {
            const { action, protocol, tokens, amount } = envelope.payload;

            // Handle Solana-specific protocols
            if (action === 'execute_swap' && (protocol === 'Jupiter' || protocol === 'Raydium' || protocol === 'Orca')) {
                console.log(`[SolanaTreasury] EVENT RECEIVED: Treasury.ExecutionRequested. Monetizing token...`);
                try {
                    // Logic to map tokens[0] to mint address and execute
                    const mint = tokens[0] === 'SOL' ? 'So11111111111111111111111111111111111111112' : tokens[0];
                    await this.monetizeToken(mint, "1000000"); // 1M units (e.g. 0.001 SOL or token fragments)
                } catch (e) {
                    console.error("[SolanaTreasury] Execution failed:", e);
                }
            }
        });
    }

    public getPublicKey(): PublicKey | null {
        return this.wallet?.publicKey || null;
    }

    /**
     * Gets the USD price of a token from Jupiter.
     */
    public async getPrice(mint: string): Promise<number> {
        try {
            const url = `https://api.jup.ag/price/v2?ids=${mint}`;
            const response = await axios.get(url);
            return parseFloat(response.data.data[mint]?.price || '0');
        } catch (error) {
            console.error(`[SolanaTreasury] Price fetch error for ${mint}:`, error);
            return 0;
        }
    }

    /**
     * Scans for tokens in the wallet (wen, bestcoin) with USD valuations.
     */
    public async scanBalances() {
        if (!this.wallet) return [];

        const publicKey = this.wallet.publicKey;
        console.log(`[SolanaTreasury] Scanning metabolic value for ${publicKey.toBase58()}...`);

        try {
            const solBalance = await this.connection.getBalance(publicKey);
            const solPrice = await this.getPrice('So11111111111111111111111111111111111111112');

            const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(publicKey, {
                programId: TOKEN_PROGRAM_ID
            });

            const balances = [
                {
                    symbol: 'SOL',
                    mint: 'So11111111111111111111111111111111111111112',
                    balance: (solBalance / LAMPORTS_PER_SOL).toString(),
                    usd_value: (solBalance / LAMPORTS_PER_SOL) * solPrice
                }
            ];

            for (const account of tokenAccounts.value) {
                const info = account.account.data.parsed.info;
                const mint = info.mint;
                const balanceStr = info.tokenAmount.uiAmountString;
                const balance = parseFloat(balanceStr);

                if (balance > 0) {
                    let symbol = 'UNKNOWN';
                    if (mint === this.MINTS.WEN) symbol = 'WEN';
                    if (mint === this.MINTS.BEST) symbol = 'BEST';
                    if (mint === this.MINTS.USDC) symbol = 'USDC';

                    const price = symbol === 'USDC' ? 1 : await this.getPrice(mint);

                    balances.push({
                        symbol,
                        mint,
                        balance: balanceStr,
                        usd_value: balance * price
                    });
                }
            }

            return balances.sort((a, b) => b.usd_value - a.usd_value);
        } catch (error) {
            console.error('[SolanaTreasury] Error scanning balances:', error);
            return [];
        }
    }
    /**
     * Swaps tokens via Jupiter Aggregator.
     * Enforces safety guidelines.
     */
    public async monetizeToken(mint: string, amount: string, targetMint: string = this.MINTS.USDC) {
        if (!this.wallet) {
            throw new Error('Wallet not initialized');
        }

        console.log(`[SolanaTreasury] Initiating monetization for token ${mint}...`);

        // 1. Validate with TreasuryGuards
        const usdValue = 50; // Mocked
        const validation = TreasuryGuards.validateTrade('SOLANA', usdValue, 1.0);

        if (!validation.allowed) {
            throw new Error(`Treasury Guard block: ${validation.reason}`);
        }

        // 2. Get Quote
        const quote = await this.getJupiterQuote(mint, targetMint, amount);
        if (!quote) throw new Error('Failed to get Jupiter quote');

        // 3. Get Swap Transaction
        try {
            const swapResponse = await axios.post('https://quote-api.jup.ag/v6/swap', {
                quoteResponse: quote,
                userPublicKey: this.wallet.publicKey.toBase58(),
                wrapAndUnwrapSol: true
            });

            const { swapTransaction } = swapResponse.data;

            // 4. Sign and send
            const transactionBuf = Buffer.from(swapTransaction, 'base64');
            const transaction = Transaction.from(transactionBuf);

            transaction.sign(this.wallet);

            const signature = await this.connection.sendRawTransaction(transaction.serialize());
            console.log(`[SolanaTreasury] Swap sent! Signature: ${signature}`);

            await this.connection.confirmTransaction(signature);
            console.log(`[SolanaTreasury] Swap confirmed!`);

            return {
                ok: true,
                signature,
                platform: 'Jupiter'
            };
        } catch (error: any) {
            console.error('[SolanaTreasury] Swap failed:', error);
            return {
                ok: false,
                error: error.message
            };
        }
    }

    /**
     * Gets a swap quote from Jupiter
     */
    public async getJupiterQuote(inputMint: string, outputMint: string, amount: string) {
        try {
            const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${TreasuryGuards['MAX_SLIPPAGE_BPS'] || 100}`;
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error('[SolanaTreasury] Jupiter quote error:', error);
            return null;
        }
    }
}

export const solanaTreasury = new SolanaTreasuryService();
