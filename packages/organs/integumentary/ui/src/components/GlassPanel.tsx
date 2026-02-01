import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'neon' | 'security' | 'defi';
  glow?: boolean;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  className,
  variant = 'default',
  glow = true
}) => {
  const variants = {
    default: 'border-white/10',
    neon: 'border-cyan-500/30',
    security: 'border-pink-500/30',
    defi: 'border-lime-500/30'
  };

  const glowColors = {
    default: 'shadow-cyan-500/20',
    neon: 'shadow-cyan-500/40',
    security: 'shadow-pink-500/40',
    defi: 'shadow-lime-500/40'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'relative backdrop-blur-xl bg-white/5 rounded-2xl border p-6',
        'before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br',
        'before:from-white/10 before:to-transparent before:-z-10',
        variants[variant],
        glow && `shadow-2xl ${glowColors[variant]}`,
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default GlassPanel;
