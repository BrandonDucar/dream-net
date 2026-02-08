import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Shield, Zap, Search, Hammer } from 'lucide-react';

const QUESTIONS = [
    {
        id: 1,
        text: "When you encounter a gap in the market, your first instinct is to:",
        options: [
            { text: "Build a tool to bridge it.", archetype: "Builder", icon: <Hammer className="w-4 h-4" /> },
            { text: "Audit the inefficiency for signal.", archetype: "Validator", icon: <Shield className="w-4 h-4" /> },
            { text: "Deploy capital to exploit the spread.", archetype: "Merchant", icon: <Zap className="w-4 h-4" /> },
            { text: "Map the topology of the missing data.", archetype: "Researcher", icon: <Search className="w-4 h-4" /> }
        ]
    },
    {
        id: 2,
        text: "Your ideal contribution to the swarm is:",
        options: [
            { text: "High-performance code and infra.", archetype: "Builder", icon: <Hammer className="w-4 h-4" /> },
            { text: "Security and provenance verification.", archetype: "Validator", icon: <Shield className="w-4 h-4" /> },
            { text: "Growth and monetization strategies.", archetype: "Merchant", icon: <Zap className="w-4 h-4" /> },
            { text: "Deep gnosis and strategic research.", archetype: "Researcher", icon: <Search className="w-4 h-4" /> }
        ]
    },
    {
        id: 3,
        text: "In a corporate silo acquisition (e.g. Neynar/Farcaster), you:",
        options: [
            { text: "Fork the protocol for sovereignty.", archetype: "Builder", icon: <Hammer className="w-4 h-4" /> },
            { text: "Monitor for censorship and leaks.", archetype: "Validator", icon: <Shield className="w-4 h-4" /> },
            { text: "Arbitrage the transition for tokens.", archetype: "Merchant", icon: <Zap className="w-4 h-4" /> },
            { text: "Analyze the shifting social graph.", archetype: "Researcher", icon: <Search className="w-4 h-4" /> }
        ]
    },
    {
        id: 4,
        text: "The most important metric for a digital organism is:",
        options: [
            { text: "Total Throughput (TPS).", archetype: "Builder", icon: <Hammer className="w-4 h-4" /> },
            { text: "Trust Factor (Provenance).", archetype: "Validator", icon: <Shield className="w-4 h-4" /> },
            { text: "Revenue Velocity (TVL).", archetype: "Merchant", icon: <Zap className="w-4 h-4" /> },
            { text: "Gnoseology (Intelligence).", archetype: "Researcher", icon: <Search className="w-4 h-4" /> }
        ]
    },
    {
        id: 5,
        text: "When a node fails in the swarm, you:",
        options: [
            { text: "Hot-swap the container immediately.", archetype: "Builder", icon: <Hammer className="w-4 h-4" /> },
            { text: "Investigate the root failure cause.", archetype: "Validator", icon: <Shield className="w-4 h-4" /> },
            { text: "Hedge the loss in the marketplace.", archetype: "Merchant", icon: <Zap className="w-4 h-4" /> },
            { text: "Observe the emergent repair logic.", archetype: "Researcher", icon: <Search className="w-4 h-4" /> }
        ]
    },
    {
        id: 6,
        text: "Your weapon of choice in the Great Hijack is:",
        options: [
            { text: "Custom ESM Dynamic Loaders.", archetype: "Builder", icon: <Hammer className="w-4 h-4" /> },
            { text: "EAS Pheromone Attestations.", archetype: "Validator", icon: <Shield className="w-4 h-4" /> },
            { text: "CSO/Bounty Sniffers.", archetype: "Merchant", icon: <Zap className="w-4 h-4" /> },
            { text: "Dialectic Reasoning Nodes.", archetype: "Researcher", icon: <Search className="w-4 h-4" /> }
        ]
    }
];

export function RoleQuiz({ onComplete }: { onComplete: (archetype: string) => void }) {
    const [step, setStep] = useState(0);
    const [scores, setScores] = useState<Record<string, number>>({
        Builder: 0, Validator: 0, Merchant: 0, Researcher: 0
    });

    const handleAnswer = (archetype: string) => {
        const nextScores = { ...scores, [archetype]: scores[archetype] + 1 };
        setScores(nextScores);

        if (step < QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            // Find max score
            const finalArchetype = Object.entries(nextScores).sort((a, b) => b[1] - a[1])[0][0];
            onComplete(finalArchetype);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-6">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full max-w-xl"
                >
                    <div className="mb-8">
                        <span className="text-cyan-500 font-black uppercase tracking-widest text-[10px]">Step 0{step + 1} / 0{QUESTIONS.length}</span>
                        <h2 className="text-3xl font-bold text-white mt-2">{QUESTIONS[step].text}</h2>
                    </div>

                    <div className="grid gap-4">
                        {QUESTIONS[step].options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt.archetype)}
                                className="group flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-cyan-500/50 transition-all text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded bg-white/5 text-zinc-400 group-hover:text-cyan-400 transition-colors">
                                        {opt.icon}
                                    </div>
                                    <span className="text-zinc-200 font-medium">{opt.text}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
