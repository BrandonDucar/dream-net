import { ethers, Wallet, HDNodeWallet } from 'ethers';
import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';

export class WalletService {
    private provider: ethers.JsonRpcProvider;
    private primaryWallet: Wallet | null = null;
    private solanaConnection: Connection;
    private solanaWallet: Keypair | null = null;

    constructor() {
        // --- EVM SETUP ---
        let rpcUrl = process.env.BASE_RPC_URL;
        if (!rpcUrl || rpcUrl.includes('your-api-key')) {
            rpcUrl = 'https://mainnet.base.org';
            console.log('🦞 WalletService: Using fallback public Base RPC.');
        }
        this.provider = new ethers.JsonRpcProvider(rpcUrl);

        // Load primary EVM private key
        const pk = process.env.EVM_PRIVATE_KEY || process.env.PRIVATE_KEY || process.env.HOT_SENDER_PK;
        if (pk) {
            this.primaryWallet = new Wallet(pk, this.provider);
            console.log(`🦞 WalletService: Primary EVM wallet loaded: ${this.primaryWallet.address}`);
        } else {
            console.warn('🦞 WalletService: No EVM_PRIVATE_KEY found in environment.');
        }

        // --- SOLANA SETUP ---
        const solRpc = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
        this.solanaConnection = new Connection(solRpc, 'confirmed');

        const solPk = process.env.SOLANA_PRIVATE_KEY;
        if (solPk) {
            try {
                // Determine if solPk is a JSON array string (Phantom export) or base58
                let secretKey: Uint8Array;
                if (solPk.startsWith('[') && solPk.endsWith(']')) {
                    secretKey = Uint8Array.from(JSON.parse(solPk));
                } else {
                    // Assume base58 string (requires bs58, but let's try to avoid extra deps if possible or use a simple decoder later)
                    // For now, prompt user to use JSON format if bs58 fails or add bs58 dep.
                    // Actually, standard phantom export is base58. 
                    // To avoid 'bs58' dependency hell right now, let's assume JSON format (array of numbers) 
                    // OR implement a simple helper if needed. 
                    // Let's rely on the user providing the array format or use 'Buffer.from(solPk, "base64")' if it was base64...
                    // Standard practice: bs58 is best. Let's start with expecting JSON array for safety.
                    console.warn('⚠️ Solana PK must be JSON array format (e.g. [123, 45...]). BS58 not yet auto-decoded.');
                    secretKey = new Uint8Array([]);
                }

                if (secretKey.length > 0) {
                    this.solanaWallet = Keypair.fromSecretKey(secretKey);
                    console.log(`🦞 WalletService: Primary Solana wallet loaded: ${this.solanaWallet.publicKey.toBase58()}`);
                }
            } catch (err: any) {
                console.error('❌ Failed to load Solana Wallet:', err.message);
            }
        } else {
            console.warn('🦞 WalletService: No SOLANA_PRIVATE_KEY found.');
        }
    }

    /**
     * Generates a deterministic EVM wallet for a specific agent/arm.
     */
    public async getAgentWallet(agentId: string): Promise<Wallet> {
        const masterPk = process.env.EVM_PRIVATE_KEY || process.env.PRIVATE_KEY;
        if (!masterPk) throw new Error('MASTER_KEY_NOT_FOUND');

        // Deterministic Seed derivation for ethers v6
        const seed = ethers.id(masterPk);
        const hdNode = HDNodeWallet.fromSeed(seed);

        // Derivation path using agentId hash
        const hash = ethers.id(agentId);
        const index = parseInt(hash.substring(2, 10), 16) % 2147483647;
        const derived = hdNode.derivePath(`m/44'/60'/0'/0/${index}`);

        return new Wallet(derived.privateKey, this.provider);
    }

    /**
     * Generates a deterministic Solana wallet for a specific agent.
     * (Simplified derivation for now - unique keypair per agent would require hierarchical derivation which is complex without widespread lib support)
     * For MVP: Returns the master wallet if agentId matches 'clawedette_sovereign', otherwise throws or returns null?
     * BETTER: Use a seed based mechanism if possible, but for now let's just expose the Master Wallet for Clawedette.
     */
    public getSolanaWallet(agentId: string): Keypair | null {
        // TODO: Implement true HD derivation for Solana
        if (agentId === 'clawedette_sovereign' || agentId === 'clawedette') {
            return this.solanaWallet;
        }
        return null;
    }

    public async getBalance(address: string): Promise<string> {
        try {
            const balance = await this.provider.getBalance(address);
            return ethers.formatEther(balance);
        } catch (error) {
            return '0.0';
        }
    }

    public async getSolanaBalance(address: string): Promise<string> {
        try {
            const pubKey = new PublicKey(address);
            const balance = await this.solanaConnection.getBalance(pubKey);
            return (balance / LAMPORTS_PER_SOL).toFixed(4);
        } catch (error) {
            return '0.0';
        }
    }

    /**
     * Monitors other agents
     */
    /**
     * Monitors other agents (Fetches from DB via Prisma)
     */
    public async getSwarmStatus(): Promise<any[]> {
        let dbAgents: any[] = [];
        try {
            // Lazy load prisma to avoid instantiation issues if DB is down
            const { PrismaClient } = await import('@prisma/client');
            const prisma = new PrismaClient();

            dbAgents = await prisma.agent.findMany({
                where: {
                    walletAddress: { not: null }
                }
            });
            console.log(`🦞 WalletService: Pulled ${dbAgents.length} agents from the Hive Mind (DB).`);
            await prisma.$disconnect();
        } catch (error) {
            console.warn('🦞 WalletService: Could not reach Agent DB. Using local cache.');
        }

        // Hardcoded high-value targets (Always ensure these are tracked)
        const coreAgents = [
            { id: 'clawedette_sovereign', role: 'Governor' },
            { id: 'wolf_analyst', role: 'Recruiter' },
            { id: 'orca_scheduler', role: 'Strategist' },
            { id: 'whale_hunter', role: 'extraction' },
            { id: 'spider_witch', role: 'Trader' }
        ];

        // Merge DB agents with core agents, preferring DB data if id matches
        const agentMap = new Map<string, any>();

        // Add core defaults first
        coreAgents.forEach(a => agentMap.set(a.id, a));

        // Overlay DB agents
        dbAgents.forEach(a => {
            agentMap.set(a.id, {
                id: a.id,
                role: a.rank || 'Agent',
                ...a
            });
        });

        const swarm: any[] = [];
        for (const agent of agentMap.values()) {
            const status: any = { ...agent, balances: {} };

            // EVM Check
            try {
                // If agent has a stored wallet address, use it. Otherwise derive it.
                let address = agent.walletAddress;
                if (!address) {
                    const wallet = await this.getAgentWallet(agent.id);
                    address = wallet.address;
                }

                const evmBal = await this.getBalance(address);
                status.balances.evm = { address: address, amount: `${evmBal} ETH` };
                status.evmActive = parseFloat(evmBal) > 0;
            } catch (err) { }

            // Solana Check
            // Usage of master wallet for Clawedette, others would need their own keys in DB
            if (this.solanaWallet && (agent.id === 'clawedette_sovereign' || agent.id === 'clawedette')) {
                const solBal = await this.getSolanaBalance(this.solanaWallet.publicKey.toBase58());
                status.balances.sol = { address: this.solanaWallet.publicKey.toBase58(), amount: `${solBal} SOL` };
            }

            swarm.push(status);
        }

        return swarm.sort((a, b) => (b.evmActive ? 1 : 0) - (a.evmActive ? 1 : 0)); // Active first
    }
}

export const walletService = new WalletService();
