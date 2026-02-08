import React from 'react';
import { motion } from 'framer-motion';
import { SentientAvatar } from './ui/SentientAvatar';
import { SentientAgent } from '@/data/agentLibrary';
import { Shield, Zap, TrendingUp, Lock, Globe, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SentientAgentCardProps {
    agent: SentientAgent;
    onClick?: () => void;
    className?: string;
}

export const SentientAgentCard: React.FC<SentientAgentCardProps> = ({ agent, onClick, className }) => {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={onClick}
            className={cn(
                "group relative w-80 h-[480px] bg-[#0b0f13] border border-white/10 rounded-2xl overflow-hidden cursor-pointer shadow-2xl",
                "chitin-iridescent hover:border-cyan-500/50 transition-all duration-500",
                className
            )}
        >
            {/* HOLOGRAPHIC OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity" />

            {/* SCANLINES */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20" />

            {/* CARD HEADER */}
            <div className="p-5 flex justify-between items-start relative z-10">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                        {agent.type}
                    </span>
                    <h3 className="text-xl font-black text-white mt-1 uppercase tracking-tighter">
                        {agent.name}
                    </h3>
                </div>
                {agent.isNFT && (
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                        <Lock className="w-4 h-4 text-white/40" />
                    </div>
                )}
            </div>

            {/* AVATAR SECTION */}
            <div className="flex justify-center items-center h-48 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 blur-2xl animate-pulse" />
                </div>
                {agent.imageUrl ? (
                    <motion.img
                        src={agent.imageUrl}
                        alt={agent.name}
                        className="w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <SentientAvatar
                        seed={agent.name}
                        type={agent.type}
                        className="w-24 h-24 ring-4 ring-white/10 ring-offset-4 ring-offset-[#0b0f13] relative z-20"
                        pulse
                    />
                )}
                {/* GRADIENT OVERLAY FOR TEXT READABILITY IF IMAGE IS FULL HEIGHT */}
                {agent.imageUrl && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f13] via-transparent to-transparent z-15" />
                )}
            </div>

            {/* CARD CONTENT */}
            <div className="bg-black/40 backdrop-blur-md p-5 border-t border-white/5 relative z-10 h-full">
                <p className="text-xs text-white/70 italic leading-relaxed mb-4">
                    "{agent.description}"
                </p>

                {/* STATS GRID */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="flex flex-col bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="text-[8px] text-gray-500 uppercase font-black">Trust</span>
                        <span className="text-xs font-bold text-green-400">{(agent.metrics.trust * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex flex-col bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="text-[8px] text-gray-500 uppercase font-black">Entropy</span>
                        <span className="text-xs font-bold text-purple-400">{(agent.metrics.entropy * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex flex-col bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="text-[8px] text-gray-500 uppercase font-black">Eff.</span>
                        <span className="text-xs font-bold text-cyan-400">{(agent.metrics.efficiency * 100).toFixed(0)}%</span>
                    </div>
                </div>

                {/* TRAITS */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                    {agent.traits.map(trait => (
                        <span key={trait} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[8px] text-white/50 uppercase font-black tracking-widest">
                            {trait}
                        </span>
                    ))}
                </div>

                {/* ACTIONS */}
                <div className="absolute bottom-4 left-5 right-5">
                    <div className="flex justify-between items-center text-[10px] border-t border-white/5 pt-3">
                        <div className="flex gap-2">
                            <Shield className="w-3 h-3 text-white/20" />
                            <Zap className="w-3 h-3 text-white/20" />
                            <Globe className="w-3 h-3 text-white/20" />
                        </div>
                        <span className="text-white/20 font-black uppercase tracking-[0.2em]">Sovereign_Asset_V1</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
