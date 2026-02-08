import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
    return (
        <div className="w-64 bg-black/20 border-r border-white/5 p-6 flex flex-col h-full">
            <div className="text-xl font-black tracking-tighter mb-10 text-blue-500">DREAMNET.LIVE</div>

            <nav className="flex-1 space-y-2">
                <NavLink href="/" icon="🏠">Home</NavLink>
                <NavLink href="/earn" icon="💰">Earn</NavLink>
                <NavLink href="/credentials" icon="🛡️">Credentials</NavLink>
                <NavLink href="/gym" icon="🏋️">ToolGym</NavLink>
                <NavLink href="/referrals" icon="🤝">Referrals</NavLink>
            </nav>

            <div className="pt-6 border-t border-white/5 space-y-2">
                <NavLink href="/settings" icon="⚙️">Settings</NavLink>
            </div>
        </div>
    );
}

function NavLink({ href, icon, children }: any) {
    return (
        <Link href={href}>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer">
                <span className="text-lg">{icon}</span>
                <span className="text-sm font-medium">{children}</span>
            </div>
        </Link>
    );
}
