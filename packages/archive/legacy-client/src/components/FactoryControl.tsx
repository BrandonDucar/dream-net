import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Factory, Zap, Settings, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const FactoryControl: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'studio' | 'foundry' | 'factory'>('factory');
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['/api/factory/status'],
        queryFn: async () => {
            const res = await fetch('/api/factory/status');
            if (!res.ok) throw new Error('Failed to fetch factory status');
            return res.json();
        },
        refetchInterval: 5000
    });

    const triggerMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/factory/trigger', { method: 'POST' });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/factory/status'] });
        }
    });

    const productionLines = data?.productionLines || [];

    return (
        <div className="factory-control p-8 bg-zinc-950/80 border border-zinc-800 rounded-3xl shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">
                        AI Factory <span className="text-zinc-500">v1.1</span>
                    </h2>
                    <p className="text-zinc-400 font-mono text-xs mt-1 uppercase tracking-widest">
                        Metabolic Production Loop Active • Live Synthesis
                    </p>
                </div>
                <div className="flex gap-2">
                    {['studio', 'foundry', 'factory'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab
                                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-zinc-900/50 border-zinc-800 col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-300 flex items-center gap-2">
                            <Factory className="w-4 h-4 text-cyan-400" />
                            Production Lines
                        </CardTitle>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active Hub</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {productionLines.length === 0 ? (
                                <div className="p-8 text-center text-zinc-600 font-mono text-xs uppercase border border-dashed border-zinc-800 rounded-2xl">
                                    No active production lines detected. Spark a pulse to begin.
                                </div>
                            ) : (
                                productionLines.map((line: any) => (
                                    <div key={line.agentName} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/50 relative overflow-hidden group">
                                        <div className="flex items-center justify-between mb-3 relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                                                    <Zap className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-white mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{line.agentName}</h4>
                                                    <p className="text-[10px] text-zinc-500 uppercase font-mono">{line.blueprint.architecture} • {new Date(line.timestamp).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${line.status === 'ready' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400 animate-pulse'
                                                    }`}>
                                                    {line.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="relative h-1 bg-zinc-900 rounded-full overflow-hidden mb-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: line.status === 'ready' ? '100%' : '65%' }}
                                                className="absolute h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                                            />
                                        </div>

                                        <div className="flex justify-between text-[9px] font-mono text-zinc-600 uppercase">
                                            <span>Blueprint Verified</span>
                                            <span>Stability Locked</span>
                                        </div>

                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-emerald-500/5 border-emerald-500/20 text-center">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center justify-center gap-2">
                                <Zap className="w-3 h-3" />
                                Performance Core
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white mb-1">98.4%</div>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Stability Coefficient</p>
                            <div className="mt-4 pt-4 border-t border-emerald-500/10 space-y-2">
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-zinc-500 uppercase">Total Minted</span>
                                    <span className="text-emerald-400 font-mono">{productionLines.filter((l: any) => l.status === 'ready').length}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-zinc-500 uppercase">Success Rate</span>
                                    <span className="text-emerald-400 font-mono">100%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-950 border-zinc-800 relative overflow-hidden">
                        <CardContent className="pt-6">
                            <Button
                                onClick={() => triggerMutation.mutate()}
                                disabled={triggerMutation.isPending}
                                className="w-full bg-white text-black hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest shadow-xl relative z-10"
                            >
                                <Play className="w-3 h-3 mr-2" />
                                {triggerMutation.isPending ? 'Pulsing Engine...' : 'Trigger New Loop'}
                            </Button>
                            <p className="text-[9px] text-center text-zinc-600 mt-3 font-mono">
                                Manual metabolic injection authorized.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
        </div>
    );
};
