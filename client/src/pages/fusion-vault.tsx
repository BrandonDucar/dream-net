import { useEffect, useState } from 'react';

export default function FusionVaultPage() {
  const [fusions, setFusions] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/fusions')
      .then(res => res.json())
      .then(setFusions)
      .catch(err => console.error('❌ Failed to load fusions:', err));
  }, []);

  return (
    <div style={{ padding: 40, background: '#000', color: '#0ff' }}>
      <h1>⚛️ Fusion Vault</h1>
      <p>View all saved Fusion Dreams across the network.</p>
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {fusions.map((d) => (
          <li key={d.id} style={{ marginBottom: 24, borderBottom: '1px solid #0ff', paddingBottom: 12 }}>
            <h3>{d.title}</h3>
            <p>Tags: {d.tags.join(', ')}</p>
            <p>Score: {d.score} | Badge: ⚛️ Fusion Dream</p>
            <p>Fused From: {d.fusedFrom?.map((id: any) => id.slice(0, 6)).join(' + ')}</p>
            {d.claimed ? <p>✅ Claimed by: {d.owner}</p> : <p>🪄 Available for Claim</p>}
            <a href={`/dream/${d.id}`}>🔗 View Dream</a>
          </li>
        ))}
      </ul>
    </div>
  );
}