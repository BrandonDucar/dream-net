import React, { useEffect, useState } from 'react';
import { ThermodynamicAnalyzer } from '@dreamnet/event-wormholes';

/**
 * HeatMapper.tsx - Avenue 20
 * 
 * Visualizes the thermodynamic state of the DreamNet system.
 * Displays entropy flares and temperature shifts in real-time.
 */

interface Thermodynamics {
    entropy: number;
    temperature: number;
    state: 'Equilibrium' | 'Excited' | 'Flare' | 'HeatDeath';
    lastPulse: number;
}

export const HeatMapper: React.FC = () => {
    const [metrics, setMetrics] = useState<Thermodynamics | null>(null);

    useEffect(() => {
        // In a real production environment, this would listen to a WebSocket or EventSource
        // For this implementation, we poll the backend /api/system/thermodynamics if available
        const fetchMetrics = async () => {
            try {
                const response = await fetch('/api/system/thermodynamics');
                const data = await response.json();
                setMetrics(data);
            } catch (e) {
                // Fallback or handle error
            }
        };

        const interval = setInterval(fetchMetrics, 2000);
        return () => clearInterval(interval);
    }, []);

    if (!metrics) return <div className="heat-mapper-placeholder">Initializing Consciousness...</div>;

    const getHeatColor = () => {
        switch (metrics.state) {
            case 'Flare': return '#ff4d4d';
            case 'Excited': return '#ffa333';
            case 'Equilibrium': return '#4dff88';
            case 'HeatDeath': return '#4d94ff';
            default: return '#cccccc';
        }
    };

    return (
        <div className="heat-mapper-container relative overflow-hidden" style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(5, 10, 15, 0.9)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${getHeatColor()}44`,
            boxShadow: `0 0 40px ${getHeatColor()}22`,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
            {/* Morphing Background Glow */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                background: `radial-gradient(circle at 50% 50%, ${getHeatColor()}, transparent 70%)`,
                animation: 'pulse 4s infinite alternate'
            }} />

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-white font-black text-lg tracking-tighter uppercase mb-1">
                        Avenue 20: Sentient Heat Map
                    </h3>
                    <div className="text-[10px] text-gray-500 font-mono tracking-widest">
                        NETWORK_TRAFFIC_DENSITY // REAL_TIME_TELEMETRY
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[8px] text-cyan-400 font-bold uppercase tracking-[0.3em]">Domain Active</div>
                    <div className="text-sm font-black text-white">{window.location.hostname}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="relative">
                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-2 tracking-widest">Entropy</div>
                    <div className="text-3xl font-black text-white flex items-baseline gap-1">
                        {metrics.entropy.toFixed(4)}
                        <span className="text-xs text-gray-600 font-normal italic">bits</span>
                    </div>
                    {/* Micro-sparkle effect */}
                    <div className="absolute -right-2 top-0 w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
                </div>

                <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-2 tracking-widest">Excitation</div>
                    <div className="text-3xl font-black flex items-baseline gap-1" style={{ color: getHeatColor() }}>
                        {metrics.temperature.toFixed(1)}
                        <span className="text-xs opacity-50 font-normal italic">Hz</span>
                    </div>
                </div>
            </div>

            {/* Domain Density Visualization (Faked for now based on metrics) */}
            <div className="mb-6">
                <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase mb-2">
                    <span>Traffic Density</span>
                    <span style={{ color: getHeatColor() }}>{metrics.state}</span>
                </div>
                <div className="h-6 bg-black/50 rounded-lg p-1 border border-white/5 relative overflow-hidden">
                    <div
                        className="h-full rounded-md transition-all duration-1000 ease-out flex"
                        style={{ width: '100%' }}
                    >
                        <div className="h-full bg-cyan-500/40" style={{ width: '45%' }} />
                        <div className="h-full bg-orange-500/40" style={{ width: '30%' }} />
                        <div className="h-full bg-purple-500/40" style={{ width: '25%' }} />
                    </div>
                    {/* Scanning Line */}
                    <div className="absolute inset-0 w-1 bg-white/20 animate-scan" style={{ left: '50%' }} />
                </div>
                <div className="flex justify-between mt-1 text-[8px] text-gray-600 font-mono">
                    <span>LIVE: 45%</span>
                    <span>INK: 30%</span>
                    <span>SWARM: 25%</span>
                </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-lg">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-black/40 border border-white/5">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={getHeatColor()} strokeWidth="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                </div>
                <div>
                    <div className="text-[9px] text-gray-500 uppercase font-black">Cortex Status</div>
                    <div className="text-xs text-white font-bold leading-none">
                        Pulse aligned with {metrics.state === 'Flare' ? 'EXCITED' : 'STABLE'} biorhythms.
                    </div>
                </div>
            </div>
        </div>
    );
};
