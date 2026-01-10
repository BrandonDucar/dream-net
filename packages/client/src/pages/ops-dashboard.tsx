import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, AlertTriangle, Shield, Zap, Server, Database, Brain, Clock } from 'lucide-react';

interface GoldenSignals {
    traffic: {
        total_requests: number;
        rps: number;
        by_endpoint: Record<string, number>;
    };
    errors: {
        total_errors: number;
        error_rate: number;
        by_endpoint: Record<string, number>;
    };
    latency: {
        p50: number;
        p95: number;
        p99: number;
        samples_count: number;
    };
    saturation: {
        memory: {
            rss: number;
            heapTotal: number;
            heapUsed: number;
        };
        cpu: {
            user: number;
            system: number;
        };
    };
}

interface WatchdogStats {
    queue_depth: number;
    ai_latency: {
        p95: number;
        samples: number;
    };
    circuit_breakers: Record<string, 'closed' | 'open' | 'half_open'>;
    health_gates: Record<string, 'open' | 'closed'>;
    rollouts: Record<string, number>;
}

export default function OpsDashboard() {
    const [signals, setSignals] = useState<GoldenSignals | null>(null);
    const [watchdogs, setWatchdogs] = useState<WatchdogStats | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const fetchData = async () => {
        try {
            const [signalsRes, watchdogsRes] = await Promise.all([
                fetch('/api/observability/golden-signals'),
                fetch('/api/observability/watchdogs')
            ]);

            const signalsData = await signalsRes.json();
            const watchdogsData = await watchdogsRes.json();

            setSignals(signalsData);
            setWatchdogs(watchdogsData);
            setLastUpdate(new Date());

            // Update history for charts
            setHistory(prev => {
                const newPoint = {
                    time: new Date().toLocaleTimeString(),
                    rps: signalsData.traffic.rps,
                    latency: signalsData.latency.p95,
                    errors: signalsData.errors.error_rate * 100
                };
                const newHistory = [...prev, newPoint];
                return newHistory.slice(-20); // Keep last 20 points
            });
        } catch (error) {
            console.error('Failed to fetch metrics:', error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!signals || !watchdogs) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <Activity className="w-12 h-12 text-blue-500 mb-4" />
                    <p>Loading Ops Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 font-sans">
            <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-blue-500" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        DreamNet Ops Center
                    </h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        System Online
                    </div>
                    <div>Updated: {lastUpdate.toLocaleTimeString()}</div>
                </div>
            </header>

            {/* Golden Signals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <MetricCard
                    title="Traffic (RPS)"
                    value={signals.traffic.rps.toFixed(2)}
                    icon={<Activity className="text-blue-400" />}
                    trend={signals.traffic.total_requests}
                    trendLabel="total reqs"
                />
                <MetricCard
                    title="Latency (p95)"
                    value={`${signals.latency.p95.toFixed(0)}ms`}
                    icon={<Clock className="text-yellow-400" />}
                    trend={signals.latency.p99.toFixed(0)}
                    trendLabel="p99 ms"
                />
                <MetricCard
                    title="Error Rate"
                    value={`${(signals.errors.error_rate * 100).toFixed(2)}%`}
                    icon={<AlertTriangle className={signals.errors.error_rate > 0.01 ? "text-red-500" : "text-green-400"} />}
                    trend={signals.errors.total_errors}
                    trendLabel="total errors"
                    alert={signals.errors.error_rate > 0.01}
                />
                <MetricCard
                    title="Saturation (Heap)"
                    value={`${(signals.saturation.memory.heapUsed / 1024 / 1024).toFixed(0)}MB`}
                    icon={<Server className="text-purple-400" />}
                    trend={(signals.saturation.memory.heapTotal / 1024 / 1024).toFixed(0)}
                    trendLabel="total MB"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" /> Traffic & Latency
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="colorRps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="time" stroke="#666" fontSize={12} />
                                <YAxis yAxisId="left" stroke="#3b82f6" fontSize={12} />
                                <YAxis yAxisId="right" orientation="right" stroke="#eab308" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area yAxisId="left" type="monotone" dataKey="rps" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRps)" />
                                <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#eab308" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" /> System Health
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <StatusItem label="Database Circuit" status={watchdogs.circuit_breakers.db} icon={<Database />} />
                    <StatusItem label="OpenAI Circuit" status={watchdogs.circuit_breakers.openai} icon={<Brain />} />
                    <StatusItem label="Event Bus Circuit" status={watchdogs.circuit_breakers.event_bus} icon={<Zap />} />
                    <div className="bg-black/40 rounded-lg p-3 border border-gray-800">
                        <div className="text-gray-400 text-sm mb-1">Queue Depth</div>
                        <div className="text-2xl font-mono">{watchdogs.queue_depth}</div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Health Gates</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <GateItem label="Global Traffic" status={watchdogs.health_gates?.global || 'open'} />
                        <GateItem label="Checkout" status={watchdogs.health_gates?.checkout || 'open'} />
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Active Rollouts</h4>
                    <div className="space-y-2">
                        <RolloutItem label="New Search API" percentage={watchdogs.rollouts?.['search-v2'] || 0} />
                        <RolloutItem label="Agent V2" percentage={watchdogs.rollouts?.['agent-v2'] || 0} />
                    </div>
                </div>
            </div>
        </div>

    );
}

function MetricCard({ title, value, icon, trend, trendLabel, alert = false }: any) {
    return (
        <div className={`bg-gray-900/50 border ${alert ? 'border-red-500/50 bg-red-900/10' : 'border-gray-800'} rounded-xl p-4 transition-all hover:border-gray-700`}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-gray-400 text-sm">{title}</span>
                {icon}
            </div>
            <div className="text-3xl font-bold mb-2 font-mono">{value}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
                <span className="text-gray-300">{trend}</span> {trendLabel}
            </div>
        </div>
    );
}

function StatusItem({ label, status, icon }: any) {
    const getColor = (s: string) => {
        switch (s) {
            case 'closed': return 'text-green-400 border-green-900/30 bg-green-900/10';
            case 'open': return 'text-red-400 border-red-900/30 bg-red-900/10';
            case 'half_open': return 'text-yellow-400 border-yellow-900/30 bg-yellow-900/10';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg border ${getColor(status)}`}>
            <div className="flex items-center gap-2">
                {React.cloneElement(icon, { className: "w-4 h-4" })}
                <span className="text-sm font-medium">{label}</span>
            </div>
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-black/20">
                {status}
            </span>
        </div>
    );
}

function GateItem({ label, status }: any) {
    const isOpen = status === 'open';
    return (
        <div className={`flex items-center justify-between p-2 rounded border ${isOpen ? 'border-green-900/30 bg-green-900/5' : 'border-red-900/30 bg-red-900/5'}`}>
            <span className="text-xs text-gray-400">{label}</span>
            <span className={`text-xs font-mono uppercase ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
                {status}
            </span>
        </div>
    );
}

function RolloutItem({ label, percentage }: any) {
    return (
        <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-400 w-24">{label}</span>
            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
            <span className="text-gray-300 font-mono">{percentage}%</span>
        </div>
    );
}
