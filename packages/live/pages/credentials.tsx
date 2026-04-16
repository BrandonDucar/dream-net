import React, { useState, useEffect } from 'react';
import { Card, TierBadge } from '@dreamnet/shared/components';
import { Shield, Award, Users } from 'lucide-react';

export default function Credentials() {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('/api/antigravity/pheromone/leaderboard');
                const data = await res.json();
                setLeaderboard(data || []);
            } catch (e) {
                console.error("Failed to fetch leaderboard:", e);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">SWARM HIERARCHY</h1>
                    <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-bold">The Great Chain of Being</p>
                </div>
                <div className="p-2 bg-blue-600/10 border border-blue-500/20 rounded-lg flex items-center gap-2">
                    <Award className="text-blue-400 w-4 h-4" />
                    <span className="text-[10px] font-bold text-blue-400 uppercase">Season 01: GENESIS</span>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2">
                        <Users size={12} /> Top Sovereigns
                    </h2>
                    <div className="space-y-2">
                        {leaderboard.map((user, idx) => (
                            <div key={user.wallet} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-blue-500/20 transition-all group">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-black text-zinc-700 w-4">#{idx + 1}</span>
                                    <div>
                                        <p className="text-sm font-bold group-hover:text-blue-400 transition-colors">{user.name}</p>
                                        <p className="text-[10px] text-zinc-600 font-mono">{user.wallet.substring(0, 10)}...</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-4">
                                    <div>
                                        <p className="text-xs font-black">{Math.floor(user.score)} SCN</p>
                                    </div>
                                    <TierBadge tier={user.tier} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2">
                        <Shield size={12} /> Local Attestations
                    </h2>
                    <Card title="P.O.E (Proof of Existence)">
                        <div className="text-[10px] font-mono text-zinc-500 uppercase mb-2">EAS Attestation Registry</div>
                        <div className="p-3 bg-black/40 rounded border border-white/5 text-[10px] font-mono text-blue-500/70 truncate">
                            0x4f2a7db9e8c1...3a88
                        </div>
                    </Card>
                    <Card title="Sovereign Scent (Decay: 2%)">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-2xl font-black text-zinc-200">142.5</p>
                                <p className="text-[8px] text-zinc-500 uppercase">Current Weighted Score</p>
                            </div>
                            <TierBadge tier="LARVA" />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
