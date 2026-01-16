import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Factory, ChevronUp, ChevronDown, Zap, CheckCircle2, AlertCircle, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ProductionLog {
    agentName: string;
    status: "provisioning" | "ready" | "failed";
    timestamp: number;
    blueprint: any;
}

export const MetabolicWidget: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['/api/factory/status'],
        queryFn: async () => {
            const res = await fetch('/api/factory/status');
            if (!res.ok) throw new Error('Failed to fetch factory status');
            return res.json();
        },
        refetchInterval: 5000 // Poll every 5 seconds
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

    const logs: ProductionLog[] = data?.productionLines || [];
    const latestLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-80"
                    >
                        <Card className="bg-zinc-950/90 border-zinc-800 shadow-2xl backdrop-blur-xl overflow-hidden rounded-2xl">
                            <CardHeader className="p-4 border-b border-zinc-800 flex flex-row items-center justify-between bg-zinc-900/50">
                                <div className="flex items-center gap-2">
                                    <Factory className="w-4 h-4 text-cyan-400" />
                                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white">Metabolic Feed</CardTitle>
                                </div>
                                <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[8px]">Live</Badge>
                            </CardHeader>

                            <CardContent className="p-4 space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                                {latestLogs.length === 0 ? (
                                    <p className="text-[10px] text-zinc-500 text-center py-4 font-mono uppercase">Idle • Waiting for Pulse</p>
                                ) : (
                                    latestLogs.map((log, i) => (
                                        <div key={i} className="flex gap-3 items-start animate-in fade-in slide-in-from-right-2">
                                            <div className={`mt-1 h-1.5 w-1.5 rounded-full ${log.status === 'ready' ? 'bg-emerald-500' :
                                                log.status === 'provisioning' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                                                }`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-bold text-zinc-200 truncate">{log.agentName}</p>
                                                <p className="text-[8px] text-zinc-500 uppercase font-mono">
                                                    {log.status} • {new Date(log.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>

                            <div className="p-3 bg-white/5 border-t border-zinc-800">
                                <Button
                                    onClick={() => triggerMutation.mutate()}
                                    disabled={triggerMutation.isPending}
                                    className="w-full h-8 bg-white text-black hover:bg-zinc-200 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all active:scale-95"
                                >
                                    {triggerMutation.isPending ? 'Pulsing...' : (
                                        <>
                                            <Play className="w-3 h-3 mr-1.5" />
                                            Spark Pulse
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center gap-3 px-4 py-3 rounded-full shadow-2xl transition-all border ${isExpanded
                    ? 'bg-zinc-900 border-zinc-700 text-white'
                    : 'bg-white border-white text-black'
                    }`}
            >
                <div className="relative">
                    <Factory className="w-5 h-5" />
                    {logs.length > 0 && !isExpanded && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                    )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider">
                    {isExpanded ? 'Minimize' : 'Monitor Metabolic Engine'}
                </span>
                {isExpanded ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronUp className="w-4 h-4 opacity-50" />}
            </motion.button>
        </div>
    );
};
