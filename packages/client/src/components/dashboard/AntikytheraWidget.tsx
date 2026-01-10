import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Zap } from "lucide-react";

/**
 * Antikythera Telemetry Widget (Sovereign Implementation)
 * Visualizes REAL data from the Metric Engine.
 * Connects to: POST /api/ops/metrics (via Server)
 * Source: farm_typex_smart.js (TypeX Boxes)
 */

interface MetricPoint {
    timestamp: number;
    value: number;
    name: string;
}

export function AntikytheraWidget() {
    const [history, setHistory] = useState<MetricPoint[]>([]);
    const [boxCount, setBoxCount] = useState(0);
    const [btcPrice, setBtcPrice] = useState<number | null>(null);
    const [weather, setWeather] = useState<{ temp: number, wind: number } | null>(null);

    // Poll for Live Data (Bloomberg Style - 2s Refresh)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch TypeX Box Mined events
                const res = await fetch('/api/ops/metrics/history');
                const json: unknown = await res.json();

                let data: MetricPoint[] = [];

                if (Array.isArray(json)) {
                    // Basic check for array of objects with expected properties
                    if (json.every(item => typeof item === 'object' && item !== null && 'timestamp' in item && 'value' in item && 'name' in item)) {
                        data = json as MetricPoint[];
                    } else {
                        console.warn("Antikythera Sync: Received array but items do not match MetricPoint structure.");
                    }
                } else if (typeof json === 'object' && json !== null && 'history' in json) {
                    const historyArray = (json as { history: unknown }).history;
                    if (Array.isArray(historyArray) && historyArray.every(item => typeof item === 'object' && item !== null && 'timestamp' in item && 'value' in item && 'name' in item)) {
                        data = historyArray as MetricPoint[];
                    } else {
                        console.warn("Antikythera Sync: Received object with 'history' but its items do not match MetricPoint structure.");
                    }
                } else {
                    console.warn("Antikythera Sync: Unexpected JSON structure received.");
                }

                setHistory(data);

                // Extract latest Sovereign Data (Isomorphs)
                // Use a safe find with optional chaining in case data is malformed
                const latestBtc = [...data].reverse().find(m => m.name === 'crypto_price_bitcoin');
                if (latestBtc) setBtcPrice(latestBtc.value);

                const latestTemp = data.find(m => m.name === 'weather_temp');
                const latestWind = data.find(m => m.name === 'weather_wind');
                if (latestTemp && latestWind) {
                    setWeather({ temp: latestTemp.value, wind: latestWind.value });
                }
            } catch (e) {
                console.error("Antikythera Sync Failed:", e);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000);
        return () => clearInterval(interval);
    }, []);

    // Filter for TypeX Chart
    const typeXData = history.filter(m => m.name === 'typex_box_mined').slice(-20);

    return (
        <div className="p-6 bg-black text-green-500 font-mono border border-green-900 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.1)]">
            <div className="flex justify-between items-center mb-6 border-b border-green-900 pb-2">
                <h2 className="text-xl font-bold tracking-widest">AHAB'S DASHBOARD // GLOBAL_OVERWATCH</h2>
                <div className="flex gap-4 text-xs">
                    <span className="animate-pulse">● LIVE</span>
                    <span>Systems: OPTIMAL</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                {/* ISOMORPH NODE: CRYPTO */}
                <div className="border border-green-800 p-4 rounded bg-green-900/10">
                    <h3 className="text-xs text-green-400 mb-1">BITCOIN PULSE</h3>
                    <div className="text-2xl font-bold">
                        {btcPrice ? `$${btcPrice.toLocaleString()}` : "SCANNING..."}
                    </div>
                    <div className="text-xs text-green-600 mt-1">SOURCE: COINGECKO_ISO</div>
                </div>

                {/* ISOMORPH NODE: WEATHER */}
                <div className="border border-green-800 p-4 rounded bg-green-900/10">
                    <h3 className="text-xs text-green-400 mb-1">ATMOSPHERIC STATE (NY)</h3>
                    <div className="text-2xl font-bold">
                        {weather ? `${weather.temp}°C` : "CALIBRATING..."}
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                        WIND: {weather ? `${weather.wind} km/h` : "--"} | OPEN_METEO_ISO
                    </div>
                </div>

                {/* ACTIVE NODE: TYPEX */}
                <div className="border border-green-800 p-4 rounded bg-green-900/10">
                    <h3 className="text-xs text-green-400 mb-1">TYPEX YIELD</h3>
                    <div className="text-2xl font-bold">
                        {typeXData.length > 0 ? typeXData[typeXData.length - 1].value : 0}
                    </div>
                    <div className="text-xs text-green-600 mt-1">AUTO-MINER ACTIVE</div>
                </div>
            </div>

            <div className="h-64 w-full border border-green-900/50 bg-black/50 rounded p-2">
                <h3 className="text-xs text-green-600 mb-2 ml-2">TYPEX VELOCITY (Boxes/Time)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={typeXData}>
                        <XAxis dataKey="timestamp" hide />
                        <YAxis stroke="#15803d" fontSize={10} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', borderColor: '#15803d' }}
                            itemStyle={{ color: '#22c55e' }}
                        />
                        <Line
                            type="step"
                            dataKey="value"
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={{ fill: '#22c55e', r: 2 }}
                            activeDot={{ r: 4, fill: '#fff' }}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
