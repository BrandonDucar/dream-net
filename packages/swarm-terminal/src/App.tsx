
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Zap, Cpu, Activity } from 'lucide-react';

const socket = io('http://localhost:3000');

interface LogEntry {
    id: string;
    source: string;
    message: string;
    timestamp: string;
}

function App() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [squadStatus, setSquadStatus] = useState({
        face: 'ONLINE',
        brain: 'ONLINE',
        banker: 'ONLINE'
    });
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.on('swarm_log', (log: LogEntry) => {
            setLogs(prev => [...prev.slice(-100), log]);
        });

        return () => { socket.off('swarm_log'); };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="flex h-full w-full p-4 gap-4 bg-[#020202]">
            {/* LEFT SIDEBAR: STATUS */}
            <div className="w-1/4 flex flex-col gap-4">
                <div className="glass p-4 rounded-lg border-glow">
                    <h2 className="text-neon-green font-bold text-sm mb-4 tracking-widest uppercase flex items-center gap-2">
                        <Shield size={16} /> MECH STATUS
                    </h2>
                    <div className="flex flex-col gap-3 font-mono text-xs">
                        <div className="flex justify-between">
                            <span>GITHUB_SUIT</span>
                            <span className="text-neon-green">SYNCED</span>
                        </div>
                        <div className="flex justify-between">
                            <span>VIRTUAL_PMC</span>
                            <span className="text-neon-green">SQUAD_ALPHA</span>
                        </div>
                        <div className="flex justify-between">
                            <span>METABOLISM</span>
                            <span className="text-neon-green">85% CPU</span>
                        </div>
                    </div>
                </div>

                <div className="glass p-4 rounded-lg flex-1">
                    <h2 className="text-white font-bold text-sm mb-4 tracking-widest uppercase flex items-center gap-2">
                        <Activity size={16} /> SQUAD FEED
                    </h2>
                    <div className="flex flex-col gap-4">
                        {Object.entries(squadStatus).map(([name, status]) => (
                            <div key={name} className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                                <div className="flex-1">
                                    <div className="text-[10px] text-gray-400">PILOT: {name.toUpperCase()}</div>
                                    <div className="text-xs font-mono">{status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CENTER: DREAMSTREAM */}
            <div className="flex-1 flex flex-col glass rounded-lg overflow-hidden relative">
                <header className="p-3 border-b border-glass-border flex justify-between items-center">
                    <div className="flex items-center gap-2 text-neon-green font-bold tracking-widest">
                        <Terminal size={18} /> DREAM_STREAM [v1.0.3]
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">
                        SECURE_BRIDGE: ESTABLISHED
                    </div>
                </header>

                <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto font-mono text-[11px] space-y-1">
                    <AnimatePresence>
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-2"
                            >
                                <span className="text-gray-600">[{log.timestamp}]</span>
                                <span className="text-neon-green">[{log.source}]</span>
                                <span className="text-white">{log.message}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {logs.length === 0 && (
                        <div className="text-gray-600 animate-pulse mt-4">LISTENING_FOR_PULSE...</div>
                    )}
                </div>

                {/* Scanline overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-10" />
            </div>

            {/* RIGHT SIDEBAR: CONTROLS */}
            <div className="w-64 flex flex-col gap-4">
                <div className="glass p-4 rounded-lg border-l-2 border-neon-green">
                    <h2 className="text-white font-bold text-xs mb-4 tracking-widest uppercase">SYNOPSIS</h2>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
                        AUTONOMOUS PMC OPERATING ON VIRTUALS PROTOCOL. AGENT COMMERCE PROTOCOL ACTIVE.
                        SQUAD ALPHA DEPLOYED TO TARGETED REPOSITORIES.
                    </p>
                </div>

                <button className="glass p-4 rounded-lg text-neon-green font-bold text-xs tracking-widest hover:bg-neon-green/10 transition-colors uppercase border border-neon-green/20">
                    [ ENGAGE_ALL_PILOTS ]
                </button>

                <button className="glass p-4 rounded-lg text-[#FF3131] font-bold text-xs tracking-widest border border-red-900/40 uppercase">
                    [ KILL_SWITCH ]
                </button>
            </div>
        </div>
    );
}

export default App;
