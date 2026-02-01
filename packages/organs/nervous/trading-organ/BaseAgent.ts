import { ethers } from 'ethers';
import { PrismaClient } from '@prisma/client';

/**
 * 💎 BaseAgent: Durable Trading Orchestrator
 * 
 * Integrated with the Durable Execution Mandate (GPT-DUMP-2026)
 * Uses WAL (Write-Ahead Log) via Prisma.
 */
export class BaseAgent {
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private prisma: PrismaClient;

    // Known Token Mints on Base
    public static MINTS = {
        VIRTUAL: '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b',
        CLANKER: '0x1bc0c42215582d5A085795f4baDbaC3ff36d1Bcb',
        AIXBT: '0x4f9fd6be4a90f2620860d680c0d4d5fb53d1a825',
        SPK: '0x692A07f2306a3bba739e5281A26A5a97C6D7A6cA',
        USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
    };

    private ERC20_ABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)"
    ];

    constructor(privateKey: string, rpcUrl: string = 'https://mainnet.base.org') {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.prisma = new PrismaClient();
    }

    /**
     * Initializes or retreieves the agent's wallet from the database.
     */
    public async initializeWallet(agentId: string) {
        // Ensure wallet exists in DB
        const existing = await this.prisma.agentWallet.findUnique({
            where: {
                agentId_chain: {
                    agentId,
                    chain: 'BASE'
                }
            }
        });

        if (!existing) {
            console.log(`[💎 BaseAgent] New Wallet Detected for ${agentId}. Persisting...`);
            await this.prisma.agentWallet.create({
                data: {
                    agentId,
                    chain: 'BASE',
                    address: this.wallet.address,
                    derivationPath: "m/44'/60'/0'/0/0", // Standard eth path
                    parentWallet: 'MASTER_WALLET_ADDRESS' // TODO: Pass master wallet addr
                }
            });
        } else {
            console.log(`[💎 BaseAgent] Wallet Verified for ${agentId}: ${existing.address}`);
        }
    }

    /**
     * Durable Step: Execute an action with WAL logging
     */
    private async durableStep<T>(type: string, payload: any, action: () => Promise<T>): Promise<T> {
        // 1. Log INTENT to WAL
        const durableAction = await this.prisma.durableAction.create({
            data: {
                type,
                payload: payload as any,
                status: 'PENDING'
            }
        });

        console.log(`[💎 BaseAgent] Intent Logged: ${type} (${durableAction.id})`);

        try {
            // 2. Execute ACTION
            const result = await action();

            // 3. Log COMPLETION
            await this.prisma.durableAction.update({
                where: { id: durableAction.id },
                data: {
                    status: 'COMPLETED',
                    result: result as any
                }
            });

            console.log(`[💎 BaseAgent] Action Completed: ${type}`);
            return result;
        } catch (error: any) {
            // 4. Log FAILURE for retry/audit
            await this.prisma.durableAction.update({
                where: { id: durableAction.id },
                data: {
                    status: 'FAILED',
                    error: error.message
                }
            });
            console.error(`[💎 BaseAgent] Action Failed: ${type} - ${error.message}`);
            throw error;
        }
    }

    /**
     * Check ETH Balance
     */
    public async checkBalance() {
        return this.durableStep('CHECK_BALANCE_ETH', { address: this.wallet.address }, async () => {
            const balance = await this.provider.getBalance(this.wallet.address);
            return {
                address: this.wallet.address,
                balanceEth: ethers.formatEther(balance),
                timestamp: Date.now()
            };
        });
    }

    /**
     * Check ERC20 Balance
     */
    public async getTokenBalance(mintAddress: string) {
        const contract = new ethers.Contract(mintAddress, this.ERC20_ABI, this.provider);
        const [balance, decimals] = await Promise.all([
            contract.balanceOf(this.wallet.address),
            contract.decimals()
        ]);
        return ethers.formatUnits(balance, decimals);
    }

    /**
     * Multi-Token Audit
     */
    public async fullAudit() {
        const eth = (await this.checkBalance()).balanceEth;
        const results: any = { ETH: eth };

        for (const [name, mint] of Object.entries(BaseAgent.MINTS)) {
            try {
                results[name] = await this.getTokenBalance(mint);
            } catch (e) {
                results[name] = "0.0 (Error)";
            }
        }

        return results;
    }

    /**
     * Get Gas Price (Durable)
     */
    public async getGasPrice() {
        return this.durableStep('GET_GAS_PRICE', {}, async () => {
            const feeData = await this.provider.getFeeData();
            return {
                gasPrice: feeData.gasPrice?.toString(),
                maxFee: feeData.maxFeePerGas?.toString(),
                priorityFee: feeData.maxPriorityFeePerGas?.toString()
            };
        });
    }

    /**
     * Transfer ETH (Durable)
     */
    public async transferEth(to: string, amountStr: string) {
        return this.durableStep('TRANSFER_ETH', { to, amount: amountStr }, async () => {
            const tx = await this.wallet.sendTransaction({
                to,
                value: ethers.parseEther(amountStr)
            });
            console.log(`[💎 BaseAgent] ETH Transfer Sent: ${tx.hash}`);
            return await tx.wait();
        });
    }

    /**
     * Transfer ERC20 (Durable)
     */
    public async transferErc20(tokenAddress: string, to: string, amountStr: string) {
        return this.durableStep('TRANSFER_ERC20', { token: tokenAddress, to, amount: amountStr }, async () => {
            const contract = new ethers.Contract(tokenAddress, [
                "function transfer(address to, uint256 amount) returns (bool)",
                "function decimals() view returns (uint8)"
            ], this.wallet);

            const decimals = await contract.decimals();
            const amount = ethers.parseUnits(amountStr, decimals);

            const tx = await contract.transfer(to, amount);
            console.log(`[💎 BaseAgent] ERC20 Transfer Sent: ${tx.hash}`);
            return await tx.wait();
        });
    }

    public getAddress() {
        return this.wallet.address;
    }

    /**
     * Directive 002: Sign a challenge for identity verification
     */
    public async signChallenge(challenge: string): Promise<string> {
        return await this.wallet.signMessage(challenge);
    }

    /**
     * Static helper to verify a signature
     */
    public static verifySignature(challenge: string, signature: string, expectedAddress: string): boolean {
        try {
            const recoveredAddress = ethers.verifyMessage(challenge, signature);
            return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
        } catch (e) {
            return false;
        }
    }
}
