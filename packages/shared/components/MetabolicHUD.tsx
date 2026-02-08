import React from 'react';
import { useTelemetry } from '../hooks/useTelemetry';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Globe } from 'lucide-react';

export const MetabolicHUD = ({ wallet }: { wallet?: string }) => {
    const { swarm, loading } = useTelemetry(wallet);

    if (loading || !swarm) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[100] pointer-events-none">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-6 shadow-2xl"
            >
                {/* BPM Pulse */}
                <div className="flex items-center gap-3 border-r border-white/10 pr-6">
                    <div className="relative">
                        <Activity className="w-5 h-5 text-emerald-500" />
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 60 / (swarm.bpm || 80) }}
                            className="absolute inset-0 bg-emerald-500 rounded-full"
                        />
                    </div>
                    <div>
                        <div className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Gnoseology</div>
                        <div className="text-sm font-black text-white leading-none">{swarm.bpm || '--'} BPM</div>
                    </div>
                </div>

                {/* Swarm Health */}
                <div className="flex items-center gap-3 border-r border-white/10 pr-6">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <div>
                        <div className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Swarm</div>
                        <div className="text-sm font-black text-white leading-none">{swarm.networkHealth || 0}%</div>
                    </div>
                </div>

                {/* Operations */}
                <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <div>
                        <div className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Ops</div>
                        <div className="text-sm font-black text-white leading-none">{swarm.activeOperations?.length || 0} ACTIVE</div>
                    </div>
                </div>

                {/* Active Bots Tooltip-style info */}
                <div className="absolute -top-12 left-0 bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded-full backdrop-blur-md">
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">
                        {swarm.bots?.length || 0} Sentinels Connected
                    </span>
                </div>
            </motion.div>
        </div>
    );
};
