<script lang="ts">
  import { onMount, tick } from 'svelte';

  // ── Props ────────────────────────────────────────────────────────────────────
  export let userHandle = 'stranger'; // Farcaster handle / wallet / basename

  // ── State ────────────────────────────────────────────────────────────────────
  interface Message {
    role: 'arya' | 'user';
    text: string;
    ts: number;
  }

  let messages: Message[] = [
    {
      role: 'arya',
      text: `Valar Morghulis, @${userHandle}. I know who you are. I know what you've done. Ask me anything — or pick a target and let's get to work.`,
      ts: Date.now()
    }
  ];

  let input = '';
  let isTyping = false;
  let chatEl: HTMLDivElement;
  let inputEl: HTMLTextAreaElement;

  // ── Suggested prompts ────────────────────────────────────────────────────────
  const suggestions = [
    '🗡️ Who has the highest bounty right now?',
    '💰 How many $ARYA have I earned?',
    '🧪 Tell me about Wildfire',
    '🛡️ How does the Iron Tax work?',
    '🌍 What is happening in the world right now?',
    '👁️ Tell me about yourself, Arya'
  ];

  // ── Scroll to bottom ─────────────────────────────────────────────────────────
  async function scrollToBottom() {
    await tick();
    if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;
  }

  // ── Send message ──────────────────────────────────────────────────────────────
  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || isTyping) return;

    messages = [...messages, { role: 'user', text: content, ts: Date.now() }];
    input = '';
    isTyping = true;
    await scrollToBottom();

    try {
      const res = await fetch('/api/arya/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, userHandle })
      });

      const data = await res.json();
      const reply = data.reply ?? data.message ?? "A girl has no words. Try again.";

      messages = [...messages, { role: 'arya', text: reply, ts: Date.now() }];
    } catch {
      messages = [...messages, {
        role: 'arya',
        text: "The Nerve Bus is silent. Even the dead need a moment. Try again soon.",
        ts: Date.now()
      }];
    } finally {
      isTyping = false;
      await scrollToBottom();
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function shareFarcaster(msg: Message) {
    const text = encodeURIComponent(`"${msg.text}" — @arya on the Executioner's Block 🗡️`);
    window.open(`https://warpcast.com/~/compose?text=${text}`, '_blank');
  }

  onMount(() => scrollToBottom());
</script>

<!-- ── Markup ─────────────────────────────────────────────────────────────── -->
<div class="chat-wrapper">

  <!-- Ambient atmosphere -->
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>

  <div class="chat-panel">

    <!-- Header -->
    <div class="chat-header">
      <div class="avatar-ring">
        <img src="/arya_executioner_profile.png" alt="Arya" class="avatar" />
        <span class="online-dot"></span>
      </div>
      <div class="header-info">
        <h2>Arya Stark</h2>
        <p class="status">⚡ Online · Executioner Engine · 503 Agents Active</p>
      </div>
      <div class="header-badge">SOVEREIGN</div>
    </div>

    <!-- Message thread -->
    <div class="thread" bind:this={chatEl}>
      {#each messages as msg (msg.ts)}
        <div class="msg-row {msg.role}">

          {#if msg.role === 'arya'}
            <img src="/arya_executioner_profile.png" alt="Arya" class="msg-avatar" />
          {/if}

          <div class="bubble {msg.role}">
            <p>{msg.text}</p>
            <div class="bubble-footer">
              <span class="ts">{new Date(msg.ts).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</span>
              {#if msg.role === 'arya'}
                <button class="share-btn" on:click={() => shareFarcaster(msg)} title="Share to Farcaster">
                  🟣 Cast
                </button>
              {/if}
            </div>
          </div>
        </div>
      {/each}

      {#if isTyping}
        <div class="msg-row arya">
          <img src="/arya_executioner_profile.png" alt="Arya" class="msg-avatar" />
          <div class="bubble arya typing-bubble">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </div>
        </div>
      {/if}
    </div>

    <!-- Suggestions -->
    {#if messages.length < 3}
      <div class="suggestions">
        {#each suggestions as s}
          <button class="suggestion-chip" on:click={() => sendMessage(s)}>{s}</button>
        {/each}
      </div>
    {/if}

    <!-- Input bar -->
    <div class="input-bar">
      <textarea
        bind:this={inputEl}
        bind:value={input}
        on:keydown={onKeydown}
        placeholder="Speak your truth to the Executioner..."
        rows="1"
      ></textarea>
      <button class="send-btn" on:click={() => sendMessage()} disabled={!input.trim() || isTyping}>
        🗡️
      </button>
    </div>

  </div>
</div>

<!-- ── Styles ──────────────────────────────────────────────────────────────── -->
<style>
  :global(body) {
    margin: 0;
    background: #030303;
    color: #fff;
    font-family: 'Outfit', 'Inter', sans-serif;
  }

  .chat-wrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  /* ── Atmosphere ── */
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
  }
  .orb-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(255,0,60,0.18) 0%, transparent 70%);
    top: -15%; left: -10%;
    animation: drift 22s infinite alternate ease-in-out;
  }
  .orb-2 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(120,0,200,0.12) 0%, transparent 70%);
    bottom: -20%; right: -10%;
    animation: drift 28s infinite alternate-reverse ease-in-out;
  }
  @keyframes drift {
    0%   { transform: translate(0, 0) scale(1); }
    100% { transform: translate(40px, 40px) scale(1.1); }
  }

  /* ── Panel ── */
  .chat-panel {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 680px;
    height: 85vh;
    max-height: 820px;
    background: rgba(12, 12, 15, 0.75);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border: 1px solid rgba(255, 0, 60, 0.12);
    border-radius: 28px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow:
      0 40px 80px rgba(0,0,0,0.7),
      0 0 0 1px rgba(255,255,255,0.03),
      inset 0 1px 0 rgba(255,255,255,0.06);
  }

  /* ── Header ── */
  .chat-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    background: rgba(0,0,0,0.3);
    flex-shrink: 0;
  }
  .avatar-ring {
    position: relative;
    flex-shrink: 0;
  }
  .avatar {
    width: 50px; height: 50px;
    border-radius: 50%;
    border: 2px solid #ff003c;
    object-fit: cover;
    box-shadow: 0 0 18px rgba(255,0,60,0.5);
  }
  .online-dot {
    position: absolute;
    bottom: 2px; right: 2px;
    width: 10px; height: 10px;
    background: #00ff66;
    border-radius: 50%;
    border: 2px solid #0a0a0f;
    box-shadow: 0 0 8px #00ff66;
  }
  .header-info { flex: 1; }
  .header-info h2 {
    margin: 0 0 2px 0;
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    background: linear-gradient(90deg, #ff4b4b, #ffffff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .status {
    margin: 0;
    font-size: 0.75rem;
    color: #555;
    font-weight: 500;
  }
  .header-badge {
    background: linear-gradient(135deg, #ff003c, #8b0000);
    color: #fff;
    font-size: 0.65rem;
    font-weight: 900;
    letter-spacing: 0.15em;
    padding: 0.3rem 0.7rem;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(255,0,60,0.3);
  }

  /* ── Thread ── */
  .thread {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    scroll-behavior: smooth;
  }
  .thread::-webkit-scrollbar { width: 4px; }
  .thread::-webkit-scrollbar-track { background: transparent; }
  .thread::-webkit-scrollbar-thumb { background: rgba(255,0,60,0.2); border-radius: 4px; }

  .msg-row {
    display: flex;
    align-items: flex-end;
    gap: 0.6rem;
    animation: msgPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  .msg-row.user { flex-direction: row-reverse; }

  @keyframes msgPop {
    from { opacity: 0; transform: translateY(8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .msg-avatar {
    width: 30px; height: 30px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid rgba(255,0,60,0.3);
    flex-shrink: 0;
  }

  .bubble {
    max-width: 72%;
    padding: 0.9rem 1.2rem;
    border-radius: 18px;
    font-size: 0.95rem;
    line-height: 1.6;
    position: relative;
  }
  .bubble p { margin: 0 0 0.35rem 0; }
  .bubble.arya {
    background: rgba(255,0,60,0.08);
    border: 1px solid rgba(255,0,60,0.15);
    border-bottom-left-radius: 4px;
    color: #e8e8e8;
  }
  .bubble.user {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-bottom-right-radius: 4px;
    color: #fff;
    text-align: right;
  }

  .bubble-footer {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 0.2rem;
  }
  .ts { font-size: 0.7rem; color: #444; }
  .share-btn {
    background: none;
    border: none;
    color: #888;
    font-size: 0.7rem;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
  }
  .share-btn:hover { color: #8b5cf6; }

  /* ── Typing indicator ── */
  .typing-bubble {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 1rem 1.2rem;
    min-width: 60px;
  }
  .dot {
    width: 7px; height: 7px;
    background: rgba(255,0,60,0.6);
    border-radius: 50%;
    animation: blink 1.2s infinite;
  }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink {
    0%, 80%, 100% { opacity: 0.2; transform: scale(1); }
    40%            { opacity: 1;   transform: scale(1.15); }
  }

  /* ── Suggestions ── */
  .suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0 1.5rem 1rem;
    flex-shrink: 0;
  }
  .suggestion-chip {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: #aaa;
    font-size: 0.78rem;
    padding: 0.4rem 0.85rem;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }
  .suggestion-chip:hover {
    background: rgba(255,0,60,0.1);
    border-color: rgba(255,0,60,0.3);
    color: #fff;
  }

  /* ── Input bar ── */
  .input-bar {
    display: flex;
    align-items: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-top: 1px solid rgba(255,255,255,0.05);
    background: rgba(0,0,0,0.3);
    flex-shrink: 0;
  }
  .input-bar textarea {
    flex: 1;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 0.85rem 1rem;
    color: #fff;
    font-size: 0.95rem;
    font-family: inherit;
    resize: none;
    line-height: 1.5;
    max-height: 120px;
    overflow-y: auto;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .input-bar textarea:focus {
    outline: none;
    border-color: rgba(255,0,60,0.5);
    box-shadow: 0 0 18px rgba(255,0,60,0.15);
  }
  .input-bar textarea::placeholder { color: #444; }

  .send-btn {
    width: 48px; height: 48px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #ff003c, #8b0000);
    font-size: 1.3rem;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 6px 20px rgba(255,0,60,0.35);
    display: flex; align-items: center; justify-content: center;
  }
  .send-btn:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.08);
    box-shadow: 0 10px 28px rgba(255,0,60,0.55);
  }
  .send-btn:disabled {
    background: #1a1a1a;
    box-shadow: none;
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
