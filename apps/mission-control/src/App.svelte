<script lang="ts">
  import { onMount } from 'svelte';

  let swarmStatus = {
    workforce: { activeHeartbeats: 0, totalWorkers: 17000 },
    mesh: { neon: '...', redis: '...', nats: '...', jetstream: '...' },
    agents: { arya: '...', wolfpack: '...', librarian: '...' },
    spikes: [] as any[]
  };

  let logs: string[] = [];

  async function fetchStatus() {
    try {
      const res = await fetch('/api/mission-control/swarm/status');
      swarmStatus = await res.json();
    } catch (e) {
      console.error("Failed to fetch swarm status");
    }
  }

  onMount(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  });
</script>

<main class="dashboard">
  <header>
    <h1>DREAMNET MISSION CONTROL</h1>
    <div class="status-badge">NEURAL MESH ONLINE</div>
  </header>

  <div class="grid">
    <!-- Workforce Card -->
    <div class="card glass">
      <h2>WORKFORCE</h2>
      <div class="stat">
        <span class="value">{swarmStatus.workforce.activeHeartbeats}</span>
        <span class="label">ACTIVE SPIKES / {swarmStatus.workforce.totalWorkers}</span>
      </div>
      <div class="progress-bar">
        <div class="fill" style="width: {(swarmStatus.workforce.activeHeartbeats / swarmStatus.workforce.totalWorkers) * 100}%"></div>
      </div>
    </div>

    <!-- Mesh Infrastructure -->
    <div class="card glass">
      <h2>NEURAL MESH</h2>
      <div class="mesh-grid">
        <div class="node {swarmStatus.mesh.neon === 'connected' ? 'active' : ''}">NEON</div>
        <div class="node {swarmStatus.mesh.redis === 'connected' ? 'active' : ''}">REDIS</div>
        <div class="node {swarmStatus.mesh.nats === 'connected' ? 'active' : ''}">NATS</div>
        <div class="node {swarmStatus.mesh.jetstream === 'connected' ? 'active' : ''}">JETSTREAM</div>
      </div>
    </div>

    <!-- Agent Status -->
    <div class="card glass">
      <h2>SOVEREIGN AGENTS</h2>
      <ul class="agent-list">
        <li><span>ARYA STARK</span> <span class="tag">{swarmStatus.agents.arya}</span></li>
        <li><span>WOLFPACK</span> <span class="tag">{swarmStatus.agents.wolfpack}</span></li>
        <li><span>LIBRARIAN</span> <span class="tag">{swarmStatus.agents.librarian}</span></li>
      </ul>
    </div>

    <!-- Sensory Intelligence -->
    <div class="card glass wide">
      <h2>SENSORY INTELLIGENCE (SPIKES)</h2>
      <div class="spike-grid">
        {#each swarmStatus.spikes as spike}
          <div class="spike-item">
            <span class="type">{spike.type}</span>
            <span class="name">{spike.name}</span>
            <span class="pulse"></span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Integrations -->
    <div class="card glass wide">
      <h2>INTEGRATION MATRIX</h2>
      <div class="icon-grid">
        <div class="icon-item">NOTION</div>
        <div class="icon-item">SLACK</div>
        <div class="icon-item">LINEAR</div>
        <div class="icon-item">GMAIL</div>
        <div class="icon-item">ZAPIER</div>
      </div>
    </div>
  </div>
</main>

<style>
  :global(body) {
    background: radial-gradient(circle at top right, #1a1a2e, #0a0a0a);
    height: 100vh;
    overflow: hidden;
  }

  .dashboard {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
  }

  h1 {
    font-size: 1.5rem;
    letter-spacing: 0.5rem;
    color: #00f2ff;
    text-shadow: 0 0 10px rgba(0, 242, 255, 0.5);
  }

  .status-badge {
    background: rgba(0, 255, 157, 0.1);
    border: 1px solid #00ff9d;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    font-size: 0.7rem;
    color: #00ff9d;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .card {
    padding: 1.5rem;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .glass {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
  }

  .wide {
    grid-column: span 3;
  }

  h2 {
    font-size: 0.8rem;
    margin-top: 0;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.2rem;
  }

  .stat {
    margin: 1.5rem 0;
  }

  .value {
    font-size: 2.5rem;
    font-weight: bold;
    display: block;
  }

  .label {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.3);
  }

  .progress-bar {
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }

  .fill {
    height: 100%;
    background: linear-gradient(90deg, #00f2ff, #00ff9d);
    box-shadow: 0 0 10px #00f2ff;
  }

  .mesh-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .node {
    padding: 1rem;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 0.5rem;
    font-size: 0.6rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.2);
    border: 1px solid transparent;
  }

  .node.active {
    color: #00f2ff;
    border-color: rgba(0, 242, 255, 0.3);
    background: rgba(0, 242, 255, 0.05);
  }

  .agent-list {
    list-style: none;
    padding: 0;
  }

  .agent-list li {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    font-size: 0.8rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .tag {
    background: rgba(255, 255, 255, 0.05);
    padding: 0.1rem 0.5rem;
    border-radius: 0.2rem;
    font-size: 0.6rem;
  }

  .icon-grid {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
  }

  .icon-item {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .spike-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .spike-item {
    background: rgba(255, 255, 255, 0.05);
    padding: 0.8rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.03);
  }

  .spike-item .type {
    font-size: 0.5rem;
    text-transform: uppercase;
    color: #00f2ff;
    display: block;
  }

  .spike-item .name {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.8);
  }

  .pulse {
    width: 8px;
    height: 8px;
    background: #00ff9d;
    border-radius: 50%;
    box-shadow: 0 0 10px #00ff9d;
    animation: blink 2s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
</style>
