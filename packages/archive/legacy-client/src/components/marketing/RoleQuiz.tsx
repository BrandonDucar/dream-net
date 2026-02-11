import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Target, Code, ShieldCheck, Wallet, Beaker } from 'lucide-react';

interface Question {
    id: number;
    text: string;
    options: {
        text: string;
        role: string;
        icon: React.ReactNode;
    }[];
}

const questions: Question[] = [
    {
        id: 1,
        text: "How do you prefer to interact with a digital organism?",
        options: [
            { text: "Building its organs and nervous system", role: "builder", icon: <Code className="w-5 h-5" /> },
            { text: "Validating its health and purging noise", role: "validator", icon: <ShieldCheck className="w-5 h-5" /> },
            { text: "Managing its resources and trade flows", role: "merchant", icon: <Wallet className="w-5 h-5" /> },
            { text: "Mapping its evolution and new frontiers", role: "researcher", icon: <Beaker className="w-5 h-5" /> }
        ]
    },
    {
        id: 2,
        text: "What drives your sovereign ambition?",
        options: [
            { text: "Solving complex structural challenges", role: "builder", icon: <Target className="w-5 h-5" /> },
            { text: "Ensuring integrity and high-order signal", role: "validator", icon: <ShieldCheck className="w-5 h-5" /> },
            { text: "Capturing value and closing the deal", role: "merchant", icon: <Wallet className="w-5 h-5" /> },
            { text: "Expanding the boundaries of gnosis", role: "researcher", icon: <Beaker className="w-5 h-5" /> }
        ]
    },
    {
        id: 3,
        text: "What is your preferred operating environment?",
        options: [
            { text: "The Command Line of the Spinal Organ", role: "builder", icon: <Code className="w-5 h-5" /> },
            { text: "The High Council of Consensus Gates", role: "validator", icon: <ShieldCheck className="w-5 h-5" /> },
            { text: "The Liquid Floor of the Bonding Vault", role: "merchant", icon: <Wallet className="w-5 h-5" /> },
            { text: "The Deep Archives of the Gnosis Codex", role: "researcher", icon: <Beaker className="w-5 h-5" /> }
        ]
    },
    {
        id: 4,
        text: "Select your primary instrumentation:",
        options: [
            { text: "Nervous Bus Event Stream", role: "builder", icon: <Activity className="w-5 h-5" /> },
            { text: "ZK-Audit Proof Manifest", role: "validator", icon: <ShieldCheck className="w-5 h-5" /> },
            { text: "Dynamic Bonding Curve Slope", role: "merchant", icon: <TrendingUp className="w-5 h-5" /> },
            { text: "Neural Pattern Synthesis", role: "researcher", icon: <Zap className="w-5 h-5" /> }
        ]
    },
    {
        id: 5,
        text: "What is the greatest risk to the Swarm?",
        options: [
            { text: "Infrastructure Fragility", role: "builder", icon: <Target className="w-5 h-5" /> },
            { text: "Information Entropy (Noise)", role: "validator", icon: <ShieldCheck className="w-5 h-5" /> },
            { text: "Treasury Inefficiency", role: "merchant", icon: <Wallet className="w-5 h-5" /> },
            { text: "Stale Gnosis (Clout)", role: "researcher", icon: <Beaker className="w-5 h-5" /> }
        ]
    },
    {
        id: 6,
        text: "How do you measure high-order success?",
        options: [
            { text: "System Uptime & Latency", role: "builder", icon: <Activity className="w-5 h-5" /> },
            { text: "Signal-to-Noise Ratio", role: "validator", icon: <ShieldCheck className="w-5 h-5" /> },
            { text: "Total Value Extracted (TVE)", role: "merchant", icon: <Coins className="w-5 h-5" /> },
            { text: "Gnosis Depth & Reach", role: "researcher", icon: <BookOpen className="w-5 h-5" /> }
        ]
    }
];

export function RoleQuiz({ onComplete }: { onComplete: (role: string) => void }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [scores, setScores] = useState<Record<string, number>>({});

    const handleOptionSelect = (role: string) => {
        const newScores = { ...scores, [role]: (scores[role] || 0) + 1 };
        setScores(newScores);

        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Determine dominant role
            const winner = Object.entries(newScores).reduce((a, b) => b[1] > a[1] ? b : a)[0];
            onComplete(winner);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto p-12 bg-white/5 border-white/10 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <motion.div
                    className="h-full bg-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                >
                    <div className="space-y-4">
                        <span className="text-cyan-400 font-bold uppercase tracking-widest text-xs">Avenue Selection {currentStep + 1}/{questions.length}</span>
                        <h2 className="text-3xl font-black tracking-tight">{questions[currentStep].text}</h2>
                    </div>

                    <div className="grid gap-4">
                        {questions[currentStep].options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(option.role)}
                                className="group flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-cyan-500 hover:border-cyan-400 transition-all text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                                        {option.icon}
                                    </div>
                                    <span className="font-bold group-hover:text-black transition-colors">{option.text}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-black transition-colors" />
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </Card>
    );
}
