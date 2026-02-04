import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Palette,
    RefreshCw,
    Download,
    ShieldCheck,
    Zap,
    CircleDashed,
    Binary,
    Sparkles,
    GitMerge,
    FlaskConical,
    Dna,
    Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const MOCK_AVATARS = [
    { id: 'av-1', seed: 'shiva', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=shiva' },
    { id: 'av-2', seed: 'vishnu', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=vishnu' },
    { id: 'av-3', seed: 'brahma', url: 'https://api.dicebear.com/7.x/identicon/svg?seed=brahma' },
];

export default function AgentAvatarCreator() {
    const [hue, setHue] = useState([180]);
    const [noise, setNoise] = useState([50]);
    const [glow, setGlow] = useState([50]);
    const [generating, setGenerating] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    // Remix State
    const [parent1, setParent1] = useState<string | null>(null);
    const [parent2, setParent2] = useState<string | null>(null);
    const [remixing, setRemixing] = useState(false);
    const [remixResult, setRemixResult] = useState<string | null>(null);

    const generateIdentity = async () => {
        setGenerating(true);
        setTimeout(() => {
            setAvatarUrl('https://api.dicebear.com/7.x/identicon/svg?seed=' + Math.random());
            setGenerating(false);
        }, 2000);
    };

    const handleRemix = () => {
        if (!parent1 || !parent2) return;
        setRemixing(true);
        setTimeout(() => {
            setRemixResult('https://api.dicebear.com/7.x/shapes/svg?seed=' + Math.random());
            setRemixing(false);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 font-mono flex flex-col items-center">

            <div className="max-w-6xl w-full space-y-12">

                {/* Brand Header */}
                <div className="flex items-center gap-4 border-b border-zinc-800 pb-8">
                    <FlaskConical className="w-12 h-12 text-electric-cyan" />
                    <div>
                        <h1 className="text-4xl font-black italic uppercase italic tracking-tighter leading-none">
                            Avatar <span className="text-electric-cyan">Forge</span>
                        </h1>
                        <p className="text-zinc-500 text-sm">Visual Identity Substrate // Molting Engine v1.0</p>
                    </div>
                </div>

                <Tabs defaultValue="forge" className="w-full">
                    <TabsList className="bg-zinc-900 border border-zinc-800 p-1 mb-12">
                        <TabsTrigger value="forge" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-black uppercase font-bold text-xs px-8">
                            <Palette className="w-4 h-4 mr-2" /> Single Forge
                        </TabsTrigger>
                        <TabsTrigger value="remix" className="data-[state=active]:bg-purple-500 data-[state=active]:text-black uppercase font-bold text-xs px-8">
                            <GitMerge className="w-4 h-4 mr-2" /> Remix Station
                        </TabsTrigger>
                    </TabsList>

                    {/* Single Forge UI */}
                    <TabsContent value="forge">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="flex flex-col items-center justify-center space-y-8">
                                <div className="relative w-80 h-80">
                                    <div className="absolute inset-0 bg-electric-cyan/10 rounded-full blur-[100px] animate-pulse" />
                                    <div className="relative w-full h-full rounded-3xl border-4 border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl flex items-center justify-center">
                                        <AnimatePresence mode="wait">
                                            {generating ? (
                                                <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                                                    <CircleDashed className="w-12 h-12 text-electric-cyan animate-spin" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-electric-cyan">Synthesizing DNA...</span>
                                                </motion.div>
                                            ) : avatarUrl ? (
                                                <motion.img
                                                    key="av" src={avatarUrl} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                                    className="w-full h-full object-cover p-8"
                                                    style={{ filter: `hue-rotate(${hue[0]}deg) contrast(${100 + noise[0]}%) brightness(${100 + glow[0]}%)` }}
                                                />
                                            ) : (
                                                <motion.div key="empty" className="flex flex-col items-center gap-4 text-zinc-700">
                                                    <Palette className="w-16 h-16" />
                                                    <span className="text-xs uppercase font-bold">Awaiting Genetic Input</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button onClick={generateIdentity} disabled={generating} className="bg-electric-cyan text-black font-black italic uppercase px-8">
                                        <Zap className="w-4 h-4 mr-2" /> Trigger Pulse
                                    </Button>
                                    <Button variant="outline" className="border-zinc-800 text-zinc-500 hover:text-white uppercase font-bold text-xs">
                                        <Download className="w-4 h-4 mr-2" /> Export
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 italic">Parameters</h3>
                                <Card className="bg-[#0a0a0a] border-zinc-800">
                                    <CardContent className="space-y-8 p-6">
                                        <SliderItem label="Chromatic Shift" value={hue} onChange={setHue} max={360} color="electric-cyan" />
                                        <SliderItem label="Structural Noise" value={noise} onChange={setNoise} max={100} color="purple-500" />
                                        <SliderItem label="Radiance" value={glow} onChange={setGlow} max={100} color="yellow-500" />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Remix Station UI */}
                    <TabsContent value="remix">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                            {/* Selection Column */}
                            <div className="lg:col-span-4 space-y-8">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 italic">Parent Selection</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {MOCK_AVATARS.map(av => (
                                        <div
                                            key={av.id}
                                            onClick={() => {
                                                if (parent1 === av.id) setParent1(null);
                                                else if (parent2 === av.id) setParent2(null);
                                                else if (!parent1) setParent1(av.id);
                                                else if (!parent2) setParent2(av.id);
                                            }}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${parent1 === av.id || parent2 === av.id ? 'border-purple-500 bg-purple-500/10' : 'border-zinc-800 bg-zinc-900/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <img src={av.url} alt={av.id} className="w-12 h-12 rounded-lg bg-black border border-zinc-700" />
                                                <div className="flex-1">
                                                    <div className="text-xs font-bold uppercase tracking-widest">{av.seed}</div>
                                                    <div className="text-[8px] text-zinc-500 mt-1 uppercase">Sovereign Identity Validated</div>
                                                </div>
                                                {parent1 === av.id && <Badge className="bg-purple-500 text-[8px]">ALPHA</Badge>}
                                                {parent2 === av.id && <Badge className="bg-blue-500 text-[8px]">BETA</Badge>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Fusion Chamber */}
                            <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-8">
                                <div className="w-64 h-64 relative">
                                    <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-[80px] animate-pulse" />
                                    <div className="relative w-full h-full rounded-full border-4 border-zinc-800 bg-zinc-900 flex items-center justify-center overflow-hidden">
                                        <AnimatePresence mode="wait">
                                            {remixing ? (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
                                                    <Activity className="w-10 h-10 text-purple-500 animate-spin" />
                                                    <span className="text-[8px] uppercase font-black tracking-widest text-purple-500">Splice Active...</span>
                                                </motion.div>
                                            ) : remixResult ? (
                                                <motion.img initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} src={remixResult} className="w-full h-full object-cover p-12" />
                                            ) : (
                                                <GitMerge className="w-16 h-16 text-zinc-800" />
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleRemix}
                                    disabled={!parent1 || !parent2 || remixing}
                                    className={`w-full font-black italic uppercase italic border-2 transition-all ${parent1 && parent2
                                            ? 'bg-purple-500 border-purple-400 text-black shadow-[0_0_30px_-10px_rgba(168,85,247,0.5)]'
                                            : 'bg-zinc-900 border-zinc-800 text-zinc-700'
                                        }`}
                                >
                                    <Zap className="w-4 h-4 mr-2" /> Incubate Molting
                                </Button>
                                <div className="text-[10px] text-zinc-500 text-center uppercase">Est. Cost: 500 $DREAM</div>
                            </div>

                            {/* Output Stats */}
                            <div className="lg:col-span-4 space-y-6">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 italic">Molting Specs</h3>
                                <Card className="bg-[#0a0a0a] border-zinc-800 border-dashed">
                                    <CardContent className="p-6 space-y-6">
                                        <SpecItem label="Complexity" value="84%" />
                                        <SpecItem label="Volatility" value="12%" />
                                        <SpecItem label="Heritage" value={parent1 && parent2 ? "DUAL_SOURCE" : "PENDING"} />
                                        <div className="pt-4 border-t border-zinc-800/50">
                                            <div className="text-[8px] text-zinc-600 uppercase font-black mb-2">Remix History</div>
                                            <div className="text-[10px] italic text-zinc-400">"{remixResult ? "A new sovereign visual has been synthesized. High probability of rare traits." : "Awaiting genetic stabilization."}"</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                        </div>
                    </TabsContent>
                </Tabs>

            </div>
        </div>
    );
}

function SliderItem({ label, value, onChange, max, color }: any) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <span>{label}</span>
                <span className={`text-${color}`}>{value[0]}</span>
            </div>
            <Slider value={value} onValueChange={onChange} max={max} step={1} className={`[&>.bg-primary]:bg-${color}`} />
        </div>
    );
}

function SpecItem({ label, value }: any) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-zinc-500">{label}</span>
            <span className="text-xs font-black text-zinc-300">{value}</span>
        </div>
    );
}
