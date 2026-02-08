import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { cn } from "@/lib/utils";

export type AgentSoulType = "research" | "defense" | "economy" | "social" | "quantum" | "human";

interface SentientAvatarProps {
    seed: string;
    type?: AgentSoulType;
    className?: string;
    isOnline?: boolean;
    pulse?: boolean;
    hue?: number;
    noise?: number;
    glow?: number;
}

const SOUL_COLORS: Record<AgentSoulType, string> = {
    research: "var(--titan-cyan)",
    defense: "#22c55e", // Bio-toxic Green
    economy: "#eab308", // Gold
    social: "#ec4899", // Pink
    quantum: "#8b5cf6", // Purple
    human: "#ffffff",
};

export function SentientAvatar({
    seed,
    type = "research",
    className,
    isOnline = true,
    pulse = false,
    hue = 0,
    noise = 0,
    glow = 0,
}: SentientAvatarProps) {
    const soulColor = SOUL_COLORS[type];

    // Deterministic "Digital Soul" pattern
    const soulPattern = useMemo(() => {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 50%)`;
    }, [seed]);

    return (
        <div className={cn("relative group", className)}>
            <motion.div
                animate={
                    pulse && isOnline
                        ? {
                            scale: [1, 1.1, 1],
                            opacity: [0.5, 0.8, 0.5],
                        }
                        : {}
                }
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full blur-md opacity-50"
                style={{ backgroundColor: soulColor }}
            />

            <Avatar
                className={cn(
                    "border-2 relative z-10",
                    isOnline ? "border-white/20" : "border-gray-500/20 grayscale",
                    type === "glitch" && "animate-pulse"
                )}
                style={{
                    filter: `hue-rotate(${hue}deg) contrast(${100 + noise}%) brightness(${100 + glow}%) ${type === 'void' ? 'grayscale(1) invert(1) brightness(0.5)' : ''}`
                }}
            >
                <AvatarImage
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=${soulPattern.replace('#', '')}&eyes=frame1,frame2,happy,hearts,round,roundFrame01,roundFrame02,sensor,shade01&mouth=bite,closed01,closed02,grimace,smile01,smile02,square01,square02`}
                />
                <AvatarFallback className="bg-[#0b0f13] text-[10px] font-black uppercase text-white/40">
                    {seed.substring(0, 2)}
                </AvatarFallback>
            </Avatar>

            {/* ONLINE STATUS GLOW */}
            {isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0b0f13] z-20 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
            )}

            {/* GLITCH OVERLAY ON HOVER */}
            <motion.div
                whileHover={{ opacity: 0.4 }}
                className="absolute inset-0 z-30 pointer-events-none opacity-0 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] rounded-full"
            />
        </div>
    );
}
