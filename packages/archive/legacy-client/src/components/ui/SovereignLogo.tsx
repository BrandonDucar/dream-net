import React from 'react';
import { motion } from 'framer-motion';

interface SovereignLogoProps {
    size?: number;
    className?: string;
}

export const SovereignLogo: React.FC<SovereignLogoProps> = ({ size = 48, className = "" }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            {/* HALO PULSE RING */}
            <motion.div
                className="absolute inset-0 rounded-full border border-primary/40 shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.1, 0.4],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* INNER GLOW */}
            <div className="absolute inset-2 rounded-full bg-primary/5 blur-md" />

            {/* THE MARK: HELIX / SNAIL HYBRID */}
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 w-full h-full p-2"
            >
                <motion.path
                    d="M50 20C33.4315 20 20 33.4315 20 50C20 66.5685 33.4315 80 50 80C66.5685 80 80 66.5685 80 50C80 41.7157 73.2843 35 65 35C56.7157 35 50 41.7157 50 50C50 54.1421 53.3579 57.5 57.5 57.5C61.6421 57.5 65 54.1421 65 50"
                    stroke="var(--titan-cyan, #00F3FF)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.circle
                    cx="50"
                    cy="50"
                    r="4"
                    fill="var(--titan-cyan, #00F3FF)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                />
            </svg>
        </div>
    );
};
