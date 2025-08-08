import { useState } from 'react';

export default function DreamFusionPanel({ dreams }) {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('');

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id].slice(0, 2)
    );
  };

  const fuseDreams = async () => {
    setStatus('⚗️ Fusing...');
    const res = await fetch('/api/fuse-dreams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selected })
    });
    const data = await res.json();
    if (data.status === 'success') {
      setResult(data.fusedDream);
      setStatus('✅ Fusion complete');
    } else {
      setStatus(`❌ ${data.message}`);
    }
  };

  return (
    <div style={{ background: '#111', padding: 20, color: '#ff0', marginTop: 20 }}>
      <h3>🧪 Dream Fusion Lab</h3>
      <p>Select up to 2 dreams to fuse together:</p>
      
      <div style={{ marginBottom: 20 }}>
        {dreams.map(dream => (
          <div 
            key={dream.id}
            onClick={() => toggleSelect(dream.id)}
            style={{
              padding: 10,
              margin: '5px 0',
              background: selected.includes(dream.id) ? '#440' : '#222',
              cursor: 'pointer',
              border: selected.includes(dream.id) ? '2px solid #ff0' : '1px solid #666'
            }}
          >
            {selected.includes(dream.id) ? '✓' : '○'} {dream.title} (ID: {dream.id.slice(0, 8)})
          </div>
        ))}
      </div>

      {selected.length === 2 && (
        <button 
          onClick={fuseDreams}
          style={{
            background: '#ff0',
            color: '#000',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
            marginBottom: 10
          }}
        >
          🔬 Fuse Selected Dreams
        </button>
      )}

      <div style={{ color: '#0f0', marginBottom: 10 }}>{status}</div>

      {result && (
        <div style={{ background: '#000', padding: 10, marginTop: 10 }}>
          <h4>🌟 Fused Dream Result:</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}