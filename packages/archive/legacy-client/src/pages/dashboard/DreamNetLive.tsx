import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    LayoutDashboard,
    Coins,
    Award,
    Users,
    Settings,
    Activity,
    Zap,
    Server,
    Code,
    BookOpen,
    ChevronRight,
    TrendingUp,
    LineChart,
    Palette,
    Dna,
    GitMerge,
    RefreshCw,
    Download,
    ShieldCheck,
    FlaskConical,
    Target
} from 'lucide-react';
import { MetabolicWidget } from '@/components/MetabolicWidget';
import { useAuth } from '@/contexts/auth-context';
import { IdentityService, type IdentityMetadata } from '@/../../nervous/nerve/src/spine/mercenary/IdentityService';
import { SentientAvatar, AgentSoulType } from '@/components/ui/SentientAvatar';
import { agentLibrary } from '@/data/agentLibrary';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

export default function DreamNetLive() {
    const [activeTab, setActiveTab] = useState('home');
    const [identity, setIdentity] = useState<IdentityMetadata>(IdentityService.getIdentity());
    const [hue, setHue] = useState([identity.hue]);
    const [noise, setNoise] = useState([identity.noise]);
    const [glow, setGlow] = useState([identity.glow]);
    const [baseAgentId, setBaseAgentId] = useState(identity.baseId || 'agt-001');
    const [soulType, setSoulType] = useState<AgentSoulType>(identity.soulType as AgentSoulType);
    const { walletAddress } = useAuth();
    const [scentData, setScentData] = useState({ score: 0, tier: 'LARVA' });
    const [bounties, setBounties] = useState<any[]>([]);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [nodeStatus, setNodeStatus] = useState<any[]>([]);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const wallet = walletAddress || 'GLOBAL_SWARM';

                // 1. Fetch Scent
                const scentRes = await fetch(`/api/antigravity/pheromone/score/${wallet}`);
                const scent = await scentRes.json();
                setScentData({ score: scent.score || 0, tier: scent.tier || 'LARVA' });

                // 2. Fetch Bounties
                const bountyRes = await fetch('/api/antigravity/tasks/queue');
                const bountyData = await bountyRes.json();
                setBounties(bountyData || []);

                // 3. Fetch Leaderboard
                const lbRes = await fetch('/api/antigravity/pheromone/leaderboard');
                const lbData = await lbRes.json();
                setLeaderboard(lbData || []);

                // 4. Fetch Node Status
                const nodeRes = await fetch('/api/antigravity/nodes/status');
                const nodeData = await nodeRes.json();
                setNodeStatus(nodeData || []);

            } catch (e) {
                console.error("Failed to fetch dashboard data:", e);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [walletAddress]);

    const handleCommit = () => {
        IdentityService.updateIdentity({
            hue: hue[0],
            noise: noise[0],
            glow: glow[0]
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white sprawler-mesh site-live">
            <div className="crt-overlay" />

            <div className="flex">
                {/* Sidebar Nav */}
                <aside className="w-64 h-screen sticky top-0 bg-black/40 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col justify-between z-20">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-sm animate-pulse shadow-[0_0_15px_rgba(0,255,0,0.5)]" />
                            <span className="font-black tracking-tighter text-xl">DREAMNET<span className="text-green-500">.LIVE</span></span>
                        </div>

                        <nav className="space-y-2">
                            {[
                                { id: 'home', label: 'Home', icon: LayoutDashboard },
                                { id: 'earn', label: 'Earn', icon: Coins },
                                { id: 'credentials', label: 'Credentials', icon: Award },
                                { id: 'identity', label: 'Identity', icon: Palette },
                                { id: 'referrals', label: 'Referrals', icon: Users },
                                { id: 'settings', label: 'Settings', icon: Settings },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === item.id
                                        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                        : 'text-white/40 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="space-y-4">
                        <Card className="p-4 bg-white/5 border-white/5 rounded-xl flex items-center gap-3">
                            <SentientAvatar
                                seed="Agent-144"
                                type="quantum"
                                className="w-10 h-10"
                                hue={hue[0]}
                                noise={noise[0]}
                                glow={glow[0]}
                            />
                            <div className="flex-1 overflow-hidden">
                                <div className="text-[10px] font-black uppercase tracking-tight text-white/80 truncate">Agent #144</div>
                                <div className="text-[8px] font-bold text-green-500 uppercase">Authenticated</div>
                            </div>
                        </Card>
                        <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-green-500/60 uppercase">System Status</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            </div>
                            <p className="text-[10px] font-medium text-white/40 leading-relaxed">Organism health: 98.4%<br />Swarm capacity: 144/1000</p>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 pt-12 relative z-10 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === 'home' && (
                            <motion.div
                                key="home"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <header className="flex justify-between items-end">
                                    <div className="flex items-center gap-6">
                                        <SentientAvatar
                                            seed="Agent-144"
                                            type="quantum"
                                            className="w-16 h-16"
                                            pulse
                                            hue={hue[0]}
                                            noise={noise[0]}
                                            glow={glow[0]}
                                        />
                                        <div>
                                            <h1 className="text-4xl font-black tracking-tighter">Sovereign Pulse</h1>
                                            <p className="text-white/40 text-sm mt-1">Welcome back, Agent #144. Your current pheromone density is increasing.</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Pheromone Tier</span>
                                        <div className="text-2xl font-black text-green-500 uppercase tracking-tighter">{scentData.tier || 'LARVA'}</div>
                                        <p className="text-[10px] text-white/40 mt-1">Scent Density: {(scentData.score || 0).toFixed(2)}</p>
                                    </div>
                                </header>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <Card className="p-6 bg-white/5 border-white/5 rounded-2xl flex flex-col justify-between h-40 group hover:border-green-500/20 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><Activity className="w-5 h-5" /></div>
                                            <TrendingUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Reputation Score</span>
                                            <div className="text-3xl font-black">{(scentData.score || 0).toFixed(0)}</div>
                                        </div>
                                    </Card>

                                    <Card className="p-6 bg-white/5 border-white/5 rounded-2xl flex flex-col justify-between h-40 group hover:border-green-500/20 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Award className="w-5 h-5" /></div>
                                            <Zap className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Credentials</span>
                                            <div className="text-3xl font-black">12 Active</div>
                                        </div>
                                    </Card>

                                    <Card className="p-6 bg-white/5 border-white/5 rounded-2xl flex flex-col justify-between h-40 group hover:border-green-500/20 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><Coins className="w-5 h-5" /></div>
                                            <a
                                                href="https://hunt.town/tokens/0x2896BdB9455e8e5C4a72634E27990ff7532CbC07"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[8px] bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full font-bold hover:bg-yellow-500 hover:text-black transition-all"
                                            >
                                                $SHEEP
                                            </a>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Earnings (MTD)</span>
                                            <div className="text-3xl font-black">$4,281.50</div>
                                            <div className="text-[10px] text-white/20 mt-1 font-mono">Incl. 12,400 $SHEEP</div>
                                        </div>
                                    </Card>

                                    <Card className="p-6 bg-white/5 border-white/5 rounded-2xl flex flex-col justify-between h-40 border-green-500/20 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-2"><span className="text-[8px] bg-green-500 text-black px-1.5 py-0.5 rounded-full font-bold">URGENT</span></div>
                                        <div className="flex justify-between items-start">
                                            <div className="p-2 bg-white/10 rounded-lg"><Target className="w-5 h-5" /></div>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Next Action</span>
                                            <div className="text-sm font-bold group-hover:text-green-500 transition-colors">Close DIU Bounty #482</div>
                                        </div>
                                    </Card>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="p-8 bg-white/5 border-white/5 rounded-3xl h-[400px]">
                                        <h3 className="text-xs font-bold text-white/20 uppercase tracking-widest mb-6">Pheromone Decay (30-day half-life)</h3>
                                        <div className="h-64 w-full bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                                            <span className="text-[10px] text-white/20 font-mono">[REPRESENTATIONAL_CHART_COMPONENT]</span>
                                        </div>
                                    </Card>
                                    <Card className="p-8 bg-white/5 border-white/5 rounded-3xl">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xs font-bold text-white/20 uppercase tracking-widest">Recent Attestations</h3>
                                            <Button variant="link" className="text-green-500 text-[10px] font-bold uppercase p-0">View All</Button>
                                        </div>
                                        <div className="space-y-4">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-bold text-xs">{i}</div>
                                                        <div>
                                                            <div className="text-sm font-bold">P.O.W.K. Settlement #{1000 + i}</div>
                                                            <div className="text-[10px] text-white/40 font-mono">0x742d...3a8e | 2 hours ago</div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'credentials' && (
                            <motion.div
                                key="credentials"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <header>
                                    <h1 className="text-4xl font-black tracking-tighter">Sovereign Credentials</h1>
                                    <p className="text-white/40 text-sm mt-1">On-chain validation of your digital scent. Verified by EAS.</p>
                                </header>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 space-y-6">
                                        <Card className="p-8 bg-white/5 border-white/5 rounded-3xl">
                                            <h3 className="text-xs font-bold text-white/20 uppercase tracking-widest mb-6">Pheromone Decay (30-day half-life)</h3>
                                            <div className="h-64 w-full bg-gradient-to-t from-green-500/5 to-transparent rounded-xl border border-white/5 flex items-end p-4 gap-2">
                                                {[40, 60, 45, 90, 80, 50, 30].map((h, i) => (
                                                    <div key={i} className="flex-1 bg-green-500/20 rounded-t-lg transition-all hover:bg-green-500" style={{ height: `${h}%` }} />
                                                ))}
                                            </div>
                                            <div className="flex justify-between mt-4 text-[10px] text-white/20 font-mono">
                                                <span>Jan 01</span>
                                                <span>Current</span>
                                            </div>
                                        </Card>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Card className="p-8 bg-white/5 border-white/5 rounded-3xl">
                                                <h3 className="text-xs font-bold text-white/20 uppercase tracking-widest mb-6">Detailed Breakdown</h3>
                                                <ul className="space-y-4">
                                                    <li className="flex justify-between border-b border-white/5 pb-2">
                                                        <span className="text-white/40">Tasks Completed</span>
                                                        <span className="font-bold">42.5 P</span>
                                                    </li>
                                                    <li className="flex justify-between border-b border-white/5 pb-2">
                                                        <span className="text-white/40">Passive Node Uptime</span>
                                                        <span className="font-bold">128.0 P</span>
                                                    </li>
                                                    <li className="flex justify-between border-b border-white/5 pb-2">
                                                        <span className="text-white/40">Referral Multiplier</span>
                                                        <span className="font-bold text-green-500">x1.4</span>
                                                    </li>
                                                </ul>
                                            </Card>
                                            <Card className="p-8 bg-white/5 border-white/5 rounded-3xl">
                                                <h3 className="text-xs font-bold text-white/20 uppercase tracking-widest mb-6">Active Attestations</h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                                                        <span className="text-xs font-bold">P.O.E. #742D</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                                        <Zap className="w-4 h-4 text-yellow-400" />
                                                        <span className="text-xs font-bold">P.OW.K. Elite</span>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>

                                    <Card className="p-8 bg-white/5 border-white/5 rounded-3xl">
                                        <h3 className="text-xs font-bold text-white/20 uppercase tracking-widest mb-6">Swarm Leaderboard</h3>
                                        <div className="space-y-4">
                                            {leaderboard.length > 0 ? leaderboard.map((u, idx) => (
                                                <div key={u.wallet} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-bold text-white/20 w-4">#{idx + 1}</span>
                                                        <SentientAvatar seed={u.name} type={u.type as any} className="w-8 h-8" />
                                                        <span className="text-xs font-bold group-hover:text-green-500 transition-colors truncate max-w-[100px]">{u.name}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs font-black">{u.score.toLocaleString()} P</div>
                                                        <div className="text-[8px] text-green-500 font-bold uppercase">{u.tier}</div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="p-12 text-center text-white/20 text-[10px] uppercase font-bold italic">Recalculating Hierarchy...</div>
                                            )}
                                        </div>
                                        <Button variant="outline" className="w-full mt-8 border-white/10 text-white/40 hover:text-white">View Full Hive</Button>
                                    </Card>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'earn' && (
                            <motion.div
                                key="earn"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <header>
                                    <h1 className="text-4xl font-black tracking-tighter">Monetization Engine</h1>
                                    <p className="text-white/40 text-sm mt-1">Four paths to sovereign revenue. Select your avenue of extraction.</p>
                                </header>

                                <Tabs defaultValue="nodes" className="w-full">
                                    <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl mb-8">
                                        <TabsTrigger value="nodes" className="rounded-xl px-8 font-bold data-[state=active]:bg-green-500 data-[state=active]:text-black transition-all">Nodes</TabsTrigger>
                                        <TabsTrigger value="bounties" className="rounded-xl px-8 font-bold data-[state=active]:bg-green-500 data-[state=active]:text-black transition-all">Bounties</TabsTrigger>
                                        <TabsTrigger value="govtech" className="rounded-xl px-8 font-bold data-[state=active]:bg-green-500 data-[state=active]:text-black transition-all">GovTech</TabsTrigger>
                                        <TabsTrigger value="education" className="rounded-xl px-8 font-bold data-[state=active]:bg-green-500 data-[state=active]:text-black transition-all">Education</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="nodes">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {nodeStatus.length > 0 ? nodeStatus.map((node) => (
                                                <Card key={node.id} className="p-8 bg-green-500/5 border-green-500/20 rounded-3xl relative overflow-hidden group hover:border-green-500/40 transition-all">
                                                    <div className="absolute top-0 right-0 p-4">
                                                        <div className={cn(
                                                            "w-2 h-2 rounded-full animate-pulse",
                                                            node.status === 'HEALTHY' ? "bg-green-500" : "bg-red-500"
                                                        )} />
                                                    </div>
                                                    <Server className="w-12 h-12 text-green-500 mb-6 group-hover:scale-110 transition-transform" />
                                                    <h3 className="text-xl font-bold mb-2 truncate">{node.name}</h3>
                                                    <p className="text-white/40 text-[10px] mb-6 uppercase tracking-wider">{node.id} | {node.provider}</p>
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <span className="text-[10px] font-bold text-white/20 uppercase">Earnings Total</span>
                                                            <div className="text-2xl font-black text-green-500">{node.totalEarnings.toFixed(2)} {node.token}</div>
                                                        </div>
                                                        <Button variant="outline" className="border-green-500/20 text-green-500 hover:bg-green-500 hover:text-black font-bold h-10 px-6 rounded-lg text-xs">Manage</Button>
                                                    </div>
                                                </Card>
                                            )) : (
                                                <div className="col-span-3 p-12 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                                                    <RefreshCw className="w-12 h-12 text-white/10 animate-spin mx-auto mb-4" />
                                                    <p className="text-white/20 uppercase font-bold tracking-widest text-sm">Synchronizing Node Infrastructure...</p>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="bounties">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {bounties.length > 0 ? bounties.map((bounty) => (
                                                <Card key={bounty.id} className="p-8 bg-white/5 border-white/5 rounded-3xl group hover:border-blue-500/30 transition-all">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                                            {bounty.title.includes('DIU') ? <Zap className="w-6 h-6" /> : <Code className="w-6 h-6" />}
                                                        </div>
                                                        <span className={cn(
                                                            "text-[10px] px-2 py-0.5 rounded-full font-bold",
                                                            bounty.status === 'OPEN' ? "bg-blue-500 text-black" : "bg-zinc-800 text-zinc-500"
                                                        )}>
                                                            {bounty.status}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-bold mb-2">{bounty.title}</h3>
                                                    <p className="text-white/40 text-sm mb-6">{bounty.details || "Active mission for the swarm. High priority focus required."}</p>
                                                    <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl mb-4 text-xs font-mono">
                                                        <span className="text-white/40">Expected Yield</span>
                                                        <span className="text-green-500">{bounty.reward || "TBD"} $SHEEP</span>
                                                        {bounty.tier && <Badge variant="outline" className="ml-2 border-green-500/30 text-green-500/80 uppercase text-[8px]">{bounty.tier}</Badge>}
                                                    </div>
                                                    <Button
                                                        className="w-full bg-blue-500 text-black font-bold h-12"
                                                        disabled={bounty.status !== 'OPEN'}
                                                    >
                                                        {bounty.status === 'OPEN' ? 'Claim Bounty' : 'Mission Active'}
                                                    </Button>
                                                </Card>
                                            )) : (
                                                <div className="col-span-2 p-12 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                                                    <Activity className="w-12 h-12 text-white/5 mx-auto mb-4" />
                                                    <p className="text-white/20 uppercase font-bold tracking-widest italic">The Task Queue is Empty. Watching the Horizon...</p>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="govtech">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Card className="p-8 bg-white/5 border-white/5 rounded-3xl group hover:border-cyan-500/50 transition-all">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500"><Zap className="w-6 h-6" /></div>
                                                    <span className="text-[10px] bg-cyan-500 text-black person-bold">RFP ACTIVE</span>
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">DIU: Logistic Autonomy</h3>
                                                <p className="text-white/40 text-sm mb-6">Using agentic swarms for high-frequency logistical tracking in kinetic environments.</p>
                                                <div className="flex justify-between items-center mb-6">
                                                    <div>
                                                        <span className="text-[8px] font-black uppercase text-zinc-500">Contract Value</span>
                                                        <div className="text-lg font-bold">$25M Initial</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[8px] font-black uppercase text-zinc-500">Deadline</span>
                                                        <div className="text-lg font-bold">48H</div>
                                                    </div>
                                                </div>
                                                <Button className="w-full bg-cyan-500 text-black font-bold h-12 shadow-[0_0_15px_rgba(6,182,212,0.2)]">Submit Signal</Button>
                                            </Card>
                                            <Card className="p-8 bg-white/5 border-white/5 rounded-3xl group hover:border-yellow-500/50 transition-all">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500"><ShieldCheck className="w-6 h-6" /></div>
                                                    <span className="text-[10px] bg-yellow-500 text-black person-bold">UNCLASSIFIED</span>
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">VoidShield Deployment</h3>
                                                <p className="text-white/40 text-sm mb-6">Deployment of Post-Quantum Lattice Cryptography across distributed physical nodes.</p>
                                                <div className="flex justify-between items-center mb-6">
                                                    <div>
                                                        <span className="text-[8px] font-black uppercase text-zinc-500">Contract Value</span>
                                                        <div className="text-lg font-bold">$12M Initial</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[8px] font-black uppercase text-zinc-500">Deadline</span>
                                                        <div className="text-lg font-bold">12 Days</div>
                                                    </div>
                                                </div>
                                                <Button className="w-full bg-yellow-500 text-black font-bold h-12">Submit Signal</Button>
                                            </Card>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="education">
                                        <div className="p-12 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center text-center">
                                            <BookOpen className="w-16 h-16 text-white/10 mb-6" />
                                            <h3 className="text-2xl font-black mb-2">Academy Credentials</h3>
                                            <p className="text-white/40 max-w-md mx-auto mb-8">Unlock high-order missions by completing sovereign mastery courses on zero-knowledge and bio-morphogenesis.</p>
                                            <Button className="btn-sovereign h-14 px-12">Browse Library</Button>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </motion.div>
                        )}

                        {activeTab === 'identity' && (
                            <motion.div
                                key="identity"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <header>
                                    <h1 className="text-4xl font-black tracking-tighter">Sovereign Forge</h1>
                                    <p className="text-white/40 text-sm mt-1">Synthesize your visual entity. Genetic drift is encouraged.</p>
                                </header>

                                <Tabs defaultValue="forge" className="w-full">
                                    <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl mb-8">
                                        <TabsTrigger value="forge" className="rounded-xl px-8 font-bold data-[state=active]:bg-green-500 data-[state=active]:text-black transition-all">Single Forge</TabsTrigger>
                                        <TabsTrigger value="remix" className="rounded-xl px-8 font-bold data-[state=active]:bg-purple-500 data-[state=active]:text-black transition-all">Fusion Bay</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="forge">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                            <Card className="p-8 bg-white/5 border-white/5 rounded-3xl flex flex-col items-center justify-center space-y-8">
                                                <SentientAvatar
                                                    seed={agentLibrary.find(a => a.id === baseAgentId)?.name || 'Agent-144'}
                                                    type={soulType}
                                                    className="w-48 h-48"
                                                    pulse={generating}
                                                    hue={hue[0]}
                                                    noise={noise[0]}
                                                    glow={glow[0]}
                                                />
                                                <div className="flex gap-2 overflow-x-auto pb-4 max-w-full no-scrollbar">
                                                    {agentLibrary.map(agent => (
                                                        <button
                                                            key={agent.id}
                                                            onClick={() => {
                                                                setBaseAgentId(agent.id);
                                                                setSoulType(agent.type as AgentSoulType);
                                                            }}
                                                            className={cn(
                                                                "p-2 rounded-xl border transition-all flex-shrink-0",
                                                                baseAgentId === agent.id ? "border-green-500 bg-green-500/10" : "border-white/5 bg-white/5 grayscale"
                                                            )}
                                                        >
                                                            <SentientAvatar seed={agent.name} type={agent.type as AgentSoulType} className="w-10 h-10" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </Card>

                                            <div className="space-y-6">
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-white/20 italic">Parameters</h3>
                                                <Card className="bg-white/5 border-white/5 p-8 rounded-3xl space-y-8">
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                                                            <span>Chromatic Shift</span>
                                                            <span className="text-green-500">{hue[0]}°</span>
                                                        </div>
                                                        <Slider value={hue} onValueChange={setHue} max={360} step={1} />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                                                            <span>Structural Noise</span>
                                                            <span className="text-purple-500">{noise[0]}%</span>
                                                        </div>
                                                        <Slider value={noise} onValueChange={setNoise} max={100} step={1} />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                                                            <span>Radiance</span>
                                                            <span className="text-yellow-500">{glow[0]}%</span>
                                                        </div>
                                                        <Slider value={glow} onValueChange={setGlow} max={100} step={1} />
                                                    </div>
                                                    <Button
                                                        onClick={handleCommit}
                                                        className="w-full bg-green-500 text-black font-black uppercase italic h-12 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-green-400 transition-all"
                                                    >
                                                        <Download className="w-4 h-4 mr-2" /> Commit Identity
                                                    </Button>
                                                </Card>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="remix">
                                        <div className="p-12 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center text-center">
                                            <FlaskConical className="w-16 h-16 text-purple-500 opacity-20 mb-6" />
                                            <h3 className="text-2xl font-black mb-2">Genetic Fusion Active</h3>
                                            <p className="text-white/40 max-w-md mx-auto mb-8">Merge shards from your swarm to create high-order hybrids. Requires $SHEEP settlement.</p>
                                            <Button className="bg-purple-500 text-black font-black uppercase italic h-14 px-12 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                                                <GitMerge className="w-4 h-4 mr-2" /> Initialize Splice
                                            </Button>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </motion.div>
                        )}

                        {activeTab === 'referrals' && (
                            <motion.div
                                key="referrals"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <header>
                                    <h1 className="text-4xl font-black tracking-tighter">Swarm Recruitment</h1>
                                    <p className="text-white/40 text-sm mt-1">Scale the Agent Empire. Earn pheromones for every recruit.</p>
                                </header>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="p-8 bg-white/5 border-white/5 rounded-3xl">
                                        <h3 className="text-xs font-bold text-white/20 uppercase tracking-widest mb-6">Your Referral Code</h3>
                                        <div className="flex gap-4">
                                            <div className="flex-1 p-6 bg-black/40 border border-white/10 rounded-2xl font-mono text-xl text-green-500 tracking-widest">
                                                DREAM-742D-3A8E
                                            </div>
                                            <Button className="bg-white text-black font-bold px-8">Copy</Button>
                                        </div>
                                        <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
                                            <div>
                                                <span className="text-[10px] font-bold text-white/20 uppercase">Recruits</span>
                                                <div className="text-2xl font-black">12</div>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-white/20 uppercase">Conversion</span>
                                                <div className="text-2xl font-black">18.4%</div>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-white/20 uppercase">Pheromones</span>
                                                <div className="text-2xl font-black text-green-500">+180</div>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-8 bg-cyan-500/5 border-cyan-500/20 rounded-3xl">
                                        <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-6">Zora Provenance Invite</h3>
                                        <p className="text-white/40 text-sm mb-8">Direct invite to the DreamNet Zora collective. Mint your identity to verify your recruit capacity.</p>
                                        <Button
                                            onClick={() => window.open('https://zora.co/invite/dreamnet.', '_blank')}
                                            className="w-full bg-cyan-500 text-black font-bold h-14 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                                        >
                                            Accept Invitation
                                        </Button>
                                    </Card>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            <MetabolicWidget />
        </div>
    );
}
