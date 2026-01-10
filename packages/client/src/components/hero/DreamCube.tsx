import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

export interface Dimension {
    id: string;
    label: string;
    description: string;
    color: string;
    agents: string[];
    traffic?: string;
}

export const DreamCube = ({
    activeDimensions = [],
    onSelectDimension
}: {
    activeDimensions?: Dimension[];
    onSelectDimension?: (dim: Dimension) => void;
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hoveredFace, setHoveredFace] = useState<number | null>(null);

    // DRAG ROTATION
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-500, 500], [180, -180]), { stiffness: 100, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-500, 500], [-180, 180]), { stiffness: 100, damping: 30 });

    const toggleReshape = (e: React.MouseEvent) => {
        // Only toggle if we didn't drag much
        if (Math.abs(x.get()) < 5 && Math.abs(y.get()) < 5) {
            setIsExpanded(!isExpanded);
        }
    };

    const defaultFaces = [
        { id: 'tactical', label: 'TACTICAL', color: '#00F3FF', rot: '0deg', axis: 'Y' },
        { id: 'liquidity', label: 'LIQUIDITY', color: '#BC13FE', rot: '180deg', axis: 'Y' },
        { id: 'metals', label: 'METALS', color: '#FFD700', rot: '90deg', axis: 'Y' },
        { id: 'visual', label: 'VISUAL', color: '#00FF9C', rot: '-90deg', axis: 'Y' },
        { id: 'bio-os', label: 'BIO-OS', color: '#FF4D4D', rot: '90deg', axis: 'X' },
        { id: 'infra', label: 'INFRA', color: '#ffffff', rot: '-90deg', axis: 'X' },
    ];

    const faces = activeDimensions.length >= 6
        ? activeDimensions.slice(0, 6).map((d, i) => ({ ...d, rot: defaultFaces[i].rot, axis: defaultFaces[i].axis }))
        : defaultFaces;

    return (
        <div className="relative w-96 h-96 perspective-[1200px] cursor-grab active:cursor-grabbing group">
            {/* AMBIENT GLOW */}
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"></div>

            <motion.div
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.1}
                style={{ x, y, rotateX, rotateY }}
                className="w-full h-full relative preserve-3d"
                onClick={toggleReshape}
            >
                {faces.map((face, i) => (
                    <motion.div
                        key={face.id}
                        onMouseEnter={() => setHoveredFace(i)}
                        onMouseLeave={() => setHoveredFace(null)}
                        animate={{
                            translateZ: isExpanded ? 240 : 180,
                            rotateX: isExpanded ? (i % 2 === 0 ? 45 : -45) : 0,
                            rotateY: isExpanded ? (i % 3 === 0 ? 45 : -45) : 0,
                            scale: isExpanded ? 0.9 : 1,
                            backgroundColor: hoveredFace === i ? 'rgba(15,15,15,0.98)' : isExpanded ? 'rgba(5,5,5,0.95)' : 'rgba(10,10,20,0.85)'
                        }}
                        transition={{
                            type: "spring",
                            stiffness: isExpanded ? 200 : 400,
                            damping: isExpanded ? 20 : 30
                        }}
                        className="absolute inset-0 border border-primary/20 backdrop-blur-[40px] flex flex-col items-center justify-center overflow-hidden group/face shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                        style={{
                            transform: `rotate${face.axis}(${face.rot}) translateZ(${isExpanded ? 240 : 180}px)`,
                            borderColor: `${face.color}60`,
                        }}
                    >
                        {/* CORE EXPOSURE LAYER (Revealed when star is open) */}
                        <AnimatePresence>
                            {isExpanded && !hoveredFace && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.15 }}
                                    className="absolute inset-0 bg-primary pointer-events-none mix-blend-overlay"
                                />
                            )}
                        </AnimatePresence>

                        {/* TOOLTIP OVERLAY (The "Hover Intelligence") */}
                        <AnimatePresence>
                            {hoveredFace === i && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute inset-0 z-20 bg-black/95 backdrop-blur-3xl p-6 flex flex-col justify-between border border-primary/30"
                                >
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[7px] font-mono text-primary tracking-[0.5em] uppercase">
                                            <span>Core_Access_Granted</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
                                        </div>
                                        <div className="h-[2px] w-full bg-gradient-to-r from-primary to-transparent"></div>
                                        <div className="space-y-3">
                                            <div className="text-[10px] font-mono text-white/50 uppercase tracking-[0.3em]">Neural Load:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {face.agents?.map((agent) => (
                                                    <span key={agent} className="px-3 py-1 rounded-sm bg-primary/20 border border-primary/40 text-[9px] font-mono text-white font-bold uppercase">{agent}</span>
                                                )) || ['UNKNOWN']}
                                            </div>
                                        </div>
                                        <div className="pt-4 text-[8px] font-mono text-gray-600 italic">
                                            "Directive active. Folding reality to sector {i + 1}."
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onSelectDimension?.(face as any);
                                        }}
                                        className="w-full py-3 bg-white text-black text-[10px] font-black tracking-[0.5em] uppercase hover:bg-primary transition-all active:scale-95 shadow-lg"
                                    >
                                        INITIALIZE_CORE
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* RADIATING GRADIENT (Hyper Density) */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-40 group-hover/face:opacity-80 transition-opacity"></div>

                        {/* INTERACTIVE POINTS */}
                        <div className="absolute top-6 left-6 w-1.5 h-1.5 rounded-full bg-primary/60 animate-ping"></div>
                        <div className="absolute bottom-6 right-6 w-1 h-1 rounded-full bg-secondary/60"></div>

                        {/* LABEL (CONCEPT TO REALITY) */}
                        <div className="relative z-10 flex flex-col items-center">
                            <span className="text-[10px] text-primary/80 font-mono tracking-[0.8em] mb-4 uppercase drop-shadow-md">Fold_{i + 1}_ID</span>
                            <span className="text-5xl lg:text-7xl font-black text-white tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{face.label}</span>
                            <motion.div
                                className="h-1 mt-6 bg-primary shadow-[0_0_25px_rgba(0,243,255,1)]"
                                initial={{ width: 0 }}
                                whileHover={{ width: '140%' }}
                            />
                        </div>

                        {/* SENSORY DATA SPARKLES (DNA HYBRID) */}
                        <div className="absolute inset-0 pointer-events-none opacity-30 group-hover/face:opacity-60 transition-opacity">
                            {[...Array(8)].map((_, j) => (
                                <div
                                    key={j}
                                    className="absolute w-px h-16 bg-gradient-to-t from-transparent via-primary to-transparent"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animation: `pulse ${1.5 + Math.random() * 2}s infinite`,
                                        animationDelay: `${Math.random() * 1.5}s`
                                    }}
                                ></div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* MAG DUST */}
            <div className="absolute inset-[-200px] pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full blur-[1px]"
                        style={{
                            backgroundColor: i % 2 === 0 ? '#00F3FF' : '#BC13FE',
                            left: `-20%`,
                            top: `-20%`
                        }}
                        animate={{
                            x: [Math.random() * 600, Math.random() * 600],
                            y: [Math.random() * 600, Math.random() * 600],
                            opacity: [0, 0.5, 0],
                            scale: [0.3, 1.5, 0.3],
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: 10 + Math.random() * 15,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                ))}
            </div>

            <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                <div className="text-[10px] font-mono tracking-[0.8em] text-white/30 uppercase whitespace-nowrap">
                    Drag to Spin // Click to Reshape
                </div>
                <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            </div>

            <style>{`
                .perspective-[1200px] { perspective: 1200px; }
                .preserve-3d { transform-style: preserve-3d; }
                @keyframes pulse {
                    0%, 100% { opacity: 0; transform: translateY(0); }
                    50% { opacity: 1; transform: translateY(-30px); }
                }
            `}</style>
        </div>
    );
};
