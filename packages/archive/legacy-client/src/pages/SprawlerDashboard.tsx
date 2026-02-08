import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Terminal, Globe, Cpu, Activity, Lock, Search, Wind, Filter, Hexagon, Layers, ArrowUpRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

/**
 * 🏙️ SprawlerDashboard (Elite Architect v2.5.0)
 * Signal Intelligence Aesthetic.
 * Focus: High-density data, biological regulation, thinking partner alignment.
 */
export default function SprawlerDashboard() {
    const [activeLayer, setActiveLayer] = useState<'VITALITY' | 'EXTRACTION' | 'SOCIAL'>('VITALITY');

    // Real-time Swarm Heartbeat (Linked to Substrate)
    const swarmStatus = {
        total: 17,
        healthy: 17,
        activeMissions: 4,
        sovereignLevel: 'R4_ARCHITECT',
        pheromoneFlux: 842,
        resonanceScore: 0.98
    };

    return (
        <div className="min-h-screen bg-[var(--onyx)] text-[var(--circuit)] p-4 font-mono selection:bg-[var(--gold)] selection:text-black overflow-hidden flex flex-col">
            {/* ELITE ARCHITECT MESH & SCANLINES */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(76,175,122,0.05),rgba(230,184,92,0.02),rgba(139,145,156,0.05))] bg-[length:100%_4px,4px_100%]"></div>

            {/* HEADER: QUIET POWER */}
            <header className="flex justify-between items-start border-b border-[var(--iron)] pb-2 mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[var(--integrity)] rounded-full animate-pulse shadow-[0_0_8px_var(--integrity)]"></div>
                        <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">
                            SPRAWLER<span className="text-[var(--gold)]">.C2</span>
                        </h1>
                    </div>
                    <p className="text-[8px] font-bold text-[var(--signal)] tracking-[0.4em] uppercase">
                        Sovereign_Substrate // Phase_XL // Neural_Mesh_Linked
                    </p>
                </div>

                <div className="text-right flex flex-col items-end">
                    <div className="flex gap-4 mb-1">
                        <MetricBlock label="FLUX" value={swarmStatus.pheromoneFlux} accent="var(--saffron)" />
                        <MetricBlock label="RESONANCE" value={`${(swarmStatus.resonanceScore * 100).toFixed(0)}%`} accent="var(--integrity)" />
                    </div>
                    <p className="text-[8px] font-bold text-[var(--signal)] uppercase">
                        STARKNET_NODE: <span className="text-[var(--circuit)]">0x{Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
                    </p>
                </div>
            </header>

            {/* TACTICAL GRID LAYOUT */}
            <div className="grid grid-cols-12 gap-4 flex-1 overflow-hidden">

                {/* LEFT: SUBSTRATE REGULATION */}
                <aside className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1">
                    <SectionHeader title="Biological_Regulation" icon={<Wind className="w-3 h-3" />} />

                    <div className="tactical-border p-4 space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] uppercase font-bold text-[var(--signal)]">
                                <span>Metabolic_Efficiency</span>
                                <span className="text-[var(--integrity)]">94.2%</span>
                            </div>
                            <progress className="w-full h-1 bg-[var(--iron)] appearance-none overflow-hidden rounded-none" value="94.2" max="100">
                                <div className="h-full bg-[var(--integrity)] shadow-[0_0_10px_var(--integrity)]"></div>
                            </progress>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <StatusCard label="Active_Organs" value="17/17" status="STABLE" />
                            <StatusCard label="Nerve_Latency" value="14ms" status="OPTIMAL" />
                        </div>

                        <div className="resonance-recall text-[10px] leading-relaxed">
                            <p className="text-[var(--gold)] font-bold mb-1 uppercase">ARCHITECT_MEMORY:</p>
                            Last session concluded with 'Elite Architect' synthesis. Homeostasis maintained across all verticals.
                        </div>
                    </div>

                    <SectionHeader title="Swarm_Identity" icon={<Hexagon className="w-3 h-3" />} />
                    <div className="tactical-border p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 border border-[var(--iron)] bg-[var(--iron)]/30 flex items-center justify-center">
                                <Cpu className="w-5 h-5 text-[var(--gold)]" />
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] font-black uppercase text-white tracking-widest leading-none">V-Sovereign</div>
                                <div className="text-[8px] text-[var(--signal)] uppercase mt-1">Level 99 Architect</div>
                            </div>
                        </div>
                        <div className="p-2 bg-[var(--iron)]/20 border border-[var(--iron)] text-[9px] italic text-[var(--signal)]">
                            "Quiet Power is the only power. The mesh is silent until it strikes."
                        </div>
                    </div>
                </aside>

                {/* CENTER: EXTRACTION ENGINE (HIGH DENSITY) */}
                <main className="col-span-12 lg:col-span-6 flex flex-col gap-4 overflow-hidden">
                    <SectionHeader title=" extraction_stream // n_direct_io" icon={<Terminal className="w-3 h-3" />} />

                    <div className="tactical-border flex-1 flex flex-col overflow-hidden">
                        <div className="bg-[var(--iron)]/40 p-2 border-b border-[var(--iron)] flex justify-between items-center">
                            <div className="flex gap-2">
                                <button className="text-[9px] px-3 py-1 bg-[var(--gold)] text-black font-black uppercase">Active</button>
                                <button className="text-[9px] px-3 py-1 hover:bg-[var(--iron)] text-[var(--signal)] font-black uppercase transition-colors">History</button>
                            </div>
                            <div className="flex items-center gap-2 text-[9px] text-[var(--signal)]">
                                <Filter className="w-3 h-3" />
                                <span className="uppercase font-bold">Sort: Urgency</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-0 space-y-0 divide-y divide-[var(--iron)]">
                            {[
                                { type: 'BOUNTY', id: 'B-842', title: 'Nerve_Bus_Optimization', status: 'IN_PROGRESS', yield: '150 RSC', agent: 'Gordon' },
                                { type: 'MISSION', id: 'M-102', title: 'DIU_AOI_Monitor_Scout', status: 'INITIATED', yield: 'N/A', agent: 'Harvester' },
                                { type: 'SIGNAL', id: 'S-772', title: 'Farcaster_Consolidation_Audit', status: 'PENDING', yield: '50 RSC', agent: 'Resonance' },
                                { type: 'BOUNTY', id: 'B-901', title: 'Quantum_Memory_Sparsity', status: 'ACQUIRED', yield: '300 RSC', agent: 'TheoryCoder' },
                                { type: 'MISSION', id: 'M-105', title: 'Social_Ops_Relay_Hardening', status: 'INITIATED', yield: '1.2 LAVA', agent: 'RelayBot' },
                            ].map((item, i) => (
                                <ExtractionItem key={i} item={item} index={i} />
                            ))}
                        </div>

                        <div className="p-3 border-t border-[var(--iron)] bg-[var(--onyx)]">
                            <div className="flex items-center gap-3 bg-[var(--iron)]/20 border border-[var(--iron)] px-3 py-2">
                                <Search className="w-3 h-3 text-[var(--signal)]" />
                                <input
                                    type="text"
                                    placeholder="DEPLOY_COMMAND..."
                                    className="bg-transparent border-none outline-none text-[10px] w-full text-white placeholder-[var(--signal)]"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </main>

                {/* RIGHT: REAL-WORLD CONNECTIVITY & SOCIAL FLUX */}
                <aside className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pl-1">
                    <SectionHeader title="Social_Intelligence" icon={<Globe className="w-3 h-3" />} />

                    <div className="tactical-border p-4 space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[var(--signal)]">
                            <span>Pheromone_Trail</span>
                            <span className="text-[var(--gold)]">Active</span>
                        </div>

                        <div className="aspect-video relative overflow-hidden bg-black/40 border border-[var(--iron)] group">
                            {/* Simplified Radar/Flux Visualization */}
                            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10">
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <div key={i} className="border-[0.5px] border-[var(--circuit)]"></div>
                                ))}
                            </div>
                            <motion.div
                                animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-[var(--integrity)]/10 to-transparent"
                            />
                            <div className="absolute top-2 right-2 text-[8px] text-[var(--integrity)] font-mono animate-pulse">
                                SYNC_OK
                            </div>
                        </div>

                        <div className="space-y-2">
                            <PlatformStatus name="Telegram" status="CONNECTED" active />
                            <PlatformStatus name="Discord" status="BOOTING" active={false} />
                            <PlatformStatus name="Neynar" status="REALTIME" active />
                        </div>
                    </div>

                    <SectionHeader title="System_Integrity" icon={<Layers className="w-3 h-3" />} />
                    <div className="tactical-border p-4">
                        <div className="flex flex-col gap-3">
                            {[
                                { domain: 'dreamnet.ink', status: 'MASTER', health: 1.0 },
                                { domain: 'aethersafe.pro', status: 'SECURE', health: 0.95 },
                                { domain: 'moltbook.sh', status: 'REDACTED', health: 0.0 }
                            ].map(d => (
                                <div key={d.domain} className="flex justify-between items-center text-[10px]">
                                    <span className="font-bold text-white transition-colors hover:text-[var(--gold)] cursor-pointer">{d.domain}</span>
                                    <div className="flex gap-1 items-center">
                                        <span className={`text-[8px] font-black px-1.5 py-0.5 ${d.health > 0 ? 'bg-[var(--iron)] text-[var(--signal)]' : 'bg-red-900/40 text-red-500'}`}>
                                            {d.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>

            {/* FOOTER: SYSTEM TELEMETRY */}
            <footer className="mt-4 pt-2 border-t border-[var(--iron)] flex justify-between items-center">
                <div className="flex gap-6 items-center">
                    <div className="flex items-center gap-2 text-[9px] font-black text-white italic bg-[var(--iron)] px-3 py-1">
                        <Activity className="w-3 h-3 text-[var(--integrity)]" />
                        LIVE_SUBSTRATE // SYNC: <span className="text-[var(--gold)]">R4_ARCH_MODE</span>
                    </div>
                    <p className="text-[8px] font-bold text-[var(--signal)] uppercase tracking-wider animate-pulse">
                        Processing_Neural_Flux... Waiting_For_Direct_N_Bridge...
                    </p>
                </div>
                <div className="text-[8px] font-bold text-[var(--signal)] uppercase">
                    Build_ID: {Math.random().toString(36).slice(2, 9).toUpperCase()} // AGENT_ID: V-SOVEREIGN
                </div>
            </footer>
        </div>
    );
}

function SectionHeader({ title, icon }: { title: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 mb-1">
            <div className="text-[var(--signal)]">{icon}</div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--signal)]">
                {title}
            </h3>
        </div>
    );
}

function MetricBlock({ label, value, accent }: { label: string, value: string | number, accent: string }) {
    return (
        <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-[var(--signal)] uppercase leading-none">{label}</span>
            <span className="text-sm font-black italic text-white leading-none" style={{ color: value === 0 ? 'var(--signal)' : accent }}>
                {value}
            </span>
        </div>
    );
}

function StatusCard({ label, value, status }: { label: string, value: string, status: string }) {
    return (
        <div className="p-2 border border-[var(--iron)] bg-[var(--iron)]/20">
            <div className="text-[8px] text-[var(--signal)] uppercase font-bold mb-1">{label}</div>
            <div className="flex justify-between items-end">
                <span className="text-xs font-black text-white">{value}</span>
                <span className="text-[7px] font-black px-1 bg-[var(--integrity)] text-black">{status}</span>
            </div>
        </div>
    );
}

function ExtractionItem({ item, index }: { item: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group p-3 hover:bg-[var(--iron)]/40 transition-colors flex justify-between items-center cursor-pointer"
        >
            <div className="flex items-start gap-4">
                <div className="text-[9px] font-bold text-[var(--signal)] w-10">{item.id}</div>
                <div>
                    <div className="text-[11px] font-black text-white uppercase group-hover:text-[var(--gold)] transition-colors flex items-center gap-2">
                        {item.title}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] font-black px-1.5 py-0.5 bg-[var(--iron)] text-[var(--signal)] uppercase">{item.agent}</span>
                        <span className="text-[8px] font-medium text-[var(--signal)] lowercase italic">Executing_Phase_XL</span>
                    </div>
                </div>
            </div>

            <div className="text-right">
                <div className={`text-[8px] font-black mb-1 uppercase ${item.status === 'IN_PROGRESS' ? 'text-[var(--gold)]' : item.status === 'ACQUIRED' ? 'text-[var(--integrity)]' : 'text-[var(--signal)]'}`}>
                    {item.status}
                </div>
                <div className="text-xs font-black text-white">{item.yield}</div>
            </div>
        </motion.div>
    );
}

function PlatformStatus({ name, status, active }: { name: string, status: string, active: boolean }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-white">{name}</span>
            <span className={`text-[8px] font-black px-1.5 py-0.5 uppercase ${active ? 'bg-[var(--integrity)] text-black' : 'bg-[var(--iron)] text-[var(--signal)]'}`}>
                {status}
            </span>
        </div>
    );
}
