import { useState } from 'react';

interface DreamCore {
  title: string;
  tags: string[];
  score: number;
  trustLevel: string;
  agents: string[];
  componentCode: string;
  schema: string;
  evolutionLevel?: number;
}

interface DreamReactivatorProps {
  dreamCore: DreamCore;
  onUpdate?: (updatedDreamCore: DreamCore) => void;
}

export default function DreamReactivator({ dreamCore, onUpdate }: DreamReactivatorProps) {
  const [status, setStatus] = useState('');
  const [log, setLog] = useState<string[]>([]);

  const runAgents = async () => {
    setStatus('running');
    setLog(prev => [...prev, '🧠 Re-running agents...']);

    try {
      const res = await fetch('/api/reactivate-core', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dreamCore })
      });
      const data = await res.json();

      if (data.status === 'success') {
        setLog(prev => [...prev, '✅ Agents re-run successfully. Dream Core updated.']);
        setStatus('done');
        if (onUpdate) onUpdate(data.dreamCore);
      } else {
        setLog(prev => [...prev, `⚠️ ${data.message}`]);
        setStatus('error');
      }
    } catch (err: any) {
      setLog(prev => [...prev, `❌ Re-run failed: ${err.message}`]);
      setStatus('error');
    }
  };

  return (
    <div style={{ padding: 20, marginTop: 20, background: '#111', color: '#0ff', border: '2px dashed #0ff' }}>
      <h3>🔁 Reactivate Dream Core</h3>
      <button onClick={runAgents} disabled={status === 'running'}>
        🧠 Re-run All Agents
      </button>
      <pre style={{ marginTop: 10 }}>
        {log.map((l, i) => <div key={i}>{l}</div>)}
      </pre>
    </div>
  );
}