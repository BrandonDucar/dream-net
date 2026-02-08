import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Activity,
  Shield,
  Zap,
  Cpu,
  Globe,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Maximize2,
  RefreshCw,
  Box,
  Layers,
  Database
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Task {
  id: string;
  title: string;
  assignee: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  timestamp: string;
}

interface WorkspacePackage {
  name: string;
  status: 'healthy' | 'issue' | 'building';
  version: string;
  type: string;
}

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'tasks' | 'registry' | 'logs' | 'expansion'>('telemetry');
  const [commandInput, setCommandInput] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Initialize query client for invalidation
  const queryClient = useQueryClient();

  // Fetch real workspace data
  const { data: workspaceData, isLoading: workspaceLoading } = useQuery({
    queryKey: ['/api/ops/workspaces'],
    queryFn: async () => {
      const resp = await fetch('/api/ops/workspaces');
      if (!resp.ok) throw new Error('Failed to fetch workspaces');
      return resp.json();
    }
  });

  // Fetch real task data
  const { data: taskData, isLoading: taskLoading } = useQuery({
    queryKey: ['/api/ops/tasks'],
    queryFn: async () => {
      const resp = await fetch('/api/ops/tasks');
      if (!resp.ok) throw new Error('Failed to fetch tasks');
      return resp.json();
    }
  });

  // Fetch expansion vertical data
  const { data: expansionData, isLoading: expansionLoading } = useQuery({
    queryKey: ['/api/ops/expansion'],
    queryFn: async () => {
      const resp = await fetch('/api/ops/expansion');
      if (!resp.ok) throw new Error('Failed to fetch expansion data');
      return resp.json();
    }
  });

  const verticals = expansionData?.verticals || [];

  // Execute Command Mutation
  const executeMutation = useMutation({
    mutationFn: async (command: string) => {
      const resp = await fetch('/api/ops/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });
      return resp.json();
    },
    onSuccess: (data) => {
      addLog(`[SYSTEM] Command Accepted: ${data.message || 'Success'}`);
      queryClient.invalidateQueries({ queryKey: ['/api/ops/tasks'] });
    }
  });

  // SSE Implementation
  useEffect(() => {
    const eventSource = new EventSource('/api/ops/stream');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      addLog(`[${data.type}] ${data.message}`);
    };
    return () => eventSource.close();
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-99), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    executeMutation.mutate(commandInput.toLowerCase());
    setCommandInput('');
  };

  const workspaces = workspaceData?.workspaces || [];
  const tasks = taskData?.tasks || [];

  // Simulate Cognitive Flux
  const [flux, setFlux] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setFlux(Math.random() * 100);
      if (Math.random() > 0.7) {
        const agentMsgs = [
          "WOLF_PACK: Scan complete. No type hazards detected in @dreamnet/shared.",
          "AI_SURGEON: Injecting stability patches to server/src/vite.ts.",
          "ORCHESTRATOR: Balancing load across 27 workspace nodes.",
          "SYSTEM: Harmonic convergence achieved in 12ms."
        ];
        addLog(`[AGENT] ${agentMsgs[Math.floor(Math.random() * agentMsgs.length)]}`);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#06080A] text-white font-mono p-4 md:p-8 overflow-hidden flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Background Pulse */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-950/20 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-950/20 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-6 relative z-10 glass-panel px-6 py-4 rounded-2xl bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-800 flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(34,211,238,0.2)] group-hover:scale-110 transition-transform">
            <Cpu className="text-white w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              AGENTIC_IDE // <span className="text-cyan-400">GRAV_CENTRAL</span>
            </h1>
            <div className="flex items-center gap-3 text-[10px] text-cyan-400 tracking-[0.3em] font-bold mt-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]"></span>
              CORE_SYNC: STABLE // LATENCY: 4MS // NODES: 27
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="px-6 py-2 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-[10px] font-black tracking-widest flex items-center gap-3 active:scale-95">
            <RefreshCw className="w-3 h-4" /> RELOAD_GRID_MESH
          </button>
          <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black rounded-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all text-[10px] font-black tracking-widest flex items-center gap-3 active:scale-95">
            <Plus className="w-4 h-4" /> NEW_SUBSTRATE_TASK
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 overflow-hidden">
        {/* Sidebar Nav */}
        <nav className="lg:col-span-2 space-y-3">
          {[
            { id: 'telemetry', icon: Activity, label: 'SYSTEM_GRID' },
            { id: 'tasks', icon: Layers, label: 'SWARM_TASKS' },
            { id: 'registry', icon: Database, label: 'AGENT_BIOS' },
            { id: 'logs', icon: Terminal, label: 'NEURAL_STREAMS' },
            { id: 'expansion', icon: Globe, label: 'EXPANSION_MARKET' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl border transition-all text-xs font-black tracking-[0.2em] relative group ${activeTab === item.id
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.1)]'
                : 'bg-white/5 border-transparent text-gray-500 hover:border-white/10 hover:text-gray-300'
                }`}
            >
              {activeTab === item.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,1)]"></div>}
              <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'animate-pulse' : ''}`} />
              {item.label}
            </button>
          ))}

          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-blue-900/10 to-black border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-12 h-12 text-cyan-500" />
            </div>
            <h3 className="text-[10px] text-gray-500 mb-4 tracking-widest uppercase font-black">NEURAL_LOAD</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-[10px] mb-2 font-bold uppercase">
                  <span className="text-gray-400">COGNITIVE_FLUX</span>
                  <span className="text-cyan-400">{flux.toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)] transition-all duration-500" style={{ width: `${flux}%` }}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 rounded bg-white/5 border border-white/5 text-center">
                  <div className="text-[8px] text-gray-600 font-black uppercase">Agents</div>
                  <div className="text-xs font-bold text-white">42</div>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/5 text-center">
                  <div className="text-[8px] text-gray-600 font-black uppercase">Uptime</div>
                  <div className="text-xs font-bold text-white">12.4h</div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <section className="lg:col-span-7 flex flex-col gap-8 h-full">
          <AnimatePresence mode="wait">
            {activeTab === 'expansion' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {verticals.map((v: any) => (
                  <div key={v.id} className="p-6 border border-white/10 rounded-xl bg-black/40 hover:border-cyan-500/50 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-[9px] text-cyan-500 font-black tracking-widest mb-1 italic uppercase">{v.status}_VECTOR</div>
                        <h3 className="text-lg font-black tracking-tighter text-white group-hover:text-cyan-400 transition-colors uppercase">{v.name}</h3>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_cyan]" />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {v.agents.map((agent: string) => (
                        <span key={agent} className="text-[8px] bg-white/5 px-2 py-1 rounded-full border border-white/10 font-black text-gray-400 uppercase">
                          {agent}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button className="text-[10px] font-black text-white px-4 py-2 border border-white/20 hover:bg-white/10 transition-all tracking-[0.2em] uppercase">
                        RESONATE_VALUE
                      </button>

                    </div>
                  </div>
                ))}
              </motion.div>
            )}
            {activeTab === 'telemetry' && (
              <motion.div
                key="telemetry"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min"
              >
                {workspaces.map((pkg) => (
                  <div key={pkg.name} className="p-6 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] hover:border-cyan-500/40 transition-all group cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                          <Box className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-black text-sm tracking-tight block">{pkg.name}</span>
                          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{pkg.type} MODULE</span>
                        </div>
                      </div>
                      <div className={`text-[9px] font-black px-2 py-1 rounded bg-black/60 border ${pkg.status === 'healthy' ? 'border-green-500/50 text-green-400' : 'border-yellow-500/50 text-yellow-400'
                        } shadow-[0_0_10px_rgba(34,197,94,0.1)]`}>
                        {pkg.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] bg-black/40 p-3 rounded-lg border border-white/5">
                      <div className="flex items-center gap-1.5"><span className="text-gray-600 font-black uppercase">Build:</span> <span className="text-green-400 font-bold">SUCCESS</span></div>
                      <div className="flex items-center gap-1.5"><span className="text-gray-600 font-black uppercase">Ver:</span> <span className="text-white font-bold">{pkg.version}</span></div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'tasks' && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4 h-full"
              >
                {tasks.map((task) => (
                  <div key={task.id} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] flex justify-between items-center group hover:bg-white/[0.06] transition-all relative overflow-hidden">
                    {task.status === 'active' && <div className="absolute left-0 top-0 w-1 h-full bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>}
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner ${task.status === 'completed' ? 'border-green-500/30 bg-green-500/5 text-green-500' :
                        task.status === 'active' ? 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400 animate-pulse' :
                          'border-white/10 bg-white/5 text-gray-600'
                        }`}>
                        {task.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : task.status === 'active' ? <Activity className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-black text-lg tracking-tight group-hover:text-cyan-400 transition-colors uppercase italic">{task.title}</h4>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase mt-2 tracking-widest">
                          <span className="flex items-center gap-2 text-cyan-500 group-hover:text-white transition-colors"><Shield className="w-3 h-3" /> {task.assignee}</span>
                          <span className="opacity-30">|</span>
                          <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {new Date(task.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded border border-white/10 ${task.status === 'active' ? 'bg-cyan-500 text-black border-cyan-500' : 'text-gray-500'}`}>
                        {task.status.toUpperCase()}
                      </span>
                      <button className="p-3 rounded-xl bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-cyan-500 hover:text-black hover:border-cyan-500">
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'registry' && (
              <motion.div
                key="registry"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {[
                  { name: 'WOLF_PACK', focus: 'Hardening & Stabilization', icon: Zap },
                  { name: 'AI_SURGEON', focus: 'Type Safety & Diagnostics', icon: Shield },
                  { name: 'ORCHESTRATOR', focus: 'Load Balancing & Mesh Sync', icon: Layers },
                  { name: 'DREAMKEEPER', focus: 'Persistence & DB Health', icon: Database },
                  { name: 'VELO_CONDUCTOR', focus: 'Vibe & Aesthetic Conduction', icon: Activity },
                  { name: 'GRAV_PRIME', focus: 'Self-Improvement & Evolution', icon: Cpu }
                ].map((agent) => (
                  <div key={agent.name} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] transition-all group">
                    <agent.icon className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-125 transition-transform" />
                    <h4 className="font-black text-xs tracking-widest uppercase mb-1">{agent.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{agent.focus}</p>
                    <div className="mt-4 flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-cyan-400 animate-ping"></div>
                      <div className="text-[8px] text-cyan-400/60 font-black">HEARTBEAT_ACTIVE</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'logs' && (
              <motion.div
                key="logs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full bg-black/60 rounded-3xl border border-white/10 p-8 font-mono text-xs overflow-hidden flex flex-col"
              >
                <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide mb-6">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-gray-800 font-black">0x{i.toString(16).padStart(2, '0')}</span>
                      <span className="text-gray-400">{log}</span>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleExecute} className="mt-6 pt-6 border-t border-white/10 flex gap-4 items-center">
                  <span className="text-cyan-500 font-black animate-pulse">❯</span>
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="EXECUTE_SOVEREIGN_COMMAND..."
                    className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-800 font-black uppercase tracking-widest text-[9px]"
                  />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Console / Activity Stream (Side Panel - Personal Telemetry) */}
        <section className="lg:col-span-3 h-full flex flex-col gap-6">
          <div className="flex-1 rounded-3xl border border-white/5 bg-black/60 p-6 font-mono text-[10px] flex flex-col relative overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.02] to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">
              <div className="flex items-center gap-3 text-cyan-400">
                <Shield className="w-4 h-4" /> GRAV_METRICS
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[8px] font-black tracking-widest text-gray-600">
                  <span>NEURAL_CAPACITY</span>
                  <span>14.2/128K</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500/50 w-[12%]"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[8px] font-black tracking-widest text-gray-600">
                  <span>EVOLUTION_SPEED</span>
                  <span>9.2 TFLOPS</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500/50 w-[45%]"></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <h5 className="text-[8px] text-gray-500 font-black tracking-widest mb-3 uppercase">Priority_Directives</h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> STABILIZE_SUBSTRATE
                  </div>
                  <div className="flex items-center gap-2 text-blue-400 font-bold">
                    <Activity className="w-3 h-3" /> MONITOR_SWARM
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 font-bold">
                    <Zap className="w-3 h-3" /> TRIGGER_UPGRADE
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="text-[8px] text-gray-700 font-black tracking-[0.2em] mb-2 uppercase">Current_Objective</div>
              <div className="p-3 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-black italic tracking-tight">
                "Orchestrating the Sovereign Command Center to enable high-fidelity agentic control."
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-tr from-cyan-950/20 via-black to-blue-950/20 overflow-hidden relative group cursor-pointer hover:border-cyan-500/30 transition-all">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <Globe className="w-10 h-10 text-cyan-500 mb-4 animate-spin-slow" />
              <h4 className="text-xs font-black tracking-[0.4em] uppercase mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-white">GRID_OS_MESH_ACTIVE</h4>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,1)]"></div>
                <p className="text-[10px] text-gray-500 font-bold tracking-tighter">BROADCASTING_SIGNAL_AT_142.3.9.1</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        .glass-panel {
          background: rgba(0, 0, 0, 0.4);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}