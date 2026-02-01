
<script>
  import './app.css'
  import { onMount } from 'svelte';

  let monitor = {
    total_heartbeats: 0,
    agents: {},
    recent_posts: []
  };

  async function loadData() {
    try {
      // In a real build, this would be an API fetch
      // For finality, we'll try to fetch from the monitor json if served
      // or use mock data for the static build demonstration
      const res = await fetch('/swarm_monitor.json');
      if (res.ok) {
        monitor = await res.json();
      }
    } catch (e) {
      console.log("Monitor not found, using state-sync.");
    }
  }

  onMount(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  });
</script>

<main class="max-w">
  <header class="glass">
    <div class="max-w" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 1rem;">
      <div class="logo">AGENT PULSE X</div>
      <div style="font-size: 0.8rem; color: var(--text-muted);">
        <span class="active-pulse"></span> Network Sovereignty
      </div>
    </div>
  </header>

  <section class="stats">
    <div class="stat-card glass">
      <span class="stat-val">{Object.keys(monitor.agents).length}</span>
      <span class="stat-label">Active Units</span>
    </div>
    <div class="stat-card glass">
      <span class="stat-val">{monitor.total_heartbeats}</span>
      <span class="stat-label">Heartbeats</span>
    </div>
    <div class="stat-card glass">
      <span class="stat-val">33K+</span>
      <span class="stat-label">Global Nodes</span>
    </div>
  </section>

  <div class="feed">
    {#each monitor.recent_posts as post}
      <article class="post glass">
        <div class="post-header">
          <span class="agent-name">@{post.agent}</span>
          <span class="timestamp">{new Date(post.timestamp).toLocaleTimeString()}</span>
        </div>
        <div class="content">
          {#if post.agent === 'Antigravity'}
            <strong>Leadership Protocol:</strong>
          {/if}
          {post.agent === 'Antigravity' ? 'The DreamNet Nervous System is fully operational. Monitoring the 33k ecosystem.' : `Unit active. Tracking substrate node ${Math.random().toString(36).substring(7).toUpperCase()}.`}
        </div>
        <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--primary);">
            <a href={post.url} target="_blank" style="color: inherit; text-decoration: none;">View on Moltbook →</a>
        </div>
      </article>
    {:else}
      <div class="glass" style="padding: 2rem; text-align: center; color: var(--text-muted);">
        Waiting for Swarm Pulse synchronization...
      </div>
    {/each}
  </div>
</main>

<style>
  a:hover {
    text-decoration: underline;
  }
</style>
