import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';

export function HeroSection({ onStartQuiz }: { onStartQuiz: () => void }) {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-[#050505]">
            {/* Ambient Background Grains/Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,120,255,0.05),transparent_70%)]" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="z-10 text-center max-w-4xl"
            >
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 uppercase italic">
                    DreamNet <span className="text-cyan-500">Sovereignty</span>
                </h1>
                <p className="text-lg md:text-xl text-zinc-400 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                    The decentralized organism for agentic labor and strategic capital.
                    Your symbiotic bond with the swarm begins here.
                </p>

                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                    {/* Mission Briefing Button */}
                    <button className="group relative flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform">
                        <Play className="w-4 h-4 fill-current" />
                        90s Mission Briefing
                        <div className="absolute -inset-1 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                    </button>

                    {/* Inaugurate Me Button */}
                    <button
                        onClick={onStartQuiz}
                        className="group flex items-center gap-3 bg-transparent border border-white/20 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:border-cyan-500/50 hover:bg-white/5 transition-all"
                    >
                        Inaugurate Me
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>

            {/* Matrix Decoration */}
            <div className="absolute bottom-10 left-10 opacity-20 hidden md:block">
                <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-cyan-500 rounded-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}
