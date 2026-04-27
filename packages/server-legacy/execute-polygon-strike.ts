import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });
dotenv.config({ path: '../../.env.gcp' });

const USDC_POLYGON = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
const WMATIC = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270';
const UNISWAP_ROUTER = '0xE592427A0AEce92De3Edee1F18E0157C05861564'; // Uniswap V3

async function polygonSwap() {
    console.log('--- ⚔️ SYSTEM STRIKE: POLYGON REVENUE ARMING ⚔️ ---');

    try {
        const rpcUrl = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
        const provider = new ethers.JsonRpcProvider(rpcUrl);

        const ethKey = process.env.METAMASK_PRIVATE_KEY || process.env.PRIVATE_KEY;
        if (!ethKey) throw new Error('METAMASK_PRIVATE_KEY missing');

        const wallet = new ethers.Wallet(ethKey, provider);
        console.log(`[Strike] Wallet: ${wallet.address}`);

        // Swap 2.0 MATIC for USDC
        const amountIn = ethers.parseEther('2.0');

        const routerAbi = [
            'function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)'
        ];

        const router = new ethers.Contract(UNISWAP_ROUTER, routerAbi, wallet);

        console.log(`[Strike] Swapping 2.0 MATIC -> USDC on Uniswap V3...`);

        const params = {
            tokenIn: WMATIC,
            tokenOut: USDC_POLYGON,
            fee: 3000, // 0.3%
            recipient: wallet.address,
            deadline: Math.floor(Date.now() / 1000) + 60 * 10,
            amountIn: amountIn,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        };

        const tx = await router.exactInputSingle(params, {
            value: amountIn,
            gasLimit: 300000
        });

        console.log(`[Strike] Transaction Broadcasted!`);
        console.log(`[Strike] Hash: https://polygonscan.com/tx/${tx.hash}`);

        const receipt = await tx.wait();
        console.log(`[Strike] ✅ SUCCESS! 2.0 MATIC swapped for USDC.`);
        console.log(`TX:${tx.hash}`);

    } catch (e: any) {
        console.error(`[Strike] ❌ Swap Failed: ${e.message}`);
    }
}

polygonSwap().catch(console.error);
