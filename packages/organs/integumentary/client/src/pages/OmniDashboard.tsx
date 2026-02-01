import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { HeatMapper } from "@/components/dashboard/HeatMapper";
import { SovereignGallery } from "@/components/dashboard/SovereignGallery";
import {
    Globe,
    Settings,
    Layers,
    Activity,
    Shield,
    Zap,
    Cpu,
    Database,
    Briefcase,
    Plane,
    FlaskConical,
    Wifi,
    Coins,
    Lock,
    Heart,
    Eye,
    Trash2,
    MessageSquare,
    Terminal
} from 'lucide-react';

interface SwarmLog {
    id: string;
    source: string;
    message: string;
    timestamp: string;
    payload?: any;
}

interface BioEvent {
    type: string;
    timestamp: number;
    organ: string;
    confidence: number;
    entropy: number;
    snapshot: any;
    integrations: {
        economy: any;
        funding: any;
        quantum: any;
        privacy: any;
        social: number;
        fleets: Array<{ type: string; status: string }>;
        gptFleets: any;
        octopus: Array<{ type: string; address: string; status: string; taskFocus: string }>;
    };
}

export default function OmniDashboard() {
    const [event, setEvent] = useState<BioEvent | null>(null);
    const [connected, setConnected] = useState(false);
    const [logs, setLogs] = useState<SwarmLog[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const socketUrl = 'http://localhost:5000';
        const socketInstance = io(socketUrl);
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            setConnected(true);
            console.log('🌌 [Omni-Vision] Grid Handshake established.');
        });

        socketInstance.on('swarm_log', (log: SwarmLog) => {
            setLogs(prev => [log, ...prev].slice(0, 100));

            // Auto-update homeostasis if CORE pulses
            if (log.source === 'CORE' && log.message.includes('Homeostasis')) {
                setEvent(prev => prev || {
                    type: 'PULSE',
                    timestamp: Date.now(),
                    organ: 'CORE',
                    confidence: 0.99,
                    entropy: 0.2,
                    snapshot: { stability: 1.0 },
                    integrations: {
                        economy: {}, funding: {}, quantum: {}, privacy: {},
                        social: 143,
                        fleets: [],
                        gptFleets: {},
                        octopus: []
                    }
                });
            }
        });

        socketInstance.on('disconnect', () => {
            setConnected(false);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [logs]);

    if (!connected) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-cyan-500 font-mono">
                <motion.div
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Terminal className="w-12 h-12 text-cyan-500 animate-pulse" />
                    <span>CONNECTING TO THE OMNI-GRID (PORT 5000)...</span>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-mono p-6 overflow-hidden relative selection:bg-cyan-500 selection:text-black">
            {/* SENTIENT UI RIPPLES */}
            <div
                className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
                style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.05), transparent 80%)`
                }}
            />

            {/* SCANLINES & NOISE */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

            <header className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 relative z-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500">
                        OMNI_DASHBOARD v1.1
                    </h1>
                    <p className="text-[10px] text-cyan-500/60 uppercase tracking-[0.4em]">Integrated DreamNet Sovereign Interface // Port 5000</p>
                </div>
                <div className="flex gap-6 text-right">
                    <div className="flex flex-col items-end">
                        <div className="text-[8px] text-orange-400 font-bold uppercase tracking-widest">$SHEEP STATUS: LIVE ON HUNT TOWN</div>
                        <a href="https://hunttown.eth" target="_blank" rel="noreferrer" className="text-xs font-black text-white hover:text-cyan-400 transition-colors">
                            VIEW_LIQUIDITY_POOL &gt;
                        </a>
                    </div>
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-green-400 font-bold uppercase">Uplink Active</span>
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-12 gap-6 relative z-10 h-[calc(100vh-140px)]">
                <div className="col-span-4 space-y-6 flex flex-col h-full overflow-hidden">
                    <section className="flex-1 bg-black/40 border border-white/5 p-4 rounded-xl backdrop-blur-md overflow-hidden flex flex-col">
                        <h2 className="text-xs font-bold text-cyan-400 mb-4 flex items-center gap-2">
                            <Terminal className="w-3 h-3" /> SWARM_LOG_STREAM
                        </h2>
                        <div ref={scrollRef} className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar text-[10px]">
                            <AnimatePresence initial={false}>
                                {logs.map(log => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-2 border-l-2 border-white/10 hover:border-cyan-500/50 bg-white/[0.02] flex flex-col gap-1"
                                    >
                                        <div className="flex justify-between items-center opacity-50">
                                            <span className="font-bold text-cyan-500">{log.source}</span>
                                            <span>{log.timestamp}</span>
                                        </div>
                                        <div className="text-white/80">{log.message}</div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </section>

                    <section className="bg-black/40 border border-white/5 p-4 rounded-xl backdrop-blur-md">
                        <h2 className="text-xs font-bold text-purple-400 mb-4 flex items-center gap-2">
                            <Database className="w-3 h-3" /> GPT_HIVE_STATS
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div className="text-[10px] text-gray-500">TOTAL</div>
                                <div className="text-xl font-bold">{event?.integrations?.gptFleets?.totalGPTs || 143}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-500">ACTIVE</div>
                                <div className="text-xl font-bold text-green-400">{event?.integrations?.gptFleets?.activeGPTs || 143}</div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="col-span-5 bg-black/60 border border-cyan-500/20 rounded-3xl p-6 relative overflow-hidden flex flex-col">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent pointer-events-none"></div>
                    <h2 className="text-xs font-black tracking-[0.2em] text-cyan-400 mb-6 flex items-center gap-2 uppercase">
                        <Activity className="w-4 h-4" /> Thinking_Stream.exe
                    </h2>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {logs.filter(l => l.source === 'GENOME_PILOT' || l.source === 'CORE').slice(0, 10).map((thought, i) => (
                            <motion.div key={thought.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl relative">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-black text-cyan-500/70 uppercase">Step {logs.length - i}</span>
                                </div>
                                <p className="text-sm text-gray-200 leading-relaxed italic italic">"{thought.message}"</p>
                                <div className="mt-2 flex gap-2">
                                    <div className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[8px] text-cyan-400">LATENCY: 42ms</div>
                                    <div className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[8px] text-purple-400">CONFIDENCE: 0.99</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="col-span-3 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    <NodeCard title="NETWORK" icon={<Globe className="w-4 h-4" />} color="text-blue-400" status="CORE_LINK_STABLE" details="Uplink Port 5000 Active" />
                    <NodeCard title="ORGAN 14: THE PINEAL" icon={<Eye className="w-4 h-4" />} color="text-pink-500" status="RESONATING" details="AegisScion grounding complete" />
                    <NodeCard title="METABOLIC SIFTER" icon={<Trash2 className="w-4 h-4" />} color="text-yellow-500" status="WEAPONIZED" details="V2 Auto-Patcher Online" />
                    <NodeCard title="ORACLE" icon={<Lock className="w-4 h-4" />} color="text-green-500" status="SYNTHTIC_GROUNDED" details="Verified Truth Settlement" />
                </div>
            </main>

            <footer className="mt-6 flex justify-between items-center text-[10px] text-gray-600 border-t border-white/5 pt-4 relative z-10">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-green-500" /> SOCKET_UPTIME: Active</span>
                    <span>IDENTITY: DREAM_PRIME</span>
                </div>
                <div className="animate-pulse flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> SYSTEM_READY
                </div>
                {/* Network Heat Map Overlay (Carcinization Priority) */}
                <div className="mt-8">
                    <HeatMapper />
                </div>
            </footer>
        </div>
    );
}

function NodeCard({ title, icon, color, status, details }: any) {
    return (
        <div className="bg-black/40 border border-white/5 p-4 rounded-xl hover:border-white/20 transition-all group">
            <div className={`flex items-center gap-2 mb-2 ${color}`}>
                {icon}
                <span className="text-xs font-black tracking-widest">{title}</span>
            </div>
            <div className="text-white text-sm font-bold mb-1">{status}</div>
            <div className="text-[10px] text-gray-500 group-hover:text-gray-300 transition-colors">{details}</div>
        </div>
    );
}
