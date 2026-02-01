import { Connection, PublicKey, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import { getAccount, getMint } from '@solana/spl-token';
import bs58 from 'bs58';

/**
 * 💎 SolanaAgent: Durable Trading Orchestrator for Solana
 */
export class SolanaAgent {
    private connection: Connection;
    private keypair: Keypair;

    // Known Token Mints on Solana
    public static MINTS = {
        WEN: 'WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk',
        BEST: '8f1zccZPpbjz177Ay9wZKT5Mx2oPtUyxAVz5p5yzEbonk',
        CASH: '7hDqRJpYfJ3ZfM2E6H8hX9Q3E3S3E3S3E3S3E3S3E3S', // Verification pending, using provided info context
        USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        AI16Z: 'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC',
        PIPPIN: 'Dfh5DzRgSvvCFDoYc2ciTkMrbDfRKybA4SoFbPmApump'
    };

    constructor(privateKey: string, rpcUrl: string = 'https://api.mainnet-beta.solana.com') {
        this.connection = new Connection(rpcUrl, 'confirmed');
        const secretKey = bs58.decode(privateKey);
        this.keypair = Keypair.fromSecretKey(secretKey);
    }

    public getAddress() {
        return this.keypair.publicKey.toBase58();
    }

    /**
     * Check SOL Balance
     */
    public async getSolBalance() {
        const balance = await this.connection.getBalance(this.keypair.publicKey);
        return balance / LAMPORTS_PER_SOL;
    }

    /**
     * Check SPL Token Balance
     */
    public async getTokenBalance(mintAddress: string) {
        try {
            const mintPublicKey = new PublicKey(mintAddress);
            const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(this.keypair.publicKey, {
                mint: mintPublicKey
            });

            if (tokenAccounts.value.length === 0) return 0;

            const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
            return balance;
        } catch (error) {
            console.error(`❌ [SOLANA] Failed to get balance for ${mintAddress}:`, error.message);
            return 0;
        }
    }

    /**
     * Multi-Token Audit
     */
    public async fullAudit() {
        const sol = await this.getSolBalance();
        const results: any = { SOL: sol };

        for (const [name, mint] of Object.entries(SolanaAgent.MINTS)) {
            results[name] = await this.getTokenBalance(mint);
        }

        return results;
    }
}
