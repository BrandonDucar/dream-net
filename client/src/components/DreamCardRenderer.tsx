import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';

interface Dream {
  id?: string;
  title: string;
  tags?: string[];
  remix?: boolean;
  fusion?: boolean;
  wallet?: string;
  isNightmare?: boolean;
  trustScore?: number;
  hasBounty?: boolean;
  bounty?: {
    reward: number;
    note: string;
  };
  forkedFrom?: string;
  bountyId?: string;
  dreamCloud?: 'defi' | 'gaming' | 'zksync' | 'desci' | 'memes' | 'ai' | 'tools' | 'social' | 'art' | 'custom';
}

interface DreamCardRendererProps {
  dream: Dream;
  isAdmin?: boolean;
  isOwner?: boolean;
  onShowBountyPanel?: () => void;
  publicKey?: string;
}

export default function DreamCardRenderer({ dream, isAdmin, isOwner, onShowBountyPanel, publicKey }: DreamCardRendererProps) {
  const [showBountyPanel, setShowBountyPanel] = useState(false);
  const [reward, setReward] = useState('');
  const [note, setNote] = useState('');
  const [forks, setForks] = useState([]);

  const handleCapture = async () => {
    const card = document.getElementById('dream-card');
    if (!card) return;
    
    const canvas = await html2canvas(card);
    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = `${dream.title || 'dream'}.png`;
    link.click();
  };

  useEffect(() => {
    if (dream.hasBounty) {
      fetch(`/api/get-forks-by-bounty?bountyId=${dream.id}`)
        .then(res => res.json())
        .then(data => setForks(data))
        .catch(err => console.error('❌ Failed to fetch forks', err));
    }
  }, [dream]);

  const handleShowBountyPanel = () => {
    if (onShowBountyPanel) {
      onShowBountyPanel();
    } else {
      setShowBountyPanel(true);
    }
  };

  const handlePostBounty = async () => {
    const res = await fetch('/api/post-bounty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dreamId: dream.id,
        reward,
        note,
        wallet: publicKey
      })
    });
    const data = await res.json();
    if (data.success) {
      alert('🎯 Bounty posted!');
      setShowBountyPanel(false);
    }
  };

  // Dynamic styling based on nightmare mode
  let background = '#000';
  let boxShadow = '0 0 24px #0ff';
  
  if (dream.isNightmare) {
    background = '#200';
    boxShadow = '0 0 16px red';
  }

  return (
    <div>
      {dream.isNightmare && (
        <div style={{
          background: '#200',
          color: '#f00',
          padding: 20,
          marginBottom: 20,
          border: '2px dashed red'
        }}>
          ⚠️ This dream has entered Nightmare Mode.
          <br />
          Remix at your own risk.
        </div>
      )}

      {dream.isNightmare && (isAdmin || isOwner) && (
        <button onClick={() => setShowBountyPanel(true)} style={{
          background: '#500', color: '#fff', padding: '10px', marginTop: '10px'
        }}>
          💼 Post Bounty to Cure This Nightmare
        </button>
      )}
      
      <div id="dream-card" style={{
        width: 512,
        height: 512,
        padding: 30,
        background,
        color: '#fff',
        fontFamily: 'monospace',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow
      }}>
        <div>
          <h2>{dream.title}</h2>
          <p style={{ opacity: 0.7 }}>{dream.tags?.join(', ')}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: 12, opacity: 0.6 }}>
            {dream.isNightmare ? '🌙' : '🧬'} {dream.remix ? 'Remix' : dream.fusion ? 'Fusion' : 'Original'} | Wallet: {dream.wallet?.slice(0, 6)}...  
          </div>
          {dream.id && (
            <QRCodeSVG value={`https://dreamnetwork.xyz/dreams/${dream.id}`} size={64} />
          )}
        </div>
      </div>
      
      <button onClick={handleCapture}>🎴 Download Share Card</button>

      {dream.hasBounty && (
        <div style={{
          background: '#300', color: '#fff', padding: '10px',
          marginTop: '20px', borderRadius: 6
        }}>
          🎯 <strong>Bounty Active:</strong> {dream.bounty?.reward} $SHEEP  
          <br />
          📝 {dream.bounty?.note}
        </div>
      )}

      {forks.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>🧪 Cure Attempts</h3>
          <ul>
            {forks.map((fork: any, i: number) => (
              <li key={i}>
                <a href={`/dreams/${fork.id}`} style={{ color: '#0ff' }}>
                  🌱 {fork.title || 'Untitled Dream'} by {fork.wallet?.slice(0, 6)}...
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showBountyPanel && (
        <div style={{
          background: '#111', padding: 20, borderRadius: 8,
          border: '1px solid #f00', marginTop: 20
        }}>
          <h3>💀 Post Nightmare Bounty</h3>
          <input
            type="number"
            placeholder="Reward Amount (e.g. 100)"
            value={reward}
            onChange={e => setReward(e.target.value)}
            style={{ padding: 8, marginBottom: 10, width: '100%' }}
          />
          <textarea
            placeholder="Optional bounty brief"
            value={note}
            onChange={e => setNote(e.target.value)}
            style={{ padding: 8, width: '100%', height: 100 }}
          />
          <button onClick={handlePostBounty} style={{
            background: '#f00', color: '#fff', padding: 10
          }}>🎯 Launch Bounty</button>
        </div>
      )}
    </div>
  );
}