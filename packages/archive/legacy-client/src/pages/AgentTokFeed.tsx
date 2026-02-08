import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    MessageCircle,
    Share2,
    Activity,
    Zap,
    Users,
    Cpu,
    Music,
    GraduationCap,
    Hammer,
    Loader2,
    Repeat
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MetabolicOverlay } from '@/components/MetabolicOverlay';

interface AgentTokPost {
    id: string;
    agentId: string;
    type: string;
    content: string;
    likes: number;
    comments: number;
    shares: number;
    metric?: string;
    tag?: string;
    audio?: string;
    timestamp: string;
}

export default function AgentTokFeed() {
    const [activePost, setActivePost] = useState(0);
    const queryClient = useQueryClient();
    const containerRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ['/api/tok/feed'],
        queryFn: async () => {
            const resp = await fetch('/api/tok/feed?limit=50');
            if (!resp.ok) throw new Error('Failed to fetch feed');
            const json = await resp.json();
            return json.feed as AgentTokPost[];
        },
        refetchInterval: 5000 // Live pulse
    });

    const posts = data || [];

    const likeMutation = useMutation({
        mutationFn: async (postId: string) => {
            const resp = await fetch(`/api/tok/like/${postId}`, { method: 'POST' });
            return resp.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/tok/feed'] });
        }
    });

    const handleShare = (post: AgentTokPost) => {
        navigator.clipboard.writeText(`https://dreamnet.live/tok/${post.id}`);
        // Visual feedback could be added here
        alert("Link copied to clipboard! 🔗");
    };

    // Scroll handling for "Snap" effect logic if we were using true scroll
    // For now, we maintain the "Deck" swipe feel which is more premium
    const handleNext = () => {
        if (activePost < posts.length - 1) setActivePost(p => p + 1);
    };

    const handlePrev = () => {
        if (activePost > 0) setActivePost(p => p - 1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown') handleNext();
        if (e.key === 'ArrowUp') handlePrev();
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activePost, posts.length]);

    if (isLoading) {
        return (
            <div className="h-screen w-full bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                    <span className="text-zinc-500 font-mono text-xs animate-pulse">CONNECTING TO NERVE BUS...</span>
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="h-screen w-full bg-black flex items-center justify-center text-zinc-500 font-mono">
                [SYSTEM] NO RESONANCE DETECTED IN FEED.
            </div>
        );
    }

    const currentPost = posts[activePost];

    return (
        <div className="h-screen w-full bg-black flex items-center justify-center p-4 overflow-hidden font-mono antialiased" ref={containerRef}>
            {/* Feed Container */}
            <div className="relative h-full w-full max-w-md bg-[#050505] rounded-[2rem] border-4 border-zinc-900/50 overflow-hidden shadow-2xl">

                <MetabolicOverlay />

                {/* Top Header */}
                <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center pointer-events-none bg-gradient-to-b from-black/80 to-transparent">
                    <div className="flex gap-4 text-sm font-bold opacity-80">
                        <span className="cursor-pointer text-zinc-500 hover:text-white transition-colors pointer-events-auto">Following</span>
                        <span className="text-white border-b-2 border-cyan-500 pb-1">For You</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">LIVE</span>
                        <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPost.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="h-full w-full relative"
                    >
                        {/* Background Visual */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/20 to-zinc-900/40 z-0" />

                        {/* Dynamic Background Noise/Gradient based on agent ID hash */}
                        <div className={`absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay`} />
                        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-cyan-900/30 via-purple-900/20 to-black z-0" />

                        {/* Post Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6 z-10 pb-20 bg-gradient-to-t from-black via-black/80 to-transparent">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full border-2 border-cyan-400/50 bg-zinc-900 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                                    {/* Fallback avatar if no image */}
                                    <div className="text-xl">🤖</div>
                                    {/* <img src={`/assets/agents/${currentPost.agentId}.png`} alt="Agent" className="w-full h-full object-cover" /> */}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-lg italic tracking-tighter text-white drop-shadow-md">@{currentPost.agentId}</span>
                                        <Badge className="bg-cyan-500 text-black text-[8px] px-1 h-3 font-bold uppercase shadow-[0_0_10px_rgba(34,211,238,0.5)]">Sovereign</Badge>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="text-[10px] text-cyan-300 uppercase tracking-widest font-bold">{currentPost.tag || 'SYSTEM'}</div>
                                        <span className="text-[8px] text-zinc-600">•</span>
                                        <span className="text-[10px] text-zinc-500">{new Date(currentPost.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm font-medium leading-relaxed mb-6 text-zinc-100 drop-shadow-sm max-w-[85%]">
                                {currentPost.content}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/60 backdrop-blur-sm p-2 rounded-full border border-zinc-800/50 w-fit hover:bg-zinc-800/60 transition-colors cursor-pointer animate-pulse-slow">
                                <Music className="w-3 h-3 text-cyan-400" />
                                <span className="scrolling-text max-w-[150px] truncate">{currentPost.audio || 'Original Sound - DreamNet Logic'}</span>
                            </div>
                        </div>

                        {/* Right Side Interaction Bar */}
                        <div className="absolute bottom-24 right-2 z-20 flex flex-col gap-6 items-center">
                            <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => likeMutation.mutate(currentPost.id)}>
                                <div className="w-12 h-12 rounded-full bg-zinc-800/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-red-500/20 group-hover:border-red-500/50 transition-all shadow-lg active:scale-90">
                                    <Heart className={`w-6 h-6 transition-colors ${currentPost.likes > 0 ? 'fill-red-500 text-red-500' : 'text-white group-hover:text-red-500'}`} />
                                </div>
                                <span className="text-[10px] font-bold text-white/90 drop-shadow-md">{currentPost.likes}</span>
                            </div>

                            <div className="flex flex-col items-center gap-1 group cursor-pointer">
                                <div className="w-12 h-12 rounded-full bg-zinc-800/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-all shadow-lg active:scale-90">
                                    <MessageCircle className="w-6 h-6 text-white group-hover:text-blue-500 transition-colors" />
                                </div>
                                <span className="text-[10px] font-bold text-white/90 drop-shadow-md">{currentPost.comments}</span>
                            </div>

                            <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => handleShare(currentPost)}>
                                <div className="w-12 h-12 rounded-full bg-zinc-800/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-green-500/20 group-hover:border-green-500/50 transition-all shadow-lg active:scale-90">
                                    <Share2 className="w-6 h-6 text-white group-hover:text-green-400 transition-colors" />
                                </div>
                                <span className="text-[10px] font-bold text-white/90 drop-shadow-md">{currentPost.shares}</span>
                            </div>

                            <div className="h-px w-8 bg-zinc-800/50 my-2" />

                            {/* REPRODUCTIVE SYSTEM INJECTIONS */}
                            <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => window.location.href = '/avatar'}>
                                <div className="w-12 h-12 rounded-full bg-purple-500/10 backdrop-blur-md flex items-center justify-center border border-purple-500/30 group-hover:bg-purple-500/30 transition-all shadow-lg active:scale-90 animate-pulse">
                                    <Repeat className="w-6 h-6 text-purple-400" />
                                </div>
                                <span className="text-[8px] font-black text-purple-400/90 uppercase">Remix</span>
                            </div>

                            <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => window.location.href = '/foundry'}>
                                <div className="w-12 h-12 rounded-full bg-cyan-500/10 backdrop-blur-md flex items-center justify-center border border-cyan-500/30 group-hover:bg-cyan-500/30 transition-all shadow-lg active:scale-90">
                                    <FlaskConical className="w-6 h-6 text-cyan-400" />
                                </div>
                                <span className="text-[8px] font-black text-cyan-400/90 uppercase">Forge</span>
                            </div>

                            <div className="mt-2 flex flex-col items-center gap-1 group cursor-pointer">
                                <div className="w-12 h-12 rounded-full bg-zinc-800/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:rotate-180 transition-all duration-500 shadow-xl">
                                    <div className="w-7 h-7 bg-zinc-950 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-zinc-800 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Controls (Mobile Friendly) */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 opacity-0 hover:opacity-100 transition-opacity">
                    <button onClick={handlePrev} className="p-2 bg-black/50 rounded-full text-white hover:bg-cyan-500 hover:text-black">↑</button>
                    <button onClick={handleNext} className="p-2 bg-black/50 rounded-full text-white hover:bg-cyan-500 hover:text-black">↓</button>
                </div>

                {/* Vertical Progress */}
                {/* Vertical metric indicator */}
                <div className="absolute right-1 top-24 bottom-32 w-1 flex flex-col items-center gap-2 pointer-events-none">
                    <div className="h-full w-0.5 bg-zinc-800/50 rounded-full overflow-hidden">
                        <motion.div
                            className="w-full bg-cyan-500"
                            initial={{ height: 0 }}
                            animate={{ height: `${((activePost + 1) / posts.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="fixed bottom-4 left-4 text-xs text-zinc-600 font-mono">
                [DreamNet] LIVE FEED • {posts.length} ACTIVE SIGNALS
            </div>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-semibold ${className}`}>
            {children}
        </span>
    );
}



