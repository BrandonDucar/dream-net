import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import LoginForm from '../components/auth/login-form';
import { Card, Button, Badge, TierBadge } from '@dreamnet/shared';
import { motion } from 'framer-motion';
import { Activity, Clock, DollarSign, Brain, Smartphone, Watch, Eye } from 'lucide-react';
import { useAccount } from 'wagmi';

export default function Dashboard() {
    const { address, isConnected } = useAccount();
    const [interfaceMode, setInterfaceMode] = useState<'DESKTOP' | 'MOBILE' | 'GLASSES' | 'WATCH'>('DESKTOP');
    const [scent, setScent] = useState({ score: 0, tier: 'LARVA', progress: 0 });
    const [telemetry, setTelemetry] = useState({ bpm: 80, latency: '12ms', flux: '4.2 GW' });
    const [earnings, setEarnings] = useState({ node: 0, desci: 0, teach: 0 });

    useEffect(() => {
        if (!isConnected || !address) return;

        const fetchData = async () => {
            try {
                // 1. Fetch Scent
                const scentRes = await fetch(`/api/antigravity/pheromone/score/${address}`);
                const scentData = await scentRes.json();
                setScent({
                    score: scentData.score || 0,
                    tier: scentData.tier || 'LARVA',
                    progress: Math.min(Math.floor((scentData.score % 1000) / 10), 100)
                });

                // 2. Fetch Node Revenue (Real-world monitor)
                const nodeRes = await fetch('/api/antigravity/nodes/status');
                const nodes = await nodeRes.json();
                const totalNodeIncome = nodes.reduce((acc: number, n: any) => acc + n.totalEarnings, 0);
                setEarnings(prev => ({ ...prev, node: totalNodeIncome }));

                // 3. Simulated/Dynamic Pulse
                setTelemetry({
                    bpm: 70 + Math.floor(Math.random() * 30),
                    latency: `${10 + Math.floor(Math.random() * 10)}ms`,
                    flux: `${(4.0 + Math.random() * 0.5).toFixed(1)} GW`
                });

            } catch (e) {
                console.error("Dashboard telemetry sync failed:", e);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [isConnected, address]);

    if (!isConnected) {
        return <LoginForm />;
    }

    return (
        <div className={`flex h-screen bg-[#050505] text-white transition-all duration-700 ${interfaceMode === 'GLASSES' ? 'grayscale brightness-110 contrast-125' : ''}`}>
            {interfaceMode === 'DESKTOP' && <Sidebar />}

            <main className="flex-1 overflow-auto">
                {/* Interface Switcher for Hybrid Vision */}
                <div className="sticky top-0 z-50 p-6 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5">
                    <h1 className="text-2xl font-black tracking-tighter">THE LIVE CORE</h1>
                    <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                        <InterfaceToggle mode="DESKTOP" icon={<Activity size={12} />} current={interfaceMode} set={setInterfaceMode} />
                        <InterfaceToggle mode="MOBILE" icon={<Smartphone size={12} />} current={interfaceMode} set={setInterfaceMode} />
                        <InterfaceToggle mode="WATCH" icon={<Watch size={12} />} current={interfaceMode} set={setInterfaceMode} />
                        <InterfaceToggle mode="GLASSES" icon={<Eye size={12} />} current={interfaceMode} set={setInterfaceMode} />
                    </div>
                </div>

                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {/* Row 1: Reputation & Metabolic Pulse */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 relative overflow-hidden group hover:border-blue-500/20 transition-all">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Brain size={120} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em] mb-1">Reputation Scent</p>
                                        <h3 className="text-5xl font-black text-white group-hover:text-blue-500 transition-colors">{scent.score.toFixed(1)}</h3>
                                    </div>
                                    <TierBadge tier={scent.tier} />
                                </div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${scent.progress}%` }}
                                        className="bg-blue-600 h-full rounded-full"
                                    />
                                </div>
                                <p className="mt-4 text-[10px] font-mono text-zinc-600 uppercase">GNOSTIC CALIBRATION: {scent.progress}% TO NEXT EVOLUTION</p>
                            </div>
                        </Card>

                        <Card className="flex flex-col justify-between border-white/5 bg-white/[0.02]">
                            <p className="text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em] mb-4">Pulse Matrix</p>
                            <div className="space-y-4">
                                <PulseItem label="Swarm Bpm" value={telemetry.bpm.toString()} color="cyan" />
                                <PulseItem label="Net Latency" value={telemetry.latency} color="purple" />
                                <PulseItem label="Energy Flux" value={telemetry.flux} color="yellow" />
                            </div>
                        </Card>
                    </div>

                    {/* Row 2: Revenue Tracks */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Revenue Tracks</h2>
                            <Button variant="ghost" className="text-[10px] p-0 h-auto uppercase tracking-widest text-zinc-500">View All Tracks</Button>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <RevenueCard label="Node Revenue" value={`$${earnings.node.toFixed(2)}`} trend="+100%" />
                            <RevenueCard label="DeSci Bounties" value={`$${earnings.desci}`} trend="0%" />
                            <RevenueCard label="GovTech" value="$0" trend="0%" />
                            <RevenueCard label="Education" value={`$${earnings.teach}`} trend="0%" />
                        </div>
                    </div>

                    {/* Row 3: Wearable/Agent Perspective */}
                    <Card className="bg-gradient-to-br from-blue-900/10 to-purple-900/10 border-blue-500/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-blue-600/20 rounded-lg text-blue-400">
                                <Smartphone size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold">Hybrid Modality Active</h4>
                                <p className="text-xs text-zinc-400">Syncing telemetry to Glass/Watch/Pin</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-3 bg-black/40 rounded-lg border border-white/5 text-center">
                                <p className="text-[8px] text-zinc-500 uppercase">Watch Glance</p>
                                <p className="text-sm font-bold">142 SCN</p>
                            </div>
                            <div className="p-3 bg-black/40 rounded-lg border border-white/5 text-center">
                                <p className="text-[8px] text-zinc-500 uppercase">Glass HUD</p>
                                <p className="text-sm font-bold">GRID_LIVE</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}

function InterfaceToggle({ mode, icon, current, set }: any) {
    return (
        <button
            onClick={() => set(mode)}
            className={`p-2 rounded-md transition-all ${current === mode ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
        >
            {icon}
        </button>
    );
}

function PulseItem({ label, value, color }: any) {
    return (
        <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500 font-medium uppercase tracking-widest text-[8px]">{label}</span>
            <span className={`font-mono font-bold text-${color}-400`}>{value}</span>
        </div>
    );
}

function RevenueCard({ label, value, trend }: any) {
    return (
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
            <p className="text-[9px] uppercase font-black text-zinc-500 tracking-[0.1em] mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
                <h4 className="text-2xl font-black group-hover:text-blue-500 transition-colors">{value}</h4>
                <span className="text-[10px] text-green-500 font-bold">{trend}</span>
            </div>
        </div>
    );
}
