import { useState } from 'react';
import SaveMutatedDream from './SaveMutatedDream.js';

export default function DreamMutator({ originalDream }) {
  const [mutated, setMutated] = useState(null);
  const [log, setLog] = useState([]);

  const mutateDream = async () => {
    setLog(prev => [...prev, '🧬 Mutating...']);
    try {
      const res = await fetch('/api/mutate-dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalDream })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMutated(data.mutatedDream);
        setLog(prev => [...prev, '✅ Mutation complete.']);
      } else {
        setLog(prev => [...prev, `⚠️ ${data.message}`]);
      }
    } catch (err) {
      setLog(prev => [...prev, `❌ Mutation failed: ${err.message}`]);
    }
  };

  return (
    <div style={{ marginTop: 40, background: '#111', padding: 20, color: '#0ff' }}>
      <h3>🦋 Remix This Dream</h3>
      <button onClick={mutateDream}>🔁 Mutate This Dream</button>
      <pre>{log.map((l, i) => <div key={i}>{l}</div>)}</pre>
      {mutated && (
        <div style={{ marginTop: 20 }}>
          <pre style={{ background: '#000', padding: 10 }}>
            {JSON.stringify(mutated, null, 2)}
          </pre>
          <SaveMutatedDream dream={mutated} />
        </div>
      )}
    </div>
  );
}