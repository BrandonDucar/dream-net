
import React, { useEffect, useState } from 'react';

interface Homeostasis {
    health: number;
    stability: number;
    mode: 'GROWTH' | 'DEFENSE' | 'RECOVERY';
}

interface BioEvent {
    type: string;
    timestamp: number;
    organ: string;
    signal: any;
    confidence: number;
    entropy: number;
    snapshot?: Homeostasis;
    integrations?: {
        economy: any;
        funding: any;
        quantum: any;
        privacy: any;
        social: number;
    };
    agents?: any; // Legacy support
}

export default function GodView() {
    const [event, setEvent] = useState<BioEvent | null>(null);
    const [history, setHistory] = useState<BioEvent[]>([]);
    const [connected, setConnected] = useState(false);
    const [snapshot, setSnapshot] = useState<Homeostasis | null>(null);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
        const eventSource = new EventSource(`${apiUrl}/api/god-view/stream`);

        eventSource.onopen = () => {
            console.log('Connected to The Grid.');
            setConnected(true);
        };

        eventSource.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                // Accept PULSE (Helix) or legacy
                if (data.type === 'PULSE') {
                    setEvent(data);
                    if (data.snapshot) setSnapshot(data.snapshot);
                    setHistory(prev => [data, ...prev].slice(0, 10));
                }
            } catch (err) {
                console.error('Signal Distortion:', err);
            }
        };

        eventSource.onerror = (err) => {
            console.error('Connection Lost:', err);
            setConnected(false);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    if (!connected) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-cyan-500 font-mono">
                <div className="animate-pulse">CONNECTING TO THE TRIPLE HELIX...</div>
            </div>
        );
    }

    // DREAMCUBE COLOR THEMES
    const getTheme = (mode: string = 'GROWTH') => {
        switch (mode) {
            case 'DEFENSE': return {
                bg: 'bg-red-900/10',
                border: 'border-red-500',
                text: 'text-red-400',
                glow: 'shadow-red-500/50',
                gradient: 'from-orange-600 to-red-900'
            };
            case 'RECOVERY': return {
                bg: 'bg-yellow-900/10',
                border: 'border-yellow-500',
                text: 'text-yellow-400',
                glow: 'shadow-yellow-500/50',
                gradient: 'from-yellow-400 to-orange-600'
            };
            default: return { // GROWTH / SYNC
                bg: 'bg-cyan-900/10',
                border: 'border-cyan-500',
                text: 'text-cyan-400',
                glow: 'shadow-cyan-500/50',
                gradient: 'from-cyan-400 to-blue-600'
            };
        }
    };

    const theme = getTheme(snapshot?.mode);

    return (
        <div className="min-h-screen bg-black text-white font-mono p-8 selection:bg-cyan-500 selection:text-black overflow-hidden relative">
            {/* BACKGROUND GRID (The Magnetic Field) */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5 transition-all duration-1000`}></div>

            <header className="mb-12 relative z-10 flex justify-between items-center border-b border-white/10 pb-6 glass-panel p-6 rounded-2xl">
                <div>
                    <h1 className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--titan-cyan)] to-[var(--titan-teal)] tracking-tighter`}>
                        THE_CUBE
                    </h1>
                    <p className="text-xs text-gray-400 mt-2 tracking-[0.3em]">TRIPLE HELIX INTERFACE // {snapshot?.mode || 'CONNECTING'}</p>
                </div>

                <div className="flex items-center space-x-6">
                    <a
                        href="/agent-dashboard"
                        className="group flex flex-col items-end hover:scale-105 transition-transform"
                    >
                        <div className="text-[10px] text-cyan-500 mb-1 font-black tracking-[0.2em] group-hover:text-white transition-colors">COMMAND_ORBIT_ENABLED</div>
                        <div className={`text-xs font-bold border border-cyan-500/30 px-3 py-1 rounded-full bg-cyan-500/5 hover:bg-cyan-500/20 transition-all`}>
                            ENTER_STELLAR_IDE
                        </div>
                    </a>
                    <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">MAGNETIC_LOCK</div>
                        <div className={`text-2xl font-bold ${theme.text}`}>
                            {(snapshot?.stability || 0).toFixed(2)} σ
                        </div>
                    </div>
                    <div className={`w-4 h-4 rounded-sm rotate-45 ${theme.bg} ${theme.border} border-2 animate-spin-slow`}></div>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
                {/* LEFT FACE: ORGANIC HEALTH */}
                <div className={`lg:col-span-4 p-8 rounded-3xl border border-white/5 backdrop-blur-xl bg-black/40 hover:border-white/20 transition-all duration-500 group relative overflow-hidden`}>
                    <div className={`absolute top-0 right-0 p-4 opacity-50 text-9xl font-black text-white/5 group-hover:scale-110 transition-transform duration-700`}>01</div>
                    <h2 className="text-sm text-gray-400 mb-6 tracking-widest">ORGANIC_HEALTH</h2>

                    <div className="relative h-64 flex items-center justify-center">
                        <svg className="w-48 h-48 transform -rotate-90">
                            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-900" />
                            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                                className={`${theme.text} transition-all duration-1000 ease-out`}
                                strokeDasharray={552}
                                strokeDashoffset={552 - (552 * (snapshot?.health || 0)) / 100}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-6xl font-bold text-white">{snapshot?.health.toFixed(0)}%</span>
                            <span className="text-xs text-gray-500 mt-2">STRUCTURE</span>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-[10px] text-gray-500 mb-1">ECONOMY</div>
                            <div className={`text-lg font-bold ${theme.text}`}>
                                {event?.integrations?.economy?.balanceCount || 0} ADDR
                            </div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-[10px] text-gray-500 mb-1">SOCIAL</div>
                            <div className={`text-lg font-bold ${theme.text}`}>
                                {event?.integrations?.social || 0} PLAT
                            </div>
                        </div>
                    </div>
                </div>

                {/* CENTER FACE: THE CONDUCTOR (The Core) */}
                <div className={`lg:col-span-4 p-8 rounded-3xl border ${theme.border} bg-black/60 shadow-2xl ${theme.glow} flex flex-col items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent animate-pulse-slow"></div>

                    <div className="mb-4 text-xs text-gray-400 tracking-[0.5em] uppercase">Core Logic</div>
                    <div className={`text-5xl font-black text-white glow-text text-center z-10 tracking-tight leading-tight`}>
                        {event?.agents?.conductor?.decision || snapshot?.mode || 'SYNC'}
                    </div>

                    <div className="mt-8 w-full">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                            <span>ENTROPY</span>
                            <span>{(event?.entropy || 0).toFixed(2)}</span>
                        </div>
                        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-white transition-all duration-300" style={{ width: `${(event?.entropy || 0) * 100}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* RIGHT FACE: NEURAL STABILITY */}
                <div className={`lg:col-span-4 p-8 rounded-3xl border border-white/5 backdrop-blur-xl bg-black/40 hover:border-white/20 transition-all duration-500 group relative overflow-hidden`}>
                    <div className={`absolute top-0 right-0 p-4 opacity-50 text-9xl font-black text-white/5 group-hover:scale-110 transition-transform duration-700`}>03</div>
                    <h2 className="text-sm text-gray-400 mb-6 tracking-widest">NEURAL_STABILITY</h2>

                    <div className="flex flex-col space-y-4">
                        {/* Visualization of internal agent confidence (mocked breakdown for visual flair if not present) */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span>RACE_ENGINEER</span>
                                <span className={theme.text}>{(event?.agents?.race_engineer?.confidence || 0).toFixed(2)}</span>
                            </div>
                            <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                                <div className={`h-full ${theme.bg.replace('/10', '')} transition-all duration-500`} style={{ width: `${(event?.agents?.race_engineer?.confidence || 0) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span>RELIABILITY_GUARD</span>
                                <span className={theme.text}>{(event?.agents?.reliability_guard?.confidence || 0).toFixed(2)}</span>
                            </div>
                            <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                                <div className={`h-full ${theme.bg.replace('/10', '')} transition-all duration-500`} style={{ width: `${(event?.agents?.reliability_guard?.confidence || 0) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">WOLF_PACK_STATUS</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded border ${event?.integrations?.funding?.leadCount > 0 ? 'text-green-400 border-green-400/50 bg-green-400/5' : 'text-gray-400 border-gray-400/50 bg-gray-400/5'}`}>
                                    {event?.integrations?.funding?.leadCount > 0 ? 'HUNTING' : 'IDLE'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">QUANTUM_HORIZON</span>
                                <span className="text-[10px] text-white">
                                    {event?.integrations?.quantum?.lastPredictionsCount || 0} PREDICTIONS
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM: THE STREAM (The Tape) */}
                <div className="lg:col-span-12 p-6 rounded-2xl border border-white/5 bg-black/80 font-mono text-xs overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-50"></div>
                    <h3 className="text-gray-500 mb-4 pl-4">HELIX_STREAM__LOG</h3>
                    <div className="flex space-x-4 overflow-x-auto pb-2 pl-4 mask-fade-right">
                        {history.map((e, i) => (
                            <div key={i} className="min-w-[200px] p-3 rounded border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-default">
                                <div className="text-gray-500 mb-1">{new Date(e.timestamp).toLocaleTimeString()}</div>
                                <div className="font-bold text-white mb-1">{e.snapshot?.mode || e.type}</div>
                                <div className="text-[10px] text-gray-400">ORG: {e.organ}</div>
                                <div className="text-[10px] text-gray-400">SIG: {JSON.stringify(e.signal).substring(0, 20)}...</div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <style>{`
                .animate-spin-slow { animation: spin 8s linear infinite; }
                .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                .mask-fade-right { -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%); }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
