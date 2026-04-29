<script lang="ts">
  import { onMount } from 'svelte';
  
  // App State
  let currentStep = 'onboarding'; // 'onboarding', 'dashboard'
  
  // Onboarding State
  let authMethod = ''; // 'wallet', 'fid', 'basename', 'email'
  let authInput = '';
  let isAuthenticating = false;

  // Game State
  let targetUsername = '';
  let grudgeReason = '';
  let stakeAmount = 100; // $ARYA
  let isExecuting = false;
  let statusMessage = '';

  const aryaProfilePic = "/arya_executioner_profile.png"; // Using the generated image

  const handleAuth = async () => {
    isAuthenticating = true;
    // Simulate auth verification (Farcaster Neynar / Base Wallet AgentKit)
    setTimeout(() => {
        isAuthenticating = false;
        currentStep = 'dashboard';
    }, 1500);
  };

  const handleThrowFruit = async () => {
    if (!targetUsername) return;
    
    isExecuting = true;
    statusMessage = `Processing execution of @${targetUsername}...`;

    try {
      const response = await fetch('/api/arya/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attackerId: authInput, // Using their registered auth
          targetUsername,
          grudgeReason,
          stakeAmount
        })
      });

      if (response.ok) {
        statusMessage = `Execution complete. Fruit thrown at @${targetUsername}.`;
      } else {
        statusMessage = `The execution failed. The target survives.`;
      }
    } catch (error) {
      statusMessage = `Execution error: ${error.message}`;
    } finally {
      setTimeout(() => {
        isExecuting = false;
        statusMessage = '';
        targetUsername = '';
        grudgeReason = '';
      }, 5000);
    }
  };
</script>

<div class="executioner-container">
  <!-- Glowing background elements -->
  <div class="glow-orb red"></div>
  <div class="glow-orb dark-red"></div>

  <div class="glass-panel">
    {#if currentStep === 'onboarding'}
      <!-- ONBOARDING FLOW -->
      <div class="header">
        <img src={aryaProfilePic} alt="Arya" class="profile-pic" />
        <h1>🗡️ Arya's List</h1>
        <p class="subtitle">Identify yourself to access the Executioner's Block.</p>
      </div>

      <div class="auth-options">
        <button class="auth-btn" class:selected={authMethod === 'wallet'} on:click={() => authMethod = 'wallet'}>Connect Wallet (Base)</button>
        <button class="auth-btn" class:selected={authMethod === 'fid'} on:click={() => authMethod = 'fid'}>Farcaster FID</button>
        <button class="auth-btn" class:selected={authMethod === 'basename'} on:click={() => authMethod = 'basename'}>Base Name</button>
        <button class="auth-btn" class:selected={authMethod === 'email'} on:click={() => authMethod = 'email'}>Email</button>
      </div>

      {#if authMethod}
        <div class="form-group auth-input-group slide-in">
          <label for="auth-input">Enter your {authMethod.toUpperCase()}</label>
          <input 
            id="auth-input" 
            type="text" 
            placeholder={`Enter ${authMethod}...`} 
            bind:value={authInput}
          />
          <button class="execute-btn mt-4" on:click={handleAuth} disabled={!authInput || isAuthenticating}>
            {isAuthenticating ? 'Verifying Identity...' : 'Enter the Arena'}
          </button>
        </div>
      {/if}

    {:else}
      <!-- DASHBOARD FLOW -->
      <div class="header">
        <img src={aryaProfilePic} alt="Arya" class="profile-pic small" />
        <h1>🗡️ The Executioner's Block</h1>
        <p class="subtitle">Stake $ARYA to throw fruit. A girl never misses.</p>
      </div>

      <div class="form-group">
        <label for="target">Target Farcaster Username</label>
        <input 
          id="target" 
          type="text" 
          placeholder="e.g., dwr.eth" 
          bind:value={targetUsername}
        />
      </div>

      <div class="form-group">
        <label for="weapon">Select Your Weapon (The Arsenal)</label>
        <select id="weapon" bind:value={stakeAmount}>
          <option value="0">Rotten Tomato (Free)</option>
          <option value="50">Cabbage (50 $ARYA)</option>
          <option value="100">Rotten Egg (100 $ARYA)</option>
          <option value="250">Cartoon Poop (250 $ARYA)</option>
          <option value="1000">Wildfire Flask (1000 $ARYA)</option>
          <option value="5000">Valyrian Steel Sword (5000 $ARYA)</option>
        </select>
      </div>

      <div class="form-group">
        <label for="grudge">The Grudge (Reason for Execution)</label>
        <textarea 
          id="grudge" 
          placeholder="They said my NFTs were worthless..." 
          bind:value={grudgeReason}
        ></textarea>
      </div>

      <div class="form-group defense-group">
        <label>Defensive Mechanics</label>
        <button class="defense-btn" on:click={() => statusMessage = "Iron Tax paid. Escape Token secured."}>
          🛡️ Pay the Iron Tax (Buy Escape Token)
        </button>
        <p class="defense-hint">Keep your head attached if you become a target.</p>
      </div>

      <button 
        class="execute-btn" 
        on:click={handleThrowFruit} 
        disabled={isExecuting || !targetUsername}
      >
        {isExecuting ? 'Executing Sequence...' : 'Drop the Blade'}
      </button>

      {#if statusMessage}
        <div class="status-box">
          <p>{statusMessage}</p>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter', 'Outfit', sans-serif;
    background: #050505;
    color: #fff;
  }

  .executioner-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #050505;
    position: relative;
    overflow: hidden;
  }

  .glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    z-index: 1;
    opacity: 0.5;
    animation: drift 20s infinite alternate;
  }

  .glow-orb.red {
    background: #ff003c;
    width: 400px;
    height: 400px;
    top: -100px;
    left: -100px;
  }

  .glow-orb.dark-red {
    background: #8b0000;
    width: 500px;
    height: 500px;
    bottom: -200px;
    right: -100px;
    animation-delay: -5s;
  }

  @keyframes drift {
    0% { transform: translate(0, 0); }
    100% { transform: translate(50px, 50px); }
  }

  .glass-panel {
    background: rgba(15, 15, 18, 0.7);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 50, 50, 0.15);
    border-radius: 24px;
    padding: 3rem;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 32px 64px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.05);
    position: relative;
    z-index: 10;
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .profile-pic {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid #ff003c;
    box-shadow: 0 0 30px rgba(255, 0, 60, 0.4);
    margin-bottom: 1rem;
    object-fit: cover;
  }

  .profile-pic.small {
    width: 80px;
    height: 80px;
  }

  .header h1 {
    font-size: 2.2rem;
    font-weight: 800;
    margin: 0 0 0.5rem 0;
    background: linear-gradient(135deg, #ff4b4b, #9b0000);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 20px rgba(255, 0, 60, 0.2);
    letter-spacing: -0.02em;
  }

  .subtitle {
    color: #a0a0a0;
    font-size: 1rem;
    margin: 0;
  }

  .auth-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .auth-btn {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #ccc;
    padding: 1rem;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .auth-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 50, 50, 0.4);
  }

  .auth-btn.selected {
    background: rgba(255, 0, 60, 0.1);
    border-color: #ff003c;
    color: #fff;
    box-shadow: 0 0 15px rgba(255, 0, 60, 0.2);
  }

  .mt-4 { margin-top: 1rem; }

  .slide-in {
    animation: slideIn 0.3s ease forwards;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    color: #bbb;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  input, textarea, select {
    width: 100%;
    background: rgba(10, 10, 12, 0.8);
    border: 1px solid rgba(255, 50, 50, 0.2);
    border-radius: 12px;
    padding: 1.2rem;
    color: #fff;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-sizing: border-box;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #ff003c;
    box-shadow: 0 0 25px rgba(255, 0, 60, 0.25), inset 0 2px 4px rgba(0, 0, 0, 0.5);
    background: rgba(20, 15, 15, 0.9);
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  .execute-btn {
    width: 100%;
    background: linear-gradient(135deg, #ff003c 0%, #8b0000 100%);
    color: white;
    border: 1px solid rgba(255, 100, 100, 0.3);
    padding: 1.25rem;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    text-transform: uppercase;
    letter-spacing: 0.15em;
    box-shadow: 0 10px 30px rgba(255, 0, 60, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;
  }

  .execute-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 50%; height: 100%;
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
    transform: skewX(-25deg);
    transition: all 0.75s;
  }

  .execute-btn:hover:not(:disabled)::before {
    left: 200%;
  }

  .execute-btn:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 15px 40px rgba(255, 0, 60, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.3);
    background: linear-gradient(135deg, #ff1a53 0%, #a30000 100%);
  }

  .execute-btn:disabled {
    background: #2a2a2a;
    color: #555;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  .status-box {
    margin-top: 1.5rem;
    padding: 1.2rem;
    background: rgba(255, 0, 60, 0.05);
    border-radius: 12px;
    text-align: center;
    border-left: 4px solid #ff003c;
    color: #fff;
    font-weight: 500;
    animation: slideIn 0.3s ease;
  }

  select {
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 1.2rem;
    color: #fff;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.2s ease;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 1.2rem top 50%;
    background-size: 0.65rem auto;
  }

  select:focus {
    outline: none;
    border-color: rgba(255, 0, 60, 0.6);
    box-shadow: 0 0 20px rgba(255, 0, 60, 0.15);
  }

  select option {
    background: #111;
    color: #fff;
    padding: 1rem;
  }

  .defense-group {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
  }

  .defense-btn {
    width: 100%;
    background: rgba(100, 100, 100, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #eee;
    padding: 1rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .defense-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #fff;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
  }

  .defense-hint {
    color: #777;
    font-size: 0.8rem;
    text-align: center;
    margin-top: 0.75rem;
    margin-bottom: 0;
  }
</style>
