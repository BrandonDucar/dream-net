"use client";

import { useState, useEffect } from "react";
import { useMiniApp } from "@neynar/react";
import { signOath, getChakraStatus, getMetabolicScraps, alignChakras } from "~/app/actions";

export function HomeTab() {
  const { context } = useMiniApp();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [chakras, setChakras] = useState<any[]>([]);
  const [scraps, setScraps] = useState<any[]>([]);
  const [resonance, setResonance] = useState(70);

  useEffect(() => {
    if (context?.user) {
      fetchData();
    }
  }, [context?.user]);

  const fetchData = async () => {
    if (!context?.user) return;
    const [cResult, sResult] = await Promise.all([
      getChakraStatus(context.user.fid.toString()),
      getMetabolicScraps()
    ]);
    if (cResult.success) setChakras(cResult.data || []);
    if (sResult.success) setScraps(sResult.data || []);
  };

  const handleAlign = async () => {
    if (!context?.user) return;
    setLoading(true);
    const result = await alignChakras(context.user.fid.toString(), Math.floor(Math.random() * 30) + 70);
    if (result.success) {
      setResonance(result.data.resonancePercentage);
      fetchData();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col space-y-6 pt-4">
      {/* Pineal Third Eye HUD */}
      <div className="vivid-glass p-6 rounded-[2rem] space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <div className="h-24 w-24 rounded-full border border-white/20 animate-pulse flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border border-white/40"></div>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Organ 14: The Pineal</h3>
          <h2 className="text-2xl font-black text-glow italic uppercase">Third Eye Status</h2>
        </div>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span>Resonance Frequency</span>
              <span className="text-white/60">{resonance}Hz</span>
            </div>
            <div className="metric-resonate">
              <div className="metric-fill" style={{ width: `${resonance}%`, backgroundColor: '#ff00ff' }}></div>
            </div>
          </div>

          <button
            onClick={handleAlign}
            disabled={loading}
            className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all"
          >
            {loading ? "ALIGNING..." : "RESONATE THIRD EYE"}
          </button>
        </div>
      </div>

      {/* Metabolic Core / Shit-Sifter */}
      <div className="vivid-glass p-6 rounded-[2rem] space-y-4 border-l-4 border-l-yellow-500/30">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Organ 15: The Metabolic</h3>
          <h2 className="text-2xl font-black italic uppercase">Intestinal Sifter</h2>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {scraps.length > 0 ? scraps.map((scrap, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 transition-all hover:border-white/20">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase text-white/40 tracking-tighter">{scrap.sourceNode}</span>
                <span className="text-[10px] font-mono text-white/80">{scrap.wasteType}</span>
              </div>
              <div className="h-1 w-8 bg-yellow-500/20 rounded-full"></div>
            </div>
          )) : (
            <div className="py-4 text-center opacity-40">
              <p className="text-[10px] uppercase tracking-[0.2em] animate-pulse">Scanning waste for gold...</p>
            </div>
          )}
        </div>

        <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] text-center pt-2">
          Metabolic loop: Tech-debt sifting active. 0 nutrients extracted today.
        </p>
      </div>

      {/* Core Oath Action */}
      <button
        onClick={async () => {
          if (!context?.user) return;
          setLoading(true);
          const res = await signOath(context.user.fid.toString(), context.user.username || "Anon");
          if (res.success) setStatus("Welcome to the Sprawl.");
          setLoading(false);
          fetchData();
        }}
        disabled={loading}
        className="btn-vivid w-full"
      >
        {loading ? "MODULATING..." : "SIGN THE OATH"}
      </button>

      {status && (
        <p className="text-center text-[10px] font-black uppercase tracking-widest animate-pulse text-white/60 italic">{status}</p>
      )}

      {/* Industrial Footer */}
      <div className="py-12 flex flex-col items-center space-y-4 opacity-30">
        <div className="h-px w-24 bg-white/20"></div>
        <p className="text-[8px] uppercase tracking-[0.5em] text-white font-black">DreamNet Intelligence Sprawl</p>
      </div>
    </div>
  );
}
