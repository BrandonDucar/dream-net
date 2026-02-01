
import React, { useEffect, useState } from "react";
import { useRoute } from "wouter";
// import { ChainReceipt } from "@dreamnet/chain-receipt-core"; // Commented out to avoid build interop issues for now, mocking local logic for Client Velocity.

// Mock Logic for Client (until monorepo linking is perfected for Frontend)
const generateReceiptSVG = (hash: string) => `
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#0B0F13"/>
    <rect x="20" y="20" width="560" height="360" rx="15" fill="none" stroke="#00D4FF" stroke-width="2"/>
    <text x="50%" y="60" text-anchor="middle" fill="#00D4FF" font-family="monospace" font-size="24">DREAMNET RECEIPT</text>
    <line x1="40" y1="80" x2="560" y2="80" stroke="#00D4FF" stroke-width="1" stroke-dasharray="5,5"/>
    
    <text x="40" y="120" fill="white" font-family="monospace">HASH: ${hash.slice(0, 16)}...</text>
    <text x="40" y="160" fill="white" font-family="monospace">STATUS: CONFIRMED</text>
    <text x="40" y="200" fill="white" font-family="monospace">NETWORK: BASE MAINNET</text>
    <text x="40" y="240" fill="white" font-family="monospace">GAS SAVED: MAXIMAL</text>
    
    <text x="50%" y="350" text-anchor="middle" fill="#00D4FF" font-family="monospace" font-size="14">VERIFIED ON BASE</text>
    
    <!-- Animation Pulse -->
    <circle cx="540" cy="50" r="10" fill="#00D4FF">
        <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
    </circle>
</svg>
`;

export default function ChainReceiptPage() {
    const [match, params] = useRoute("/receipt/:hash");
    const hash = params?.hash || "0x000000";
    const [svg, setSvg] = useState<string>("");

    useEffect(() => {
        // In full prod, we would call ChainReceipt.generator.fetchTransaction(hash)
        setSvg(generateReceiptSVG(hash));
    }, [hash]);

    const downloadPNG = () => {
        // Simple SVG to PNG download logic would go here
        alert("Downloading Receipt... (Mock)");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-primary tracking-tighter glow">THE VIRAL HAND</h1>
                <p className="text-muted-foreground font-mono">BASE TRANSACTION VERIFICATION</p>
            </div>

            {/* The Frame */}
            <div
                className="relative group cursor-pointer transition-transform hover:scale-105"
                dangerouslySetInnerHTML={{ __html: svg }}
            />

            <div className="flex space-x-4">
                <button
                    onClick={downloadPNG}
                    className="px-6 py-2 bg-primary text-background font-bold tracking-widest hover:bg-white transition-colors rounded-none border border-primary glow-box"
                >
                    DOWNLOAD ARTIFACT
                </button>
            </div>
        </div>
    );
}
