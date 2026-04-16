<script lang="ts">
    import { onMount } from "svelte";

    // Mocking the event bus connection for the UI component
    // In a real app, this would consume the `Solar.Telemetry` event via a WebSocket or Bridge

    let predictionHistory: number[] = [];
    let currentYield = 0;
    let directive = "ANALYZING...";
    let phase = "DAY";

    onMount(() => {
        // Simulate listening to the high-frequency stream
        const interval = setInterval(() => {
            // Mock simulating the "Solar.Telemetry" payload arriving
            const newYield = 50 + Math.random() * 50;
            currentYield = Math.floor(newYield);

            predictionHistory = [...predictionHistory, currentYield];
            if (predictionHistory.length > 50) predictionHistory.shift();

            if (currentYield > 80) directive = "ACCELERATE_COMPUTE";
            else if (currentYield < 30) directive = "CONSERVE_POWER";
            else directive = "MAINTAIN_ORBIT";
        }, 1000); // 1Hz update (High Frequency)

        return () => clearInterval(interval);
    });
</script>

<div
    class="solar-monitor p-4 bg-gray-900 text-cyan-400 font-mono rounded-lg border border-cyan-800 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
>
    <div class="header flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold flex items-center gap-2">
            <span>☀️</span> SOLAR REACH TELEMETRY
        </h3>
        <div
            class="badge px-2 py-1 bg-black rounded border border-cyan-600 text-xs animate-pulse"
        >
            LIVE
        </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="metric bg-black p-2 rounded border border-gray-800">
            <div class="label text-xs text-gray-500">PREDICTED YIELD (kWh)</div>
            <div class="value text-2xl font-bold">{currentYield}</div>
        </div>
        <div class="metric bg-black p-2 rounded border border-gray-800">
            <div class="label text-xs text-gray-500">DIRECTIVE</div>
            <div
                class="value text-sm font-bold"
                class:text-red-500={directive === "CONSERVE_POWER"}
                class:text-green-500={directive === "ACCELERATE_COMPUTE"}
            >
                {directive}
            </div>
        </div>
    </div>

    <div
        class="viz h-32 bg-black rounded border border-gray-800 relative overflow-hidden"
    >
        <!-- SVG Visualization of the yield history -->
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
        >
            <path
                d={`M 0 100 ${predictionHistory.map((v, i) => `L ${i * (100 / 50)} ${100 - v}`).join(" ")} L 100 100 Z`}
                fill="rgba(34, 211, 238, 0.2)"
                stroke="cyan"
                stroke-width="1"
            />
        </svg>
        <div
            class="scanline absolute top-0 left-0 w-full h-[2px] bg-cyan-400 opacity-50 animate-scan"
        ></div>
    </div>

    <div class="footer mt-2 text-xs text-gray-600 flex justify-between">
        <span>PHASE: {phase}</span>
        <span>DIGITAL TWIN: ACTIVE</span>
    </div>
</div>

<style>
    @keyframes scan {
        0% {
            top: 0%;
        }
        100% {
            top: 100%;
        }
    }
    .animate-scan {
        animation: scan 2s linear infinite;
    }
</style>
