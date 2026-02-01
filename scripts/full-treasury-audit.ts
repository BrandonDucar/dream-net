import { ethers } from 'ethers';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// Load keys from ENV
const METAMASK_PK = '83a901f657e80f470d63e2be5baa753da5b81ec31a55195862a9c32e469e8c80';
const PHANTOM_PK = '2JKguBFypiuPKs2AjReuuiyyaCaJvw9zY4m9je4XDu6ZmUyPHeR68MqwRKpXhjCYoYfxxZmw4fkevZNfeaj6FKkk';

// Token addresses
const BASE_TOKENS = {
    VIRTUAL: '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b',
    CLANKER: '0x1bc0c42215582d5A085795f4baDbaC3ff36d1Bcb',
    AIXBT: '0x4f9fd6be4a90f2620860d680c0d4d5fb53d1a825',
    SPK: '0x692A07f2306a3bba739e5281A26A5a97C6D7A6cA',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
};

const SOLANA_TOKENS = {
    WEN: 'WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk',
    BEST: '8f1zccZPpbjz177Ay9wZKT5Mx2oPtUyxAVz5p5yzEbonk',
    USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    AI16Z: 'HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC',
    PIPPIN: 'Dfh5DzRgSvvCFDoYc2ciTkMrbDfRKybA4SoFbPmApump'
};

const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
];

async function auditMetaMask() {
    console.log("\n🔵 ═══════════════════════════════════════════");
    console.log("🔵 METAMASK WALLET AUDIT (BASE CHAIN)");
    console.log("🔵 ═══════════════════════════════════════════\n");

    const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
    const wallet = new ethers.Wallet(METAMASK_PK, provider);

    console.log(`📍 Address: ${wallet.address}\n`);

    // Check ETH balance
    const ethBalance = await provider.getBalance(wallet.address);
    console.log(`💰 ETH: ${ethers.formatEther(ethBalance)}`);

    // Check ERC20 tokens
    for (const [name, address] of Object.entries(BASE_TOKENS)) {
        try {
            const contract = new ethers.Contract(address, ERC20_ABI, provider);
            const [balance, decimals] = await Promise.all([
                contract.balanceOf(wallet.address),
                contract.decimals()
            ]);
            const formatted = ethers.formatUnits(balance, decimals);

            if (parseFloat(formatted) > 0) {
                console.log(`💰 ${name}: ${formatted}`);
            } else {
                console.log(`💰 ${name}: 0.0`);
            }
        } catch (e: any) {
            console.log(`❌ ${name}: Error - ${e.message.slice(0, 50)}`);
        }
    }
}

async function auditPhantom() {
    console.log("\n🟣 ═══════════════════════════════════════════");
    console.log("🟣 PHANTOM WALLET AUDIT (SOLANA CHAIN)");
    console.log("🟣 ═══════════════════════════════════════════\n");

    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const secretKey = bs58.decode(PHANTOM_PK);
    const keypair = Keypair.fromSecretKey(secretKey);

    console.log(`📍 Address: ${keypair.publicKey.toBase58()}\n`);

    // Check SOL balance
    const solBalance = await connection.getBalance(keypair.publicKey);
    console.log(`💰 SOL: ${solBalance / LAMPORTS_PER_SOL}`);

    // Check SPL tokens
    for (const [name, mint] of Object.entries(SOLANA_TOKENS)) {
        try {
            const mintPublicKey = new PublicKey(mint);
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(keypair.publicKey, {
                mint: mintPublicKey
            });

            if (tokenAccounts.value.length === 0) {
                console.log(`💰 ${name}: 0.0`);
            } else {
                const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
                console.log(`💰 ${name}: ${balance}`);
            }
        } catch (e: any) {
            console.log(`❌ ${name}: Error - ${e.message.slice(0, 50)}`);
        }
    }
}

async function performFullAudit() {
    console.log("\n💎 ═══════════════════════════════════════════");
    console.log("💎 SOVEREIGN TREASURY AUDIT");
    console.log("💎 Multi-Chain Balance Check");
    console.log("💎 ═══════════════════════════════════════════");

    try {
        await auditMetaMask();
    } catch (e: any) {
        console.error(`\n❌ MetaMask Audit Failed: ${e.message}`);
    }

    try {
        await auditPhantom();
    } catch (e: any) {
        console.error(`\n❌ Phantom Audit Failed: ${e.message}`);
    }

    console.log("\n✅ ═══════════════════════════════════════════");
    console.log("✅ AUDIT COMPLETE");
    console.log("✅ ═══════════════════════════════════════════\n");
}

performFullAudit().catch(console.error);
