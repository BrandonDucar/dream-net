import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { Card, Button, Badge } from '@dreamnet/shared/components';
import { Terminal, Cpu, Zap, Activity, Play } from 'lucide-react';

export default function ToolGym() {
    const [running, setRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [stats, setStats] = useState({ cpu: 0, ram: 0, ops: 0 });

    const runBenchmark = () => {
        setRunning(true);
        setLogs(prev => [...prev, "> INITIALIZING TOOLGYM CONTAINER..."]);

        // Simulation
        let step = 0;
        const interval = setInterval(() => {
            step++;
            if (step === 1) {
                setLogs(prev => [...prev, "> ALLOCATING V-CPU CORES [8]... OK"]);
                setStats(s => ({ ...s, cpu: 45 }));
            }
            if (step === 2) {
                setLogs(prev => [...prev, "> MOUNTING VECTOR MEMORY (QDRANT)... OK"]);
                setStats(s => ({ ...s, ram: 1024 }));
            }
            if (step === 3) {
                setLogs(prev => [...prev, "> RUNNING INFERENCE BATCH_001..."]);
                setStats(s => ({ ...s, ops: 1540 }));
            }
            if (step === 4) {
                setLogs(prev => [...prev, "> BENCHMARK COMPLETE. SCORE: 98.4"]);
                setRunning(false);
                clearInterval(interval);
            }
        }, 1000);
    };

    return (
        <div className="flex h-screen bg-[#050505] text-white font-mono">
            <Sidebar />
            <main className="flex-1 p-8 overflow-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-green-500">TOOL_GYM</h1>
                        <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest">Autonomous Agent Training Facility</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-right">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase">Compute Credits</p>
                            <p className="text-xl font-black text-white">4,200 <span className="text-green-500 text-xs">CR</span></p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Console Output */}
                    <div className="lg:col-span-2 bg-black border border-white/10 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-50" />
                        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                            <div className="flex gap-2">
                                <Terminal size={16} className="text-zinc-500" />
                                <span className="text-xs font-bold text-zinc-400">TERM_SESSION_844</span>
                            </div>
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">ONLINE</Badge>
                        </div>
                        <div className="h-64 overflow-y-auto space-y-2 text-xs text-green-400/80 font-mono">
                            {logs.length === 0 && <span className="opacity-50 text-zinc-600">Waiting for input stream...</span>}
                            {logs.map((log, i) => (
                                <div key={i}>{log}</div>
                            ))}
                            {running && <div className="animate-pulse">_</div>}
                        </div>
                    </div>

                    {/* Controls & Stats */}
                    <div className="space-y-6">
                        <Card className="p-6 bg-white/[0.02]">
                            <h3 className="text-sm font-bold uppercase mb-4 text-zinc-400">Resource Monitor</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>CPU LOAD</span>
                                        <span>{stats.cpu}%</span>
                                    </div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${stats.cpu}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>MEMORY (MB)</span>
                                        <span>{stats.ram}</span>
                                    </div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${(stats.ram / 2048) * 100}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>OPS / SEC</span>
                                        <span>{stats.ops}</span>
                                    </div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: `${(stats.ops / 2000) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Button
                            className={`w-full h-14 font-black text-lg border border-green-500/30 text-green-400 hover:bg-green-500/10 uppercase tracking-widest transition-all ${running ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={runBenchmark}
                            disabled={running}
                        >
                            {running ? 'Running Suite...' : 'Start Benchmark'}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
