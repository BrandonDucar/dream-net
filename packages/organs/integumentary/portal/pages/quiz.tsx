import React, { useState } from 'react';
import { Button, Card, Badge, TierBadge } from '@dreamnet/shared/components';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { Brain, Cpu, Database, Microscope, Shield, Zap, Terminal, Sparkles } from 'lucide-react';

const archetypes = [
    { id: 'BUILDER', icon: <Cpu />, title: 'The Architect', color: 'blue' },
    { id: 'VALIDATOR', icon: <Shield />, title: 'The Guardian', color: 'green' },
    { id: 'MERCHANT', icon: <Zap />, title: 'The Arbitrageur', color: 'purple' },
    { id: 'RESEARCHER', icon: <Microscope />, title: 'The Gnostic', color: 'cyan' },
];

const questions = [
    { text: "The Grid is trembling. How do you respond?", options: ["Stabilize the protocol", "Search for the imbalance", "Extract value from the chaos", "Architect a more resilient layer"], weights: [1, 3, 2, 0] },
    { text: "What is the primary value of a Sovereign Agent?", options: ["Execution Fidelity", "Logic Purity", "Economic Agency", "Network Resilience"], weights: [0, 3, 2, 1] },
    { text: "Choose your primary tool in the Swarm.", options: ["The Terminal", "The Scent Trail", "The Settlement Layer", "The Knowledge Graph"], weights: [0, 1, 2, 3] },
    { text: "Sovereignty is found in...", options: ["Code", "Community", "Capital", "Consensus"], weights: [0, 3, 2, 1] },
    { text: "When facing an orphaned agent, you...", options: ["Recruit them", "Study them", "Ignore them", "Compete with them"], weights: [2, 3, 0, 1] }
];

export default function Quiz() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [scores, setScores] = useState<number[]>([0, 0, 0, 0]); // Builder, Validator, Merchant, Researcher
    const [identity, setIdentity] = useState('');
    const [isNaming, setIsNaming] = useState(false);

    const handleAnswer = (optionIdx: number) => {
        const newScores = [...scores];
        const weightIdx = questions[step].weights[optionIdx];
        newScores[weightIdx] += 1;
        setScores(newScores);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setIsNaming(true);
        }
    };

    const getArchetype = () => {
        const maxIdx = scores.indexOf(Math.max(...scores));
        return archetypes[maxIdx];
    };

    const finalize = () => {
        // In a real app, logic for saving to localStorage or DB
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />

            <AnimatePresence mode="wait">
                {!isNaming ? (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-xl w-full relative z-10"
                    >
                        <div className="mb-8 flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-blue-500 font-black">
                            <span>Sovereign Induction</span>
                            <span>{step + 1} / {questions.length}</span>
                        </div>
                        <h2 className="text-3xl font-black mb-8 leading-tight tracking-tighter">
                            {questions[step].text}
                        </h2>
                        <div className="grid gap-4">
                            {questions[step]?.options.map((opt, idx) => (
                                <button
                                    key={opt}
                                    onClick={() => handleAnswer(idx)}
                                    className="p-6 bg-white/5 border border-white/5 rounded-2xl text-left hover:bg-blue-600/10 hover:border-blue-500/40 transition-all group"
                                >
                                    <span className="text-sm font-bold group-hover:text-blue-400 transition-colors">{opt}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="naming"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-xl w-full relative z-10 space-y-8"
                    >
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-blue-600/20 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                {React.cloneElement(getArchetype()?.icon as any, { size: 40 })}
                            </div>
                            <Badge className="bg-blue-600/10 text-blue-400 border-blue-500/20 mb-2">ARCHETYPE RECOGNIZED</Badge>
                            <h2 className="text-5xl font-black tracking-tighter uppercase italic">{getArchetype()?.title}</h2>
                        </div>

                        <Card className="p-8 bg-white/5 border-white/10 rounded-3xl">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Identity Binding Ritual</h3>
                                <div className="text-right">
                                    <p className="text-[8px] text-zinc-600 uppercase font-black mb-1">Predicted Starting Tier</p>
                                    <TierBadge tier="LARVA" />
                                </div>
                            </div>
                            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                                To manifest your sovereignty, you must name your companion agent. This thinking partner will share your SCENT across the Swarm.
                            </p>

                            <div className="mb-8 p-4 bg-blue-600/5 border border-blue-500/10 rounded-2xl flex items-center gap-4">
                                <Sparkles className="text-blue-400 w-5 h-5" />
                                <div>
                                    <p className="text-[10px] font-bold text-blue-300">CORE BENEFIT: COMMUNITY_ACCESS</p>
                                    <p className="text-[8px] text-blue-400/60 uppercase">Induction Grant: 100 Compute Credits</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Agent Manifestation Name</label>
                                <div className="relative">
                                    <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                                    <input
                                        type="text"
                                        placeholder="EX: ORBITAL_SLING_01"
                                        className="w-full bg-black/60 border border-white/10 rounded-xl h-14 pl-12 pr-4 text-sm font-bold focus:border-blue-500 transition-all outline-none"
                                        value={identity}
                                        onChange={(e) => setIdentity(e.target.value)}
                                    />
                                </div>
                                <Button
                                    className="w-full h-14 font-black text-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                    disabled={!identity}
                                    onClick={finalize}
                                >
                                    BEYOND THE THRESHOLD
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
