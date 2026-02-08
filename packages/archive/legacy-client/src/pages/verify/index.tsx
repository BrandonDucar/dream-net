
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
    const [dwellStart, setDwellStart] = useState<number | null>(null);

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

        // Shadow Intent: Tracking dwell on page entrance
        const entranceTime = Date.now();
        return () => {
            const dwellDuration = Date.now() - entranceTime;
            if (dwellDuration > 2000) { // Only track meaningful dwells
                emitIntentPulse('PAGE_EXIT', dwellDuration);
            }
        };
    }, []);

    const emitIntentPulse = async (type: string, duration: number) => {
        const assetId = result?.data?.uid || 'anonymous_intent';

        // Emitting for local listeners (theatre)
        window.dispatchEvent(new CustomEvent('INTENT_PULSE', {
            detail: { assetId, dwellDuration: duration, exitType: type, timestamp: Date.now() }
        }));

        // PERSISTING to the Sovereign Substrate
        try {
            await fetch('/api/intent/pulse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assetId,
                    dwellDuration: duration,
                    exitType: type,
                    vibe: 0.8 // Injected resonance
                })
            });
        } catch (e) {
            console.error('[Intent] Failed to transmit shadow pulse:', e);
        }
    };

    const verifyTag = async (enc: string, cmac: string) => {
        setStatus('SCANNING');

        // DIRECT RPC LINK (WolfPack Request)
        window.dispatchEvent(new CustomEvent('SHIELD_PROBE', {
            detail: { enc, cmac, timestamp: Date.now(), source: 'VerifyPage' }
        }));

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

            {/* LIQUID GLASS IRIDESCENCE */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-10 pointer-events-none mix-blend-overlay" />

            {/* SCANNER UI */}
            <div className="relative z-10 w-full max-w-md text-center">

                {/* ANIMATED SCANNER RING (Liquid Glass Style) */}
                <div className="relative w-72 h-72 mx-auto mb-12 flex items-center justify-center">
                    {/* Shimmer Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 opacity-40 rounded-full blur-2xl animate-pulse" />

                    {/* Outer Ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className={`absolute inset-0 border border-white/10 rounded-full`}
                    />

                    {/* Spinning Indicator */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className={`absolute inset-4 border-2 border-dashed ${getStatusColor(status)} opacity-40 rounded-full`}
                    />

                    {/* Inner Pulse (Core Heartbeat) */}
                    <motion.div
                        animate={{
                            scale: status === 'SCANNING' ? [1, 1.1, 1] : status === 'AUTHENTIC' ? [1, 1.05, 1] : 1,
                            opacity: [0.6, 1, 0.6]
                        }}
                        transition={{ duration: status === 'SCANNING' ? 1 : 3, repeat: Infinity }}
                        className={`w-48 h-48 rounded-full border border-white/20 backdrop-blur-3xl bg-black/40 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden`}
                    >
                        {/* Shimmer inside ring */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

                        <div className="z-10 flex flex-col items-center">
                            {getStatusIcon(status)}
                            {status === 'SCANNING' && (
                                <div className="text-[8px] font-mono mt-2 text-blue-400 tracking-[0.3em] font-black uppercase">
                                    Analyzing...
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* TEXT READOUT */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                >
                    <h1 className="text-4xl font-black font-mono tracking-[0.2em] mb-2 uppercase">
                        {status === 'IDLE' && 'Ready_Scan'}
                        {status === 'SCANNING' && 'Shield_Probe'}
                        {status === 'AUTHENTIC' && 'Authentic_Asset'}
                        {status === 'INVALID' && 'Breach_Detected'}
                    </h1>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                    <p className="text-gray-400 font-mono text-xs uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                        {status === 'IDLE' && 'Synchronize your physical device with the DreamNet sovereign fabric.'}
                        {status === 'SCANNING' && 'Verifying AES-128 CMAC integrity at the hardware boundary...'}
                        {status === 'AUTHENTIC' && `Verified_UID: ${result?.data?.uid.slice(0, 8)}... | Pulse_Rank: PRIME`}
                        {status === 'INVALID' && 'Cryptographic signature mismatch. Hardware is non-sovereign.'}
                    </p>
                </motion.div>

                {/* CHAIRMAN COUNCIL VERDICT (Liquid Glass Panel) */}
                {status === 'AUTHENTIC' && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mt-10 p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-3xl text-left relative overflow-hidden group hover:border-purple-500/30 transition-colors duration-500"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-50" />

                        <div className="relative z-10 font-mono">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] text-purple-400 font-black tracking-widest uppercase">
                                    Chairman_Council_Verdict
                                </span>
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                            </div>

                            <h2 className="text-2xl font-black mb-4 tracking-tight uppercase">
                                {result?.data?.linkedAsset?.name || 'Sovereign_Entity'}
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                                    <div className="text-[8px] text-gray-500 uppercase mb-2">Council_Notes:</div>
                                    <ul className="text-[10px] space-y-2">
                                        <li className="text-cyan-400">⚡ BORIS: Performance Reward 95% Yield.</li>
                                        <li className="text-green-400">🐺 WOLFPACK: Social resonance verified.</li>
                                        <li className="text-purple-400">🏦 ANTIGRAVITY: Substrate bound to TBA.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-[10px] tracking-widest uppercase text-gray-500">
                                <div className="flex flex-col gap-1">
                                    <span className="opacity-50">Sovereign_Node</span>
                                    <span className="text-white font-bold">OPTIO-20-BOUND</span>
                                </div>
                                <div className="flex flex-col gap-1 text-right">
                                    <span className="opacity-50">RLVR_Status</span>
                                    <span className="text-purple-400 font-black">REWARDED_SYNC</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'AUTHENTIC': return 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.5)]';
        case 'INVALID': return 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]';
        case 'SCANNING': return 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)]';
        default: return 'border-white/20';
    }
}

function getStatusIcon(status: string) {
    if (status === 'AUTHENTIC') return <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">🛡️</motion.span>;
    if (status === 'INVALID') return <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl filter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">⚠️</motion.span>;
    if (status === 'SCANNING') return <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} className="text-6xl filter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">👁️</motion.span>;
    return <span className="text-6xl opacity-20">📡</span>;
}
