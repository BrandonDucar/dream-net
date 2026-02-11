import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, Zap, Brain } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';

export function MetabolicOverlay() {
    const { walletAddress } = useAuth();

    useEffect(() => {
        const fetchScent = async () => {
            try {
                const wallet = walletAddress || 'GLOBAL_SWARM';
                const res = await fetch(`/api/antigravity/pheromone/score/${wallet}`);
                const data = await res.json();
                setMetrics(prev => ({
                    ...prev,
                    scent: data.score || 0,
                    tier: data.tier || 'LARVA'
                }));
            } catch (e) {
                // Fallback to random walk if API fails
            }
        };

        const interval = setInterval(() => {
            setMetrics(prev => ({
                ...prev,
                pulse: 80 + Math.floor(Math.random() * 20),
                load: 35 + Math.floor(Math.random() * 15),
                energy: prev.energy - 1 + (Math.random() > 0.8 ? 5 : 0),
                consensus: 0.98 + Math.random() * 0.02,
            }));
            fetchScent();
        }, 3000);
        return () => clearInterval(interval);
    }, [walletAddress]);

    return (
        <div className="absolute top-20 left-4 z-30 pointer-events-none">
            <div className="flex flex-col gap-4">
                <MetricItem
                    icon={<Activity className="w-3 h-3 text-cyan-500" />}
                    label="Swarm Pulse"
                    value={`${metrics.pulse} BPM`}
                    color="cyan"
                />
                <MetricItem
                    icon={<Cpu className="w-3 h-3 text-purple-500" />}
                    label="Kinetic Load"
                    value={`${metrics.load}%`}
                    color="purple"
                />
                <MetricItem
                    icon={<Zap className="w-3 h-3 text-yellow-500" />}
                    label="Energy Flux"
                    value={`${metrics.energy} MW`}
                    color="yellow"
                />
                <MetricItem
                    icon={<Brain className="w-3 h-3 text-green-500" />}
                    label="Consensus"
                    value={`${(metrics.consensus * 100).toFixed(1)}%`}
                    color="green"
                />
                <MetricItem
                    icon={<Zap className="w-3 h-3 text-orange-500" />}
                    label={`Swarm Scent (${metrics.tier})`}
                    value={`${metrics.scent.toFixed(2)} SCENT`}
                    color="orange"
                />
            </div>
        </div>
    );
}

function MetricItem({ icon, label, value, color }: any) {
    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/5 py-1 px-3 rounded-lg"
        >
            <div className="p-1 rounded bg-white/5">{icon}</div>
            <div className="flex flex-col">
                <span className="text-[7px] uppercase font-black text-zinc-500 tracking-widest">{label}</span>
                <span className={`text-[10px] font-bold text-${color}-400/90 font-mono`}>{value}</span>
            </div>
        </motion.div>
    );
}
