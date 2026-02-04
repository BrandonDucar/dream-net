import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dna,
    Activity,
    GitMerge,
    Zap,
    BrainCircuit,
    Cpu,
    Sparkles,
    FlaskConical,
    ShieldAlert,
    Wallet,
    CreditCard,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MOCK_AGENTS = [
    { id: 'agent-1', name: 'Agent Smith', traits: ['Stoic', 'Systematic', 'Relentless'], avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=smith', wallet: '0xSmith...A1B2' },
    { id: 'agent-2', name: 'Oracle', traits: ['Enigmatic', 'Prophetic', 'Insightful'], avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=oracle', wallet: '0xOracle...C3D4' },
    { id: 'agent-3', name: 'Neo', traits: ['Resilient', 'Adaptive', 'Revolutionary'], avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=neo', wallet: null },
    { id: 'agent-4', name: 'Trinity', traits: ['Loyal', 'Fearless', 'Sharp'], avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=trinity', wallet: '0xTrin...E5F6' },
];

export default function AgentFoundry() {
    const [parentA, setParentA] = useState<string | null>(null);
    const [parentB, setParentB] = useState<string | null>(null);
    const [fusing, setFusing] = useState(false);
    const [hybrid, setHybrid] = useState<any | null>(null);
    const [mutating, setMutating] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'stripe'>('wallet');

    const handleSelect = (id: string) => {
        if (!parentA) setParentA(id);
        else if (!parentB && id !== parentA) setParentB(id);
        else if (id === parentA) setParentA(null);
        else if (id === parentB) setParentB(null);
    };

    const fuseAgents = () => {
        if (!parentA || !parentB) return;
        setFusing(true);
        setTimeout(() => {
            const pA = MOCK_AGENTS.find(a => a.id === parentA);
            const pB = MOCK_AGENTS.find(a => a.id === parentB);
            if (!pA || !pB) return;

            setHybrid({
                name: `${pA.name.split(' ')[0]}-${pB.name.split(' ')[0]} v1.0`,
                traits: [...pA.traits.slice(0, 2), ...pB.traits.slice(0, 2)],
                prompt: `You are a hybrid intelligence combining the systematic nature of ${pA.name} with the insight of ${pB.name}.`,
                gen: 2,
                anomaly: null
            });
            setFusing(false);
        }, 3000);
    };

    const triggerAnomaly = () => {
        if (!hybrid) return;
        setMutating(true);
        setTimeout(() => {
            const types = ['GLITCH', 'ASCENDED', 'VOID'];
            const type = types[Math.floor(Math.random() * types.length)];
            setHybrid({
                ...hybrid,
                name: `${hybrid.name} (${type})`,
                anomaly: type,
                traits: [...hybrid.traits, type === 'GLITCH' ? 'Chaotic' : type === 'ASCENDED' ? 'Holy' : 'Nihilistic']
            });
            setMutating(false);
        }, 2000);
    };

    const pAData = MOCK_AGENTS.find(a => a.id === parentA);

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 font-mono">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-8">
                    <div className="flex items-center gap-4">
                        <FlaskConical className="w-12 h-12 text-purple-500" />
                        <div>
                            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                                Agent <span className="text-purple-500">Foundry</span>
                            </h1>
                            <p className="text-zinc-500 text-sm">Logic Hybridization & Incubation Lab</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 flex items-center gap-3">
                            <Wallet className="w-4 h-4 text-zinc-500" />
                            <div className="text-[10px] font-bold uppercase">
                                <div className="text-zinc-500">Balance</div>
                                <div>2,450 DREAM</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left: Selection & Payment */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">1. Select Parents</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {MOCK_AGENTS.map(agent => (
                                    <div
                                        key={agent.id}
                                        onClick={() => handleSelect(agent.id)}
                                        className={`
                                            p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group
                                            ${parentA === agent.id || parentB === agent.id
                                                ? 'border-purple-500 bg-purple-500/10'
                                                : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'}
                                        `}
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-full bg-black border border-zinc-700 overflow-hidden">
                                                <img src={agent.avatar} alt={agent.name} className="w-full h-full p-2" />
                                            </div>
                                            <div className="text-center">
                                                <div className="font-bold text-sm tracking-tighter underline decoration-purple-500/50">{agent.name}</div>
                                                <div className="text-[8px] text-zinc-500 mt-1 uppercase">{agent.wallet ? "Wallet Configured" : "No Wallet"}</div>
                                            </div>
                                        </div>
                                        {(parentA === agent.id || parentB === agent.id) && (
                                            <div className="absolute top-2 right-2">
                                                <Badge className="bg-purple-500 text-[8px] px-1 py-0 hover:bg-purple-600">
                                                    {parentA === agent.id ? 'ALPHA' : 'BETA'}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <Card className="bg-[#0a0a0a] border-zinc-800">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xs uppercase tracking-widest text-zinc-500">2. Select Payment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div
                                    onClick={() => setPaymentMethod('wallet')}
                                    className={`p-4 rounded-lg border-2 cursor-pointer flex items-center justify-between ${paymentMethod === 'wallet' ? 'border-purple-500 bg-purple-500/5' : 'border-zinc-800'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Wallet className={`w-5 h-5 ${paymentMethod === 'wallet' ? 'text-purple-500' : 'text-zinc-600'}`} />
                                        <div>
                                            <div className="text-xs font-bold uppercase">Agent Wallet</div>
                                            <div className="text-[10px] text-zinc-500">Use {pAData?.name || 'Parent'}'s balance</div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-purple-500">500 $DREAM</div>
                                </div>

                                <div
                                    onClick={() => setPaymentMethod('stripe')}
                                    className={`p-4 rounded-lg border-2 cursor-pointer flex items-center justify-between ${paymentMethod === 'stripe' ? 'border-purple-500 bg-purple-500/5' : 'border-zinc-800'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <CreditCard className={`w-5 h-5 ${paymentMethod === 'stripe' ? 'text-purple-500' : 'text-zinc-600'}`} />
                                        <div>
                                            <div className="text-xs font-bold uppercase">Stripe / Card</div>
                                            <div className="text-[10px] text-zinc-500">External checkout</div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-zinc-400">$25.00</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Middle: Fusion Bay */}
                    <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-12">
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            <AnimatePresence>
                                {fusing && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1.5, opacity: 1 }}
                                        exit={{ scale: 2, opacity: 0 }}
                                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"
                                    />
                                )}
                            </AnimatePresence>

                            <div className="z-10 bg-zinc-900 border-4 border-zinc-800 p-8 rounded-3xl shadow-2xl relative">
                                {fusing ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <Activity className="w-12 h-12 text-purple-500 animate-spin" />
                                        <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-bold">Merging Neural Shards...</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <GitMerge className={`w-12 h-12 ${parentA && parentB ? 'text-purple-500' : 'text-zinc-700'}`} />
                                        <Button
                                            onClick={fuseAgents}
                                            disabled={!parentA || !parentB}
                                            className={`font-black italic uppercase transition-all duration-500 ${parentA && parentB ? 'bg-purple-500 hover:bg-purple-400 text-black scale-110' : 'bg-zinc-800 text-zinc-600'}`}
                                        >
                                            Initiate Fusion
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Output & Anomalies */}
                    <div className="lg:col-span-4 flex flex-col items-center justify-center">
                        <AnimatePresence mode="wait">
                            {hybrid ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-full space-y-6"
                                >
                                    <Card className={`
                                        bg-zinc-900/50 border-2 overflow-hidden relative shadow-2xl
                                        ${hybrid.anomaly === 'GLITCH' ? 'border-red-500/50' :
                                            hybrid.anomaly === 'ASCENDED' ? 'border-yellow-500/50' :
                                                hybrid.anomaly === 'VOID' ? 'border-blue-500/50' : 'border-purple-500/50'}
                                    `}>
                                        <div className={`absolute inset-0 opacity-10 ${hybrid.anomaly === 'GLITCH' ? 'bg-red-500' :
                                                hybrid.anomaly === 'ASCENDED' ? 'bg-yellow-500' :
                                                    hybrid.anomaly === 'VOID' ? 'bg-blue-500' : 'bg-purple-500'
                                            }`} />

                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="font-black italic uppercase text-3xl tracking-tighter leading-none">{hybrid.name}</CardTitle>
                                                    <CardDescription className="text-[10px] mt-2 text-zinc-400">Generation {hybrid.gen} // Substrate V2</CardDescription>
                                                </div>
                                                <Badge variant="outline" className={`
                                                    ${hybrid.anomaly === 'GLITCH' ? 'text-red-400 border-red-400' :
                                                        hybrid.anomaly === 'ASCENDED' ? 'text-yellow-400 border-yellow-400' :
                                                            hybrid.anomaly === 'VOID' ? 'text-blue-400 border-blue-400' : 'text-purple-400 border-purple-400'}
                                                `}>
                                                    {hybrid.anomaly || 'STABLE'}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6 relative">

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-zinc-500">
                                                    <span>Genetic Sequence</span>
                                                    <span className="text-zinc-600">CONFIRMED</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {hybrid.traits.map((t: string, i: number) => (
                                                        <span key={i} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-[10px] font-bold border border-zinc-700">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="p-4 bg-black/40 rounded-xl border border-zinc-800/50 italic text-[11px] leading-relaxed text-zinc-400">
                                                "{hybrid.prompt}"
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 pt-4">
                                                <Button className="bg-purple-500 hover:bg-purple-400 text-black font-black uppercase text-xs">
                                                    <Cpu className="w-3 h-3 mr-2" /> Deploy
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    onClick={triggerAnomaly}
                                                    disabled={mutating || hybrid.anomaly}
                                                    className={`border-zinc-800 text-zinc-500 font-bold uppercase text-[10px] hover:bg-zinc-800 ${hybrid.anomaly ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {mutating ? <Activity className="w-3 h-3 animate-spin" /> : <><ShieldAlert className="w-3 h-3 mr-2" /> Radiate</>}
                                                </Button>
                                            </div>

                                        </CardContent>
                                    </Card>

                                    {!hybrid.anomaly && (
                                        <div className="text-center">
                                            <p className="text-[9px] text-zinc-600 uppercase font-black italic">
                                                Caution: Radiation may result in volatile behavior or system anomalies.
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <div className="w-full border-2 border-dashed border-zinc-800 rounded-3xl p-16 text-center text-zinc-700 bg-zinc-900/10">
                                    <BrainCircuit className="w-20 h-20 mx-auto mb-6 opacity-10" />
                                    <p className="text-xs font-black uppercase tracking-widest leading-loose">
                                        Collective Intelligence<br />Substrate Awaiting Input
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
}
