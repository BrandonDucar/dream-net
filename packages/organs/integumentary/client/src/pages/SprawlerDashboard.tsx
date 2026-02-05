import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Terminal, Globe, Cpu, Activity, Lock, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

/**
 * SprawlerDashboard
 * The Mercenary Command & Control 2.0 (On Steroids).
 * Aesthetic: High-density, tactical, sovereign.
 */
export default function SprawlerDashboard() {
    const [receipts, setReceipts] = useState<any[]>([]);
    const [drivelCount, setDrivelCount] = useState(1432); // Simulated purgation count

    // Real-time Swarm Heartbeat (Simulated for C2)
    const swarmStatus = {
        total: 17,
        healthy: 17,
        activeMissions: 4,
        sovereignLevel: 'R4_MASTER'
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#00F3FF] p-6 font-mono selection:bg-[#00F3FF] selection:text-black">
            {/* SCANLINES & GRID OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(0,243,255,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

            {/* HEADER SECTION */}
            <header className="flex justify-between items-end border-b border-[#00F3FF]/20 pb-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Sprawler_C2_v2.0</h1>
                    <p className="text-[10px] opacity-60 tracking-[0.5em] uppercase">Mercenary Command & Control // Domain: dreamnet.ink</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                        <div className="w-2 h-2 bg-[#00F3FF] rounded-full animate-pulse shadow-[0_0_10px_#00F3FF]"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-white">Uplink: Sovereign_Stable</span>
                    </div>
                    <p className="text-[10px] opacity-40 uppercase">Node: NA_ALPHA_WOLFPACK</p>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6">
                {/* LEFT COLUMN: SWARM STATUS */}
                <aside className="col-span-12 lg:col-span-3 space-y-6">
                    <div className="vivid-glass border border-[#00F3FF]/20 p-6 rounded-sm bg-black/40">
                        <h3 className="text-sm font-black mb-4 flex items-center gap-2 uppercase">
                            <Activity className="w-4 h-4" /> Swarm_Pulse
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="opacity-60">OPERATIONAL_NODES</span>
                                <span className="text-white font-bold">{swarmStatus.healthy}/{swarmStatus.total}</span>
                            </div>
                            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                <div className="bg-[#00F3FF] h-full" style={{ width: '100%' }}></div>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="opacity-60">ACTIVE_MISSIONS</span>
                                <span className="text-white font-bold">{swarmStatus.activeMissions}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="opacity-60">SOVEREIGNTY_RATING</span>
                                <span className="text-purple-400 font-bold">{swarmStatus.sovereignLevel}</span>
                            </div>
                        </div>
                    </div>

                    <div className="vivid-glass border border-[#00F3FF]/20 p-6 rounded-sm bg-black/40">
                        <h3 className="text-sm font-black mb-4 flex items-center gap-2 uppercase">
                            <Shield className="w-4 h-4 text-red-500" /> Resonance_Filter
                        </h3>
                        <div className="text-center">
                            <div className="text-4xl font-black text-white mb-1">{drivelCount}</div>
                            <div className="text-[8px] opacity-60 uppercase tracking-widest">Drivel_Incinerated</div>
                        </div>
                        <p className="text-[9px] mt-4 opacity-40 leading-tight">
                            DEAN_OF_VIBE: "If it sounds like a chatbot, we purge it. No apologies. No fillers."
                        </p>
                    </div>
                </aside>

                {/* MAIN COLUMN: ACTION FEED */}
                <main className="col-span-12 lg:col-span-6 space-y-6">
                    <div className="vivid-glass border border-[#00F3FF]/30 p-6 rounded-sm bg-black/60 min-h-[600px] relative overflow-hidden">
                        {/* BACKGROUND DECORATION */}
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Terminal className="w-48 h-48" />
                        </div>

                        <h2 className="text-xl font-black mb-6 flex items-center gap-3 uppercase">
                            <Cpu className="w-5 h-5" /> Mercenary_Audit_Trail
                        </h2>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
                            {/* MOCK RECEIPTS */}
                            {[1, 2, 3, 4, 5].map((i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className="border-l-2 border-[#00F3FF]/40 pl-4 py-2 hover:bg-[#00F3FF]/5 transition-colors group"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Receipt://impact_report_{i}44z</span>
                                        <span className="text-[9px] opacity-40">2026-02-04 22:30:12</span>
                                    </div>
                                    <p className="text-xs text-[#00F3FF]/80 mb-2">
                                        Agent #144 Gordon: Stabilized container cluster 'academy_beta'. 17/17 health verified.
                                    </p>
                                    <div className="flex gap-4 text-[8px] font-black uppercase">
                                        <span className="text-[#00F3FF]">SIG: 0x8a2b...efc9</span>
                                        <span className="text-white/40">DOMAIN: SOVEREIGN_V1</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* RIGHT COLUMN: MAP & LOGBOOK */}
                <aside className="col-span-12 lg:col-span-3 space-y-6">
                    <div className="vivid-glass border border-[#00F3FF]/20 p-6 rounded-sm bg-black/40">
                        <h3 className="text-sm font-black mb-4 flex items-center gap-2 uppercase">
                            <Globe className="w-4 h-4" /> Global_Reach
                        </h3>
                        <div className="aspect-square bg-[#00F3FF]/5 rounded border border-[#00F3FF]/10 flex items-center justify-center relative overflow-hidden">
                            {/* SIMULATED MAP */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                            <div className="w-2 h-2 bg-white rounded-full absolute top-1/4 left-1/3 animate-ping"></div>
                            <div className="w-1 h-1 bg-white rounded-full absolute top-1/4 left-1/3"></div>

                            <div className="w-2 h-2 bg-white rounded-full absolute bottom-1/2 right-1/4 animate-ping"></div>
                            <div className="w-1 h-1 bg-white rounded-full absolute bottom-1/2 right-1/4"></div>

                            <div className="text-[8px] font-black uppercase tracking-tighter opacity-40">Tactical_Map_Offline</div>
                        </div>
                    </div>

                    <div className="vivid-glass border border-[#00F3FF]/20 p-6 rounded-sm bg-black/40">
                        <h3 className="text-sm font-black mb-4 flex items-center gap-2 uppercase">
                            <Lock className="w-4 h-4 text-purple-400" /> Multidomain_Status
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { host: 'dreamnet.ink', status: 'ACTIVE', type: 'C2_SPRAWLER' },
                                { host: 'dreamnet.live', status: 'ACTIVE', type: 'VISUALIZER' },
                                { host: 'dadfi.org', status: 'WAITING', type: 'DESCI_HUB' },
                                { host: 'aethersafe.pro', status: 'CONFIG', type: 'SOV_VAULT' }
                            ].map((d) => (
                                <li key={d.host} className="flex flex-col">
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="font-bold text-white">{d.host}</span>
                                        <span className={`text-[8px] px-1 rounded ${d.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {d.status}
                                        </span>
                                    </div>
                                    <span className="text-[8px] opacity-40 uppercase tracking-widest">{d.type}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>

            {/* FOOTER TERMINAL */}
            <footer className="mt-12 bg-black border border-[#00F3FF]/40 p-2 font-mono text-[10px] flex gap-4 items-center">
                <span className="bg-[#00F3FF] text-black px-2 font-black">TERMINAL</span>
                <span className="animate-pulse">_</span>
                <div className="flex-1 opacity-60 overflow-hidden whitespace-nowrap">
                    AUTHENTICATED_AS_ARCHITECT // PERMISSION: R4_LEVEL_UNLOCKED // WAKU_UPLINK_STABLE // SWARM_COMM_ENCRYPTED...
                </div>
            </footer>
        </div>
    );
}
