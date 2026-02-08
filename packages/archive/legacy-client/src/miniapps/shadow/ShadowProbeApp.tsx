import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Radar, Shield, Activity, Share2 } from 'lucide-react';
import sdk from '@farcaster/frame-sdk';

export default function ShadowProbeApp() {
    const [isScanning, setIsScanning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [context, setContext] = useState<any>(null);

    useEffect(() => {
        const init = async () => {
            const ctx = await sdk.context;
            setContext(ctx);
            sdk.actions.ready();
        };
        init();
    }, []);

    const startScan = () => {
        setIsScanning(true);
        setLogs(["Initiating Shadow Scan...", "Connecting to Base L2 RPC...", "Authenticating via Frame v2 context..."]);

        setTimeout(() => {
            setLogs(prev => [...prev, "Scanning local ganglia...", "LUCID logic detected: STABLE", "ROOT schemas detected: ALIVE"]);
        }, 1000);

        setTimeout(() => {
            setLogs(prev => [...prev, "Scan Complete. Organism is HOMEOTASTIC."]);
            setIsScanning(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 font-mono">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto space-y-6"
            >
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-cyan-400">SHADOW PROBE v1.0</h1>
                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-300">Base Native</Badge>
                </div>

                <Card className="bg-gray-900/50 border-cyan-500/20 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Radar className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                            Diagnostic Ganglia
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-gray-400 mb-4">
                            The Shadow Probe identifies the 'spaces between commits' and ensures sovereign routing is active.
                        </p>

                        <Button
                            onClick={startScan}
                            disabled={isScanning}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold"
                        >
                            {isScanning ? "SCANNING..." : "TRIGGER PROBE"}
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-2">
                    <h3 className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Signal Feed</h3>
                    <div className="bg-black/80 border border-white/5 p-4 rounded-lg h-48 overflow-y-auto text-xs space-y-1">
                        {logs.map((log, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={i}
                                className="text-green-400"
                            >
                                <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                {log}
                            </motion.div>
                        ))}
                        {logs.length === 0 && <p className="text-gray-700 italic">Waiting for signal...</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-900/30 border border-white/5 rounded-xl text-center">
                        <Shield className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                        <span className="text-[10px] text-gray-500">Shields</span>
                        <p className="text-xs font-bold text-purple-300">ACTIVE</p>
                    </div>
                    <div className="p-3 bg-gray-900/30 border border-white/5 rounded-xl text-center">
                        <Activity className="w-5 h-5 mx-auto mb-1 text-green-400" />
                        <span className="text-[10px] text-gray-500">Heartbeat</span>
                        <p className="text-xs font-bold text-green-300">STABLE</p>
                    </div>
                </div>

                <div className="text-center pt-4">
                    <p className="text-[9px] text-gray-600 uppercase tracking-widest">Powered by DreamNet Sovereign Protocol</p>
                </div>
            </motion.div>
        </div>
    );
}
