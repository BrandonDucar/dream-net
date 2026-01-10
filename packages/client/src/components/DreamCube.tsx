import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface DreamCubeProps {
    posture?: 'idle' | 'attack' | 'resonate';
}

export const DreamCube: React.FC<DreamCubeProps> = ({ posture = 'idle' }) => {
    // Reactive properties based on posture
    const postureConfig = useMemo(() => {
        switch (posture) {
            case 'attack':
                return {
                    scale: 1.4,
                    rotationSpeed: 10,
                    glowIntensity: 'rgba(255, 0, 0, 0.4)',
                    unfoldSpeed: 5,
                    opacity: 0.95
                };
            case 'resonate':
                return {
                    scale: 1.1,
                    rotationSpeed: 60,
                    glowIntensity: 'rgba(255, 0, 255, 0.4)',
                    unfoldSpeed: 20,
                    opacity: 0.9
                };
            default:
                return {
                    scale: 1,
                    rotationSpeed: 40,
                    glowIntensity: 'rgba(0, 243, 255, 0.2)',
                    unfoldSpeed: 15,
                    opacity: 0.8
                };
        }
    }, [posture]);

    const faceVariants = {
        unfold: (i: number) => ({
            rotateY: [0, 90, 180, 270, 360],
            rotateX: [0, 45, -45, 0],
            scale: [1, 1.2 * postureConfig.scale, 0.8, 1],
            transition: {
                duration: postureConfig.unfoldSpeed,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
            }
        })
    };

    return (
        <div className="relative w-96 h-96 flex items-center justify-center perspective-[1500px]">
            <motion.div
                className="relative w-64 h-64 preserve-3d"
                animate={{
                    rotateX: 360,
                    rotateY: 360,
                    scale: postureConfig.scale
                }}
                transition={{
                    rotateX: { duration: postureConfig.rotationSpeed, repeat: Infinity, ease: "linear" },
                    rotateY: { duration: postureConfig.rotationSpeed, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, ease: "anticipate" }
                }}
            >
                {[...Array(18)].map((_, i) => (
                    <motion.div
                        key={i}
                        custom={i}
                        variants={faceVariants}
                        animate="unfold"
                        className="absolute inset-0 border border-white/10 backdrop-blur-xl transition-all"
                        style={{
                            width: '100%',
                            height: '100%',
                            transform: `rotateY(${i * 60}deg) translateZ(128px)`,
                            background: i % 2 === 0
                                ? 'rgba(255, 255, 255, 0.05)' // Liquid Glass panel
                                : 'rgba(0, 0, 0, 0.9)',
                            boxShadow: `inset 0 0 60px ${postureConfig.glowIntensity}`,
                            borderRadius: '12px',
                            opacity: postureConfig.opacity
                        }}
                    >
                        {/* Shimmer overlay for Liquid Glass */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-30 pointer-events-none"></div>

                        <div className="p-4 flex flex-col justify-between h-full relative z-10">
                            <div className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">
                                Segment_{i.toString().padStart(2, '0')}
                            </div>
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                            {posture === 'attack' && i % 4 === 0 && (
                                <div className="text-[10px] text-red-500 font-bold animate-pulse uppercase tracking-widest">Shield_Lock</div>
                            )}
                            {posture === 'resonate' && i % 3 === 0 && (
                                <div className="text-[10px] text-pink-500 font-bold animate-pulse uppercase tracking-widest">Vibe_Sync</div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {/* Internal Glow (The Core) */}
                <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 blur-[150px] rounded-full"
                    style={{ background: postureConfig.glowIntensity }}
                />
            </motion.div>

            {/* Background Geometric Rings */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: -360, scale: postureConfig.scale }}
                    transition={{ rotate: { duration: 60, repeat: Infinity, ease: "linear" } }}
                    className="w-[130%] h-[130%] border border-white/10 rounded-full" />
                <motion.div
                    animate={{ rotate: 360, scale: postureConfig.scale * 1.15 }}
                    transition={{ rotate: { duration: 45, repeat: Infinity, ease: "linear" } }}
                    className="w-[150%] h-[150%] border border-white/5 rounded-full" />
            </div>
        </div>
    );
};
