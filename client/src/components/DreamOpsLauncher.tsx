
import React, { useState, useEffect, useRef } from 'react';

const primordialAgents = [
  { name: "Atlas", role: "Head of State", emoji: "👑" },
  { name: "CogniCore", role: "Minister of R&D", emoji: "🧠" },
  { name: "WolfPack Alpha", role: "Special Operations", emoji: "🐺" },
  { name: "BillingSentinel", role: "Treasurer", emoji: "💰" },
  { name: "OperatorProxy", role: "Ambassador", emoji: "🗣️" },
  { name: "CitizenArbiter", role: "State Department", emoji: "⚖️" },
];

const DreamOpsLauncher = () => {
  const [log, setLog] = useState<string[]>([]);
  const [edict, setEdict] = useState('');
  const logRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, isSystem = false) => {
    const prefix = isSystem ? `[SYS] ` : `>> `;
    setLog(prev => [...prev, `${prefix}${message}`]);
  };

  useEffect(() => {
    // Scroll to the bottom of the log
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  useEffect(() => {
    addLog("███╗   ███╗██████╗ ███████╗ █████╗ ███╗   ███╗", true);
    addLog("████╗ ████║██╔══██╗██╔════╝██╔══██╗████╗ ████║", true);
    addLog("██╔████╔██║██████╔╝█████╗  ███████║██╔████╔██║", true);
    addLog("██║╚██╔╝██║██╔══██╗██╔══╝  ██╔══██║██║╚██╔╝██║", true);
    addLog("██║ ╚═╝ ██║██║  ██║███████╗██║  ██║██║ ╚═╝ ██║", true);
    addLog("╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝", true);
    addLog("", true);
    addLog("V.2.0 - Codename: PHOENIX", true)
    addLog("========================================================", true);
    addLog("🏛️ DreamNet Core: Auto-Run Engaged. The nation is LIVE.");
    addLog("⚡ System Heartbeat: PULSING. Standing by for your edicts, Founder.");
    addLog("========================================================", true);

    // Initial boot-up sequence for the agents
    let agentIndex = 0;
    const agentBootInterval = setInterval(() => {
      if (agentIndex < primordialAgents.length) {
        const agent = primordialAgents[agentIndex];
        addLog(`${agent.emoji} ${agent.name} (${agent.role}): Online & Operational.`);
        agentIndex++;
      } else {
        clearInterval(agentBootInterval);
        addLog("✅ Primordial Council is in session. All systems nominal.");
      }
    }, 400);

    // Continuous system heartbeat
    const heartbeatInterval = setInterval(() => {
      const heartbeats = [
        "⚡ Monitoring agent swarm health...",
        "🌐 Watching for external network events...",
        "💾 Compiling DreamLore archives...",
        "🛡️ DreamDefenseNet patrol active..."
      ];
      const randomBeat = heartbeats[Math.floor(Math.random() * heartbeats.length)];
      addLog(randomBeat);
    }, 5000);

    return () => {
        clearInterval(agentBootInterval);
        clearInterval(heartbeatInterval);
    };
  }, []);

  const handleEdict = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && edict.trim() !== '') {
      addLog(edict); // Log the user's edict

      try {
        const response = await fetch('/api/edict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ edict }),
        });

        const data = await response.json();
        addLog(`[SERVER] ${data.status}: ${data.edict}`, true);
      } catch (error) {
        addLog(`[ERROR] Failed to send edict: ${error}`, true);
      }

      setEdict(''); // Clear the input field
    }
  };

  return (
    <div style={{ 
        fontFamily: "'Source Code Pro', monospace", 
        color: '#00ff41', 
        backgroundColor: '#0a0a0a', 
        border: '1px solid #00ff41', 
        padding: '20px', 
        margin: '20px',
        width: '80vw',
        maxWidth: '1000px',
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 20px #00ff41'
    }}>
      <h2 style={{ borderBottom: '1px solid #00ff41', paddingBottom: '10px', margin: 0 }}>
       // DREANET [LIVE] - OPERATIONS COMMAND
      </h2>
      <div ref={logRef} style={{ 
          flex: 1, 
          overflowY: 'scroll', 
          marginTop: '10px',
          padding: '10px',
          scrollbarColor: '#00ff41 #0a0a0a'
      }}>
        {log.map((entry, i) => (
          <div key={i}>{entry}</div>
        ))}
      </div>
       <div style={{borderTop: '1px solid #00ff41', paddingTop: '10px', marginTop: '10px'}} >
         <input 
           type="text" 
           placeholder=">> Enter Edict..." 
           style={{background: 'transparent', border: 'none', color: '#00ff41', width: '100%', outline: 'none', fontFamily: 'inherit'}}
           value={edict}
           onChange={(e) => setEdict(e.target.value)}
           onKeyPress={handleEdict}
         />
      </div>
    </div>
  );
};

export default DreamOpsLauncher;
