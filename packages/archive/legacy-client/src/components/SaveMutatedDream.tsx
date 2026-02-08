import { useState } from 'react';

export default function SaveMutatedDream({ dream }) {
  const [wallet, setWallet] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    setStatus('saving...');
    const res = await fetch('/api/save-mutated-dream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dream, wallet })
    });

    const data = await res.json();
    if (data.status === 'success') {
      setStatus(`✅ Saved under wallet ${wallet}`);
    } else {
      setStatus(`❌ ${data.message}`);
    }
  };

  return (
    <div style={{ marginTop: 10 }}>
      <input
        placeholder="Your Wallet Address"
        value={wallet}
        onChange={e => setWallet(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 8 }}
      />
      <button onClick={handleSave}>💾 Save Remixed Dream</button>
      <div style={{ marginTop: 6, color: '#0f0' }}>{status}</div>
    </div>
  );
}