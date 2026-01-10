import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AGENTS = [
    {
        id: 'LUCID',
        role: 'Nervous System',
        codename: '🧠 Logic Daemon',
        description: 'Routes intent through the Spider Web threads. Core ganglia.',
        status: 'ONLINE',
        color: '#00f2ff'
    },
    {
        id: 'ROOT',
        role: 'Architecture',
        codename: '🌱 Subconscious Architect',
        description: 'Weaves the database schemas and API spines. Foundation.',
        status: 'ONLINE',
        color: '#39ff14'
    },
    {
        id: 'CANVAS',
        role: 'Visual Layer',
        codename: '🎨 Dream Weaver',
        description: 'Manifests the frontend dream components into existence.',
        status: 'ONLINE',
        color: '#ff00ee'
    },
    {
        id: 'ECHO',
        role: 'Identity',
        codename: '🪞 Trust Mirror',
        description: 'Validates wallet sovereignity and reputation levels.',
        status: 'ONLINE',
        color: '#bc13fe'
    }
];

export const AgentShowcase: React.FC = () => {
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <div className="agent-showcase-container p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden relative">
            <div className="relative z-10">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                    Sentient Fleet
                </h2>
                <p className="text-gray-400 font-mono text-sm mb-8 tracking-tighter">
                    The biomimetic organs of DreamNet are active. High-intensity stability achieved.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {AGENTS.map((agent) => (
                        <motion.div
                            key={agent.id}
                            className="agent-card p-6 rounded-2xl border bg-gray-900/40 relative group cursor-pointer"
                            style={{
                                borderColor: hovered === agent.id ? agent.color : 'rgba(255,255,255,0.1)'
                            }}
                            onHoverStart={() => setHovered(agent.id)}
                            onHoverEnd={() => setHovered(null)}
                            whileHover={{ y: -5 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{agent.role}</span>
                                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{agent.id}</h3>
                            <p className="text-xs text-cyan-400 font-mono mb-4">{agent.codename}</p>

                            <AnimatePresence>
                                {hovered === agent.id && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-xs text-gray-300 leading-relaxed overflow-hidden"
                                    >
                                        {agent.description}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Decorative background glow */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"
                                style={{ backgroundColor: agent.color, filter: 'blur(20px)' }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Noise/Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />
        </div>
    );
};
