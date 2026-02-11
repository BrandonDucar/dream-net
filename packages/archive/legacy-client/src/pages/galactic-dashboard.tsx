
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Activity, Zap, Radio, Globe, Heart, Wrench, Crosshair } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface NerveEvent {
    id: string;
    type: string;
    sender: string;
    payload: any;
    timestamp: number;
}

interface NerveStats {
    activeChannels: string[];
    subscriberCount: number;
    eventCount: number;
}

export default function GalacticDashboard() {
    const { toast } = useToast();
    const [stats, setStats] = useState<NerveStats | null>(null);
    const [events, setEvents] = useState<NerveEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Initial Fetch
    useEffect(() => {
        fetchNerveData();
        const interval = setInterval(fetchNerveData, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    const fetchNerveData = async () => {
        try {
            const [statsRes, eventsRes] = await Promise.all([
                fetch('/api/nerve/stats'),
                fetch('/api/nerve/recent-events?limit=10')
            ]);

            if (statsRes.ok) {
                const data = await statsRes.json();
                if (data.success) setStats(data.stats);
            }

            if (eventsRes.ok) {
                const data = await eventsRes.json();
                if (data.success) setEvents(data.events);
            }
        } catch (error) {
            console.error("Failed to fetch nerve data", error);
        }
    };

    const triggerMechanic = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/mechanic/diagnose', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ errorLog: { id: 'manual-test', message: 'System integrity check failed', timestamp: Date.now() } })
            });
            const data = await res.json();
            toast({
                title: "Mechanic Report",
                description: `Diagnosis Complete. Confidence: ${data.fix?.confidence * 100}%`,
            });
        } catch (e) {
            toast({ title: "Error", description: "Mechanic unreachable", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const triggerHunter = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/hunter/hunt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform: 'base', keyword: 'yield' })
            });
            const data = await res.json();
            toast({
                title: "Hunter Status",
                description: `Hunt triggered on Base. Trends found: ${data.trends?.length || 0}`,
            });
        } catch (e) {
            toast({ title: "Error", description: "Hunter unreachable", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-cyan-50 p-6 font-mono">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-cyan-500/30 pb-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center gap-2">
                        <Globe className="w-8 h-8 text-cyan-400" />
                        Galactic Swarm Dashboard
                    </h1>
                    <p className="text-cyan-400/60 mt-1">Status: <span className="text-green-400 animate-pulse">● PROLIFERATING</span></p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/20" onClick={fetchNerveData}>
                        Sync Node
                    </Button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                {/* VAULT CARD */}
                <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-purple-400 flex items-center gap-2">
                            <Shield className="w-5 h-5" /> Aethersafe Vault
                        </CardTitle>
                        <CardDescription>Security & Backups</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Status</span>
                                <Badge variant="outline" className="text-green-400 border-green-400/50">SECURE</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Recent Snapshot</span>
                                <span className="font-mono text-purple-300">Today, 04:20</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* HEART CARD */}
                <Card className="bg-slate-900/50 border-red-500/30 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-red-400 flex items-center gap-2">
                            <Heart className="w-5 h-5" /> Traffic Heart
                        </CardTitle>
                        <CardDescription>Flow Optimization</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Pulse</span>
                                <Badge variant="outline" className="text-red-400 border-red-400/50">BEATING</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Latency</span>
                                <span className="font-mono text-red-300">12ms (Optimized)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* NERVE CARD */}
                <Card className="bg-slate-900/50 border-yellow-500/30 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-yellow-400 flex items-center gap-2">
                            <Zap className="w-5 h-5" /> OmniSync Nerve
                        </CardTitle>
                        <CardDescription>Event Bus</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Connections</span>
                                <span className="font-mono text-yellow-300">{stats?.subscriberCount || 'Unknown'} Nodes</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Events Processed</span>
                                <span className="font-mono text-yellow-300">{stats?.eventCount || 0}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Controls & Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Agent Controls */}
                <Card className="bg-slate-900/50 border-cyan-500/30">
                    <CardHeader>
                        <CardTitle className="text-cyan-400 flex items-center gap-2">
                            <Radio className="w-5 h-5" /> Command Center
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 border border-cyan-500/20 rounded-lg flex justify-between items-center hover:bg-cyan-900/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <Wrench className="w-8 h-8 text-blue-400" />
                                <div>
                                    <h4 className="font-bold text-blue-400">Forge Mechanic</h4>
                                    <p className="text-sm text-gray-400">Run Diagnostics</p>
                                </div>
                            </div>
                            <Button size="sm" onClick={triggerMechanic} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                                {isLoading ? 'Running...' : 'DIAGNOSE'}
                            </Button>
                        </div>

                        <div className="p-4 border border-cyan-500/20 rounded-lg flex justify-between items-center hover:bg-cyan-900/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <Crosshair className="w-8 h-8 text-green-400" />
                                <div>
                                    <h4 className="font-bold text-green-400">Trend Hunter</h4>
                                    <p className="text-sm text-gray-400">Scan for Alpha</p>
                                </div>
                            </div>
                            <Button size="sm" onClick={triggerHunter} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                                {isLoading ? 'Hunting...' : 'START HUNT'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Event Feed */}
                <Card className="bg-slate-900/50 border-cyan-500/30 h-[400px] flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-cyan-400 flex items-center gap-2">
                            <Activity className="w-5 h-5" /> Nerve Activity Feed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {events.length === 0 ? (
                            <div className="text-center text-gray-500 mt-10">No signals detected on the wire...</div>
                        ) : (
                            events.map((evt, i) => (
                                <div key={i} className="p-3 bg-black/40 border-l-2 border-cyan-500 rounded text-sm group hover:bg-black/60 transition-colors">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-bold text-cyan-300">{evt.type}</span>
                                        <span className="text-xs text-gray-500">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-gray-400 text-xs">From: {evt.sender}</span>
                                        {/* Payload preview if needed */}
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
