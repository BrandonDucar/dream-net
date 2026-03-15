"use client";

import { useEffect, useState } from "react";
import { Terminal, Shield, Cpu, Zap, Search, Plus, Loader2 } from "lucide-react";
import { BountyService, Bounty } from "@/lib/BountyService";

export default function BountyDashboard() {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);

  useEffect(() => {
    BountyService.getBounties().then(data => {
      setBounties(data);
      setLoading(false);
    });
  }, []);

  const handleExtract = async () => {
    setExtracting(true);
    const newBounty = await BountyService.extractBountyFromCast("0x_mock_cast_hash");
    setBounties(prev => [newBounty, ...prev]);
    setExtracting(false);
  };

  return (
    <main className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter neon-text-pink italic uppercase">
            BountyCaster
          </h1>
          <p className="text-zinc-500 font-mono text-sm mt-1">
            // Farcaster-Native AI Research & Bounty Board
          </p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 glass-card hover:bg-white/10 transition-colors">
            <Search size={18} className="text-pink-500" />
            <span className="text-sm font-mono tracking-tight">Search Bounties</span>
          </button>
          <button 
            onClick={handleExtract}
            disabled={extracting}
            className="flex items-center gap-2 px-6 py-2 bg-pink-600 rounded-2xl hover:bg-pink-500 transition-all shadow-[0_0_20px_rgba(219,39,119,0.4)] active:scale-95 disabled:opacity-50"
          >
            {extracting ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            <span className="text-sm font-bold">{extracting ? "Analyzing Cast..." : "New Mission"}</span>
          </button>
        </div>
      </header>

      {/* Hero Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Nodes", value: "54", icon: Cpu, color: "text-blue-400" },
          { label: "Total Bounty Flow", value: "4.2 ETH", icon: Zap, color: "text-yellow-400" },
          { label: "Secured by PRISM", value: "99.9%", icon: Shield, color: "text-green-400" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 flex items-center gap-6">
            <div className={`p-4 rounded-xl bg-white/5 ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">{stat.label}</p>
              <p className="text-2xl font-black font-mono">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Active Missions */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Terminal size={20} className="text-pink-500" />
          Live Bounties
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-pink-500" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bounties.map((bounty) => (
              <div key={bounty.id} className="glass-card p-5 flex justify-between items-center group hover:border-pink-500/50 transition-all cursor-pointer">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg group-hover:text-pink-500 transition-colors">{bounty.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-zinc-400 font-mono">
                    <span>{bounty.author}</span>
                    <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                    <span className="text-pink-400/80 uppercase text-[10px] tracking-widest">{bounty.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-white">{bounty.reward}</p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-tighter">Settlement on Base</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
