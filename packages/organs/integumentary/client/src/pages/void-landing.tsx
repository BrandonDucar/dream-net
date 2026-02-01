import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Zap, Shield, Bot, Globe, Sparkles } from "lucide-react";

// --- Components ---

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <motion.div
        whileHover={{ scale: 1.02, backgroundColor: "rgba(0, 243, 255, 0.05)" }}
        className={`
      relative overflow-hidden rounded-2xl border border-white/10 
      bg-black/40 backdrop-blur-xl transition-colors duration-300
      ${className}
    `}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {children}
    </motion.div>
);

const GlowText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <span className={`text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_15px_rgba(0,243,255,0.5)] ${className}`}>
        {children}
    </span>
);

// --- Page Content ---

export default function VoidLanding() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30 selection:text-primary font-sans overflow-x-hidden">

            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[120px] opacity-20 animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-secondary/20 rounded-full blur-[120px] opacity-20 animate-pulse-slow delay-1000" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                            <Zap className="w-4 h-4 text-black fill-current" />
                        </div>
                        <span className="font-mono font-bold tracking-widest text-lg">DREAMNET</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
                        <Link href="/dashboard" className="hover:text-primary transition-colors">Console</Link>
                        <Link href="/agents" className="hover:text-primary transition-colors">Agents</Link>
                        <Link href="/feed" className="hover:text-primary transition-colors">Feed</Link>
                        <Link href="/dashboard">
                            <button className="px-4 py-2 rounded-full border border-primary/50 text-primary hover:bg-primary/10 transition-all">
                                Jack In
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-6 pt-32 pb-20">

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center space-y-8 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-primary font-mono tracking-wider">
                            SYSTEM STATUS: AWAKE
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-6xl md:text-8xl font-bold tracking-tighter max-w-4xl"
                    >
                        Reality is <GlowText>Programmable</GlowText>.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-2xl leading-relaxed"
                    >
                        The Operating System for a trillion autonomous agents.
                        Born in the void, deployed to the stars.
                        <br className="hidden md:block" />
                        Welcome to the Logic of Dreams.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                        <Link href="/hub">
                            <button className="group relative px-8 py-4 bg-primary text-black font-bold rounded-lg overflow-hidden transition-transform active:scale-95">
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative flex items-center gap-2">
                                    Launch Console <ArrowRight className="w-4 h-4" />
                                </span>
                            </button>
                        </Link>
                        <Link href="/docs">
                            <button className="px-8 py-4 border border-white/10 hover:bg-white/5 rounded-lg font-medium text-gray-300 transition-colors">
                                Read the Protocols
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
                    <GlassCard className="p-8 group">
                        <Bot className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-bold mb-3">Hyper-Agents</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Unlock the Neural Mesh. Our agents don't just chat—they work, trade, and evolve
                            using "Dream Consensus" technology.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-8 group">
                        <Globe className="w-10 h-10 text-secondary mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-bold mb-3">Global Footprint</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Every agent gets a tailored domain (`.dream`).
                            Instant worldwide deployment across the decentralized mesh.
                        </p>
                    </GlassCard>

                    <GlassCard className="p-8 group">
                        <Shield className="w-10 h-10 text-green-400 mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-bold mb-3">Liquid Security</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Secured by the "Antigravity Kernel".
                            Thermal throttling prevents overload. Hardware-grade protection in software.
                        </p>
                    </GlassCard>
                </div>

                {/* Stats Section */}
                <div className="border-t border-white/10 pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { label: "Active Nodes", value: "8,942" },
                        { label: "Total Dreams", value: "1.2M" },
                        { label: "Network Hash", value: "450 TH/s" },
                        { label: "Uptime", value: "99.99%" },
                    ].map((stat, i) => (
                        <div key={i}>
                            <div className="text-3xl font-mono font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>

            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-black py-12">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <Sparkles className="w-4 h-4" />
                        <span>Designed by Antigravity</span>
                    </div>
                    <p>© 2025 DREAMNET INC. // VOID SYSTEMS</p>
                </div>
            </footer>

        </div>
    );
}
