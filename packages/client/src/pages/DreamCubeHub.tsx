import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { DreamCube, Dimension } from '../components/hero/DreamCube.js';
import { SovereignLogo } from '../components/ui/SovereignLogo.js';
import { VerticalSurface } from '../components/layout/VerticalSurface.js';
import { ArrowRight, Shield, Coins, Globe, Plane, Zap, Activity, Radio, Database, Cpu, Search, X, Grid, Box, Layers, MousePointer2 } from 'lucide-react';

// MASTER DIMENSION REGISTRY (119+ Packages)
const DIMENSION_REGISTRY: Dimension[] = [
    { id: 'shield', label: 'SHIELD', description: 'Tactical defensive grid and OSINT shielding.', color: '#00F3FF', agents: ['Aegis', 'Guardian', 'Sentinel'] },
    { id: 'alchemist', label: 'ALCHEMIST', description: 'Hard-asset RWA and gold-pegged liquidity.', color: '#00D1FF', agents: ['Octopus', 'Midas', 'Transmute'] },
    { id: 'predator', label: 'PREDATOR', description: 'Algorithmic hunting and nature-oracle signals.', color: '#00B8FF', agents: ['Hunter', 'Tracker', 'Lurker'] },
    { id: 'voyager', label: 'VOYAGER', description: 'Atmosphere-verified travel and exploration.', color: '#00A3FF', agents: ['Explorer', 'Navigator', 'Scout'] },
    { id: 'forgefix', label: 'FORGEFIX', description: 'Autonomous infrastructure repair and tuning.', color: '#008CFF', agents: ['Mechanic', 'Welder', 'Optimizer'] },
    { id: 'vibes', label: 'VIBES', description: 'Sensory atmosphere and environmental noise.', color: '#0075FF', agents: ['Conductor', 'Resonator', 'Ambient'] },
    { id: ' snail', label: 'SNAIL', description: 'Hardened hashing and proof-of-work security.', color: '#00F3FF', agents: ['Miner', 'Hasher', 'Validator'] },
    { id: 'octopus', label: 'OCTOPUS', description: 'Multi-chain treasury and liquidity management.', color: '#00D1FF', agents: ['Treasurer', 'SwapMaster', 'Bridge'] },
    { id: 'graft', label: 'GRAFT', description: 'Multi-agent fusion and bio-logic synthesis.', color: '#00B8FF', agents: ['Geneticist', 'Hybridizer', 'Chimera'] },
    { id: 'nerve', label: 'NERVE', description: 'Cross-agent state and neural synchronization.', color: '#00A3FF', agents: ['Synapse', 'Relay', 'Transmitter'] },
    // Mocking the rest to reach 119 count for visual density
    ...Array.from({ length: 109 }, (_, i) => ({
        id: `pkg - ${i} `,
        label: `PKG_${Math.random().toString(36).slice(2, 6).toUpperCase()} `,
        description: 'DreamNet System Package // Autonomous Directive Active.',
        color: '#00F3FF',
        agents: ['Agent_Alpha', 'Agent_Beta']
    }))
];

const OmniGrid = ({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (d: Dimension) => void }) => {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() =>
        DIMENSION_REGISTRY.filter(d =>
            d.label.toLowerCase().includes(search.toLowerCase()) ||
            d.id.toLowerCase().includes(search.toLowerCase())
        )
        , [search]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 lg:p-24 overflow-hidden"
                >
                    {/* SYSTEM GRID BACKGROUND */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00F3FF 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                    <motion.div
                        initial={{ scale: 1.1, filter: 'blur(20px)', opacity: 0 }}
                        animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
                        exit={{ scale: 1.1, filter: 'blur(20px)', opacity: 0 }}
                        className="w-full max-w-7xl h-full flex flex-col gap-8 relative z-10"
                    >
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-primary animate-pulse shadow-[0_0_10px_rgba(0,243,255,1)]"></div>
                                    <h2 className="text-4xl lg:text-7xl font-black tracking-tighter text-white uppercase italic">System_Core</h2>
                                </div>
                                <p className="text-gray-600 font-mono text-[10px] tracking-[0.6em] uppercase">Hyper-Grid Access: 119/119 Dimensions Synchronized // Root_Level</p>
                            </div>
                            <button onClick={onClose} className="group p-4 rounded-none border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all">
                                <X size={32} className="text-gray-500 group-hover:text-primary transition-colors" />
                            </button>
                        </div>

                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="IDENTIFY_DIMENSION_ID..."
                                className="w-full bg-white/[0.02] border border-white/5 rounded-none py-8 pl-16 pr-8 font-mono text-sm tracking-[0.4em] uppercase focus:border-primary/50 outline-none transition-all placeholder:text-gray-800 text-primary"
                            />
                            <div className="absolute bottom-0 left-0 h-[1px] bg-primary w-0 group-focus-within:w-full transition-all duration-700"></div>
                        </div>

                        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pr-4 custom-scrollbar">
                            {filtered.map((dim, i) => (
                                <motion.div
                                    key={dim.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (i % 50) * 0.005 }}
                                    onClick={() => onSelect(dim)}
                                    className="p-6 border border-white/5 bg-black/40 hover:border-primary/60 hover:bg-primary/[0.02] transition-all cursor-pointer group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="w-1.5 h-1.5 rounded-none" style={{ backgroundColor: dim.color, boxShadow: `0 0 10px ${dim.color} ` }}></div>
                                        <div className="text-[7px] font-mono text-gray-700 tracking-widest uppercase italic">0X{dim.id.slice(0, 4)}</div>
                                    </div>
                                    <h4 className="font-black text-[10px] tracking-[0.3em] mb-2 group-hover:text-primary transition-colors uppercase leading-tight">{dim.label}</h4>
                                    <div className="h-[1px] w-0 group-hover:w-full bg-primary/40 transition-all duration-500"></div>

                                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                        <div className="text-[6px] font-mono text-gray-600 uppercase tracking-tighter">Status: Active_Link</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const SensoryNode = ({ icon: Icon, label, status, x, y, delay }: any) => (
    <motion.div
        className="absolute z-0 flex items-center gap-3 px-4 py-2 border border-white/5 bg-void-black/20 backdrop-blur-md rounded-full pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
            opacity: [0.2, 0.4, 0.2],
            x: [x, x + 15, x],
            y: [y, y - 15, y],
        }}
        transition={{ duration: 10 + Math.random() * 5, repeat: Infinity, delay }}
        style={{ left: `${x}% `, top: `${y}% ` }}
    >
        <Icon size={12} className="text-primary/40" />
        <span className="text-[8px] font-mono text-white/20 tracking-widest uppercase">{label}</span>
    </motion.div>
);

export default function DreamCubeHub() {
    const [isGridOpen, setIsGridOpen] = useState(false);
    const [foldedDimension, setFoldedDimension] = useState<Dimension | null>(null);
    const [activeDimensions, setActiveDimensions] = useState(DIMENSION_REGISTRY.slice(0, 6));

    const handleSelectDimension = (dim: Dimension) => {
        // Trigger the Full-Surface Fold
        setFoldedDimension(dim);

        // Sync the Cube as well
        const next = [...activeDimensions];
        next[0] = dim;
        setActiveDimensions(next);
        setIsGridOpen(false);
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
            <OmniGrid isOpen={isGridOpen} onClose={() => setIsGridOpen(false)} onSelect={handleSelectDimension} />
            <VerticalSurface dimension={foldedDimension} onClose={() => setFoldedDimension(null)} />

            {/* AMBIENCE */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[150px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-secondary/5 rounded-full blur-[150px] animate-pulse-slow delay-1000"></div>

                {/* SENSORY NODES */}
                <SensoryNode icon={Radio} label="GLOBAL_PULSE" x={5} y={10} delay={0} />
                <SensoryNode icon={Activity} label="OSINT_PING" x={90} y={15} delay={2} />
                <SensoryNode icon={Database} label="CHAIN_PEG" x={80} y={85} delay={4} />
                <SensoryNode icon={Zap} label="TX_THROUGHPUT" x={10} y={80} delay={6} />

                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 contrast-150"></div>
            </div>

            {/* NAV */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="container mx-auto px-12 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <SovereignLogo size={48} />
                    </div>
                    <div className="flex items-center gap-12">
                        <button onClick={() => setIsGridOpen(true)} className="flex items-center gap-3 text-[10px] font-mono tracking-[0.6em] text-white/40 hover:text-primary transition-all group">
                            <Grid size={14} className="group-hover:rotate-180 transition-transform duration-500" /> OMNI_GRID
                        </button>
                        <Link href="/dashboard">
                            <button className="px-10 py-3 rounded-2xl bg-white text-black font-black text-[11px] tracking-[0.3em] uppercase hover:bg-primary hover:text-black transition-all active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                                ENTER_GRID
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative pt-64 pb-32 z-10 flex flex-col items-center">
                <div className="container mx-auto px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-primary/20 bg-primary/5 shadow-[0_0_30px_rgba(0,243,255,0.1)]"
                        >
                            <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                            <span className="text-[10px] text-primary font-mono tracking-[0.8em] uppercase">Kinetic_DreamCube_V1</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-8xl lg:text-[13rem] font-black tracking-tighter leading-[0.8]"
                        >
                            FOLD <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary drop-shadow-[0_0_80px_rgba(0,243,255,0.4)]">
                                REALITY
                            </span>
                        </motion.h1>

                        <div className="max-w-xl space-y-8 pl-12 border-l-2 border-primary/10">
                            <p className="text-2xl text-gray-400 font-light leading-relaxed">
                                DreamNet is the world's first **Agentic Operating System**.
                                Reconfigure global data flows by shifting the DreamCube.
                            </p>
                            <div className="flex gap-8">
                                <Link href="/dashboard">
                                    <button className="mt-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-primary transition-all flex items-center justify-center gap-4 group active:scale-95 text-[10px] tracking-widest uppercase w-full">
                                        Initiate Core Fold <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center justify-center pt-24 lg:pt-0 scale-110 lg:scale-125">
                            <DreamCube activeDimensions={activeDimensions} onSelectDimension={(d) => handleSelectDimension(d)} />
                        </div>
                    </div>
                </div>
            </section>

            {/* DATA TICKER */}
            <div className="relative h-20 bg-black/80 border-y border-white/5 backdrop-blur-xl flex items-center overflow-hidden">
                <motion.div
                    className="whitespace-nowrap flex gap-40"
                    animate={{ x: [0, -2000] }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="flex gap-12 items-center">
                            <span className="text-[11px] font-mono text-primary/40 tracking-[0.5em] uppercase">SYSTEM_PULSE_DETECTION_OXY_{Math.random().toString(16).slice(2, 8)}</span>
                            <span className="text-[10px] font-mono text-white/20">LATENCY: {(Math.random() * 5).toFixed(2)}MS</span>
                            <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_rgba(188,19,254,0.6)]"></div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ACCESS TIERS (THE THREE LEVELS) */}
            <section className="py-64 relative overflow-hidden bg-void-black/20">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

                <div className="container mx-auto px-12 relative z-10">
                    <div className="text-center mb-32 space-y-6">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-7xl lg:text-9xl font-black tracking-tighter"
                        >
                            CHOOSE YOUR <span className="text-primary italic">REALITY</span>
                        </motion.h2>
                        <p className="text-gray-500 font-mono tracking-[0.8em] uppercase text-xs">Access Tiers // Scaling from Individual to Industrial</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
                        {/* FREE TIER: EXPLORER */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="p-12 border border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col justify-between group hover:border-white/20 transition-all relative"
                        >
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-black tracking-tighter uppercase italic">Explorer</h3>
                                    <p className="text-primary/60 font-mono text-[10px] tracking-widest uppercase italic">The Everyday User</p>
                                </div>
                                <div className="text-6xl font-black tracking-tighter">$0 <span className="text-lg text-gray-700 font-mono">/MO</span></div>
                                <div className="h-px w-full bg-white/10 group-hover:bg-primary/40 transition-colors"></div>
                                <ul className="space-y-6 text-sm text-gray-400 font-light tracking-wide">
                                    <li className="flex items-center gap-3"><Zap size={14} className="text-primary" /> Kinetic DreamCube Access</li>
                                    <li className="flex items-center gap-3"><Zap size={14} className="text-primary" /> Basic Dimension Discovery</li>
                                    <li className="flex items-center gap-3"><Zap size={14} className="text-primary" /> Community Logic Exchange</li>
                                    <li className="flex items-center gap-3 opacity-20"><Zap size={14} /> Full Omni-Grid Search</li>
                                </ul>
                            </div>
                            <Link href="/dashboard">
                                <button className="mt-16 w-full py-6 border border-white/10 hover:bg-white text-white hover:text-black font-black text-xs tracking-[0.4em] uppercase transition-all active:scale-95">
                                    Initialize_Free
                                </button>
                            </Link>
                        </motion.div>

                        {/* PRO TIER: ARCHITECT */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="p-12 border border-primary/40 bg-primary/5 backdrop-blur-3xl flex flex-col justify-between relative transform lg:scale-110 z-20 shadow-[0_0_80px_rgba(0,243,255,0.1)]"
                        >
                            <div className="absolute top-0 right-0 px-6 py-2 bg-primary text-black font-black text-[9px] tracking-widest uppercase">Popular_Choice</div>
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-black tracking-tighter uppercase italic">Architect</h3>
                                    <p className="text-primary font-mono text-[10px] tracking-widest uppercase italic">Master the Grid</p>
                                </div>
                                <div className="text-6xl font-black tracking-tighter text-white">$49 <span className="text-lg text-primary/40 font-mono">/MO</span></div>
                                <div className="h-px w-full bg-primary/20"></div>
                                <ul className="space-y-6 text-sm text-white/80 font-normal tracking-wide">
                                    <li className="flex items-center gap-3"><Zap size={14} className="text-primary fill-primary" /> Full Omni-Grid Access</li>
                                    <li className="flex items-center gap-3"><Zap size={14} className="text-primary fill-primary" /> Custom Stella Octangula Folds</li>
                                    <li className="flex items-center gap-3"><Zap size={14} className="text-primary fill-primary" /> Real-time OSINT Telemetry</li>
                                    <li className="flex items-center gap-3"><Zap size={14} className="text-primary fill-primary" /> Priority Agent Handshakes</li>
                                </ul>
                            </div>
                            <Link href="/dashboard">
                                <button className="mt-16 w-full py-6 bg-white text-black font-black text-xs tracking-[0.4em] uppercase transition-all hover:bg-primary active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                                    Elevate_Reality
                                </button>
                            </Link>
                        </motion.div>

                        {/* ENTERPRISE TIER: TITAN */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="p-12 border border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col justify-between group hover:border-secondary/40 transition-all relative"
                        >
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-black tracking-tighter uppercase italic">Titan</h3>
                                    <p className="text-secondary/60 font-mono text-[10px] tracking-widest uppercase italic">Industrial Scaling</p>
                                </div>
                                <div className="text-4xl lg:text-5xl font-black tracking-tighter leading-tight italic uppercase">Custom <br /> <span className="text-lg text-gray-700 font-mono italic non-italic capitalize tracking-normal">Inquiry Required</span></div>
                                <div className="h-px w-full bg-white/10 group-hover:bg-secondary/40 transition-colors"></div>
                                <ul className="space-y-6 text-sm text-gray-400 font-light tracking-wide">
                                    <li className="flex items-center gap-3"><Zap size={14} className="text-secondary" /> Dedicated OS Core Instance</li>
                                    <li className="flex items-center gap-3"><Zap size={14} className="text-secondary" /> Industrial-Scale Agent Teams</li>
                                    <li className="flex items-center gap-3"><Zap size={14} className="text-secondary" /> White-Glove Deployment Support</li>
                                    <li className="flex items-center gap-3"><Zap size={14} className="text-secondary" /> Custom Interop Spine Mapping</li>
                                </ul>
                            </div>
                            <button className="mt-16 py-6 border border-secondary/20 hover:bg-secondary text-secondary hover:text-black font-black text-xs tracking-[0.4em] uppercase transition-all active:scale-95">
                                Establish_Dominance
                            </button>
                        </motion.div>
                    </div>

                    <div className="mt-48 text-center opacity-30">
                        <p className="text-[10px] font-mono tracking-[1em] uppercase">Security Clearance Level : Omega // All Transactions Encrypted Via Helix-v3</p>
                    </div>
                </div>

                {/* BG ORB FOR TITAN */}
                <div className="absolute top-1/2 left-[-10%] w-[40vw] h-[40vw] bg-secondary/5 rounded-full blur-[150px] pointer-events-none"></div>
            </section>

            {/* INTERACTIVE GUIDE (Density Add) */}
            <section className="py-48 container mx-auto px-12 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-64 bg-gradient-to-b from-primary/40 to-transparent"></div>
                <div className="text-center space-y-24">
                    <div className="space-y-4">
                        <h2 className="text-8xl font-black tracking-tighter">THE DIRECTIVE</h2>
                        <p className="text-gray-500 font-mono tracking-[1em] uppercase text-xs">Autonomous Agentic Discovery</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div className="space-y-8 p-12 rounded-3xl bg-white/2[0] border border-white/5 backdrop-blur-3xl group hover:border-primary/20 transition-all">
                            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                                <MousePointer2 className="text-primary" size={40} />
                            </div>
                            <h3 className="text-3xl font-black tracking-tight">KINETIC SHIFT</h3>
                            <p className="text-gray-400 font-light leading-relaxed">Drag the DreamCube to rotate focus between active dimensions. Discover hidden system intersections.</p>
                        </div>
                        <div className="space-y-8 p-12 rounded-3xl bg-white/2[0] border border-white/5 backdrop-blur-3xl group hover:border-secondary/20 transition-all">
                            <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-secondary/20 transition-all">
                                <Box className="text-secondary" size={40} />
                            </div>
                            <h3 className="text-3xl font-black tracking-tight">DIMENSION FOLD</h3>
                            <p className="text-gray-400 font-light leading-relaxed">Click to reshape the cube, opening up the internal agentic logic cores for manipulation.</p>
                        </div>
                        <div className="space-y-8 p-12 rounded-3xl bg-white/2[0] border border-white/5 backdrop-blur-3xl group hover:border-white/20 transition-all">
                            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-white/20 transition-all">
                                <Search className="text-white" size={40} />
                            </div>
                            <h3 className="text-3xl font-black tracking-tight">GRID OVERRIDE</h3>
                            <p className="text-gray-400 font-light leading-relaxed">Access the Omni-Grid to search and trigger any of the 119 packages directly without discovery.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-32 border-t border-white/5 bg-black">
                <div className="container mx-auto px-12 flex flex-col md:flex-row justify-between items-end gap-24">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <Zap className="text-primary" size={32} />
                            <span className="font-mono font-black text-3xl tracking-widest">DREAMNET</span>
                        </div>
                        <p className="max-w-md text-gray-500 font-light italic leading-relaxed text-sm">
                            DreamNet is a hyper-dense ecosystem of 400+ agents coordinating via the DreamCube protocol. Built for the sovereign explorer.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                        <div className="flex gap-12 text-[10px] font-mono tracking-[0.5em] text-gray-700 uppercase">
                            <a href="#" className="hover:text-primary">Whitepaper</a>
                            <a href="#" className="hover:text-primary">Ecosystem</a>
                            <a href="#" className="hover:text-primary">Directives</a>
                        </div>
                        <div className="text-gray-900 font-mono text-[9px] tracking-[1em] uppercase">© 2025 // DREAMCUBE_CORE_V1.0</div>
                    </div>
                </div>
            </footer>

            <style>{`
    .custom - scrollbar:: -webkit - scrollbar { width: 4px; }
                .custom - scrollbar:: -webkit - scrollbar - track { background: transparent; }
                .custom - scrollbar:: -webkit - scrollbar - thumb { background: rgba(0, 243, 255, 0.2); border - radius: 10px; }
                .custom - scrollbar:: -webkit - scrollbar - thumb:hover { background: rgba(0, 243, 255, 0.4); }
                .animate - pulse - slow { animation: pulse_glow 10s ease -in -out infinite; }
@keyframes pulse_glow {
    0 %, 100 % { opacity: 0.05; transform: scale(1); }
    50 % { opacity: 0.15; transform: scale(1.1); }
}
`}</style>
        </div>
    );
}
