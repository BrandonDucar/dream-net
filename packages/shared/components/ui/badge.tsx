import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }: any) => {
    const variants: any = {
        default: 'bg-zinc-800 text-zinc-100',
        blue: 'bg-blue-600/20 text-blue-400 border border-blue-500/20',
        green: 'bg-green-600/20 text-green-400 border border-green-500/20',
        purple: 'bg-purple-600/20 text-purple-400 border border-purple-500/20',
        gold: 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/20',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${variants[variant] || variants.default} ${className}`}>
            {children}
        </span>
    );
};
