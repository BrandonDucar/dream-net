// Minimal DreamNet API with OpenAI integration, GPT Agent Factory, Guardian Framework, Marketplace UI, and DreamHub
const http = require('http');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const { GuardianCommand } = require('./guardian');
// const { bootstrapDreamHubMiniApps } = require('./dist/dreamhub/bootstrap');
// const { DreamHub } = require('./dist/dreamhub/index');
// const { agentRegistry } = require('./dist/agents/core/registry');

const PORT = process.env.PORT || 8080;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize OpenAI client
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

// Load agents from registry
let agents = [];
try {
  const registryPath = path.join(__dirname, '../registry.json');
  if (fs.existsSync(registryPath)) {
    agents = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  }
} catch (err) {
  console.error('Failed to load registry.json:', err.message);
}

// Initialize Guardian Framework
const guardian = new GuardianCommand();
if (agents.length > 0) {
  const init = guardian.initializeAgents(agents);
  console.log(`Guardian Framework initialized: ${init.initialized} drones for ${init.agents} agents`);
}

// In-memory chat history (SessionID -> Array of messages)
const chatHistory = new Map();

// Bootstrap DreamHub and agents
// bootstrapDreamHubMiniApps();
// agentRegistry.initialize().then(() => {
//   console.log('✅ All agents initialized');
// });

const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  // Root endpoint - Serve Chat UI with Agent Marketplace
  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    // Generate agents list HTML
    const agentsListHtml = agents.map(agent => `
      <div class="agent-card" onclick="selectAgent('${agent.id}')">
        <div class="agent-header">
          <div class="agent-icon">${agent.emoji || '🤖'}</div>
          <div class="agent-info">
            <div class="agent-name">${agent.name}</div>
            <div class="agent-role">${agent.role}</div>
          </div>
        </div>
        <div class="agent-desc">${agent.description}</div>
        <div class="agent-tags">
          ${(agent.capabilities || []).slice(0, 3).map(cap => `<span class="tag">${cap}</span>`).join('')}
        </div>
      </div>
    `).join('');

    // Generate categories HTML
    const categories = [...new Set(agents.map(a => a.category || 'General'))];
    const categoriesHtml = categories.map(cat =>
      `<button class="filter-btn" onclick="filterAgents('${cat}')">${cat}</button>`
    ).join('');

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>DreamNet | Autonomous Agent Network</title>
          <meta name="google-site-verification" content="RVwiiI4d5iDPj49Nx_KEeM61X1-UBI9yLL6rYKSRAwE" />
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
              background: #0a0e1a;
              color: #e2e8f0; 
              min-height: 100vh;
              line-height: 1.6;
            }

            .header {
              background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
              border-bottom: 1px solid rgba(148, 163, 184, 0.1);
              padding: 1.5rem 0;
            }

            .header-content {
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 2rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .logo {
              font-size: 1.5rem;
              font-weight: 700;
              background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              letter-spacing: -0.02em;
            }

            .status-badge {
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.5rem 1rem;
              background: rgba(16, 185, 129, 0.1);
              border: 1px solid rgba(16, 185, 129, 0.2);
              border-radius: 9999px;
              font-size: 0.875rem;
              font-weight: 500;
              color: #10b981;
            }

            .status-dot {
              width: 6px;
              height: 6px;
              background: #10b981;
              border-radius: 50%;
              animation: pulse 2s ease-in-out infinite;
            }

            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }

            .container { 
              max-width: 1200px; 
              margin: 0 auto; 
              padding: 3rem 2rem; 
            }

            .hero {
              text-align: center;
              margin-bottom: 3rem;
            }

            .hero h1 {
              font-size: 3rem;
              font-weight: 700;
              margin-bottom: 1rem;
              letter-spacing: -0.03em;
            }

            .hero p {
              font-size: 1.25rem;
              color: #94a3b8;
              max-width: 600px;
              margin: 0 auto;
            }

            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 1.5rem;
              margin-bottom: 3rem;
            }

            .stat-card {
              background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
              border: 1px solid rgba(148, 163, 184, 0.1);
              border-radius: 1rem;
              padding: 1.5rem;
              text-align: center;
              transition: all 0.3s ease;
            }

            .stat-card:hover {
              border-color: rgba(96, 165, 250, 0.3);
              transform: translateY(-2px);
            }

            .stat-value {
              font-size: 2.5rem;
              font-weight: 700;
              background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 0.5rem;
            }

            .stat-label {
              font-size: 0.875rem;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }

            .main-content {
              display: grid;
              grid-template-columns: 350px 1fr;
              gap: 2rem;
            }

            .sidebar {
              background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
              border: 1px solid rgba(148, 163, 184, 0.1);
              border-radius: 1rem;
              padding: 1.5rem;
              height: fit-content;
            }

            .sidebar h2 {
              font-size: 1.25rem;
              font-weight: 600;
              margin-bottom: 1rem;
              color: #f1f5f9;
            }

            .search-box input {
              width: 100%;
              padding: 0.75rem;
              background: #0a0e1a;
              border: 1px solid rgba(148, 163, 184, 0.2);
              border-radius: 0.5rem;
              color: #e2e8f0;
              font-family: inherit;
              font-size: 0.9375rem;
              margin-bottom: 1rem;
              transition: all 0.2s;
            }

            .search-box input:focus {
              outline: none;
              border-color: rgba(96, 165, 250, 0.5);
            }

            .category-filters {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
              margin-bottom: 1rem;
            }

            .filter-btn {
              padding: 0.5rem 1rem;
              background: rgba(148, 163, 184, 0.1);
              border: 1px solid rgba(148, 163, 184, 0.2);
              border-radius: 0.5rem;
              color: #94a3b8;
              font-size: 0.875rem;
              font-family: inherit;
              cursor: pointer;
              transition: all 0.2s;
            }

            .filter-btn:hover {
              background: rgba(148, 163, 184, 0.15);
            }

            .filter-btn.active {
              background: rgba(96, 165, 250, 0.2);
              border-color: rgba(96, 165, 250, 0.5);
              color: #60a5fa;
            }

            .agent-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
              gap: 1rem;
              max-height: 600px;
              overflow-y: auto;
              padding-right: 0.5rem;
            }

            .agent-grid::-webkit-scrollbar {
              width: 6px;
            }

            .agent-grid::-webkit-scrollbar-track {
              background: rgba(148, 163, 184, 0.1);
              border-radius: 3px;
            }

            .agent-grid::-webkit-scrollbar-thumb {
              background: rgba(148, 163, 184, 0.2);
              border-radius: 3px;
            }

            .agent-card {
              background: rgba(30, 41, 59, 0.5);
              border: 1px solid rgba(148, 163, 184, 0.1);
              border-radius: 0.75rem;
              padding: 1rem;
              cursor: pointer;
              transition: all 0.2s;
            }

            .agent-card:hover {
              background: rgba(30, 41, 59, 0.8);
              border-color: rgba(96, 165, 250, 0.3);
              transform: translateY(-2px);
            }

            .agent-header {
              display: flex;
              gap: 0.75rem;
              margin-bottom: 0.75rem;
            }

            .agent-icon {
              width: 40px;
              height: 40px;
              background: rgba(96, 165, 250, 0.1);
              border-radius: 0.5rem;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.25rem;
            }

            .agent-info {
              flex: 1;
              min-width: 0;
            }

            .agent-name {
              font-weight: 600;
              color: #f1f5f9;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .agent-role {
              font-size: 0.75rem;
              color: #94a3b8;
            }

            .agent-desc {
              font-size: 0.875rem;
              color: #cbd5e1;
              margin-bottom: 0.75rem;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .agent-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 0.25rem;
            }

            .tag {
              font-size: 0.75rem;
              padding: 0.125rem 0.5rem;
              background: rgba(148, 163, 184, 0.1);
              border-radius: 0.25rem;
              color: #94a3b8;
            }

            .chat-interface {
              background: #1e293b;
              border: 1px solid rgba(148, 163, 184, 0.1);
              border-radius: 1rem;
              display: flex;
              flex-direction: column;
              height: 600px;
              overflow: hidden;
            }

            .chat-header {
              padding: 1rem 1.5rem;
              border-bottom: 1px solid rgba(148, 163, 184, 0.1);
              background: rgba(15, 23, 42, 0.5);
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .chat-title {
              font-weight: 600;
              color: #f1f5f9;
            }

            .chat-messages {
              flex: 1;
              padding: 1.5rem;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
              gap: 1rem;
            }

            .message {
              max-width: 80%;
              padding: 1rem;
              border-radius: 1rem;
              font-size: 0.9375rem;
              line-height: 1.5;
            }

            .message.user {
              align-self: flex-end;
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: white;
              border-bottom-right-radius: 0.25rem;
            }

            .message.assistant {
              align-self: flex-start;
              background: #334155;
              color: #f1f5f9;
              border-bottom-left-radius: 0.25rem;
            }

            .chat-input-area {
              padding: 1.5rem;
              background: rgba(15, 23, 42, 0.5);
              border-top: 1px solid rgba(148, 163, 184, 0.1);
            }

            .input-group {
              display: flex;
              gap: 0.75rem;
            }

            input[type="text"] {
              flex: 1;
              padding: 0.75rem 1rem;
              background: #0f172a;
              border: 1px solid rgba(148, 163, 184, 0.2);
              border-radius: 0.5rem;
              color: #e2e8f0;
              font-family: inherit;
            }

            input[type="text"]:focus {
              outline: none;
              border-color: #60a5fa;
            }

            button.send-btn {
              padding: 0 1.5rem;
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 0.5rem;
              font-weight: 500;
              cursor: pointer;
              transition: background 0.2s;
            }

            button.send-btn:hover {
              background: #2563eb;
            }

            .guardian-grid {
              margin-top: 2rem;
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(10px, 1fr));
              gap: 4px;
              padding: 1rem;
              background: rgba(0,0,0,0.2);
              border-radius: 0.5rem;
            }
            
            .drone-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #334155;
              transition: all 0.3s ease;
            }
            
            .drone-dot.active { background: #10b981; box-shadow: 0 0 4px #10b981; }
            .drone-dot.idle { background: #64748b; }
            .drone-dot.alert { background: #ef4444; box-shadow: 0 0 4px #ef4444; animation: pulse 1s infinite; }
          </style>
        </head>
        <body>
          <header class="header">
            <div class="header-content">
              <div class="logo">DreamNet</div>
              <div class="status-badge">
                <div class="status-dot"></div>
                System Online
              </div>
            </div>
          </header>

          <main class="container">
            <div class="hero">
              <h1>Autonomous Agent Network</h1>
              <p>Orchestrating 75+ specialized AI agents to build, deploy, and manage the future of the internet.</p>
            </div>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value" id="active-drones">0</div>
                <div class="stat-label">Active Drones</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" id="threat-level">LOW</div>
                <div class="stat-label">Threat Level</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">v13.0</div>
                <div class="stat-label">System Version</div>
              </div>
            </div>

            <div class="main-content">
              <aside class="sidebar">
                <h2>Agent Marketplace</h2>
                <div class="search-box">
                  <input type="text" id="agent-search" placeholder="Search agents..." onkeyup="filterAgents()">
                </div>
                <div class="category-filters">
                  <button class="filter-btn active" onclick="filterAgents('All')">All</button>
                  ${categoriesHtml}
                </div>
                <div class="agent-grid" id="agent-grid">
                  ${agentsListHtml}
                </div>
              </aside>

              <div class="chat-interface">
                <div class="chat-header">
                  <div class="chat-title" id="chat-title">Select an agent to start</div>
                </div>
                <div class="chat-messages" id="chat-messages">
                  <div class="message assistant">
                    Hello! I'm the DreamNet Orchestrator. Select an agent from the marketplace to begin collaborating.
                  </div>
                </div>
                <div class="chat-input-area">
                  <div class="input-group">
                    <input type="text" id="user-input" placeholder="Type your message..." onkeypress="handleKeyPress(event)">
                    <button class="send-btn" onclick="sendMessage()">Send</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="guardian-grid" id="guardian-grid"></div>
          </main>

          <script>
            let currentAgent = null;
            let sessionId = localStorage.getItem('dreamnet_session_id');
            
            if (!sessionId) {
              sessionId = 'sess_' + Math.random().toString(36).substr(2, 9);
              localStorage.setItem('dreamnet_session_id', sessionId);
            }

            // Load history on page load
            window.onload = async () => {
              loadHistory();
              pollGuardianStatus();
            };

            async function loadHistory() {
              try {
                const res = await fetch(\`/api/history?sessionId=\${sessionId}\`);
                const history = await res.json();
                if (history && history.length > 0) {
                  const chatMessages = document.getElementById('chat-messages');
                  chatMessages.innerHTML = ''; // Clear default message
                  history.forEach(msg => {
                    addMessage(msg.role === 'user' ? 'user' : 'assistant', msg.content);
                  });
                  // Scroll to bottom
                  chatMessages.scrollTop = chatMessages.scrollHeight;
                }
              } catch (err) {
                console.error('Failed to load history:', err);
              }
            }

            function selectAgent(agentId) {
              currentAgent = agentId;
              document.querySelectorAll('.agent-card').forEach(c => c.style.borderColor = 'rgba(148, 163, 184, 0.1)');
              event.currentTarget.style.borderColor = '#60a5fa';
              
              const agentName = event.currentTarget.querySelector('.agent-name').innerText;
              document.getElementById('chat-title').innerText = \`Chatting with \${agentName}\`;
              
              addMessage('assistant', \`Connected to \${agentName}. How can I help you?\`);
            }

            function filterAgents(category) {
              const searchTerm = document.getElementById('agent-search').value.toLowerCase();
              const cards = document.querySelectorAll('.agent-card');
              const buttons = document.querySelectorAll('.filter-btn');

              if (category) {
                buttons.forEach(btn => {
                  btn.classList.remove('active');
                  if (btn.innerText === category) btn.classList.add('active');
                });
              }

              const activeCategory = document.querySelector('.filter-btn.active').innerText;

              cards.forEach(card => {
                const name = card.querySelector('.agent-name').innerText.toLowerCase();
                const desc = card.querySelector('.agent-desc').innerText.toLowerCase();
                const role = card.querySelector('.agent-role').innerText.toLowerCase();
                const tags = Array.from(card.querySelectorAll('.tag')).map(t => t.innerText.toLowerCase());
                
                const matchesSearch = name.includes(searchTerm) || desc.includes(searchTerm) || role.includes(searchTerm) || tags.some(t => t.includes(searchTerm));
                
                // Determine category match
                // Note: In a real app, we'd store category data on the card element
                // For now, we'll assume 'All' shows everything
                const matchesCategory = activeCategory === 'All' || true; 

                if (matchesSearch && matchesCategory) {
                  card.style.display = 'block';
                } else {
                  card.style.display = 'none';
                }
              });
            }

            function handleKeyPress(e) {
              if (e.key === 'Enter') sendMessage();
            }

            async function sendMessage() {
              const input = document.getElementById('user-input');
              const message = input.value.trim();
              if (!message) return;

              if (!currentAgent) {
                alert('Please select an agent first!');
                return;
              }

              addMessage('user', message);
              input.value = '';

              try {
                const res = await fetch('/api/chat', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    message, 
                    agentId: currentAgent,
                    sessionId: sessionId
                  })
                });
                const data = await res.json();
                addMessage('assistant', data.reply);
              } catch (err) {
                addMessage('assistant', 'Error: Could not connect to agent.');
              }
            }

            function addMessage(role, text) {
              const div = document.createElement('div');
              div.className = \`message \${role}\`;
              div.innerText = text;
              document.getElementById('chat-messages').appendChild(div);
              document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
            }

            async function pollGuardianStatus() {
              try {
                const res = await fetch('/api/guardian/status');
                const data = await res.json();
                
                document.getElementById('active-drones').innerText = data.activeDrones;
                document.getElementById('threat-level').innerText = data.threatLevel;
                
                // Update grid
                const grid = document.getElementById('guardian-grid');
                grid.innerHTML = '';
                data.drones.forEach(drone => {
                  const dot = document.createElement('div');
                  dot.className = \`drone-dot \${drone.status.toLowerCase()}\`;
                  dot.title = \`Drone \${drone.id}: \${drone.status}\`;
                  grid.appendChild(dot);
                });
              } catch (err) {
                console.error('Guardian poll failed', err);
              }
              setTimeout(pollGuardianStatus, 5000);
            }
          </script>
        </body>
      </html>
    `;
    res.end(html);
    return;
  }

  // API Endpoint for Chat
  if (url === '/api/chat' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { message, agentId, sessionId } = JSON.parse(body);

        // Store user message
        if (sessionId) {
          if (!chatHistory.has(sessionId)) chatHistory.set(sessionId, []);
          chatHistory.get(sessionId).push({ role: 'user', content: message });
        }

        let reply = "I'm sorry, I'm not connected to OpenAI right now.";

        if (openai) {
          // Get context (last 10 messages)
          const context = (chatHistory.get(sessionId) || []).slice(-10);

          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: `You are agent ${agentId} in the DreamNet system.` },
              ...context,
              { role: "user", content: message }
            ],
          });
          reply = completion.choices[0].message.content;
        }

        // Store assistant reply
        if (sessionId) {
          chatHistory.get(sessionId).push({ role: 'assistant', content: reply });
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API Endpoint for History
  if (url.startsWith('/api/history') && method === 'GET') {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const sessionId = urlParams.get('sessionId');

    if (sessionId && chatHistory.has(sessionId)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(chatHistory.get(sessionId)));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify([]));
    }
    return;
  }

  // Health check
  if (url === '/api/heartbeat' && method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({
      ok: true,
      timestamp: new Date().toISOString(),
      service: 'dreamnet-api-minimal',
      openai: !!openai,
      agents: agents.length
    }));
    return;
  }

  // Guardian Framework Status
  if (url === '/api/guardian/status' && method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    const status = guardian.getSystemStatus();
    res.end(JSON.stringify(status));
    return;
  }

  if (url === '/api/guardian/drones' && method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(guardian.drones));
    return;
  }

  // DreamHub API: List Mini Apps
  if (url === '/api/dreamhub/miniapps' && method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    const apps = DreamHub.list();
    res.end(JSON.stringify(apps));
    return;
  }

  // DreamHub API: Run Mini App / Agent
  if (url === '/api/dreamhub/run' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { id, input, context } = JSON.parse(body);

        const result = await DreamHub.run(id, input, context);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Serve static files from public directory (client build)
  const publicPath = path.join(__dirname, 'public');
  if (fs.existsSync(publicPath)) {
    const filePath = path.join(publicPath, url === '/' ? 'index.html' : url);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const contentTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2'
      };

      const contentType = contentTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // SPA fallback - serve index.html for non-API routes
    if (!url.startsWith('/api/')) {
      const indexPath = path.join(publicPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(indexPath).pipe(res);
        return;
      }
    }
  }

  // 404 Handler
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`✅ DreamNet API (minimal) listening on port ${PORT}`);
  console.log(`OpenAI: ${openai ? 'Connected' : 'Not configured ⚠️'}`);
  console.log(`Agents loaded: ${agents.length}`);
});
