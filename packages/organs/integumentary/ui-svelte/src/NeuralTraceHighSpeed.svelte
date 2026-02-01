<script lang="ts">
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';

    export let logs: any[] = [];

    interface TraceSpan {
        id: string;
        agentId: string;
        action: string;
        durationMs: number;
        status: 'OK' | 'ERROR';
        timestamp: number;
    }

    let spans: TraceSpan[] = [];

    $: {
        const traceLogs = logs
            .filter(l => l.kind === 'TRACE_SPAN_COMPLETE')
            .map(l => ({
                id: l.payload.id,
                agentId: l.payload.source || 'Unknown',
                action: l.payload.name,
                durationMs: l.payload.duration,
                status: 'OK',
                timestamp: l.timestamp
            }))
            .reverse();

        if (traceLogs.length > 0) {
            spans = traceLogs.slice(0, 20);
        }
    }
</script>

<div class="glass-panel p-8 shimmer-card border-white/5 bg-white/[0.02] flex flex-col h-full overflow-hidden">
    <div class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4">
            <div class="p-2 bg-neon-pink/10 rounded-lg text-xl">🌌</div>
            <div>
                <h2 class="text-lg font-black italic uppercase tracking-tight">Obsidian_Neural_Trace</h2>
                <p class="text-[10px] text-white/40 uppercase tracking-widest">Distributed_Otel_Tracing</p>
            </div>
        </div>
        <div class="flex gap-2 text-[9px] font-bold">
            <span class="px-3 py-1 bg-neon-cyan/20 border border-neon-cyan/40 rounded-full text-neon-cyan animate-pulse">STREAMING_LIVE</span>
        </div>
    </div>

    <div class="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-hide">
        {#each spans as span (span.id)}
            <div
                in:fly={{ x: -20, duration: 300 }}
                out:fade={{ duration: 200 }}
                class="flex items-center gap-4 group"
            >
                <div class="w-1 h-8 rounded-full {span.status === 'OK' ? 'bg-neon-cyan' : 'bg-neon-pink shadow-[0_0_10px_var(--neon-pink)]'}" />
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-end mb-1">
                        <span class="text-[10px] font-mono text-white/80 group-hover:text-white transition-colors truncate">
                            {span.agentId} <span class="text-white/30 text-[8px] tracking-widest">::</span> {span.action}
                        </span>
                        <span class="text-[9px] font-black italic {span.durationMs > 1.0 ? 'text-neon-pink' : 'text-neon-lime'}">
                            {span.durationMs}ms
                        </span>
                    </div>
                    <div class="w-full h-[1px] bg-white/5 relative">
                        <div
                            class="absolute h-full {span.status === 'OK' ? 'bg-neon-cyan/30' : 'bg-neon-pink/30'}"
                            style="width: 100%; transition: width {span.durationMs / 100}s linear;"
                        />
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .glass-panel {
        backdrop-filter: blur(12px);
    }
</style>
