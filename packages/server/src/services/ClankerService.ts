import { ethers } from 'ethers';
import { agentBus } from '../agents/agent-bus.js';

// Clanker v4 Base Network Addresses
export const CLANKER_BASE_ADDRESSES = {
    FACTORY_V4: '0xE85A59c628F7d27878ACeB4bf3b35733630083a9',
    FEE_LOCKER_V4: '0xF3622742b1E446D92e45E22923Ef11C2fcD55D68',
    LP_LOCKER_FEE_CONVERSION: '0x63D2DfEA64b3433F4071A98665bcD7Ca14d93496',
};

// Simplified ABIs for Metabolic Monitoring
const CLANKER_FEE_LOCKER_ABI = [
    'function claimableRewards(address user, address token) view returns (uint256)',
    'function claim(address token) external',
    'event FeeClaimed(address indexed user, address indexed token, uint256 amount)'
];

const CLANKER_FACTORY_ABI = [
    'event TokenDeployed(address indexed token, address indexed pool, address indexed deployer, string name, string symbol)',
    'function deployToken(string name, string symbol, uint256 supply, address hook, address extensions) external returns (address)'
];

export class ClankerService {
    private provider: ethers.JsonRpcProvider;
    private feeLocker: ethers.Contract;
    private factory: ethers.Contract;

    constructor() {
        // Base RPC assumed in ENV
        const rpcUrl = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
        this.provider = new ethers.JsonRpcProvider(rpcUrl);

        this.feeLocker = new ethers.Contract(
            CLANKER_BASE_ADDRESSES.FEE_LOCKER_V4,
            CLANKER_FEE_LOCKER_ABI,
            this.provider
        );

        this.factory = new ethers.Contract(
            CLANKER_BASE_ADDRESSES.FACTORY_V4,
            CLANKER_FACTORY_ABI,
            this.provider
        );

        this.initMetabolicListeners();
    }

    private initMetabolicListeners() {
        console.log('[ClankerService] Monitoring Factory Births...');

        this.factory.on('TokenDeployed', (token, pool, deployer, name, symbol) => {
            console.log(`[ClankerService] 🐣 New Token Birth: ${name} (${symbol}) at ${token}`);
            agentBus.broadcast('CLANKER_TOKEN_BORN', `Token ${name} exploded into the Farcaster ecosystem.`, {
                token,
                pool,
                deployer,
                name,
                symbol,
                timestamp: new Date().toISOString()
            });
        });

        this.feeLocker.on('FeeClaimed', (user, token, amount) => {
            console.log(`[ClankerService] 💎 Fee Collected: ${ethers.formatEther(amount)} tokens at ${token}`);
            agentBus.broadcast('CLANKER_FEE_HARVESTED', `Metabolic residue collected: ${ethers.formatEther(amount)} from ${token}`, {
                user,
                token,
                amount: amount.toString()
            });
        });
    }

    /**
     * Check if a specific address has pending rewards sitting in the Clanker Fee Locker
     */
    public async getPendingRewards(userAddress: string, tokenAddress: string): Promise<string> {
        try {
            const rewards = await this.feeLocker.claimableRewards(userAddress, tokenAddress);
            return ethers.formatEther(rewards);
        } catch (e) {
            console.error(`[ClankerService] Failed to fetch rewards for ${userAddress}: ${e}`);
            return '0';
        }
    }

    /**
     * Scan a wallet for common rewards (WETH, DEGEN, etc.)
     */
    public async scanWalletForRewards(userAddress: string) {
        const commonTokens = [
            '0x4200000000000000000000000000000000000006', // WETH
            '0x4ed4E045Cc90d6409674c520317e0b2170c97828', // DEGEN
        ];

        let totalPending = 0;
        for (const token of commonTokens) {
            const amount = await this.getPendingRewards(userAddress, token);
            if (parseFloat(amount) > 0) {
                console.log(`[ClankerService] Found pending ${amount} rewards for ${token}`);
                totalPending++;
            }
        }
        return totalPending;
    }
}

export const clanker = new ClankerService();
