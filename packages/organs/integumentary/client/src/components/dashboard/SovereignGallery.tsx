import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SovereignGallery.tsx - Avenue 19
 * 
 * Displays autonomous art pieces harvested by the ArtHarvester.
 * These pieces are generated during high-entropy system events.
 */

interface ArtPiece {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    entropy: number;
    temperature: number;
    timestamp: string;
}

export const SovereignGallery: React.FC = () => {
    const [pieces, setPieces] = useState<ArtPiece[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                // In a real scenario, this would fetch from /api/gallery
                // For now, we seed with the agent's first masterwork
                const seed: ArtPiece = {
                    id: 'art-0',
                    title: 'The Entropy Mastermind',
                    description: 'A generative blueprint of the Sovereign Monolith. Captured at the moment of topological fusion.',
                    imageUrl: 'https://storage.googleapis.com/dreamnet-assets/gallery/agent_masterwork_v1.png',
                    entropy: 0.892,
                    temperature: 42.15,
                    timestamp: new Date().toISOString()
                };
                setPieces([seed]);
            } catch (e) {
                console.error("Gallery Offline");
            }
        };

        fetchGallery();
    }, []);

    if (pieces.length === 0) return null;

    const currentPiece = pieces[currentIndex];

    return (
        <div className="sovereign-gallery-container bg-black/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
            <div className="relative aspect-square overflow-hidden group">
                {currentPiece.imageUrl ? (
                    <img
                        src={currentPiece.imageUrl}
                        alt={currentPiece.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                        <span className="text-white/20 font-mono">SIGNAL_LOST</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <motion.h4
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl font-bold text-white mb-2"
                    >
                        {currentPiece.title}
                    </motion.h4>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xs text-white/70 line-clamp-2 italic"
                    >
                        {currentPiece.description}
                    </motion.p>
                </div>

                <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded-full border border-white/10 backdrop-blur-md">
                    <span className="text-[10px] font-mono text-cyan-400">
                        ENTROPY: {currentPiece.entropy.toFixed(3)}
                    </span>
                </div>
            </div>

            <div className="p-4 flex justify-between items-center border-t border-white/5">
                <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
                    Avenue 19: Sovereign Aesthetics
                </span>
                <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
            </div>
        </div>
    );
};
