import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SovereignHero } from '@/components/hero/SovereignHero';
import { RoleQuiz } from '@/components/RoleQuiz';
import { IdentityBinding } from '@/components/marketing/IdentityBinding';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Hammer, Search, ArrowRight, Globe, LayoutDashboard } from 'lucide-react';
import { Link } from 'wouter';
import WalletConnector from '@/components/WalletConnector';

type OnboardingStep = 'hero' | 'quiz' | 'binding' | 'path';

export default function DreamNetInk() {
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
        const paths: Record<string, { title: string; desc: string; icon: any; link: string; task: string }> = {
            Builder: {
                title: 'THE BUILDER',
                desc: 'Engineers of the Sovereign Grid. You build the organs and the spine. Forge the next generation of tools.',
                icon: Hammer,
                link: '/foundry',
                task: "Complete your first 'Spine Integration' bounty."
            },
            Validator: {
                title: 'THE VALIDATOR',
                desc: 'Gatekeepers of truth. You verify signal and purge the noise. Securing the cathedral via P.O.W.K.',
                icon: Shield,
                link: '/dreamkeeper-core',
                task: "Perform your first P.O.W.K. validation ritual."
            },
            Merchant: {
                title: 'THE MERCHANT',
                desc: 'Economics of the Swarm. You facilitate trade, liquidity, and value capture. Arbitrage the Great Hijack.',
                icon: Zap,
                link: '/bounty-explorer',
                task: "List your first agent asset on the Dream Vault."
            },
            Researcher: {
                title: 'THE RESEARCHER',
                desc: 'Gnosis Seekers. You extract knowledge, map the Avenues, and guide the swarms evolution.',
                icon: Search,
                link: '/academy',
                task: "Submit your first Peer Review on ResearchHub."
            }
        };

        const currentPath = paths[archetype] || paths.Builder;
        const PathIcon = currentPath.icon;

        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-4xl w-full flex flex-col md:flex-row gap-12 items-center"
                >
                    <div className="flex-1 space-y-8 text-left">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-electric-cyan/20 flex items-center justify-center border border-electric-cyan/30">
                                <PathIcon className="w-6 h-6 text-electric-cyan" />
                            </div>
                            <div>
                                <span className="text-electric-cyan font-black uppercase tracking-widest text-[10px]">Citizen Assigned</span>
                                <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">{currentPath.title}</h2>
                            </div>
                        </div>

                        <p className="text-xl text-gray-400 leading-relaxed font-medium">
                            Welcome, <span className="text-white font-bold">{partnerName}</span>. {currentPath.desc}
                        </p>

                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                <Globe className="w-32 h-32" />
                            </div>
                            <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <LayoutDashboard className="w-3 h-3 text-electric-cyan" />
                                Active Injunction
                            </h3>
                            <p className="text-2xl font-bold text-white mb-8">{currentPath.task}</p>

                            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
                                <div>
                                    <span className="text-[10px] uppercase font-black text-gray-500 tracking-widest block mb-1">Pheromone Status</span>
                                    <span className="text-electric-cyan font-black uppercase tracking-tighter text-xl">LARVA (0.00)</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] uppercase font-black text-gray-500 tracking-widest block mb-1">Time to Decay</span>
                                    <span className="text-white font-mono text-xl">Infinity</span>
                                </div>
                            </div>

                            <Link href={currentPath.link}>
                                <Button className="w-full mt-10 h-16 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-electric-cyan transition-all shadow-[0_0_30px_rgba(0,255,255,0.2)]">
                                    Enter the Cathedral
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="w-full md:w-72 space-y-6">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Swarm Protocols</h3>
                        {['Docs: Agent Foundry', 'GitHub: Nerve Repo', 'Protocol: Reputation Decay'].map((res) => (
                            <div key={res} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-electric-cyan/30 flex justify-between items-center group cursor-pointer transition-all">
                                <span className="text-sm font-bold text-gray-400 group-hover:text-white">{res}</span>
                                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-electric-cyan group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                        <button
                            onClick={() => setStep('quiz')}
                            className="w-full mt-6 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
                        >
                            Initiate Recalibration
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
            {/* Permanent Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-electric-cyan shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
                    <span className="font-black tracking-tighter text-xl text-white">DREAMNET<span className="text-electric-cyan">.INK</span></span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                    <Link href="/" className="text-white">Grid</Link>
                    <Link href="/about" className="hover:text-white transition-colors text-gray-500">Manifesto</Link>
                    <Link href="/docs" className="hover:text-white transition-colors text-gray-500">Gnosis</Link>
                    <a href="https://dreamnet.live" className="hover:text-white transition-colors text-gray-500">C2 Dashboard</a>
                </div>
                <WalletConnector />
            </nav>

            <main className="relative z-10">
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
                            <div className="container mx-auto px-6 py-10 text-center -mt-20">
                                <Button
                                    onClick={() => setStep('quiz')}
                                    className="h-20 px-16 text-2xl font-black bg-white text-black hover:bg-electric-cyan hover:scale-105 transition-all rounded-full border-4 border-black shadow-[0_0_50px_rgba(0,255,255,0.3)] animate-bounce"
                                >
                                    START THE RITUAL
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 'quiz' && (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
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
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {renderPath()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <div className="pointer-events-none fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        </div>
    );
}
