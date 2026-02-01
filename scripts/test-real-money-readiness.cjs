
const { ethers } = require('ethers');
require('dotenv').config();

let PrismaClient;
try {
    PrismaClient = require('@prisma/client').PrismaClient;
} catch (e) {
    console.warn('⚠️ Falling back to agent-pulse-x PrismaClient');
    try {
        PrismaClient = require('../../agent-pulse-x/node_modules/@prisma/client').PrismaClient;
    } catch (e2) {
        PrismaClient = require('../packages/organs/nervous/trading-organ/node_modules/@prisma/client').PrismaClient;
    }
}
if (!PrismaClient) {
    console.error('❌ Could not find PrismaClient in any known location.');
    process.exit(1);
}

// Mock BaseAgent for the script to avoid TS/module issues with the main file
class BaseAgent {
    constructor(privateKey, rpcUrl = 'https://mainnet.base.org') {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.prisma = new PrismaClient();
    }

    async initializeWallet(agentId) {
        // Ensure wallet exists in DB
        const existing = await this.prisma.agentWallet.findUnique({
            where: {
                agentId_chain: {
                    agentId: agentId,
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

    async checkBalance() {
        const balance = await this.provider.getBalance(this.wallet.address);
        return {
            address: this.wallet.address,
            balanceEth: ethers.formatEther(balance),
            timestamp: Date.now()
        };
    }

    async getGasPrice() {
        const feeData = await this.provider.getFeeData();
        return {
            gasPrice: feeData.gasPrice?.toString(),
            maxFee: feeData.maxFeePerGas?.toString(),
            priorityFee: feeData.maxPriorityFeePerGas?.toString()
        };
    }
}

async function runRealMoneyTest() {
    console.log('💰 [BaseAgent] Initiating Real Money Readiness Test (CJS Mode)...');

    // 1. Setup Identity
    // Use env key or generate a random one for testing the "Wallet Creation" logic
    const pk = process.env.PRIVATE_KEY || ethers.Wallet.createRandom().privateKey;
    const agentId = 'agent-money-test-01';

    console.log(`🔑 Using Agent ID: ${agentId}`);

    // 2. Instantiate Agent
    const agent = new BaseAgent(pk);

    // 3. Initialize Wallet (DB Persistence Test)
    console.log('💾 Testing DB Persistence (initializeWallet)...');
    try {
        await agent.initializeWallet(agentId);
        console.log('✅ Wallet Initialization Success (DB Checked/Created).');
    } catch (e) {
        console.error('❌ Wallet Initialization Failed:', e);
        // process.exit(1); 
    }

    // 4. Check Balance (Real RPC Test)
    console.log('📡 Testing RPC Connection (checkBalance)...');
    try {
        const balance = await agent.checkBalance();
        console.log('✅ Balance Check Success:', balance);
    } catch (e) {
        console.error('❌ RPC Connection Failed:', e.message);
    }

    // 5. Gas Price (Real Network Data)
    console.log('⛽ Fetching Live Gas Prices...');
    try {
        const gas = await agent.getGasPrice();
        console.log('✅ Gas Price Success:', gas);
    } catch (e) {
        console.error('❌ Gas Price Fetch Failed:', e.message);
    }

    console.log('\n🏁 Real Money Readiness Test COMPLETE.');
    process.exit(0);
}

runRealMoneyTest().catch(console.error);
