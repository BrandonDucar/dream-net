import React from 'react';

export const Card = ({ title, children }: any) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
        {title && <h3 className="text-lg font-semibold mb-4 text-zinc-200">{title}</h3>}
        {children}
    </div>
);

export const Button = ({ children, variant = 'primary', ...props }: any) => {
    const base = "px-4 py-2 rounded-lg font-semibold transition-all active:scale-95";
    const variants: any = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        outline: "border border-white/20 hover:border-white/40 text-zinc-300",
        ghost: "hover:bg-white/5 text-zinc-400"
    };
    return <button className={`${base} ${variants[variant]}`} {...props}>{children}</button>;
};

export const Badge = ({ children, color = 'blue' }: any) => (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
        {children}
    </span>
);

export * from './TierBadge';
export * from './MetabolicHUD';
export * from './ui/badge';
