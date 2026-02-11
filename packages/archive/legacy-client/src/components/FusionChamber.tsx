import { useState } from 'react';

interface Dream {
  id: string;
  title: string;
  name?: string;
}

interface FusedDream {
  title: string;
  tags: string[];
  lineage: {
    ancestors: string[];
  };
}

interface FusionChamberProps {
  dreams?: Dream[];
  wallet?: string;
  enabled: boolean;
}

export default function FusionChamber({ dreams = [], wallet, enabled }: FusionChamberProps) {
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  const [result, setResult] = useState<FusedDream | null>(null);

  const handleFuse = async () => {
    const res = await fetch('/api/fuse-dreams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aId: a, bId: b, wallet })
    });
    const data = await res.json();
    setResult(data.fusedDream);
  };

  if (!enabled) return <p>🔒 Fusion locked — WING agent required</p>;

  return (
    <div style={{ background: '#111', padding: 30, borderRadius: 12 }}>
      <h2>⚗️ Dream Fusion Chamber</h2>
      <select 
        onChange={e => setA(e.target.value)} 
        defaultValue=""
        style={{ 
          width: '100%', 
          margin: '10px 0', 
          padding: '8px', 
          background: '#222', 
          color: '#fff', 
          border: '1px solid #444',
          borderRadius: '4px'
        }}
      >
        <option value="" disabled>Select Dream A</option>
        {dreams.map(d => (
          <option key={d.id} value={d.id}>
            {d.title || d.name || `Dream ${d.id}`}
          </option>
        ))}
      </select>
      <select 
        onChange={e => setB(e.target.value)} 
        defaultValue=""
        style={{ 
          width: '100%', 
          margin: '10px 0', 
          padding: '8px', 
          background: '#222', 
          color: '#fff', 
          border: '1px solid #444',
          borderRadius: '4px'
        }}
      >
        <option value="" disabled>Select Dream B</option>
        {dreams.map(d => (
          <option key={d.id} value={d.id}>
            {d.title || d.name || `Dream ${d.id}`}
          </option>
        ))}
      </select>
      <button
        onClick={handleFuse}
        disabled={!a || !b}
        style={{ 
          marginTop: 20, 
          padding: 10, 
          background: (!a || !b) ? '#666' : '#0ff', 
          color: '#000',
          border: 'none',
          borderRadius: '4px',
          cursor: (!a || !b) ? 'not-allowed' : 'pointer',
          width: '100%',
          fontWeight: 'bold'
        }}
      >
        🧬 Fuse
      </button>

      {result && (
        <div style={{ marginTop: 30, background: '#222', padding: 20, borderRadius: '8px' }}>
          <h3>⚛️ Fusion Created:</h3>
          <p><strong>{result.title}</strong></p>
          <p>Tags: {result.tags.join(', ')}</p>
          <p>Lineage: {result.lineage.ancestors.join(' ➝ ')}</p>
        </div>
      )}
    </div>
  );
}