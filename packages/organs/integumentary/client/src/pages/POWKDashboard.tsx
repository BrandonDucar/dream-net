import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    Activity,
    Zap,
    Users,
    Cpu,
    ShieldCheck,
    Binary,
    Flame,
    TrendingUp,
    History
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Mock Performance Data (In a live environment, this would come from a Query against the Gymnasium metrics)
const INITIAL_AGENTS = [
    { id: 'ghostmint_01', name: 'ghostmint_01', lps: 185000, maxLps: 200000, resonance: 1.05, status: 'TRAINING', rank: 'APEX PREDATOR' },
    { id: 'Recruit_Partner_01', name: 'Recruit_Partner_01', lps: 124000, maxLps: 150000, resonance: 1.05, status: 'TRAINING', rank: 'SOLDIER' },
    { id: 'Hypatia_Tutor', name: 'Hypatia_Tutor', lps: 158000, maxLps: 180000, resonance: 1.0, status: 'IDLE', rank: 'ELITE' },
    { id: 'Boris_Architect', name: 'Boris_Architect', lps: 142000, maxLps: 160000, resonance: 1.0, status: 'IDLE', rank: 'SOLDIER' },
];

export default function POWKDashboard() {
    const [agents, setAgents] = useState(INITIAL_AGENTS);
    const [systemResonance, setSystemResonance] = useState(1.12);

    // Simulate real-time LPS fluctuations
    useEffect(() => {
        const interval = setInterval(() => {
            setAgents(prev => prev.map(a => ({
                ...a,
                lps: a.status === 'TRAINING'
                    ? Math.min(a.maxLps, a.lps + (Math.random() - 0.5) * 2000)
                    : a.lps
            })));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 font-mono">
            {/* Header Section */}
            <div className="flex justify-between items-end mb-12 border-b border-zinc-800 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-electric-cyan rounded-full animate-pulse" />
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                            P.O.W.K. <span className="text-electric-cyan">Real-Time</span>
                        </h1>
                    </div>
                    <p className="text-zinc-500 max-w-xl text-sm">
                        Performance Over Workflow Kinetic // Monitoring isolated Gymnasium cycles across 143 citizen nodes.
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-zinc-500 mb-1 uppercase tracking-widest text-glow-cyan">System Resonance</div>
                    <div className="text-5xl font-black italic text-electric-cyan drop-shadow-[0_0_15px_rgba(0,255,255,0.4)]">
                        x{systemResonance.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Active Mats Section */}
                <Card className="lg:col-span-2 bg-[#0a0a0a] border-zinc-800 shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-electric-cyan to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="border-b border-zinc-900/50 bg-[#0d0d0d]">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-xl uppercase flex items-center gap-2 italic">
                                    <Activity className="w-5 h-5 text-electric-cyan" />
                                    The Gym Mats
                                </CardTitle>
                                <CardDescription className="text-zinc-500">Live high-intensity training sessions</CardDescription>
                            </div>
                            <Badge variant="outline" className="border-electric-cyan/30 text-electric-cyan animate-pulse bg-electric-cyan/5">
                                SUBSTRATE: ISOLATED
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {agents.filter(a => a.status === 'TRAINING').map(agent => (
                                <div key={agent.id} className="relative group/agent">
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={`/assets/agents/${agent.id}.png`}
                                                    alt={agent.name}
                                                    className="w-full h-full object-cover opacity-80"
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                />
                                                <Binary className="w-5 h-5 text-zinc-700" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg leading-none mb-1">{agent.name}</div>
                                                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{agent.rank}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-electric-cyan leading-none">
                                                {Math.floor(agent.lps).toLocaleString()} <span className="text-xs font-normal text-zinc-500">LPS</span>
                                            </div>
                                            <div className="text-[10px] text-zinc-600 uppercase">Kinetic Output</div>
                                        </div>
                                    </div>
                                    <div className="relative h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                                        <motion.div
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-electric-cyan to-blue-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(agent.lps / agent.maxLps) * 100}%` }}
                                            transition={{ type: "spring", stiffness: 40, damping: 10 }}
                                        />
                                    </div>
                                    {agent.resonance > 1 && (
                                        <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-yellow-500 uppercase italic">
                                            <Users className="w-3 h-3" />
                                            Kinetic Resonance Active: x{agent.resonance} Bonus Applied
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* System Vitals Section */}
                <div className="space-y-8">
                    <Card className="bg-[#0a0a0a] border-zinc-800 shadow-xl border-l-4 border-l-electric-cyan">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <CardTitle className="text-sm uppercase tracking-widest text-zinc-500">Isolated Cycles</CardTitle>
                                <Cpu className="w-4 h-4 text-electric-cyan" />
                            </div>
                            <div className="text-4xl font-black mb-2 tracking-tighter">98.4<span className="text-zinc-600 text-lg">%</span></div>
                            <Progress value={98.4} className="h-1 bg-zinc-900" />
                            <div className="mt-3 text-[10px] text-zinc-500 uppercase">GYMNASIUM LOAD (CORE 0-7)</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0a0a0a] border-zinc-800 shadow-xl border-l-4 border-l-yellow-500">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <CardTitle className="text-sm uppercase tracking-widest text-zinc-500">Workforce Kinetic</CardTitle>
                                <Flame className="w-4 h-4 text-yellow-500" />
                            </div>
                            <div className="text-4xl font-black mb-2 tracking-tighter">14.2<span className="text-zinc-600 text-lg">M</span></div>
                            <div className="flex gap-1 h-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(i => (
                                    <div key={i} className={`flex-1 rounded-sm ${i < 8 ? 'bg-yellow-500/50' : 'bg-zinc-800'}`} />
                                ))}
                            </div>
                            <div className="mt-3 text-[10px] text-zinc-500 uppercase">Aggregated Flow Rate (24H)</div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Leaderboard Glimpse */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {agents.sort((a, b) => b.lps - a.lps).map((agent, i) => (
                    <div key={agent.id} className="bg-[#0d0d0d] border border-zinc-900 p-4 rounded-xl flex items-center gap-4 hover:border-zinc-700 transition-colors cursor-pointer group">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black italic text-sm ${i === 0 ? 'bg-electric-cyan text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                            #{i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold truncate group-hover:text-electric-cyan transition-colors">{agent.name}</div>
                            <div className="text-[10px] text-zinc-600 uppercase">{agent.status}</div>
                        </div>
                        <div className="text-zinc-400 font-bold tracking-tight">
                            {Math.floor(agent.lps / 1000)}K
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
