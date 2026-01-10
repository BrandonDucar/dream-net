import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    Trash2
} from 'lucide-react';

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

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
        const eventSource = new EventSource(`${apiUrl}/api/god-view/stream`);

        eventSource.onopen = () => setConnected(true);
        eventSource.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                if (data.type === 'PULSE') setEvent(data);
            } catch (err) {
                console.error('Signal Distortion:', err);
            }
        };
        eventSource.onerror = () => setConnected(false);

        return () => eventSource.close();
    }, []);

    if (!connected) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-cyan-500 font-mono">
                <motion.div
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    CONNECTING TO THE OMNI-GRID...
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-mono p-6 overflow-hidden relative selection:bg-cyan-500 selection:text-black">
            {/* SCANLINES EFFECT */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]"></div>

            {/* BACKGROUND NOISE */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

            <header className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 relative z-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500">
                        OMNI_DASHBOARD v1.0
                    </h1>
                    <p className="text-[10px] text-cyan-500/60 uppercase tracking-[0.4em]">Integrated DreamNet Sovereign Interface</p>
                </div>
                <div className="flex gap-6 text-right">
                    <div>
                        <div className="text-[10px] text-gray-500 uppercase">Entropy</div>
                        <div className="text-xl font-bold text-white">{(event?.entropy || 0).toFixed(4)}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-500 uppercase">Stability</div>
                        <div className="text-xl font-bold text-cyan-400">{(event?.snapshot?.stability || 0).toFixed(2)} σ</div>
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-12 gap-6 relative z-10 h-[calc(100vh-140px)]">

                {/* LEFT COLUMN: THE FLEETS */}
                <div className="col-span-3 space-y-6 flex flex-col">
                    <section className="flex-1 bg-black/40 border border-white/5 p-4 rounded-xl backdrop-blur-md overflow-hidden flex flex-col">
                        <h2 className="text-xs font-bold text-cyan-400 mb-4 flex items-center gap-2">
                            <Plane className="w-3 h-3" /> FLEET_PROTOCOL
                        </h2>
                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                            {event?.integrations?.fleets.map(fleet => (
                                <motion.div
                                    key={fleet.type}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="p-3 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold">{fleet.type}</span>
                                        <span className="text-xs text-white">{fleet.type.toUpperCase()}_UNIT</span>
                                    </div>
                                    <div className={`text-[10px] px-2 py-0.5 rounded border ${fleet.status === 'active' ? 'text-green-400 border-green-400/30' : 'text-yellow-400 border-yellow-400/30'} animate-pulse`}>
                                        {fleet.status.toUpperCase()}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-black/40 border border-white/5 p-4 rounded-xl backdrop-blur-md">
                        <h2 className="text-xs font-bold text-purple-400 mb-4 flex items-center gap-2">
                            <Database className="w-3 h-3" /> GPT_HIVE_STATS
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div className="text-[10px] text-gray-500">TOTAL</div>
                                <div className="text-xl font-bold">{event?.integrations?.gptFleets?.totalGPTs || 0}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-500">ACTIVE</div>
                                <div className="text-xl font-bold text-green-400">{event?.integrations?.gptFleets?.activeGPTs || 0}</div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* CENTER: THE OCTOPUS (ORGANISM CORE) */}
                <div className="col-span-6 bg-black/60 border border-cyan-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent"></div>

                    {/* OCTOPUS CENTRAL HUB */}
                    <div className="relative mb-12">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                            className="w-48 h-48 rounded-full border-2 border-dashed border-cyan-500/20 absolute -inset-6"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="w-36 h-36 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 flex items-center justify-center relative z-10"
                        >
                            <div className="text-center">
                                <Activity className="w-8 h-8 text-white mx-auto mb-2 animate-pulse" />
                                <div className="text-[10px] text-cyan-400 font-black tracking-widest uppercase">Octopus Brain</div>
                                <div className="text-xs text-white/60">HEARTBEAT</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* OCTOPUS ARMS DISPLAY */}
                    <div className="grid grid-cols-4 gap-4 w-full h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {event?.integrations?.octopus.map((arm, i) => (
                            <motion.div
                                key={arm.type}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-all group"
                            >
                                <div className="text-[8px] text-gray-500 mb-1 uppercase font-bold truncate">{arm.type.replace('_', ' ')}</div>
                                <div className="text-[10px] text-white font-bold mb-2 truncate">{arm.address.slice(0, 6)}...{arm.address.slice(-4)}</div>
                                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        className={`h-full ${arm.status === 'active' ? 'bg-cyan-500' : 'bg-red-500'}`}
                                    />
                                </div>
                                <div className="text-[8px] text-gray-400 leading-tight opacity-0 group-hover:opacity-100 transition-opacity">
                                    {arm.taskFocus}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 flex gap-8">
                        <div className="text-center">
                            <span className="text-[10px] text-gray-500 block">SOCIAL_MASS</span>
                            <span className="text-2xl font-black text-white">{event?.integrations?.social || 0}</span>
                        </div>
                        <div className="text-center">
                            <span className="text-[10px] text-gray-500 block">PROVENANCE_TRAILS</span>
                            <span className="text-2xl font-black text-white">{event?.integrations?.privacy?.historyCount || 0}</span>
                        </div>
                        <div className="text-center">
                            <span className="text-[10px] text-gray-500 block">CU_PREDICTIONS</span>
                            <span className="text-2xl font-black text-white">{event?.integrations?.quantum?.lastPredictionsCount || 0}</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: THE QUAD-NODES SUMMARY */}
                <div className="col-span-3 space-y-6">
                    <NodeCard
                        title="NETWORK"
                        icon={<Globe className="w-4 h-4" />}
                        color="text-blue-400"
                        status="MESH_CONNECTED"
                        details="Farcaster + Twitter + StarBridge"
                    />
                    <NodeCard
                        title="ORGAN 14: THE PINEAL"
                        icon={<Eye className="w-4 h-4" />}
                        color="text-pink-500"
                        status="RESONATING"
                        details="Third Eye Active | 963Hz | Chakra Sync"
                    />
                    <NodeCard
                        title="ORGAN 15: THE METABOLIC"
                        icon={<Trash2 className="w-4 h-4" />}
                        color="text-yellow-500"
                        status="SHIFTING WASTE"
                        details="Intestinal Sifter | Extracting Gold from Tech Debt"
                    />
                    <NodeCard
                        title="SYSTEM"
                        icon={<Settings className="w-4 h-4" />}
                        color="text-purple-400"
                        status="STABLE_HELIX"
                        details="Nerve Bus + Immune + OS Core"
                    />
                    <NodeCard
                        title="PLATFORM"
                        icon={<Briefcase className="w-4 h-4" />}
                        color="text-yellow-400"
                        status="ECONOMY_ACTIVE"
                        details="Factory + Forge + EcoEngine"
                    />
                    <NodeCard
                        title="ORGANISM"
                        icon={<Heart className="w-4 h-4" />}
                        color="text-red-400"
                        status="EVOLVING"
                        details="Octopus + Vibe + Stigmergy"
                    />
                    <div className="mt-6">
                        <HeatMapper />
                    </div>
                    <div className="mt-6">
                        <SovereignGallery />
                    </div>
                </div>
            </main>

            <footer className="mt-6 flex justify-between items-center text-[10px] text-gray-600 border-t border-white/5 pt-4 relative z-10">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><Wifi className="w-3 h-3 text-green-500" /> LIVE_PULSE_SIGNAL</span>
                    <span>UPTIME: 99.998%</span>
                </div>
                <div className="animate-pulse">SYSTEM_KEY: {import.meta.env.VITE_API_KEY?.slice(0, 16)}...</div>
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
