import { useState } from 'react';
import AgentStatusGrid from './AgentStatusGrid.js';
import DreamCoreViewer from './DreamCoreViewer.js';
import AgentSelector from './AgentSelector.js';
import AgentPanel from './AgentPanel.js';

export default function DreamOpsLauncher() {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletResult, setWalletResult] = useState<{
    score: number;
    trustLevel: string;
    unlockedAgents: string[];
  } | null>(null);
  const [dreamTitle, setDreamTitle] = useState('');
  const [dreamTags, setDreamTags] = useState('');
  const [outputLog, setOutputLog] = useState<string[]>([]);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['lucid', 'canvas']);
  const [dreamCore, setDreamCore] = useState<{
    title: string;
    tags: string[];
    score: number;
    trustLevel: string;
    agents: string[];
    componentCode: string;
    schema: string;
  } | null>(null);

  const log = (msg: string) => setOutputLog(prev => [...prev, msg]);

  const handleAgentAction = (agent: string, action: string) => {
    log(`🤖 ${agent} ${action} requested`);

    switch (agent) {
      case 'LUCID':
        log(`🧠 LUCID (Logic Unification & Command Interface Daemon) activated`);
        log(`→ Intelligent task routing system online`);
        log(`→ Failure pattern detection enabled`);
        break;
      case 'CANVAS':
        log(`🎨 CANVAS (Visual Layer Weaver) summoned`);
        log(`→ Frontend dream component scaffolding ready`);
        log(`→ Theme systems and UI generation active`);
        break;
      case 'ROOT':
        log(`🌱 ROOT (Subconscious Architect) engaged`);
        log(`→ Backend schema and API planning initiated`);
        log(`→ Storage logic architecture in progress`);
        break;
      case 'ECHO':
        log(`🪞 ECHO (Wallet Mirror) analyzing`);
        if (walletAddress) {
          log(`→ Deep wallet trust analysis starting`);
          scanWallet();
        } else {
          log(`→ ERROR: Wallet address required for mirror analysis`);
        }
        break;
      case 'CRADLE':
        log(`🌀 CRADLE (Evolution Engine) spinning up`);
        log(`→ Dream mutation and growth tracking system`);
        log(`→ Temporal evolution patterns being calculated`);
        log(`→ Evolution chain visualization activated`);
        break;
      case 'WING':
        log(`🪽 WING (Messenger & Mint Agent) preparing`);
        log(`→ Dream message minting capabilities`);
        log(`→ Micro-token delivery system ready`);
        break;
    }
  };

  async function scanWallet() {
    log(`🪞 Scanning wallet: ${walletAddress}`);
    const res = await fetch('/api/wallet/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress,
        completedDreams: 5,
        hasTokenBoost: false
      })
    });
    const data = await res.json();
    if (data.status === 'success') {
      const analysis = data.data;
      setWalletResult({
        score: analysis.trustScore,
        trustLevel: analysis.trustLevel,
        unlockedAgents: analysis.unlockedAgents
      });
      setActiveAgents(analysis.unlockedAgents);
      log(`✅ Wallet scored: ${analysis.trustLevel} (${analysis.trustScore})`);
      log(`💰 Tokens: ${analysis.tokens.SHEEP} SHEEP, ${analysis.tokens.FLBY} FLBY`);
      log(`🔓 Agents unlocked: ${analysis.unlockedAgents.join(', ')}`);
    }
  }

  async function launchDreamCore() {
    log(`🌱 LUCID routing based on goal: Build Dream Core`);
    const lucRes = await fetch('/api/lucid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentState: 'Dream submitted',
        goal: 'Build Dream Core',
        availableAgents: activeAgents
      })
    });
    const lucData = await lucRes.json();
    const nextAgent = lucData.routedTo;
    log(`🤖 LUCID routed to: ${nextAgent}`);

    let canvasData = null;
    let rootData = null;

    if (activeAgents.includes('CANVAS')) {
      const canvasRes = await fetch('/api/canvas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dreamTitle,
          dreamTags: dreamTags.split(',').map(tag => tag.trim()),
          includeMintButton: activeAgents.includes('WING'),
          theme: 'neon'
        })
      });
      canvasData = await canvasRes.json();
      log(`🎨 CANVAS rendered component:\n${canvasData.componentCode}`);
    }

    if (activeAgents.includes('ROOT')) {
      const rootRes = await fetch('/api/root', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dreamTitle,
          storageType: 'json',
          includeAdminAccess: true
        })
      });
      rootData = await rootRes.json();
      log(`🌱 ROOT generated schema:\n${rootData.schema}`);
    }

    if (activeAgents.includes('CRADLE')) {
      log(`🌀 CRADLE unlocked — evolution system not yet wired.`);
    }

    if (activeAgents.includes('WING')) {
      log(`🪽 WING unlocked — mint/messaging layer coming soon.`);
    }

    log(`✅ Dream Core built successfully.`);

    // Create the dream core object using actual API response data
    if (activeAgents.length > 0 && dreamTitle) {
      const fullDreamCore = {
        title: dreamTitle,
        tags: dreamTags.split(',').map(t => t.trim()),
        score: walletResult?.score || 0,
        trustLevel: walletResult?.trustLevel || 'Unknown',
        agents: activeAgents,
        componentCode: canvasData?.componentCode || '<div style="padding: 20px; color: #999;">No component generated</div>',
        schema: rootData?.schema || '// No schema generated',
        evolutionLevel: activeAgents.includes('CRADLE') ? Math.min(3, Math.floor((walletResult?.score || 0) / 25)) : undefined
      };

      setDreamCore(fullDreamCore);
      log(`🧬 Dream Core data structure created for viewer`);

      // Save dream core locally via API
      try {
        await fetch('/api/save-core', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dreamCore: fullDreamCore, walletAddress })
        });
        log(`💾 Dream Core saved locally for wallet: ${walletAddress}`);
      } catch (saveError) {
        log(`⚠️ Save error: ${saveError}`);
      }
    }
  }

  const loadDreamCore = async () => {
    if (!walletAddress) {
      log(`⚠️ Wallet address required to load saved dream core`);
      return;
    }

    try {
      log(`🔍 Loading saved dream core for wallet: ${walletAddress}`);
      const response = await fetch(`/api/dream-storage/load/${walletAddress}`);
      const result = await response.json();

      if (result.status === 'success') {
        setDreamCore(result.data);
        log(`💾 Loaded saved dream core: ${result.data.title}`);
        log(`📊 Score: ${result.data.score}, Trust: ${result.data.trustLevel}`);
        log(`🤖 Active Agents: ${result.data.agents.join(', ')}`);
      } else if (result.status === 'not_found') {
        log(`📂 No saved dream core found for wallet: ${walletAddress}`);
      } else {
        log(`⚠️ Load failed: ${result.message}`);
      }
    } catch (error) {
      log(`⚠️ Load error: ${error}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto font-mono">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-cyan-400 mb-2">🚀 DreamOps Launcher</h2>
        <p className="text-gray-400">Multi-Agent AI Orchestration System</p>
      </div>

      <AgentSelector
        selectedAgents={selectedAgents}
        onAgentToggle={(agentKey) => {
          setSelectedAgents(prev =>
            prev.includes(agentKey)
              ? prev.filter(k => k !== agentKey)
              : [...prev, agentKey]
          );
        }}
        trustScore={walletResult?.score || 0}
        completedDreams={5} // Mock value - could be fetched from API
        stakedSheep={1500} // Mock value - could be fetched from wallet
        hasTokenBoost={false}
      />

      <AgentStatusGrid
        activeAgents={activeAgents}
        onAgentAction={handleAgentAction}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-cyan-400">Wallet Configuration</h3>
          <input
            placeholder="Your Wallet Address"
            value={walletAddress}
            onChange={e => setWalletAddress(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={scanWallet}
              className="p-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              🪞 Scan Wallet
            </button>
            <button
              onClick={loadDreamCore}
              className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              💾 Load Saved
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-cyan-400">Dream Parameters</h3>
          <input
            placeholder="Dream Title"
            value={dreamTitle}
            onChange={e => setDreamTitle(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
          <input
            placeholder="Tags (comma separated)"
            value={dreamTags}
            onChange={e => setDreamTags(e.target.value)}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
          <button
            onClick={launchDreamCore}
            className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            🌱 Launch Dream Core
          </button>
        </div>
      </div>

      {walletResult && (
        <AgentPanel
          walletData={{
            unlockedAgents: walletResult.unlockedAgents
          }}
        />
      )}

      <div style={{
        marginBottom: 20,
        fontSize: 14,
        color: '#ccc'
      }}>
        Selected Agents: {selectedAgents.map(key => key.toUpperCase()).join(', ') || 'None'}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-950 rounded-lg border border-gray-800 p-4">
          <h3 className="text-lg font-semibold text-green-400 mb-4">📡 System Output Log</h3>
          <pre className="bg-black p-4 rounded text-green-400 text-sm min-h-[300px] max-h-[500px] overflow-y-auto">
            {outputLog.length === 0 ? (
              <div className="text-gray-600">Waiting for agent operations...</div>
            ) : (
              outputLog.map((line, i) => <div key={i}>{line}</div>)
            )}
          </pre>
        </div>

        <div className="bg-gray-950 rounded-lg border border-gray-800 p-4">
          <DreamCoreViewer dreamCore={dreamCore} />
        </div>
      </div>
    </div>
  );
}