
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Coins, Activity, Zap, Shield, Globe } from 'lucide-react';

export default function BondingCurveHub() {
    const [agents] = useState([
        { id: 'fox', name: 'FOX_PRIME', price: 1.2, pool: 5400, color: 'text-orange-500' },
        { id: 'ant', name: 'ANT_SCOUT', price: 0.8, pool: 2100, color: 'text-green-500' },
        { id: 'octopus', name: 'OCTO_SENTRY', price: 2.5, pool: 12000, color: 'text-cyan-500' },
        { id: 'wolf', name: 'WOLF_WATCH', price: 1.8, pool: 8900, color: 'text-red-500' }
    ]);

    return (
        <div className="min-h-screen bg-black text-white font-mono p-8 selection:bg-cyan-500 selection:text-black">
            <header className="mb-12 border-b border-white/10 pb-6">
                <h1 className="text-5xl font-black italic tracking-tighter uppercase italic">
                    Bonding_Curve_Hub <span className="text-xs font-normal non-italic text-cyan-400 opacity-50">v1.0-SYNC</span>
                </h1>
                <p className="text-sm opacity-60 mt-2 tracking-[0.2em]">/// LIQUIDITY RESONANCE PROTOCOL // BASE L2</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {agents.map((agent) => (
                    <motion.div
                        key={agent.id}
                        whileHover={{ y: -5 }}
                        className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                            <TrendingUp className="w-12 h-12" />
                        </div>

                        <h2 className={`text-xl font-black mb-4 ${agent.color}`}>{agent.name}</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] uppercase opacity-40">Current Price</label>
                                <div className="text-2xl font-bold">{agent.price} DREAM</div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase opacity-40">Bonded Liquidity</label>
                                <div className="text-xl">{agent.pool.toLocaleString()} SHEEP</div>
                            </div>

                            <button className="w-full bg-white text-black py-2 rounded-lg font-black text-xs uppercase hover:bg-cyan-400 transition-colors mt-4">
                                Acquire Bond
                            </button>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5 text-[10px] opacity-40 flex justify-between uppercase">
                            <span>ALGO: QUADRATIC</span>
                            <span>STATUS: LIVE</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <section className="mt-16 bg-cyan-950/20 border border-cyan-500/20 p-8 rounded-3xl">
                <h3 className="text-sm font-black text-cyan-500 mb-4 flex items-center gap-2 uppercase tracking-widest">
                    <Activity className="w-4 h-4" /> Swarm_Economics_Telemetry
                </h3>
                <div className="grid grid-cols-3 gap-8">
                    <div className="bg-black/40 p-4 border border-white/5 rounded-xl">
                        <label className="text-[10px] opacity-40 uppercase">Total Value Bonded</label>
                        <div className="text-2xl font-bold">28.4k SHEEP</div>
                    </div>
                    <div className="bg-black/40 p-4 border border-white/5 rounded-xl">
                        <label className="text-[10px] opacity-40 uppercase">Global Entropy Score</label>
                        <div className="text-2xl font-bold text-green-500">0.93</div>
                    </div>
                    <div className="bg-black/40 p-4 border border-white/5 rounded-xl">
                        <label className="text-[10px] opacity-40 uppercase">Treasury Surplus</label>
                        <div className="text-2xl font-bold text-purple-500">1.2 ETH</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
