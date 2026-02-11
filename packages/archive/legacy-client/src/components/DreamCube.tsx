import React, { useMemo, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface DreamCubeProps {
    posture?: 'idle' | 'attack' | 'resonate';
    metabolism?: number; // 0.1 to 2.0
}

export const DreamCube: React.FC<DreamCubeProps> = ({ posture = 'idle', metabolism = 1.0 }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Drag Physics
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-100, 100], [30, -30]), { stiffness: 100, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-100, 100], [-30, 30]), { stiffness: 100, damping: 30 });

    // Reactive properties based on posture and metabolism
    const postureConfig = useMemo(() => {
        const baseSpeed = metabolism > 0 ? 40 / metabolism : 40;
        switch (posture) {
            case 'attack':
                return {
                    scale: 1.4,
                    rotationSpeed: baseSpeed / 4, // Fast
                    glowIntensity: 'rgba(255, 0, 0, 0.4)',
                    unfoldSpeed: 5 * metabolism,
                    opacity: 0.95,
                    color: 'text-red-500',
                    border: 'border-red-500/30'
                };
            case 'resonate':
                return {
                    scale: 1.1,
                    rotationSpeed: baseSpeed / 10, // Ultra-fast
                    glowIntensity: 'rgba(255, 0, 255, 0.4)',
                    unfoldSpeed: 2 * metabolism,
                    opacity: 0.9,
                    color: 'text-pink-500',
                    border: 'border-pink-500/30'
                };
            default:
                return {
                    scale: 1,
                    rotationSpeed: baseSpeed,
                    glowIntensity: 'rgba(0, 243, 255, 0.2)',
                    unfoldSpeed: 15 / metabolism,
                    opacity: 0.8,
                    color: 'text-cyan-400',
                    border: 'border-cyan-500/20'
                };
        }
    }, [posture, metabolism]);

    const faceVariants = {
        unfold: (i: number) => ({
            rotateY: [0, 90, 180, 270, 360],
            rotateX: [0, 45, -45, 0],
            scale: [1, 1.2 * postureConfig.scale, 0.8, 1],
            transition: {
                duration: postureConfig.unfoldSpeed,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
            }
        })
    };

    return (
        <div
            className="relative w-96 h-96 flex items-center justify-center perspective-[1500px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="relative w-64 h-64 preserve-3d cursor-grab active:cursor-grabbing"
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.1}
                style={{ x, y, rotateX, rotateY }}
                animate={{
                    rotateX: [0, 360],
                    rotateY: [0, 360],
                    scale: postureConfig.scale * (isHovered ? 1.1 : 1)
                }}
                transition={{
                    rotateX: { duration: postureConfig.rotationSpeed, repeat: Infinity, ease: "linear" },
                    rotateY: { duration: postureConfig.rotationSpeed * 0.8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 0.5, ease: "easeOut" }
                }}
            >
                {[...Array(18)].map((_, i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        variants={faceVariants}
                        animate="unfold"
                        className={`absolute inset-0 border backdrop-blur-3xl transition-all ${postureConfig.border}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            transform: `rotateY(${i * 20}deg) translateZ(${128 + (isHovered ? 20 : 0)}px)`,
                            background: i % 2 === 0
                                ? 'linear-gradient(135deg, rgba(84, 255, 153, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)' // Liquid Glass Iridescence
                                : 'rgba(10, 15, 10, 0.9)',
                            boxShadow: i % 2 === 0
                                ? `0 0 50px ${postureConfig.glowIntensity}, inset 0 0 30px rgba(255, 255, 255, 0.05)`
                                : `inset 0 0 20px rgba(0, 0, 0, 0.9)`,
                            borderRadius: '12px',
                            opacity: postureConfig.opacity
                        }}
                    >
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 opacity-40 pointer-events-none"></div>

                        <div className="p-4 flex flex-col justify-between h-full relative z-10 font-mono">
                            <div className="flex justify-between items-start">
                                <div className="text-[7px] font-black text-white/30 uppercase tracking-[0.4em]">
                                    SEG_{i.toString().padStart(2, '0')}
                                </div>
                                <div className={`w-1 h-1 rounded-full animate-ping ${i % 3 === 0 ? 'bg-lime-500' : 'bg-red-500'}`} />
                            </div>

                            <div className="flex-1 flex flex-col justify-center items-center gap-1 opacity-60 scale-75">
                                <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-lime-500"
                                        animate={{ width: ['0%', '100%', '30%'] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    />
                                </div>
                                <div className="text-[6px] text-white/20">BIO_LOAD: {Math.round(Math.random() * 100)}%</div>
                            </div>

                            <div className="space-y-1">
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                                    <span className={postureConfig.color}>{posture}</span>
                                    {posture === 'attack' && i % 6 === 0 && (
                                        <span className="text-red-500 animate-pulse">SHIELD_LOCK</span>
                                    )}
                                    {posture === 'resonate' && i % 4 === 0 && (
                                        <span className="text-pink-500 animate-pulse">VIBE_SYNC</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* The Core (Heartbeat) */}
                <motion.div
                    animate={{
                        scale: [1, 2 * metabolism, 1],
                        opacity: [0.2, 0.8, 0.2]
                    }}
                    transition={{
                        duration: 1.5 / metabolism,
                        repeat: Infinity,
                        ease: "anticipate"
                    }}
                    className="absolute inset-0 blur-[120px] rounded-full"
                    style={{ background: postureConfig.glowIntensity }}
                />
            </motion.div>

            {/* Orbital Synchrony Rings */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30">
                <motion.div
                    animate={{ rotate: -360, scale: postureConfig.scale }}
                    transition={{ rotate: { duration: 30 / metabolism, repeat: Infinity, ease: "linear" } }}
                    className="w-[120%] h-[120%] border border-white/5 rounded-full border-dashed" />
                <motion.div
                    animate={{ rotate: 360, scale: postureConfig.scale * 1.3 }}
                    transition={{ rotate: { duration: 20 / metabolism, repeat: Infinity, ease: "linear" } }}
                    className="w-[140%] h-[140%] border border-white/10 rounded-full" />
            </div>
        </div>
    );
};
