import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignHero } from '@/components/hero/SovereignHero';
import { RoleQuiz } from '@/components/RoleQuiz';
import { IdentityBinding } from '@/components/marketing/IdentityBinding';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Hammer, Search, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

type OnboardingStep = 'hero' | 'quiz' | 'binding' | 'path';

export default function SovereignFlagship() {
    const [step, setStep] = useState<OnboardingStep>('hero');
    const [archetype, setArchetype] = useState<string>('');
    const [partnerName, setPartnerName] = useState<string>('');

    const handleQuizComplete = (selectedArchetype: string) => {
        setArchetype(selectedArchetype);
        setStep('binding');
    };

    const handleBindingComplete = (name: string) => {
        setPartnerName(name);
        setStep('path');
    };

    const renderPath = () => {
        const paths: Record<string, { title: string; desc: string; icon: any; link: string }> = {
            Builder: {
                title: 'BUILDER PATH',
                desc: 'Access ToolGym and high-performance GPU clusters. Forge the next generation of sovereign tools.',
                icon: Hammer,
                link: '/foundry'
            },
            Validator: {
                title: 'VALIDATOR PATH',
                desc: 'Audit the swarm, verify provenance, and secure the cathedral. Your word is doctrine.',
                icon: Shield,
                link: '/dreamkeeper-core'
            },
            Merchant: {
                title: 'MERCHANT PATH',
                desc: 'Arbitrage the great hijack. Deploy capital, capture bounties, and master the sovereign economy.',
                icon: Zap,
                link: '/bounty-explorer'
            },
            Researcher: {
                title: 'RESEARCHER PATH',
                desc: 'Deep gnosis extraction. Map the topology of intelligence and guide the swarms evolution.',
                icon: Search,
                link: '/academy'
            }
        };

        const currentPath = paths[archetype] || paths.Builder;
        const PathIcon = currentPath.icon;

        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl w-full space-y-12 text-center"
                >
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                                <PathIcon className="w-16 h-16 text-electric-cyan" />
                            </div>
                        </div>
                        <h2 className="text-5xl font-black text-white italic tracking-tighter">
                            {currentPath.title}
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Welcome, <span className="text-white font-bold">{partnerName}</span>.
                            {currentPath.desc}
                        </p>
                    </div>

                    <Link href={currentPath.link}>
                        <Button className="h-16 px-12 text-xl font-bold bg-white text-black hover:bg-electric-cyan transition-all rounded-2xl group">
                            ENTER THE CATHEDRAL
                            <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>

                    <p className="text-[10px] uppercase tracking-widest text-gray-700 font-bold">
                        PHASE XLVIII: THE GREAT HIJACK IS IN PROGRESS.
                    </p>
                </motion.div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-black overflow-x-hidden">
            <AnimatePresence mode="wait">
                {step === 'hero' && (
                    <motion.div
                        key="hero"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col"
                    >
                        <SovereignHero />
                        <div className="container mx-auto px-6 py-20 text-center">
                            <Button
                                onClick={() => setStep('quiz')}
                                className="h-20 px-12 text-2xl font-black bg-electric-cyan text-black hover:scale-105 transition-all rounded-full border-4 border-black shadow-[0_0_50px_rgba(0,255,255,0.3)]"
                            >
                                START THE RITUAL
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 'quiz' && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                    >
                        <RoleQuiz onComplete={handleQuizComplete} />
                    </motion.div>
                )}

                {step === 'binding' && (
                    <motion.div
                        key="binding"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        <IdentityBinding archetype={archetype} onComplete={handleBindingComplete} />
                    </motion.div>
                )}

                {step === 'path' && (
                    <motion.div
                        key="path"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {renderPath()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
