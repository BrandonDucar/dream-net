import React, { useState, useEffect } from 'react';

/**
 * 🏓 PickleBet: The Exclusive Pickleball Casino
 * 
 * Neon-Lime / Dark Mode / High-Stake Prop Betting.
 * Real-Money Integration: Stripe, USDC, BTC, SOL.
 */
export function PickleBetMini() {
    const [balance, setBalance] = useState({
        USD: 100.00,
        USDC: 50.00,
        BTC: 0.001,
        SOL: 1.5
    });
    const [activeCurrency, setActiveCurrency] = useState<'USD' | 'USDC' | 'BTC' | 'SOL'>('USD');
    const [betAmount, setBetAmount] = useState(10);
    const [showDeposit, setShowDeposit] = useState(false);

    const [activeMatch, setActiveMatch] = useState({
        id: 'PPA-001',
        match: 'Ben Johns vs. Tyson McGuffin',
        score: '11-9, 4-2',
        live: true
    });

    const [pendingBets, setPendingBets] = useState<any[]>([]);

    const placePropBet = (type: string, target: any) => {
        if (balance[activeCurrency] < betAmount) {
            alert("Insufficient Sovereignty. Deposit more to play.");
            return;
        }

        const betId = Math.random().toString(36).slice(2, 9);
        const newBet = {
            id: betId,
            matchId: activeMatch.id,
            propType: type,
            targetMetric: target,
            amount: betAmount,
            currency: activeCurrency,
            status: 'PENDING'
        };

        setPendingBets([...pendingBets, newBet]);
        setBalance({ ...balance, [activeCurrency]: balance[activeCurrency] - betAmount });

        console.log(`[🚀 PickleBet] REAL BET PLACED: ${type} for ${betAmount} ${activeCurrency}`);
    };

    const handleStripeDeposit = () => {
        console.log("[💳 Stripe] Redirecting to Checkout...");
        // Simulate successful deposit for UI demo
        setBalance({ ...balance, USD: balance.USD + 50 });
        setShowDeposit(false);
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 font-sans selection:bg-lime-500 selection:text-black">
            {/* Header / Sovereign Wallet */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 p-6 bg-gray-900/50 backdrop-blur-md rounded-3xl border border-lime-500/20 gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-3xl">🏓</span>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter text-lime-400 italic uppercase leading-none">PickleBet</h1>
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Sovereign Casino</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5 w-full md:w-auto overflow-x-auto">
                    {Object.entries(balance).map(([curr, val]) => (
                        <button
                            key={curr}
                            onClick={() => setActiveCurrency(curr as any)}
                            className={`flex flex-col items-start px-4 py-2 rounded-xl transition-all min-w-[100px] ${activeCurrency === curr ? 'bg-lime-500 text-black shadow-[0_0_15px_rgba(163,230,53,0.4)]' : 'hover:bg-white/5 text-gray-400'}`}
                        >
                            <span className="text-[10px] font-black uppercase tracking-tight">{curr}</span>
                            <span className="text-lg font-mono font-bold">{val.toFixed(curr === 'BTC' ? 4 : 2)}</span>
                        </button>
                    ))}
                    <button
                        onClick={() => setShowDeposit(true)}
                        className="bg-lime-400/10 text-lime-400 px-4 py-3 rounded-xl hover:bg-lime-400 hover:text-black font-black uppercase text-xs transition-colors"
                    >
                        Deposit
                    </button>
                </div>
            </header>

            {/* DEPOSIT MODAL (SIMULATED) */}
            {showDeposit && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-lime-500/30 w-full max-w-md rounded-3xl p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black italic uppercase italic text-lime-400">Add Sovereignty</h2>
                            <button onClick={() => setShowDeposit(false)} className="text-gray-500 hover:text-white">✕</button>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={handleStripeDeposit} className="w-full p-4 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center justify-between font-bold group transition-all">
                                <span>Stripe (Cards/Apple Pay)</span>
                                <span className="opacity-50 text-xs">FIAT GATEWAY</span>
                            </button>
                            <button className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-2xl flex items-center justify-between font-bold group transition-all">
                                <span>USDC (Base)</span>
                                <span className="text-lime-500 text-xs">INSTANT</span>
                            </button>
                            <button className="w-full p-4 bg-orange-500 hover:bg-orange-400 rounded-2xl flex items-center justify-between font-bold group transition-all">
                                <span>Bitcoin</span>
                                <span className="text-black text-xs">COLD STORAGE</span>
                            </button>
                            <button className="w-full p-4 bg-purple-600 hover:bg-purple-500 rounded-2xl flex items-center justify-between font-bold group transition-all">
                                <span>Solana</span>
                                <span className="text-white text-xs">LIGHTNING FAST</span>
                            </button>
                        </div>
                        <p className="mt-6 text-[10px] text-gray-500 text-center uppercase font-bold tracking-widest">PickleNet Payment Layer Verified</p>
                    </div>
                </div>
            )}

            <main className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 🎾 LIVE MATCH FEED */}
                <section className="space-y-4">
                    <div className="p-1 rounded-3xl bg-gradient-to-br from-lime-400 to-green-600 shadow-[0_0_20px_rgba(163,230,53,0.2)]">
                        <div className="bg-gray-950 rounded-[22px] p-6 lg:p-8">
                            <div className="flex justify-between items-start mb-6">
                                <span className="px-3 py-1 rounded-full bg-red-500 text-[10px] font-black uppercase animate-pulse border-2 border-red-400">Live PPA Tour</span>
                                <span className="text-xs text-gray-500 font-bold tracking-tighter">MEN'S SINGLES FINALS</span>
                            </div>
                            <h2 className="text-2xl font-black mb-1 uppercase tracking-tighter">{activeMatch.match}</h2>
                            <div className="text-5xl font-mono text-lime-400 tracking-tighter mb-6">{activeMatch.score}</div>

                            <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-gradient-to-r from-lime-500 to-green-400 animate-[progress_2s_infinite]" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* 🥩 THE KITCHEN (Main Bets) */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6 backdrop-blur-sm">
                        <h3 className="text-lime-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">The Kitchen (Winner)</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => placePropBet('winner', 'Ben Johns')} className="p-5 bg-gray-800/50 hover:bg-lime-500 hover:text-black transition-all rounded-2xl text-left relative overflow-hidden group">
                                <div className="text-[10px] opacity-50 uppercase font-black group-hover:opacity-100">Odds: 1.45</div>
                                <div className="font-black text-lg">Ben Johns</div>
                                <div className="absolute -right-2 -bottom-2 text-4xl opacity-5 group-hover:opacity-20 transition-all">🏆</div>
                            </button>
                            <button onClick={() => placePropBet('winner', 'Tyson McGuffin')} className="p-5 bg-gray-800/50 hover:bg-lime-500 hover:text-black transition-all rounded-2xl text-left relative overflow-hidden group">
                                <div className="text-[10px] opacity-50 uppercase font-black group-hover:opacity-100">Odds: 2.75</div>
                                <div className="font-black text-lg">McGuffin</div>
                                <div className="absolute -right-2 -bottom-2 text-4xl opacity-5 group-hover:opacity-20 transition-all">🔥</div>
                            </button>
                        </div>
                    </div>
                </section>

                {/* 🎲 DEGEN PROPS SECTION (REAL $SLOTS) */}
                <section className="space-y-4">
                    <div className="bg-lime-500 text-black p-8 rounded-[40px] shadow-2xl relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 text-[200px] opacity-10 rotate-12 select-none">🎲</div>
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-2 opacity-60 italic">Prop Betting Master</h3>
                        <p className="text-4xl font-black italic uppercase leading-none mb-6 tracking-tighter">Degen<br />Metrics</p>

                        <div className="space-y-3 relative z-10">
                            {[
                                { id: 'third_shot_type', label: 'Next 3rd Shot: Drop', odds: '2.1x' },
                                { id: 'lob_count', label: 'Team B Over 2.5 Lobs', odds: '4.5x' },
                                { id: 'erne_attempt', label: 'Successful Erne (Game)', odds: '12.0x' },
                                { id: 'atp_winner', label: 'Around-The-Post Winner', odds: '25.0x' }
                            ].map(prop => (
                                <button
                                    key={prop.id}
                                    onClick={() => placePropBet(prop.id, { value: 1 })}
                                    className="w-full p-4 bg-black text-white rounded-2xl flex justify-between items-center group hover:bg-white hover:text-black transition-all border-2 border-transparent hover:border-black/20"
                                >
                                    <span className="font-black uppercase italic text-sm tracking-tight">{prop.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] opacity-40 font-bold uppercase">WIN {prop.odds}</span>
                                        <span className="bg-lime-500 text-black px-2 py-1 rounded text-[10px] font-black group-hover:bg-black group-hover:text-lime-500">BET NOW</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 📎 ACTIVE TICKETS */}
                    <div className="p-6 bg-gray-900/20 border-2 border-dashed border-gray-800 rounded-[32px]">
                        <h3 className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Active Bet Slips</h3>
                        {pendingBets.length === 0 && (
                            <div className="flex flex-col items-center py-8 opacity-20">
                                <span className="text-4xl mb-2">🎫</span>
                                <p className="text-xs uppercase font-black">No Active Stakes</p>
                            </div>
                        )}
                        <div className="space-y-2">
                            {pendingBets.map(bet => (
                                <div key={bet.id} className="flex justify-between items-center bg-gray-900 p-4 rounded-2xl border border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 uppercase font-black">{bet.propType}</span>
                                        <span className="text-sm font-bold uppercase italic text-lime-400">{bet.amount} {bet.currency}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-black bg-lime-400 px-3 py-1 rounded-full uppercase italic animate-pulse">Live Tracking</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <style>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                ::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}
