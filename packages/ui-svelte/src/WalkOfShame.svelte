<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();

  export let targetUser = {
    username: 'unknown.eth',
    avatar: 'https://avatar.vercel.sh/unknown.eth',
    crimes: 'Unspecified Farcaster Offenses',
    bounty: 500
  };

  let selectedWeapon = 'tomato';
  let arsenal = [
    { id: 'tomato', name: 'Rotten Tomato', cost: 0, damage: 10, icon: '🍅' },
    { id: 'cabbage', name: 'Cabbage', cost: 50, damage: 25, icon: '🥬' },
    { id: 'egg', name: 'Rotten Egg', cost: 100, damage: 40, icon: '🥚' },
    { id: 'poop', name: 'Cartoon Poop', cost: 250, damage: 75, icon: '💩' },
    { id: 'wildfire', name: 'Wildfire Flask', cost: 1000, damage: 500, icon: '🧪' }
  ];

  let isThrowing = false;
  let impactMessage = '';
  let shieldStrength = 100; // Iron Tax shield mechanism

  const handleThrow = () => {
    const weapon = arsenal.find(w => w.id === selectedWeapon);
    if (!weapon) return;

    isThrowing = true;
    impactMessage = `Hurling ${weapon.name}...`;

    setTimeout(() => {
      isThrowing = false;
      const damageDealt = weapon.damage;
      shieldStrength = Math.max(0, shieldStrength - damageDealt);
      
      if (shieldStrength === 0) {
        impactMessage = `CRITICAL HIT! Shield shattered. ${targetUser.username} is humiliated.`;
      } else {
        impactMessage = `Hit! Shield absorbed ${damageDealt} damage. Shield at ${shieldStrength}%.`;
      }
      
      dispatch('throw', { weapon, damageDealt, target: targetUser });
      
      setTimeout(() => { impactMessage = ''; }, 3000);
    }, 800);
  };
</script>

<div class="shame-arena">
  <!-- Dynamic Atmosphere -->
  <div class="ambient-light"></div>
  <div class="particles"></div>

  <div class="target-podium">
    <div class="shield-ring" style="--shield-pct: {shieldStrength}%">
      <img src={targetUser.avatar} alt={targetUser.username} class="target-avatar {shieldStrength === 0 ? 'shattered' : ''}" />
    </div>
    <div class="target-info">
      <h2>@{targetUser.username}</h2>
      <p class="crimes">{targetUser.crimes}</p>
      <div class="bounty-badge">Bounty: {targetUser.bounty} $ARYA</div>
    </div>
  </div>

  <div class="arsenal-panel">
    <h3>The Arsenal</h3>
    <div class="weapon-grid">
      {#each arsenal as weapon}
        <button 
          class="weapon-card {selectedWeapon === weapon.id ? 'active' : ''}"
          on:click={() => selectedWeapon = weapon.id}
        >
          <div class="weapon-icon">{weapon.icon}</div>
          <div class="weapon-details">
            <span class="weapon-name">{weapon.name}</span>
            <span class="weapon-cost">{weapon.cost === 0 ? 'Free' : `${weapon.cost} $ARYA`}</span>
          </div>
        </button>
      {/each}
    </div>

    <div class="action-zone">
      <button 
        class="throw-btn" 
        on:click={handleThrow}
        disabled={isThrowing || shieldStrength === 0}
      >
        {isThrowing ? 'Winding Up...' : (shieldStrength === 0 ? 'Target Annihilated' : 'Hurl Weapon')}
      </button>
      
      {#if impactMessage}
        <div class="impact-alert slide-up">{impactMessage}</div>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(body) {
    background: #000;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    margin: 0;
  }

  .shame-arena {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .ambient-light {
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(50,255,100,0.15) 0%, rgba(0,0,0,0) 70%);
    top: -10%;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    z-index: 0;
  }

  .target-podium {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 3rem;
  }

  .shield-ring {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    padding: 10px;
    background: conic-gradient(
      #00ff66 var(--shield-pct), 
      rgba(255,255,255,0.05) var(--shield-pct)
    );
    box-shadow: 0 0 40px rgba(0, 255, 102, calc(var(--shield-pct) / 200));
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    margin-bottom: 1.5rem;
  }

  .target-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #111;
    background: #222;
    transition: all 0.3s;
  }

  .target-avatar.shattered {
    filter: grayscale(1) contrast(1.5) sepia(0.5) hue-rotate(-50deg);
    transform: scale(0.95);
    box-shadow: inset 0 0 50px rgba(255,0,0,0.5);
  }

  .target-info {
    text-align: center;
  }

  .target-info h2 {
    font-size: 2rem;
    font-weight: 800;
    margin: 0 0 0.5rem 0;
    letter-spacing: -1px;
    text-shadow: 0 4px 20px rgba(255,255,255,0.2);
  }

  .crimes {
    color: #ff4444;
    font-size: 1.1rem;
    font-style: italic;
    margin: 0 0 1rem 0;
  }

  .bounty-badge {
    display: inline-block;
    padding: 0.5rem 1.2rem;
    background: linear-gradient(90deg, #ffd700, #ff8c00);
    color: #000;
    font-weight: 800;
    border-radius: 20px;
    font-size: 0.9rem;
    text-transform: uppercase;
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  }

  .arsenal-panel {
    z-index: 10;
    background: rgba(20, 20, 25, 0.6);
    backdrop-filter: blur(30px);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 24px;
    padding: 2.5rem;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  }

  .arsenal-panel h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.2rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .weapon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .weapon-card {
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .weapon-card:hover {
    background: rgba(255,255,255,0.05);
    transform: translateY(-2px);
  }

  .weapon-card.active {
    background: rgba(0, 255, 102, 0.1);
    border-color: #00ff66;
    box-shadow: 0 0 20px rgba(0, 255, 102, 0.2);
    transform: translateY(-4px);
  }

  .weapon-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
  }

  .weapon-details {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .weapon-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: #eee;
    margin-bottom: 0.25rem;
  }

  .weapon-cost {
    font-size: 0.75rem;
    color: #888;
    background: rgba(0,0,0,0.5);
    padding: 0.2rem 0.5rem;
    border-radius: 8px;
  }

  .action-zone {
    position: relative;
  }

  .throw-btn {
    width: 100%;
    padding: 1.25rem;
    background: linear-gradient(135deg, #00ff66, #00b347);
    color: #000;
    border: none;
    border-radius: 12px;
    font-size: 1.2rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 10px 30px rgba(0, 255, 102, 0.3);
  }

  .throw-btn:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 15px 40px rgba(0, 255, 102, 0.5);
  }

  .throw-btn:disabled {
    background: #333;
    color: #666;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  .impact-alert {
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    color: #000;
    padding: 0.75rem 1.5rem;
    border-radius: 30px;
    font-weight: 700;
    white-space: nowrap;
    box-shadow: 0 10px 30px rgba(255,255,255,0.2);
  }

  .slide-up {
    animation: slideUpFade 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }

  @keyframes slideUpFade {
    from { opacity: 0; top: -40px; }
    to { opacity: 1; top: -60px; }
  }
</style>
