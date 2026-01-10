import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Activity, Shield, Coins, Globe, Plane } from 'lucide-react';
import { Dimension } from '../hero/DreamCube.js';

interface VerticalSurfaceProps {
    dimension: Dimension | null;
    onClose: () => void;
}

export const VerticalSurface: React.FC<VerticalSurfaceProps> = ({ dimension, onClose }) => {
    if (!dimension) return null;

    const getVerticalIcon = (id: string) => {
        switch (id) {
            case 'shield': return Shield;
            case 'alchemist': return Coins;
            case 'voyager': return Plane;
            case 'predator': return Activity;
            default: return Zap;
        }
    };

    const Icon = getVerticalIcon(dimension.id);

    return (
        <AnimatePresence>
            {dimension && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                    className="fixed inset-0 z-[110] bg-[#0B0F13] flex flex-col items-center justify-center p-8 lg:p-24 overflow-hidden"
                >
                    {/* ATMOSPHERIC BACKGROUND PIC (Generated Asset) */}
                    <div className="absolute inset-0 z-0">
                        {/* Placeholder Gradient if image doesn't exist yet */}
                        <div className={`absolute inset-0 opacity-20 bg-gradient-to-br from-[var(--titan-cyan)] to-black`} />
                        <img
                            src={`/assets/verticals/vertical_${dimension.id}_titan.png`}
                            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                            alt=""
                        />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150"></div>
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B0F13] to-transparent"></div>
                    </div>

                    {/* CLOSE UI */}
                    <button
                        onClick={onClose}
                        className="absolute top-12 right-12 z-50 p-6 border border-white/5 hover:border-[var(--titan-cyan)]/50 hover:bg-[var(--titan-cyan)]/10 transition-all group"
                    >
                        <X size={32} className="text-gray-500 group-hover:text-[var(--titan-cyan)] transition-colors" />
                    </button>

                    {/* CONTENT CORE */}
                    <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-12">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-[var(--titan-cyan)]/20 bg-[var(--titan-cyan)]/5 shadow-[0_0_30px_rgba(0,243,255,0.1)]"
                            >
                                <Icon size={16} className="text-[var(--titan-cyan)]" />
                                <span className="text-[10px] text-[var(--titan-cyan)] font-mono tracking-[0.8em] uppercase">Sector_{dimension.id}_Synchronized</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-8xl lg:text-[11rem] font-black tracking-tighter leading-[0.8] text-white italic uppercase"
                            >
                                {dimension.label}
                            </motion.h1>

                            <p className="text-2xl text-gray-400 font-light leading-relaxed max-w-xl border-l-2 border-[var(--titan-cyan)]/10 pl-8">
                                {dimension.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 border border-white/5 bg-black/40 backdrop-blur-xl group hover:border-[var(--titan-cyan)]/30 transition-all">
                                    <h3 className="text-[10px] font-mono tracking-[0.4em] text-gray-600 mb-6 uppercase">Active_Agents</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {dimension.agents.map(agent => (
                                            <span key={agent} className="px-4 py-1.5 bg-[var(--titan-cyan)]/10 border border-[var(--titan-cyan)]/20 text-[10px] font-mono text-white tracking-widest uppercase">
                                                {agent}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8 border border-white/5 bg-black/40 backdrop-blur-xl group hover:border-[var(--titan-teal)]/30 transition-all">
                                    <h3 className="text-[10px] font-mono tracking-[0.4em] text-gray-600 mb-6 uppercase">Sector_Telemetry</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-mono">
                                            <span className="text-gray-500">RESISTANCE</span>
                                            <span className="text-[var(--titan-cyan)]">0.00{Math.floor(Math.random() * 99)} σ</span>
                                        </div>
                                        <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '65%' }}
                                                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                                                className="h-full bg-[var(--titan-cyan)] shadow-[0_0_10px_var(--titan-cyan)]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SYMBOLIC MARK / 3D ELEMENT PREVIEW */}
                        <div className="hidden lg:flex items-center justify-center pointer-events-none">
                            <motion.div
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="relative"
                            >
                                <div className="w-[450px] h-[450px] rounded-full border border-[var(--titan-cyan)]/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                <div className="w-[300px] h-[300px] rounded-full border border-[var(--titan-cyan)]/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-2xl opacity-20" />
                                <Icon size={120} className="text-[var(--titan-cyan)] opacity-20" />
                            </motion.div>
                        </div>
                    </div>

                    {/* BOTTOM TICKER SCAN */}
                    <div className="absolute bottom-12 w-full px-24 flex justify-between items-end">
                        <div className="space-y-4">
                            <div className="text-[8px] font-mono tracking-[1em] text-gray-700 uppercase">Directive: Continuous_Evolution</div>
                            <div className="flex gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className={`w-8 h-1 ${i === dimension.id.length % 4 ? 'bg-[var(--titan-cyan)]' : 'bg-white/5'} transition-colors`} />
                                ))}
                            </div>
                        </div>
                        <div className="text-[10px] font-mono text-gray-600 tracking-widest italic">
                            Sector_Lock_0x{dimension.id.toUpperCase()} // Initialized_Aqueous_Tube
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
