
import { useState, useEffect, useRef } from 'react';
import './index.css';
import heroBg from './assets/hero-bg.png';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';

interface SwarmLog {
  id: string;
  source: string;
  message: string;
  timestamp: string;
  type?: string;
}

function App() {
  const [thoughts, setThoughts] = useState<SwarmLog[]>([]);
  const [connected, setConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Priority: Environmental API URL -> Localhost fallback
    // Note: Dashboards often use Port 5000 for the Control Core Bridge
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    console.log(`📡 [DreamNet Portal] Attempting link to: ${socketUrl}`);

    const socketInstance = io(socketUrl);

    socketInstance.on('connect', () => {
      setConnected(true);
      console.log('🌌 [DreamNet Portal] Grid Handshake Established.');
    });

    socketInstance.on('swarm_log', (log: SwarmLog) => {
      // Map server source to portal icon types for visual feedback
      const typeMap: Record<string, string> = {
        'PICKLEBALLORACLE': 'witness',
        'WOLFPACKFUNDING': 'scout',
        'DREAMBETORACLE': 'hub',
        'CORE': 'hub',
        'GENOME_PILOT': 'scout',
        'NERVE': 'witness'
      };

      const portalLog = {
        ...log,
        type: typeMap[log.source.toUpperCase()] || 'witness'
      };

      setThoughts(prev => [portalLog, ...prev].slice(0, 50));
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
      console.warn('⚠️ [DreamNet Portal] Grid Link Severed.');
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Soft scroll to top when new thoughts arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [thoughts]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black selection:bg-lime-500 selection:text-black">
      {/* Background Layer */}
      <div
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-black/20 via-black/80 to-black pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 cyber-container">
        {/* Header */}
        <header className="flex justify-between items-center mb-16 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-lime-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.6)]">
              <span className="text-black font-black">DN</span>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">DreamNet</h1>
              <span className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-500">Agentic Sovereignty</span>
            </div>
          </div>
          <nav className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-widest">
            <a href="https://dreamnet.ink/miniapps/ohara/picklebet-casino" className="text-lime-400 hover:text-white transition-colors">The Arena</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">The Vault</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Governance</a>
          </nav>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-lime-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                {connected ? 'Syncing to Grid' : 'Link Offline'}
              </span>
            </div>
            <button className="btn-sovereign text-xs">Enter Portal</button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="mb-24 text-center md:text-left max-w-2xl">
          <h2 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.9] tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Witness <br />
            <span className="text-glow-lime text-lime-400">The Truth.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            DreamNet is the world's first agent-driven ecosystem for real-time witnessing,
            sovereign betting, and autonomous revenue generation.
          </p>
          <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <a href="https://dreamnet.ink/miniapps/ohara/picklebet-casino" className="btn-sovereign px-10">Launch PickleBet</a>
            <button className="px-10 py-4 glass-panel border-lime-500/20 text-lime-400 font-black uppercase text-xs hover:border-lime-500 transition-all">
              Deep Seeking Stats
            </button>
          </div>
        </section>

        {/* Live Thinking Stream */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-panel p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Metabolic Rate</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-1 h-3 ${i < 4 ? 'bg-lime-500' : 'bg-white/10'}`} />)}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-lime-400">The Global Pulse</h3>
              <span className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                <span className={`w-2 h-2 rounded-full ${connected ? 'bg-red-500 animate-pulse' : 'bg-gray-800'}`} /> Live Stream
              </span>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar" ref={scrollRef}>
              {thoughts.length > 0 ? (
                thoughts.map((t, idx) => (
                  <div key={t.id} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-lime-500/30 hover:bg-white/[0.04] transition-all group animate-in slide-in-from-left duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="text-2xl opacity-30 group-hover:opacity-100 transition-opacity">
                      {t.type === 'witness' ? '👁️' : t.type === 'scout' ? '🐺' : '🌍'}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <div className="text-[10px] font-black uppercase text-lime-400/70">{t.source}</div>
                        <div className="text-[9px] font-mono text-gray-600">[{t.timestamp}]</div>
                      </div>
                      <p className="text-sm font-medium text-gray-300 leading-relaxed">{t.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                  <div className="text-5xl mb-4 animate-bounce">📡</div>
                  <div className="text-[10px] uppercase font-black tracking-[0.5em]">Establishing Neural Uplink...</div>
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel p-8 border-purple-500/20">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-purple-400">Sovereign Vault</h3>
              <div className="text-[8px] font-black text-gray-600 bg-white/5 px-2 py-1 rounded">HOT WALLET</div>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Chiliz', val: '24,500 CHZ', color: 'var(--neon-lime)', progress: 85 },
                { label: 'Solana', val: '142.5 SOL', color: 'var(--cyber-blue)', progress: 62 },
                { label: 'Bitcoin', val: '0.042 BTC', color: '#f59e0b', progress: 40 }
              ].map(w => (
                <div key={w.label} className="group cursor-help">
                  <div className="flex justify-between text-[10px] font-black uppercase text-gray-500 mb-2 group-hover:text-gray-300 transition-colors">
                    <span>{w.label}</span>
                    <span className="text-gray-700">Active</span>
                  </div>
                  <div className="text-2xl font-black font-mono tracking-tighter group-hover:text-glow-purple transition-all">{w.val}</div>
                  <div className="h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${w.progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                      style={{ background: w.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase mb-4">
                <span>Revenue Cycle</span>
                <span className="text-lime-500">IGNITION</span>
              </div>
              <div className="p-4 rounded-xl bg-lime-500/5 border border-lime-500/10 text-center">
                <div className="text-xs font-black text-lime-400 mb-1">Total Sovereign Yield</div>
                <div className="text-xl font-black text-white">$12,842.00</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 pb-12 border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600">
          <p className="text-[10px] font-black uppercase tracking-[0.5em]">
            © 2026 DreamNet Labs // Operation Event Horizon
          </p>
          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Whitepaper</a>
            <a href="#" className="hover:text-white transition-colors">Terminal</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
