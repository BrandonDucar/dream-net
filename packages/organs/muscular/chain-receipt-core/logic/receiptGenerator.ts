
/**
 * 🧾 CHAIN RECEIPT GENERATOR
 * 
 * "The Viral Hand"
 * 
 * Generates an SVG/PNG receipt for a Base transaction.
 * Designed to be shared on Farcaster as a Frame.
 */

import { ethers } from "ethers";

export interface ReceiptData {
    hash: string;
    from: string;
    to: string;
    value: string;
    timestamp: number;
    gasUsed: string;
    fee: string;
}

export class ReceiptGenerator {

    provider: ethers.JsonRpcProvider;

    constructor() {
        this.provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
    }

    async fetchTransaction(hash: string): Promise<ReceiptData | null> {
        console.log(`🔍 [ChainReceipt] Fetching TX: ${hash}`);
        const tx = await this.provider.getTransaction(hash);
        const receipt = await this.provider.getTransactionReceipt(hash);

        if (!tx || !receipt) return null;

        return {
            hash: tx.hash,
            from: tx.from,
            to: tx.to || "Contract",
            value: ethers.formatEther(tx.value),
            timestamp: Date.now(), // Estimate
            gasUsed: receipt.gasUsed.toString(),
            fee: ethers.formatEther(receipt.fee)
        };
    }

    generateSVG(data: ReceiptData): string {
        // Simple SVG Template for the "Receipt" look
        return `
        <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#0B0F13"/>
            <rect x="20" y="20" width="560" height="360" rx="15" fill="none" stroke="#00D4FF" stroke-width="2"/>
            <text x="50%" y="60" text-anchor="middle" fill="#00D4FF" font-family="monospace" font-size="24">DREAMNET RECEIPT</text>
            <line x1="40" y1="80" x2="560" y2="80" stroke="#00D4FF" stroke-width="1" stroke-dasharray="5,5"/>
            
            <text x="40" y="120" fill="white" font-family="monospace">HASH: ${data.hash.slice(0, 16)}...</text>
            <text x="40" y="160" fill="white" font-family="monospace">FROM: ${data.from}</text>
            <text x="40" y="200" fill="white" font-family="monospace">VALUE: ${data.value} ETH</text>
            <text x="40" y="240" fill="white" font-family="monospace">GAS SAVED (L2): HIGH</text>
            
            <text x="50%" y="350" text-anchor="middle" fill="#00D4FF" font-family="monospace" font-size="14">VERIFIED ON BASE</text>
        </svg>
        `;
    }
}
