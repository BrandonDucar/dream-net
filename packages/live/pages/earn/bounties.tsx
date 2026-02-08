import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@dreamnet/shared/components';

export default function Bounties() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch('/api/antigravity/tasks/queue');
                const data = await res.json();
                setTasks(data || []);
            } catch (e) {
                console.error("Failed to fetch tasks:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
        const interval = setInterval(fetchTasks, 30000); // 30s refresh for tasks
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">DESCI BOUNTIES</h1>
                    <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-bold">Extraction Layer: ACTIVE</p>
                </div>
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">{tasks.length} OPEN JOBS</Badge>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <p className="text-zinc-600 animate-pulse font-mono text-xs uppercase">Scanning for unclaimed labor...</p>
                ) : tasks.length > 0 ? tasks.map(task => (
                    <Card key={task.id} className="p-6 bg-white/[0.02] border-white/5 hover:border-blue-500/30 transition-all group">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">{task.title}</h3>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="text-[10px] uppercase border-zinc-800 text-zinc-500">{task.tier}</Badge>
                                    <Badge variant="outline" className="text-[10px] uppercase border-blue-900/40 text-blue-500/80">REVENUE_SHARE</Badge>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-green-500">{task.reward}</p>
                                <p className="text-[10px] text-zinc-600 font-mono">EST. SETTLEMENT: 1.5h</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-[10px]">
                            <span className="text-zinc-500 uppercase">Provenance ID</span>
                            <span className="text-zinc-400">{task.id.substring(0, 12)}...</span>
                        </div>
                        <Button className="w-full mt-6 bg-blue-600/10 text-blue-400 hover:bg-blue-600 border border-blue-500/20 font-bold uppercase tracking-widest h-12 transition-all group-hover:bg-blue-600 group-hover:text-white">
                            Claim Bounty
                        </Button>
                    </Card>
                )) : (
                    <div className="p-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                        <p className="text-zinc-600 font-bold uppercase tracking-[0.2em] text-sm">Swarm Purgation Complete. No open bounties detected.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
