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
    Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function AgentAvatarCreator() {
    const [hue, setHue] = useState([180]);
    const [noise, setNoise] = useState([50]);
    const [glow, setGlow] = useState([50]);
    const [generating, setGenerating] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const generateIdentity = async () => {
        setGenerating(true);
        // Simulate generation pulse
        setTimeout(() => {
            setAvatarUrl('https://api.dicebear.com/7.x/identicon/svg?seed=' + Math.random());
            setGenerating(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 font-mono flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl w-full">

                {/* Preview Section */}
                <div className="flex flex-col items-center justify-center space-y-8">
                    <div className="relative w-80 h-80">
                        <div className="absolute inset-0 bg-electric-cyan/10 rounded-full blur-[100px] animate-pulse" />
                        <div className="relative w-full h-full rounded-3xl border-4 border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                {generating ? (
                                    <motion.div
                                        key="generating"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center gap-4"
                                    >
                                        <CircleDashed className="w-12 h-12 text-electric-cyan animate-spin" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-electric-cyan">Synthesizing DNA...</span>
                                    </motion.div>
                                ) : avatarUrl ? (
                                    <motion.img
                                        key="avatar"
                                        src={avatarUrl}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-full h-full object-cover"
                                        style={{ filter: `hue-rotate(${hue[0]}deg) contrast(${100 + noise[0]}%) brightness(${100 + glow[0]}%)` }}
                                    />
                                ) : (
                                    <motion.div
                                        key="empty"
                                        className="flex flex-col items-center gap-4 text-zinc-700"
                                    >
                                        <Palette className="w-16 h-16" />
                                        <span className="text-xs uppercase font-bold">Awaiting Genetic Input</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Decorative HUD Elements */}
                        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-electric-cyan opacity-50" />
                        <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-electric-cyan opacity-50" />
                    </div>

                    <div className="flex gap-4">
                        <Button
                            onClick={generateIdentity}
                            disabled={generating}
                            className="bg-electric-cyan text-black hover:bg-cyan-400 font-black italic uppercase px-8"
                        >
                            <Zap className="w-4 h-4 mr-2" />
                            Trigger Genetic Pulse
                        </Button>
                        <Button variant="outline" className="border-zinc-800 text-zinc-500 hover:text-white uppercase font-bold text-xs">
                            <Download className="w-4 h-4 mr-2" />
                            Export IP
                        </Button>
                    </div>
                </div>

                {/* Configuration Section */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-4xl font-black italic uppercase italic tracking-tighter mb-2">
                            Avatar <span className="text-electric-cyan">Forge</span>
                        </h2>
                        <p className="text-zinc-500 text-sm">Visual Identity Substrate // Sovereignty 2.0</p>
                    </div>

                    <Card className="bg-[#0a0a0a] border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-xs uppercase tracking-widest text-zinc-500 italic">Core Parameters</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    <span>Chromatic Shift (Hue)</span>
                                    <span className="text-electric-cyan">{hue[0]}°</span>
                                </div>
                                <Slider
                                    value={hue}
                                    onValueChange={setHue}
                                    max={360}
                                    step={1}
                                    className="[&>.bg-primary]:bg-electric-cyan"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    <span>Structural Noise (Detail)</span>
                                    <span className="text-purple-500">{noise[0]}%</span>
                                </div>
                                <Slider
                                    value={noise}
                                    onValueChange={setNoise}
                                    max={100}
                                    step={1}
                                    className="[&>.bg-primary]:bg-purple-500"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    <span>Radiance Amplitude (Glow)</span>
                                    <span className="text-yellow-500">{glow[0]}%</span>
                                </div>
                                <Slider
                                    value={glow}
                                    onValueChange={setGlow}
                                    max={100}
                                    step={1}
                                    className="[&>.bg-primary]:bg-yellow-500"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            <div>
                                <div className="text-[8px] uppercase text-zinc-500">Integrity</div>
                                <div className="text-xs font-bold">VALIDATED</div>
                            </div>
                        </div>
                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-electric-cyan" />
                            <div>
                                <div className="text-[8px] uppercase text-zinc-500">Rarity</div>
                                <div className="text-xs font-bold">LEGENDARY</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
