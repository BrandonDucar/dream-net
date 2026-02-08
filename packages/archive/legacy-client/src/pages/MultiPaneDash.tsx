import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, Layout, Maximize2, Minimize2, Terminal, MessageSquare, Activity, Shield } from 'lucide-react';
import AgentDashboard from'./agent-dashboard.js';
import RemixThread from'./remix-thread.js';
import OmniDashboard from'./OmniDashboard.js';
import DreamCubeHub from'./DreamCubeHub.js';
import ChatGPTChat from'../components/ChatGPTChat.js';

export default function MultiPaneDash() {
    const [expandedPane, setExpandedPane] = useState<number | null>(null);

    const panes = [
        { id: 1, title: 'MY_DASH', icon: Terminal, component: <AgentDashboard />, color: 'cyan' },
        { id: 2, title: 'OUR_THREAD', icon: MessageSquare, component: <RemixThread />, color: 'gold' },
        { id: 3, title: 'AGENT_CHAT', icon: Activity, component: <ChatGPTChat />, color: 'purple' },
        { id: 4, title: 'DREAMNET_INK', icon: Globe, component: <DreamCubeHub />, color: 'blue' }
    ];

    const toggleExpand = (id: number) => {
        setExpandedPane(expandedPane === id ? null : id);
    };

    return (
        <div className="h-screen w-screen bg-black overflow-hidden relative font-mono text-white selection:bg-cyan-500 selection:text-black">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-cyan-950/20 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-950/20 blur-[150px] rounded-full"></div>
            </div>

            {/* Grid Layout */}
            <div className={`h-full w-full p-2 grid gap-2 transition-all duration-500 ${expandedPane ? 'grid-cols-1 grid-rows-1' : 'grid-cols-2 grid-rows-2'
                }`}>
                {panes.map((pane) => (
                    <motion.div
                        key={pane.id}
                        layout
                        initial={false}
                        animate={{
                            opacity: expandedPane && expandedPane !== pane.id ? 0 : 1,
                            scale: expandedPane && expandedPane !== pane.id ? 0.9 : 1,
                            zIndex: expandedPane === pane.id ? 50 : 10
                        }}
                        className={`relative border border-white/5 rounded-2xl overflow-hidden bg-black/40 backdrop-blur-md flex flex-col ${expandedPane === pane.id ? 'absolute inset-2 z-[100]' : ''
                            } ${expandedPane && expandedPane !== pane.id ? 'hidden' : 'flex'}`}
                    >
                        {/* Pane Header */}
                        <div className="p-3 border-b border-white/5 flex justify-between items-center bg-white/[0.02] z-20">
                            <div className="flex items-center gap-3">
                                <pane.icon size={14} className={`text-${pane.color}-400`} />
                                <span className={`text-[10px] font-black tracking-widest uppercase italic text-${pane.color}-400`}>
                                    {pane.title}
                                </span>
                            </div>
                            <button
                                onClick={() => toggleExpand(pane.id)}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-500"
                            >
                                {expandedPane === pane.id ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                            </button>
                        </div>

                        {/* Pane Content - Scrollable */}
                        <div className="flex-1 overflow-auto relative">
                            {/* Using scale to fit large dashboards into small quadrants if not expanded */}
                            <div className={`w-full h-full transform-gpu origin-top-left transition-transform duration-500 ${!expandedPane ? 'scale-[0.85]' : 'scale-100'
                                }`} style={{ width: !expandedPane ? '117%' : '100%', height: !expandedPane ? '117%' : '100%' }}>
                                {pane.component}
                            </div>
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-white/10 rounded-tr-2xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-white/10 rounded-bl-2xl pointer-events-none"></div>
                    </motion.div>
                ))}
            </div>

            {/* Global Overlay Elements */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 px-6 py-3 bg-black/80 border border-white/10 rounded-full backdrop-blur-2xl z-[110] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3 pr-4 border-r border-white/10">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                    <span className="text-[9px] font-black tracking-[0.2em]">QUAD_VIEW_ACTIVE</span>
                </div>
                <div className="flex gap-6">
                    {panes.map(p => (
                        <button
                            key={p.id}
                            onClick={() => toggleExpand(p.id)}
                            className={`text-[8px] font-black tracking-widest uppercase transition-all ${expandedPane === p.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {p.title.split('_')[1] || p.title}
                        </button>
                    ))}
                    {expandedPane && (
                        <button
                            onClick={() => setExpandedPane(null)}
                            className="text-[8px] font-black tracking-widest uppercase text-cyan-400 border-l border-white/10 pl-6"
                        >
                            RESET_GRID
                        </button>
                    )}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
}
