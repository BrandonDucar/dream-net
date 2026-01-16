
import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

export default function GodModePage() {
    const [telemetry, setTelemetry] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshCount, setRefreshCount] = useState(0);

    // Initial Fetch
    useEffect(() => {
        const fetchGodView = async () => {
            try {
                const res = await fetch('/api/god-view/sync');
                const data = await res.json();
                setTelemetry(data.telemetry);
                setLoading(false);
            } catch (e) {
                console.warn("God View signal lost. Switching to Simulation Mode.", e);
                // Mock Data for Demo/Preview if API is unreachable
                setTelemetry({
                    timestamp: Date.now(),
                    systemHealth: 'SIMULATED',
                    earthquakes: { significant_count: 2, latest_significant: [{ magnitude: 6.5, location: 'Simulated Rift' }] },
                    flights: { tracked_vectors: [{ callsign: 'DREAM-1', origin_country: 'United States', velocity: 250 }] },
                    solar: { caption: 'Simulation Feed', image_url: 'https://epic.gsfc.nasa.gov/archive/natural/2023/10/05/png/epic_1b_20231005003633.png' },
                    wolfPack: [{ action: 'HUNTING', target: 'Simulated Grant', timestamp: Date.now() }],
                    trends: { github: { active_repos: ['dream-net', 'nerve'] }, reddit: { hot_topics: [{ title: 'Simulated Hive Mind Post', url: '#' }] } }
                });
                setLoading(false);
            }
        };

        const interval = setInterval(fetchGodView, 2000); // 2s polling for "Live" feel
        fetchGodView();
        return () => clearInterval(interval);
    }, []);

    const triggerPulse = async () => {
        await fetch('/api/god-view/pulse', { method: 'POST' });
        setRefreshCount(c => c + 1);
    };

    if (loading) return <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center text-2xl animate-pulse">CONNECTING TO TITAN LINK...</div>;

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono p-4 overflow-hidden relative selection:bg-green-900">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, .3) 25%, rgba(0, 255, 0, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, .3) 75%, rgba(0, 255, 0, .3) 76%, transparent 77%, transparent)',
                backgroundSize: '50px 50px'
            }}></div>

            {/* HEADER */}
            <div className="flex justify-between items-end border-b-2 border-green-800 pb-2 mb-6 z-10 relative">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter">GOD VIEW <span className="text-xs align-top opacity-50">v1.0</span></h1>
                    <p className="opacity-70 text-sm">/// DREAMNET SOVEREIGN COMMAND UTILITY</p>
                </div>
                <div className="text-right">
                    <p className="text-xl">{telemetry?.timestamp ? new Date(telemetry.timestamp).toLocaleTimeString() : '--:--:--'}</p>
                    <button
                        onClick={triggerPulse}
                        className="mt-2 bg-green-900/30 hover:bg-green-500 hover:text-black border border-green-500 px-4 py-1 text-sm transition-all uppercase"
                    >
                        INITIATE SENSORY PULSE
                    </button>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 h-[80vh]">

                {/* COL 1: ENVIRONMENTAL */}
                <div className="space-y-6">
                    {/* FLIGHTS */}
                    <div className="border border-green-800 bg-black/80 p-4 relative group">
                        <div className="absolute top-0 right-0 p-1 text-[10px] bg-green-900 text-green-100">AIRSPACE</div>
                        <h2 className="text-xl mb-2">✈️ AERIAL VECTORS</h2>
                        <div className="opacity-80 text-sm h-32 overflow-y-auto">
                            {telemetry?.flights?.tracked_vectors?.length > 0 ? (
                                telemetry.flights.tracked_vectors.map((f: any, i: number) => (
                                    <div key={i} className="flex justify-between border-b border-green-900/50 py-1">
                                        <span>{f.callsign}</span>
                                        <span>{f.origin_country}</span>
                                        <span className="text-green-300">{Math.round(f.velocity)} m/s</span>
                                    </div>
                                ))
                            ) : <div className="opacity-50 italic">No Vectors Detected in Sector.</div>}
                        </div>
                    </div>

                    {/* QUAKES */}
                    <div className="border border-green-800 bg-black/80 p-4 relative">
                        <div className="absolute top-0 right-0 p-1 text-[10px] bg-green-900 text-green-100">SEISMIC</div>
                        <h2 className="text-xl mb-2">🌍 TECTONIC SHIFTS</h2>
                        <div className="text-sm">
                            <p>SIGNIFICANT EVENTS (24H): <span className="text-2xl font-bold">{telemetry?.earthquakes?.significant_count || 0}</span></p>
                            <div className="mt-2 space-y-1">
                                {telemetry?.earthquakes?.latest_significant?.map((q: any, i: number) => (
                                    <div key={i} className="text-xs truncate text-red-400">
                                        [{q.magnitude}] {q.location}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SOLAR */}
                    <div className="border border-green-800 bg-black/80 p-4 relative">
                        <div className="absolute top-0 right-0 p-1 text-[10px] bg-green-900 text-green-100">OPTICAL</div>
                        <h2 className="text-xl mb-2">☀️ PLANETARY VIEW</h2>
                        {telemetry?.solar?.image_url ? (
                            <div className="relative aspect-square w-full overflow-hidden border border-green-900 cursor-pointer group">
                                <img src={telemetry.solar.image_url} alt="Earth" className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
                                <div className="absolute bottom-0 left-0 bg-black/50 text-[10px] p-1 w-full truncate">
                                    {telemetry.solar.caption || 'NASA EPIC'}
                                </div>
                            </div>
                        ) : <div className="h-32 flex items-center justify-center border border-green-900 text-xs">NO VISUAL FEED</div>}
                    </div>
                </div>

                {/* COL 2: MAIN FEED (HUNTING LOG) */}
                <div className="border-x border-green-800 px-6 overflow-y-auto bg-black/40">
                    <h2 className="text-center text-2xl font-bold mb-4 border-b border-green-800 pb-2">🐺 WOLF PACK FEED</h2>
                    <div className="space-y-4">
                        {telemetry?.wolfPack?.length > 0 ? (
                            telemetry.wolfPack.map((log: any, i: number) => (
                                <div key={i} className="border border-green-500/30 p-3 hover:bg-green-900/10 transition-colors">
                                    <div className="flex justify-between text-xs opacity-50 mb-1">
                                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                        <span>{log.source || 'UNKNOWN'}</span>
                                    </div>
                                    <div className="font-bold text-lg text-green-400">{log.action || 'EVENT'}</div>
                                    <div className="text-sm opacity-80">{log.target}</div>
                                    <div className="mt-2 text-xs border-t border-green-900 pt-1 truncate">{log.data?.focus || JSON.stringify(log.data)}</div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center opacity-50 py-10">
                                <p className="animate-pulse">WAITING FOR PREY...</p>
                                <p className="text-xs mt-2">Pack is scouting.</p>
                            </div>
                        )}

                        {/* Mock Item for Visual if empty */}
                        {(!telemetry?.wolfPack || telemetry.wolfPack.length === 0) && (
                            <div className="border border-green-500/30 p-3 opacity-50 blur-[1px]">
                                <div className="flex justify-between text-xs opacity-50 mb-1">
                                    <span>--:--:--</span>
                                    <span>DEV.TO</span>
                                </div>
                                <div className="font-bold text-lg text-green-400">TARGET ACQUIRED</div>
                                <div className="text-sm opacity-80">EXAMPLE_HACKATHON_V1</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* COL 3: TRENDS & SYSTEM */}
                <div className="space-y-6">
                    {/* SYSTEM HEALTH */}
                    <div className={`border p-4 ${telemetry?.systemHealth === 'STABLE' ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'}`}>
                        <h2 className="text-xl mb-1">🏥 SYSTEM VITALS</h2>
                        <div className="text-4xl font-black tracking-widest">{telemetry?.systemHealth || 'WAITING'}</div>
                        <div className="text-xs mt-2 opacity-70">
                            ALIVEMODE: ACTIVE<br />
                            HEARTBEAT: {telemetry?.timestamp || 0}
                        </div>
                    </div>

                    {/* GITHUB TRENDS */}
                    <div className="border border-green-800 bg-black/80 p-4">
                        <h2 className="text-xl mb-2">💻 CODE PULSE</h2>
                        <div className="text-sm space-y-2">
                            {telemetry?.trends?.github?.active_repos?.map((repo: string, i: number) => (
                                <div key={i} className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                    <span className="truncate">{repo}</span>
                                </div>
                            ))}
                            {(!telemetry?.trends?.github?.active_repos) && <span className="opacity-50">NO SIGNAL</span>}
                        </div>
                    </div>

                    {/* REDDIT HIVE */}
                    <div className="border border-green-800 bg-black/80 p-4">
                        <h2 className="text-xl mb-2">🧠 HIVE MIND</h2>
                        <div className="text-xs space-y-2 max-h-40 overflow-hidden">
                            {telemetry?.trends?.reddit?.hot_topics?.map((post: any, i: number) => (
                                <a key={i} href={post.url} target="_blank" rel="noreferrer" className="block hover:text-white hover:underline truncate">
                                     > {post.title.substring(0, 50)}...
                                </a>
                            ))}
                            {(!telemetry?.trends?.reddit?.hot_topics) && <span className="opacity-50">NO SIGNAL</span>}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
