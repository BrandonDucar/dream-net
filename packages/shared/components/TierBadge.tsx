import React from 'react';
import { Badge } from './ui/badge';

export type Tier = 'LARVA' | 'SWARM' | 'COLONY' | 'HIVE' | 'QUEEN';

interface TierBadgeProps {
    tier: string;
    className?: string;
}

export const TierBadge: React.FC<TierBadgeProps> = ({ tier, className }) => {
    const getTierColor = (t: string) => {
        switch (t.toUpperCase()) {
            case 'LARVA': return 'bg-zinc-800 text-zinc-400 border-zinc-700';
            case 'SWARM': return 'bg-blue-900/40 text-blue-400 border-blue-700/50';
            case 'COLONY': return 'bg-purple-900/40 text-purple-400 border-purple-700/50';
            case 'HIVE': return 'bg-amber-900/40 text-amber-400 border-amber-700/50';
            case 'QUEEN': return 'bg-red-900/40 text-red-400 border-red-700/50';
            default: return 'bg-zinc-800 text-zinc-400';
        }
    };

    return (
        <Badge className={`${getTierColor(tier)} border px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold ${className}`}>
            {tier}
        </Badge>
    );
};
