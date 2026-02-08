import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@dreamnet/shared/components';
import { Server, Activity, ShieldCheck } from 'lucide-react';

export default function Nodes() {
    const [nodes, setNodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const res = await fetch('/api/antigravity/nodes/status');
                const data = await res.json();
                setNodes(data || []);
            } catch (e) {
                console.error("Failed to fetch node status:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchNodes();
        const interval = setInterval(fetchNodes, 15000); // 15s refresh
        return () => clearInterval(interval);
    }, []);

    const totalEarnings = nodes.reduce((acc, n) => acc + n.totalEarnings, 0);

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">NODE REVENUE</h1>
                    <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-bold">Lava & Pocket Infrastructure Sidecars</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-zinc-500 font-black uppercase mb-1">Total Accumulated</p>
                    <p className="text-2xl font-black text-blue-500">${totalEarnings.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <p className="text-zinc-600 animate-pulse font-mono text-xs uppercase">Pinging Swarm Infrastructure...</p>
                ) : nodes.length > 0 ? nodes.map(node => (
                    <Card key={node.id} className="p-6 bg-white/[0.02] border-white/5 hover:border-green-500/20 transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Server size={64} />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <div className="flex justify-between items-start">
                                <Badge className={node.status === 'HEALTHY' ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30'}>
                                    {node.status}
                                </Badge>
                                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{node.id.substring(0, 8)}</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{node.name}</h3>
                                <p className="text-[10px] text-zinc-500 font-mono uppercase">{node.provider} | {node.token}</p>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                                <div>
                                    <p className="text-[8px] text-zinc-600 uppercase font-black">Yield Total</p>
                                    <p className="text-lg font-black text-green-400">{node.totalEarnings.toFixed(2)} {node.token}</p>
                                </div>
                                <Button variant="ghost" className="h-8 px-3 text-[10px] border border-white/5 hover:bg-white/5">DIAGNOSTICS</Button>
                            </div>
                        </div>
                    </Card>
                )) : (
                    <div className="col-span-full p-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                        <p className="text-zinc-600 font-bold uppercase tracking-[0.2em] text-sm">Synchronizing Sidecars. Standing by for RPC broadcast...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
