import { Link, useLocation } from 'wouter';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  CloudMoon, 
  Sparkles, 
  Music,
  Shield,
  Bot,
  Gem,
  TrendingUp,
  Network,
  Zap,
  ArrowRight,
  Wallet,
  Play,
  Code,
  Lock,
  Brain,
  Star,
  Layers,
  Rocket
} from 'lucide-react';

export default function LandingPage() {
  const [, setLocation] = useLocation();
  
  // Set owner wallet flag for instant access
  useEffect(() => {
    const OWNER_WALLET = '0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e';
    localStorage.setItem('owner_wallet', OWNER_WALLET);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <CloudMoon className="w-6 h-6 text-electric-cyan" />
              <span className="text-xl font-semibold">DreamNet</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#dreamstar" className="text-gray-400 hover:text-white transition-colors">DreamStar</Link>
              <Link href="#dreamsnail" className="text-gray-400 hover:text-white transition-colors">DreamSnail</Link>
              <Link href="#foundry" className="text-gray-400 hover:text-white transition-colors">Foundry</Link>
              <Link href="#metals" className="text-gray-400 hover:text-white transition-colors">Metals</Link>
              <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">Control Room</Link>
            </nav>
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10">
                <Wallet className="w-4 h-4 mr-2" />
                Connect
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Base Style */}
      <main className="relative">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              <span className="block">A biomimetic ecosystem,</span>
              <span className="block bg-gradient-to-r from-electric-cyan via-soft-gold to-electric-cyan bg-clip-text text-transparent">
                built by dreamers
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              DreamNet empowers creators, builders, and dreamers everywhere to build AI agents, 
              generate music, mint NFTs, and earn onchain. One ecosystem for everything you dream.
            </p>

            {/* Product Stack - Base Style */}
            <div className="pt-12">
              <p className="text-sm uppercase tracking-wider text-gray-500 mb-8">An open stack for creators</p>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <Link href="#dreamstar" className="px-6 py-3 rounded-full border border-white/10 hover:border-electric-cyan/50 transition-colors text-gray-300 hover:text-white">
                  DreamStar
                </Link>
                <Link href="#dreamsnail" className="px-6 py-3 rounded-full border border-white/10 hover:border-electric-cyan/50 transition-colors text-gray-300 hover:text-white">
                  DreamSnail
                </Link>
                <Link href="#foundry" className="px-6 py-3 rounded-full border border-white/10 hover:border-electric-cyan/50 transition-colors text-gray-300 hover:text-white">
                  Atlas Foundry
                </Link>
                <Link href="#metals" className="px-6 py-3 rounded-full border border-white/10 hover:border-electric-cyan/50 transition-colors text-gray-300 hover:text-white">
                  Metals Intelligence
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* DreamStar Section */}
        <section id="dreamstar" className="border-t border-white/10 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-cyan/10 border border-electric-cyan/20">
                    <Music className="w-4 h-4 text-electric-cyan" />
                    <span className="text-sm font-medium text-electric-cyan">DreamStar</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold">
                    Generate, remix, and release — all in one place
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    An AI music generation engine that brings together composition, influence vector building, 
                    and publishing. One platform to create, collaborate, and monetize your sound.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/dreamstar">
                      <Button size="lg" className="bg-electric-cyan text-black hover:bg-electric-cyan/90 font-semibold">
                        Launch DreamStar
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    <Link href="/gallery">
                      <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
                        Explore Gallery
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-electric-cyan/20 to-soft-gold/20 border border-electric-cyan/30 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Music className="w-24 h-24 text-electric-cyan mx-auto" />
                      <p className="text-gray-400">AI Music Generation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DreamSnail Section */}
        <section id="dreamsnail" className="border-t border-white/10 py-24 bg-white/5">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative order-2 md:order-1">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Shield className="w-24 h-24 text-purple-400 mx-auto" />
                      <p className="text-gray-400">Privacy-Preserving NFT</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 order-1 md:order-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-400">DreamSnail</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold">
                    Privacy-first identity with zk-proof trails
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    A revolutionary NFT with triple-helix core, Fibonacci rarity, and zero-knowledge proven 
                    slime trails. Own your identity without revealing your path.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/dreamsnail">
                      <Button size="lg" className="bg-purple-500 text-white hover:bg-purple-600 font-semibold">
                        Mint DreamSnail
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    <Link href="/vault">
                      <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
                        View Vault
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Atlas Foundry Section */}
        <section id="foundry" className="border-t border-white/10 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-soft-gold/10 border border-soft-gold/20">
                    <Bot className="w-4 h-4 text-soft-gold" />
                    <span className="text-sm font-medium text-soft-gold">Atlas Foundry</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold">
                    The agent that builds agents
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    Design, deploy, and manage AI agents with zero code. Choose from templates or create 
                    custom agents with specific capabilities. Build the future, one agent at a time.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/foundry">
                      <Button size="lg" className="bg-soft-gold text-black hover:bg-soft-gold/90 font-semibold">
                        Launch Foundry
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    <Link href="/admin">
                      <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
                        View Agents
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-soft-gold/20 to-orange-500/20 border border-soft-gold/30 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Bot className="w-24 h-24 text-soft-gold mx-auto" />
                      <p className="text-gray-400">Agent Builder</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Precious Metals Intelligence Section */}
        <section id="metals" className="border-t border-white/10 py-24 bg-white/5">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative order-2 md:order-1">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Gem className="w-24 h-24 text-amber-400 mx-auto" />
                      <p className="text-gray-400">Metals Intelligence</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 order-1 md:order-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <Gem className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-400">Metals Intelligence</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold">
                    Real-time precious metals intelligence
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed">
                    AI-powered analysis of precious metals markets with predictive insights, 
                    portfolio tracking, and automated trading strategies. Make informed decisions with data-driven intelligence.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/metals">
                      <Button size="lg" className="bg-amber-500 text-black hover:bg-amber-600 font-semibold">
                        Explore Intelligence
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    <Link href="/admin">
                      <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10">
                        View Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="border-t border-white/10 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Everything you need to build
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-white/10 hover:border-electric-cyan/50 transition-colors bg-white/5">
                  <div className="w-12 h-12 rounded-lg bg-electric-cyan/20 flex items-center justify-center mb-4">
                    <Network className="w-6 h-6 text-electric-cyan" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Dream Network</h3>
                  <p className="text-gray-400">Explore connections and relationships between dreams, creators, and agents.</p>
                </div>
                <div className="p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition-colors bg-white/5">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                    <Layers className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Dream Vault</h3>
                  <p className="text-gray-400">Store, tokenize, and monetize your creative assets with Merkle proofs.</p>
                </div>
                <div className="p-6 rounded-xl border border-white/10 hover:border-soft-gold/50 transition-colors bg-white/5">
                  <div className="w-12 h-12 rounded-lg bg-soft-gold/20 flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-soft-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">DreamScope UI</h3>
                  <p className="text-gray-400">Neon-holographic dashboard visualizing agent activity and network health.</p>
                </div>
                <div className="p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors bg-white/5">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">DreamOps</h3>
                  <p className="text-gray-400">Central orchestrator managing deployments, logs, and integrations.</p>
                </div>
                <div className="p-6 rounded-xl border border-white/10 hover:border-green-500/50 transition-colors bg-white/5">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">DreamKeeper</h3>
                  <p className="text-gray-400">Network health monitoring and self-healing defense systems.</p>
                </div>
                <div className="p-6 rounded-xl border border-white/10 hover:border-pink-500/50 transition-colors bg-white/5">
                  <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4">
                    <Rocket className="w-6 h-6 text-pink-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Star Bridge</h3>
                  <p className="text-gray-400">Cross-chain interoperability with CCTP V2 for seamless asset transfers.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-white/10 py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to start dreaming?
              </h2>
              <p className="text-xl text-gray-400">
                Join thousands of creators building the future on DreamNet
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/submit-dream">
                  <Button size="lg" className="bg-gradient-to-r from-electric-cyan to-soft-gold text-black hover:opacity-90 font-semibold text-lg px-8">
                    <Sparkles className="mr-2 w-5 h-5" />
                    Submit Your Dream
                  </Button>
                </Link>
                <Link href="/gallery">
                  <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-lg px-8">
                    Explore Gallery
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Base Style */}
      <footer className="border-t border-white/10 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Explore</h3>
              <ul className="space-y-2">
                <li><Link href="/gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</Link></li>
                <li><Link href="/feed" className="text-gray-400 hover:text-white transition-colors">Feed</Link></li>
                <li><Link href="/vault" className="text-gray-400 hover:text-white transition-colors">Vault</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Builders</h3>
              <ul className="space-y-2">
                <li><Link href="/foundry" className="text-gray-400 hover:text-white transition-colors">Atlas Foundry</Link></li>
                <li><Link href="/admin" className="text-gray-400 hover:text-white transition-colors">Control Room</Link></li>
                <li><Link href="/dreamscope" className="text-gray-400 hover:text-white transition-colors">DreamScope</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Products</h3>
              <ul className="space-y-2">
                <li><Link href="#dreamstar" className="text-gray-400 hover:text-white transition-colors">DreamStar</Link></li>
                <li><Link href="#dreamsnail" className="text-gray-400 hover:text-white transition-colors">DreamSnail</Link></li>
                <li><Link href="#metals" className="text-gray-400 hover:text-white transition-colors">Metals Intelligence</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">DreamNet</h3>
              <ul className="space-y-2">
                <li><Link href="/admin" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/submit-dream" className="text-gray-400 hover:text-white transition-colors">Submit Dream</Link></li>
                <li><Link href="/admin" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <CloudMoon className="w-5 h-5 text-electric-cyan" />
              <span className="font-semibold">DreamNet</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 DreamNet. Built on Base.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
