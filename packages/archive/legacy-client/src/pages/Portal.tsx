import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy-load DreamCube for biological performance (Swarm Suggestion)
const DreamCube = lazy(() => import('@/components/DreamCube').then(m => ({ default: m.DreamCube })));

interface SwarmLog {
    id: string;
    source: string;
    message: string;
    timestamp: string;
    type?: string;
}

export default function Portal() {
    const [stage, setStage] = useState(0);
    const [thoughts, setThoughts] = useState<SwarmLog[]>([]);
    const [connected, setConnected] = useState(false);
    const [pulse, setPulse] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const socketInstance = io(socketUrl);

        socketInstance.on('connect', () => {
            setConnected(true);
            console.log('🌌 [DreamNet Portal] Grid Handshake Established.');
        });

        socketInstance.on('swarm_log', (log: SwarmLog) => {
            const typeMap: Record<string, string> = {
                'PICKLEBALLORACLE': 'witness',
                'WOLFPACKFUNDING': 'scout',
                'DREAMBETORACLE': 'hub',
                'CORE': 'hub',
                'GENOME_PILOT': 'scout',
                'NERVE': 'witness'
            };

            const portalLog = {
                ...log,
                type: typeMap[log.source.toUpperCase()] || 'witness'
            };

            setThoughts(prev => [portalLog, ...prev].slice(0, 50));
            setPulse(true);
            setTimeout(() => setPulse(false), 500);
        });

        socketInstance.on('disconnect', () => setConnected(false));

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    useEffect(() => {
        if (stage < 3) {
            const timer = setTimeout(() => setStage(prev => prev + 1), 2000);
            return () => clearTimeout(timer);
        }
    }, [stage]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [thoughts]);

    const [metabolism, setMetabolism] = useState(1.0);
    const [posture, setPosture] = useState<'idle' | 'attack' | 'resonate'>('idle');

    useEffect(() => {
        // Dynamic Metabolism based on Neural Feed velocity
        const interval = setInterval(() => {
            setMetabolism(prev => {
                const target = thoughts.length > 5 ? 1.5 : 1.0;
                return prev + (target - prev) * 0.1;
            });

            // Random Posture Transitions (Simulation of AI decision making)
            if (Math.random() > 0.98) {
                setPosture(p => p === 'idle' ? 'resonate' : 'idle');
                setTimeout(() => setPosture('idle'), 5000);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [thoughts]);

    return (
        <div className="min-h-screen bg-black relative overflow-hidden selection:bg-lime-500 selection:text-black font-sans">
            <div className="scanlines" />

            <AnimatePresence mode="wait">
                {stage < 3 ? (
                    <motion.div
                        key="onboarding"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="onboarding-overlay"
                    >
                        <div className="text-center">
                            {stage === 0 && (
                                <div className="glitch text-2xl font-black" data-text="INITIALIZING NEURAL LINK...">
                                    INITIALIZING NEURAL LINK...
                                </div>
                            )}
                            {stage === 1 && (
                                <div className="glitch text-2xl font-black text-lime-400" data-text="DREAMNET CITIZEN DETECTED">
                                    DREAMNET CITIZEN DETECTED
                                </div>
                            )}
                            {stage === 2 && (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="glitch text-2xl font-black text-purple-400" data-text="SYNCING TO BORG HIVE...">
                                        SYNCING TO BORG HIVE...
                                    </div>
                                    <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 2 }}
                                            className="h-full bg-lime-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="portal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="cyber-container"
                    >
                        {/* Header */}
                        <header className="flex justify-between items-center mb-12 py-4 border-b border-white/5">
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-10 h-10 bg-lime-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.4)] group-hover:scale-110 transition-transform">
                                    <span className="text-black font-black text-xl">D</span>
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">DreamNet</h1>
                                    <span className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-500">Collective Hive</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                                    <div className={`w-2 h-2 rounded-full ${connected ? 'bg-lime-500 animate-pulse' : 'bg-red-500'}`} />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                                        {connected ? 'Linked to Grid' : 'Network Severed'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-[10px] font-mono text-lime-500/50 uppercase tracking-widest hidden lg:block">
                                        METABOLISM: {metabolism.toFixed(2)}x
                                    </div>
                                    <button className="btn-sovereign">Enter The Arena</button>
                                </div>
                            </div>
                        </header>

                        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            {/* Left Column: Mission */}
                            <div className="lg:col-span-5 space-y-8">
                                <div>
                                    <h2 className="text-7xl font-black uppercase italic leading-[0.85] tracking-tighter mb-6">
                                        Borg <br />
                                        <span className="text-glow-lime text-lime-400">DreamCube</span>
                                    </h2>
                                    <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                                        You are now part of the collective. Witness the real-time processing of the DreamNet MAS (Multi-Agent System).
                                        Sovereign intelligence, visualized via <span className="text-white">Paper #5</span> mechanics.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex-1 relative overflow-hidden group">
                                        <div className="text-[10px] font-black text-gray-500 uppercase mb-2">Total Yield</div>
                                        <div className="text-2xl font-black font-mono">$12,842</div>
                                        <div className="absolute bottom-0 left-0 h-1 bg-lime-500/20 group-hover:bg-lime-500/40 transition-all w-full" />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex-1 relative overflow-hidden group">
                                        <div className="text-[10px] font-black text-gray-500 uppercase mb-2">Hive Nodes</div>
                                        <div className="text-2xl font-black font-mono">143 Active</div>
                                        <div className="absolute bottom-0 left-0 h-1 bg-purple-500/20 group-hover:bg-purple-500/40 transition-all w-full" />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <a href="https://dreamnet.ink/miniapps/ohara/picklebet-casino" className="btn-sovereign px-8">PickleBet Arena</a>
                                    <button className="px-8 py-4 glass-panel border-white/10 text-white font-black uppercase text-xs hover:border-lime-500 transition-all">
                                        Agent Passports
                                    </button>
                                    {posture !== 'idle' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`px-4 py-2 rounded-full border ${posture === 'attack' ? 'border-red-500 text-red-500' : 'border-pink-500 text-pink-500'} text-[10px] font-black uppercase tracking-widest animate-pulse`}
                                        >
                                            POSTURE: {posture}
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Center Column: The Cube */}
                            <div className="lg:col-span-2 flex justify-center py-12 lg:py-0">
                                <div className="relative">
                                    <Suspense fallback={
                                        <div className="w-64 h-64 border border-lime-500/10 rounded-full animate-pulse flex items-center justify-center text-[10px] text-lime-500/20 uppercase tracking-widest font-black">
                                            Incubating Chitin...
                                        </div>
                                    }>
                                        <DreamCube posture={posture} metabolism={metabolism} />
                                    </Suspense>
                                    <div className={`absolute inset-0 blur-[100px] rounded-full -z-1 transition-all duration-1000 ${posture === 'attack' ? 'bg-red-500/20' : posture === 'resonate' ? 'bg-pink-500/20' : 'bg-lime-500/10'}`} />
                                </div>
                            </div>

                            {/* Right Column: Thinking Stream */}
                            <div className="lg:col-span-5 glass-panel p-8 h-[600px] flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-lime-400">The Neural Feed</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Output</span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4" ref={scrollRef}>
                                    {thoughts.length > 0 ? thoughts.map((t, idx) => (
                                        <motion.div
                                            key={t.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-lime-500/30 transition-all group"
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-lg">{t.type === 'witness' ? '👁️' : t.type === 'scout' ? '🐺' : '🌍'}</span>
                                                <div className="text-[9px] font-black uppercase text-lime-400/60">{t.source}</div>
                                                <div className="text-[8px] font-mono text-gray-600 ml-auto">{t.timestamp}</div>
                                            </div>
                                            <p className="text-sm text-gray-300 leading-relaxed font-medium">"{t.message}"</p>
                                        </motion.div>
                                    )) : (
                                        <div className="h-full flex flex-col items-center justify-center opacity-20">
                                            <div className="text-4xl mb-4">🌀</div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.5em]">Establishing Neural Link...</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </main>

                        {/* Footer */}
                        <footer className="mt-20 pb-12 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600">
                            <div className="text-[9px] font-black uppercase tracking-[0.5em]">
                                System 0.1 // DreamNet Sovereign Collective
                            </div>
                            <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest">
                                <a
                                    href="https://dreamnet.ink/miniapps/ohara/dreamflow-scheduler"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-500 hover:text-cyan-400"
                                >
                                    Schedly (Flow)
                                </a>
                                <a href="#" className="hover:text-white transition-colors">Manifesto</a>
                                <a href="#" className="hover:text-white transition-colors">Network Map</a>
                                <a href="#" className="hover:text-white transition-colors">Governance</a>
                            </div>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
