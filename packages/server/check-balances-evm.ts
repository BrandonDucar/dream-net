import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

async function checkEvmBalances() {
    const pk = process.env.METAMASK_PRIVATE_KEY || process.env.PRIVATE_KEY;
    if (!pk) throw new Error('METAMASK_PRIVATE_KEY missing');

    const networks = [
        { name: 'Polygon', rpc: 'https://polygon-rpc.com', symbol: 'MATIC' },
        { name: 'Base', rpc: 'https://mainnet.base.org', symbol: 'ETH' }
    ];

    const USDC_POLYGON = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

    for (const net of networks) {
        try {
            const provider = new ethers.JsonRpcProvider(net.rpc);
            const wallet = new ethers.Wallet(pk, provider);
            const balance = await provider.getBalance(wallet.address);

            console.log(`--- ${net.name} Report: ${wallet.address} ---`);
            console.log(`${net.symbol}: ${ethers.formatEther(balance)}`);

            if (net.name === 'Polygon') {
                const usdcAbi = ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"];
                const usdcContract = new ethers.Contract(USDC_POLYGON, usdcAbi, provider);
                const usdcBal = await usdcContract.balanceOf(wallet.address);
                const decimals = await usdcContract.decimals();
                console.log(`USDC: ${ethers.formatUnits(usdcBal, decimals)}`);
            }
        } catch (e) {
            console.error(`Error checking ${net.name}:`, e.message);
        }
    }
}

checkEvmBalances().catch(console.error);
