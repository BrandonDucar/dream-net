import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { getDefaultToken, getTokenBySymbol, parseTokenAmount, type BountyToken, SUPPORTED_TOKENS } from '@shared/tokens';
import TokenSelector from '@/components/TokenSelector';
import TokenBooster from '@/components/TokenBooster';

interface Dream {
  id: string;
  title: string;
  dreamCloud: string;
}

export default function FusePage() {
  const [location] = useLocation();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [newDreamBody, setNewDreamBody] = useState('');
  const [token, setToken] = useState(getDefaultToken().symbol);
  const [bountyAmount, setBountyAmount] = useState('1.0');
  const [selectedToken, setSelectedToken] = useState('SHEEP');
  const [boostAmount, setBoostAmount] = useState('');
  const [fusionResult, setFusionResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1]);
    const ids = urlParams.get('ids')?.split(',') || [];
    
    if (ids.length > 0) {
      // Fetch dream details using server-side endpoint
      fetch(`/api/fuse/${ids.join(',')}`)
        .then(res => res.json())
        .then(data => {
          setDreams(data.dreams);
        })
        .catch(err => console.error('Failed to load dreams:', err));
    }
  }, [location]);

  function submitFusion() {
    setLoading(true);
    
    // Get current wallet from session/context
    const currentWallet = localStorage.getItem('walletAddress') || 'anonymous';
    const selectedToken = getTokenBySymbol(token);
    const bountyAmountInUnits = selectedToken ? parseTokenAmount(bountyAmount, selectedToken.decimals) : '1000000000000000000';
    
    fetch('/api/fuse-dreams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dreamIds: dreams.map(d => d.id),
        dreamBody: newDreamBody,
        currentWallet: currentWallet,
        bountyToken: token as BountyToken,
        bountyAmount: bountyAmountInUnits,
        fusionBoost: boostAmount ? {
          token: selectedToken,
          amount: parseTokenAmount(boostAmount, getTokenBySymbol(selectedToken)?.decimals || 18)
        } : null
      })
    })
    .then(res => res.json())
    .then(result => {
      setFusionResult(result);
      setNewDreamBody('');
      setLoading(false);
    })
    .catch(err => {
      console.error('Fusion failed:', err);
      setLoading(false);
    });
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>🧬 Fuse Dreams</h1>
      <ul>
        {dreams.map(d => <li key={d.id}>🧠 {d.title}</li>)}
      </ul>

      <textarea 
        value={newDreamBody} 
        onChange={e => setNewDreamBody(e.target.value)}
        style={{
          width: '100%',
          height: 120,
          marginTop: 20,
          marginBottom: 20,
          padding: 10,
          background: '#111',
          color: '#fff',
          border: '1px solid #555',
          borderRadius: 4
        }}
        placeholder="Describe your fused dream..."
      />

      <div style={{ display: 'flex', gap: 15, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 8, color: '#ccc' }}>Bounty Token:</label>
          <TokenSelector 
            token={token}
            setToken={setToken}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: 8, color: '#ccc' }}>Bounty Amount:</label>
          <input
            type="number"
            step="0.1"
            value={bountyAmount}
            onChange={(e) => setBountyAmount(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: '#111',
              border: '1px solid #555',
              borderRadius: 4,
              color: '#fff'
            }}
            placeholder="1.0"
          />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 8, 
          color: '#ffa500',
          fontWeight: 'bold'
        }}>
          💰 Boost with Token?
        </label>
        <select 
          value={selectedToken} 
          onChange={e => setSelectedToken(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: '#111',
            border: '1px solid #555',
            borderRadius: 4,
            color: '#fff',
            marginBottom: 10
          }}
        >
          {SUPPORTED_TOKENS.map(t => (
            <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
          ))}
        </select>

        <input
          type="number"
          step="0.1"
          value={boostAmount}
          onChange={e => setBoostAmount(e.target.value)}
          placeholder="Amount to spend"
          style={{
            width: '100%',
            padding: '8px 12px',
            background: '#111',
            border: '1px solid #555',
            borderRadius: 4,
            color: '#fff'
          }}
        />
      </div>

      <button 
        onClick={submitFusion}
        disabled={loading || !newDreamBody.trim()}
        style={{
          padding: '8px 16px',
          borderRadius: 6,
          background: loading ? '#555' : '#0a5',
          color: '#fff',
          border: '1px solid #555'
        }}
      >
        {loading ? 'Submitting...' : '✅ Submit New Dream'}
      </button>

      {fusionResult && (
        <div style={{
          marginTop: 20,
          padding: 15,
          background: '#111',
          border: '2px solid #0ff',
          borderRadius: 8
        }}>
          <h3 style={{ color: '#0ff' }}>✨ Dream Created!</h3>
          <p><strong>{fusionResult.fusedDream?.title}</strong></p>
          <p>ID: {fusionResult.fusedDream?.id}</p>
          
          <button
            onClick={() => window.location.href = '/cloud/all'}
            style={{
              marginTop: 10,
              padding: '6px 12px',
              borderRadius: 4,
              background: '#0a5',
              color: '#fff',
              border: '1px solid #555'
            }}
          >
            Back to Cloud
          </button>
        </div>
      )}
    </div>
  );
}

// Server-side rendering pattern (currently client-side for React compatibility)
// export async function getServerSideProps(context) {
//   const ids = context.query.ids.split(',');
//   const dreams = await db.collection('dreams').find({ id: { $in: ids } }).toArray();
//   return { props: { dreams } };
// }