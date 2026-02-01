<script lang="ts">
    import { onMount } from "svelte";
    import { fade, scale } from "svelte/transition";

    export let balance: number = 0;
    export let burnRate: number = 0;
    export let history: number[] = [];

    let displayBalance = balance;
    let pulseOpacity = 0.5;

    $: {
        // Smoothly animate the balance display
        const delta = balance - displayBalance;
        if (Math.abs(delta) > 0.001) {
            displayBalance += delta * 0.1;
        } else {
            displayBalance = balance;
        }
    }

    onMount(() => {
        const interval = setInterval(() => {
            pulseOpacity = 0.3 + Math.random() * 0.4;
        }, 100);
        return () => clearInterval(interval);
    });

    function formatNumber(num: number) {
        return num.toLocaleString(undefined, {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
        });
    }
</script>

<div
    class="glass-panel p-6 shimmer-card border-white/5 bg-white/[0.02] flex flex-col h-full relative overflow-hidden"
>
    <!-- Pulse Background Layer -->
    <div
        class="absolute inset-0 bg-neon-cyan/5 transition-opacity duration-300"
        style="opacity: {pulseOpacity};"
    />

    <div class="flex justify-between items-start mb-6 z-10">
        <div>
            <h2
                class="text-sm font-black italic uppercase tracking-tighter text-white/60"
            >
                Joule_Metabolism
            </h2>
            <div
                class="text-3xl font-mono font-bold text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]"
            >
                {formatNumber(displayBalance)}
                <span class="text-xs italic align-middle">J</span>
            </div>
        </div>
        <div class="text-right">
            <span
                class="text-[9px] font-bold uppercase tracking-widest text-neon-pink"
                >Burn_Rate</span
            >
            <div class="text-lg font-mono text-neon-pink">
                -{formatNumber(burnRate)}/s
            </div>
        </div>
    </div>

    <!-- History Sparkline (Simplified Svelte Implementation) -->
    <div class="flex-1 flex items-end gap-[2px] h-24 z-10">
        {#each history.slice(-30) as point, i}
            <div
                class="flex-1 bg-neon-cyan/40 hover:bg-neon-cyan transition-colors"
                style="height: {point}%;"
                in:scale={{ duration: 200, delay: i * 10 }}
            />
        {/each}
    </div>

    <div
        class="mt-4 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-white/30 z-10"
    >
        <span>Economic_Fluidity</span>
        <span class="text-neon-cyan animate-pulse">Synchronized</span>
    </div>
</div>

<style>
    .glass-panel {
        backdrop-filter: blur(16px);
    }
    .shimmer-card::after {
        content: "";
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.03),
            transparent
        );
        transform: rotate(45deg);
        animation: shimmer 10s infinite linear;
        pointer-events: none;
    }
    @keyframes shimmer {
        from {
            transform: rotate(45deg) translateX(-50%);
        }
        to {
            transform: rotate(45deg) translateX(50%);
        }
    }
</style>
