
import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

// Types
interface VerificationResult {
    success: boolean;
    data?: {
        uid: string;
        tapCount: number;
        linkedAsset?: {
            name: string;
            type: string;
            rarity: string;
            owner: string;
        };
    };
    error?: string;
}

export default function VerifyPage() {
    const [location, setLocation] = useLocation();
    const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'AUTHENTIC' | 'INVALID'>('IDLE');
    const [result, setResult] = useState<VerificationResult | null>(null);

    useEffect(() => {
        // Parse Query Params manually since wouter doesn't have a hook for it built-in easily
        const searchParams = new URLSearchParams(window.location.search);
        const enc = searchParams.get('e');
        const cmac = searchParams.get('c');

        if (enc) {
            verifyTag(enc, cmac || '');
        } else {
            setStatus('IDLE');
        }
    }, []);

    const verifyTag = async (enc: string, cmac: string) => {
        setStatus('SCANNING');

        // Artificial Delay for "Ocular Scanning" effect (The theatre of authentication)
        await new Promise(r => setTimeout(r, 2000));

        try {
            const response = await fetch(`/api/ntag/verify?e=${enc}&c=${cmac}`);
            const data = await response.json();

            if (data.success) {
                setResult(data);
                setStatus('AUTHENTIC');
            } else {
                setStatus('INVALID');
            }
        } catch (e) {
            console.error(e);
            setStatus('INVALID');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* BACKGROUND GRID */}
            <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-10 pointer-events-none" />

            {/* SCANNER UI */}
            <div className="relative z-10 w-full max-w-md text-center">

                {/* ANIMATED SCANNER RING */}
                <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
                    {/* Outer Ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className={`absolute inset-0 border-2 rounded-full border-dashed ${getStatusColor(status)} opacity-30`}
                    />

                    {/* Inner Pulse */}
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`w-48 h-48 rounded-full border-4 ${getStatusColor(status)} flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
                    >
                        {getStatusIcon(status)}
                    </motion.div>
                </div>

                {/* TEXT READOUT */}
                <h1 className="text-3xl font-bold font-mono tracking-widest mb-2">
                    {status === 'IDLE' && 'READY TO SCAN'}
                    {status === 'SCANNING' && 'DECRYPTING SKU...'}
                    {status === 'AUTHENTIC' && 'VERIFIED SOUUL'}
                    {status === 'INVALID' && 'COUNTERFEIT DETECTED'}
                </h1>

                <p className="text-gray-500 font-mono text-sm mb-8">
                    {status === 'IDLE' && 'Tap your DreamNet Asset to verify authenticity.'}
                    {status === 'SCANNING' && 'Verifying AES-128 CMAC Signature...'}
                    {status === 'AUTHENTIC' && `UID: ${result?.data?.uid} • TAP #${result?.data?.tapCount}`}
                    {status === 'INVALID' && 'Cryptographic signature mismatch. Asset is not genuine.'}
                </p>

                {/* ASSET CARD (If Authentic) */}
                {status === 'AUTHENTIC' && result?.data?.linkedAsset && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl text-left"
                    >
                        <div className="text-xs text-blue-500 font-bold tracking-widest uppercase mb-1">
                            {result.data.linkedAsset.type}
                        </div>
                        <div className="text-2xl font-bold mb-2">
                            {result.data.linkedAsset.name}
                        </div>
                        <div className="flex justify-between text-sm text-gray-400 font-mono">
                            <span>Rank: {result.data.linkedAsset.rarity}</span>
                            <span>Owner: {result.data.linkedAsset.owner}</span>
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'AUTHENTIC': return 'border-green-500 text-green-500 shadow-green-500';
        case 'INVALID': return 'border-red-500 text-red-500 shadow-red-500';
        case 'SCANNING': return 'border-blue-500 text-blue-500 shadow-blue-500';
        default: return 'border-zinc-500 text-zinc-500';
    }
}

function getStatusIcon(status: string) {
    if (status === 'AUTHENTIC') return <span className="text-6xl">🛡️</span>;
    if (status === 'INVALID') return <span className="text-6xl">💀</span>;
    if (status === 'SCANNING') return <span className="text-6xl animate-pulse">👁️</span>;
    return <span className="text-6xl">📡</span>;
}
