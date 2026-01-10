import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { DreamCube } from '@/components/DreamCube';

interface Nutrient {
  source: string;
  metric: string;
  value: number;
  sentiment: string;
}

const Home: React.FC = () => {
  const [posture, setPosture] = useState<'idle' | 'attack' | 'resonate'>('idle');
  const [nutrients, setNutrients] = useState<Nutrient[]>([]);
  const [lastSignal, setLastSignal] = useState<string>("WAITING_FOR_SYNAPSE");

  useEffect(() => {
    // Establishing the Borg Synapse (SSE)
    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL || '/api'}/god-view/stream`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'NERVE_EVENT') {
        setLastSignal(data.kind);

        // Reactive Posturing Logic
        if (data.kind === 'NUTRIENT_INTAKE') {
          setPosture('resonate');
          setNutrients(prev => [data.payload as Nutrient, ...prev].slice(0, 3));
          setTimeout(() => setPosture('idle'), 3000); // Return to idle
        } else if (data.kind === 'SHIELD_PHASE_TICK' || data.kind === 'THREAT_DETECTED') {
          setPosture('attack');
          setTimeout(() => setPosture('idle'), 5000);
        } else if (data.kind === 'METRIC_SNAPSHOT' && data.payload.metricName === 'heart_rate') {
          // Subtle pulse? (Could be added to CSS)
        }
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Connection Failed:", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="relative isolate min-h-screen bg-black">
      {/* Hero Section - The Unimatrix */}
      <section className="relative flex flex-col lg:flex-row items-center justify-center text-center lg:text-left min-h-screen px-6 py-20 overflow-hidden">
        {/* Deep industrial backdrop */}
        <div className="absolute inset-0 -z-10 bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,243,255,0.05)_0%,transparent_100%)]"></div>
          <div className={`absolute top-0 w-full h-1/2 bg-gradient-to-b ${posture === 'attack' ? 'from-red-900/40' : posture === 'resonate' ? 'from-purple-900/40' : 'from-cyan-900/10'} to-transparent transition-colors duration-1000 animate-pulse`}></div>
        </div>

        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* The Text Side */}
          <div className="space-y-8 z-10 order-2 lg:order-1">
            <div className="space-y-2">
              <h3 className={`text-xs font-black uppercase tracking-[0.5em] animate-pulse transition-colors duration-1000 ${posture === 'attack' ? 'text-red-500' : posture === 'resonate' ? 'text-pink-500' : 'text-cyan-500'}`}>
                Neural Signal: {lastSignal}
              </h3>
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black mb-4 drop-shadow-2xl text-white italic uppercase leading-none tracking-tighter">
                DreamNet <span className={`text-transparent bg-clip-text bg-gradient-to-r ${posture === 'attack' ? 'from-red-500 to-orange-500' : posture === 'resonate' ? 'from-pink-500 to-purple-500' : 'from-cyan-400 to-purple-500'} transition-all duration-1000`}>Unimatrix</span>.
              </h1>
            </div>

            <p className="text-lg sm:text-xl md:text-2xl max-w-xl text-slate-400 font-mono tracking-tight">
              A collective-mind architecture synchronized via the Nerve Spine. Reactive Liquid Glass panels reconfigure based on planetary supplements and world sentiment.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <div className="flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
                {(['idle', 'attack', 'resonate'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPosture(p)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${posture === p ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'text-white/40 hover:text-white'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Planetary Supplements Display */}
            {nutrients.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-white/5 max-w-sm">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Nutrient Intake:</h4>
                {nutrients.map((n, i) => (
                  <div key={i} className="flex justify-between items-center text-[11px] font-mono p-3 bg-white/5 rounded-lg border border-white/5">
                    <span className="text-cyan-400">{n.source}</span>
                    <span className="text-white/40">{n.metric}:</span>
                    <span className="text-white">{n.value.toFixed(2)}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] ${n.sentiment === 'optimistic' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {n.sentiment.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Link
                to="/onboard"
                className="px-8 py-4 rounded-full bg-white text-black font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 text-xs"
              >
                Join Hive
              </Link>
              <Link
                to="/dashboard"
                className="px-8 py-4 rounded-full border border-white/20 text-white font-black uppercase tracking-widest transition-all hover:bg-white/5 text-xs"
              >
                Observatory
              </Link>
            </div>
          </div>

          {/* The Shashibo Cube Side */}
          <div className="flex justify-center items-center order-1 lg:order-2">
            <div className="relative">
              {/* Cinematic Glow */}
              <div className={`absolute inset-0 blur-[150px] animate-pulse transition-colors duration-1000 ${posture === 'attack' ? 'bg-red-500/30' : posture === 'resonate' ? 'bg-pink-500/30' : 'bg-cyan-500/10'}`}></div>
              <DreamCube posture={posture} />

              {/* Floating HUD Telemetry */}
              <div className="absolute -top-10 -right-10 hidden xl:block p-4 vivid-glass rounded-2xl border border-white/10 text-[10px] space-y-1 font-mono">
                <div className={`${posture === 'attack' ? 'text-red-500' : posture === 'resonate' ? 'text-pink-500' : 'text-cyan-400'}`}>Vessel: DREAM_UNIMATRIX</div>
                <div className="text-white/40">STATUS: {posture.toUpperCase()}</div>
                <div className="text-white/40">MASS: {posture === 'attack' ? '1.4x' : '1.0x'}</div>
                <div className="text-white/40">MATERIAL: LIQUID_GLASS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Pillars Section */}
      <section className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Military Card */}
          <Link
            to="/military"
            className="flex flex-col justify-between h-full rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-md hover:shadow-xl transition-shadow p-4"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2 text-white">Military</h3>
              <p className="text-sm text-slate-400">
                Defense protocols driven by the Borg Collective.
              </p>
            </div>
          </Link>
          {/* Travel Card */}
          <Link
            to="/travel"
            className="flex flex-col justify-between h-full rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-md hover:shadow-xl transition-shadow p-4"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2 text-white">Travel</h3>
              <p className="text-sm text-slate-400">
                Wormhole navigation across mapped space.
              </p>
            </div>
          </Link>
          {/* Science Card */}
          <Link
            to="/science"
            className="flex flex-col justify-between h-full rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-md hover:shadow-xl transition-shadow p-4"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2 text-white">Science</h3>
              <p className="text-sm text-slate-400">
                Planetary intake processing from NASA & Agri sensors.
              </p>
            </div>
          </Link>
          {/* Crypto Card */}
          <Link
            to="/crypto"
            className="flex flex-col justify-between h-full rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-md hover:shadow-xl transition-shadow p-4"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2 text-white">Crypto</h3>
              <p className="text-sm text-slate-400">
                Economic pulses fueled by the Heart's Octopus Arms.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
