import { useState } from 'react';
import { SUPPORTED_TOKENS, formatUnits, parseTokenAmount, getTokenBySymbol } from '@shared/tokens';
import DreamCard from '@/components/DreamCard';

interface Dream {
  id: string;
  title: string;
  description: string;
  creator: string;
  dreamCloud: string;
  status: string;
  fusionBoost?: {
    token: string;
    amount: string;
  };
}

export default function FusionChamberDemo() {
  const [dreams] = useState<Dream[]>([
    {
      id: 'dream-1',
      title: 'Quantum Dream Parser',
      description: 'Advanced AI system for interpreting and categorizing dream content using quantum computing.',
      creator: '0x1234...5678',
      dreamCloud: 'ai',
      status: 'Live'
    },
    {
      id: 'dream-2',
      title: 'Dream Token Exchange',
      description: 'Decentralized marketplace for trading dream-backed tokens with automated pricing.',
      creator: '0x9876...5432',
      dreamCloud: 'defi',
      status: 'Live'
    },
    {
      id: 'dream-3',
      title: 'Collaborative Dream Spaces',
      description: 'Virtual environments where multiple users can contribute to shared dream narratives.',
      creator: '0xabcd...efgh',
      dreamCloud: 'social',
      status: 'Draft'
    }
  ]);

  const [selectedDreams, setSelectedDreams] = useState<string[]>([]);
  const [fusionBody, setFusionBody] = useState('');
  const [selectedToken, setSelectedToken] = useState('SHEEP');
  const [boostAmount, setBoostAmount] = useState('');
  const [fusionResult, setFusionResult] = useState<Dream | null>(null);
  const [fusionStatus, setFusionStatus] = useState<'idle' | 'fusing' | 'success' | 'error'>('idle');

  function handleDreamSelection(dreamId: string) {
    setSelectedDreams(prev => 
      prev.includes(dreamId) 
        ? prev.filter(id => id !== dreamId)
        : [...prev, dreamId]
    );
  }

  function handleFusion() {
    if (selectedDreams.length < 2 || !fusionBody.trim()) return;

    setFusionStatus('fusing');

    // Simulate fusion process
    setTimeout(async () => {
      try {
        const selectedDreamData = dreams.filter(d => selectedDreams.includes(d.id));
        const fusionBoost = boostAmount ? {
          token: selectedToken,
          amount: parseTokenAmount(boostAmount, getTokenBySymbol(selectedToken)?.decimals || 18)
        } : null;

        // Database insertion pattern
        console.log('Fusion process:', {
          fusedFrom: selectedDreamData.map(d => d.id),
          creator: localStorage.getItem('walletAddress') || '0xuser...wallet',
          fusionBoost: fusionBoost,
          timestamp: Date.now()
        });

        const newFusedDream: Dream = {
          id: `fusion-${Date.now()}`,
          title: `Fusion of ${selectedDreamData.length} Dreams`,
          description: fusionBody,
          creator: localStorage.getItem('walletAddress') || '0xuser...wallet',
          dreamCloud: 'fusion',
          status: 'Live',
          fusionBoost: fusionBoost || undefined
        };

        setFusionResult(newFusedDream);
        setFusionStatus('success');
        
        // Reset form
        setSelectedDreams([]);
        setFusionBody('');
        setBoostAmount('');
      } catch (error) {
        setFusionStatus('error');
      }
    }, 2000);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>⚡ Fusion Chamber Demo</h1>
      
      <p style={{ marginBottom: 30, color: '#ccc' }}>
        Select 2+ dreams to fuse them into a new creation. Add a fusion boost to enhance the resulting dream's network visibility.
      </p>

      <div style={{ marginBottom: 40 }}>
        <h2>Available Dreams</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))', 
          gap: 20 
        }}>
          {dreams.map(dream => (
            <DreamCard
              key={dream.id}
              dream={{
                ...dream,
                description: `${dream.description}${selectedDreams.includes(dream.id) ? '\n\n✓ SELECTED FOR FUSION' : ''}`
              }}
              onClick={() => handleDreamSelection(dream.id)}
              selected={selectedDreams.includes(dream.id)}
            />
          ))}
        </div>
      </div>

      <div style={{
        background: '#111',
        border: '1px solid #555',
        borderRadius: 8,
        padding: 20,
        marginBottom: 20
      }}>
        <h2>Fusion Configuration</h2>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, color: '#0ff', fontWeight: 'bold' }}>
            Selected Dreams: {selectedDreams.length}
          </label>
          <div style={{ color: '#ccc', fontSize: 14 }}>
            {selectedDreams.length < 2 && 'Select at least 2 dreams to enable fusion'}
            {selectedDreams.length >= 2 && `Ready to fuse ${selectedDreams.length} dreams`}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, color: '#fff', fontWeight: 'bold' }}>
            Fusion Description:
          </label>
          <textarea
            value={fusionBody}
            onChange={e => setFusionBody(e.target.value)}
            placeholder="Describe how these dreams should be combined..."
            style={{
              width: '100%',
              height: 100,
              padding: '8px 12px',
              background: '#222',
              border: '1px solid #555',
              borderRadius: 4,
              color: '#fff',
              resize: 'vertical'
            }}
          />
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
              background: '#222',
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
              background: '#222',
              border: '1px solid #555',
              borderRadius: 4,
              color: '#fff'
            }}
          />
        </div>

        <button
          onClick={handleFusion}
          disabled={selectedDreams.length < 2 || !fusionBody.trim() || fusionStatus === 'fusing'}
          style={{
            padding: '12px 24px',
            background: (selectedDreams.length < 2 || !fusionBody.trim() || fusionStatus === 'fusing') ? '#555' : '#0a5',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: (selectedDreams.length < 2 || !fusionBody.trim() || fusionStatus === 'fusing') ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {fusionStatus === 'fusing' ? '⚡ Fusing Dreams...' : `⚡ Fuse ${selectedDreams.length} Dreams`}
        </button>

        {boostAmount && parseFloat(boostAmount) > 0 && (
          <div style={{ 
            marginTop: 10, 
            fontSize: 12, 
            color: '#ffa500' 
          }}>
            Will boost with: {boostAmount} {selectedToken}
          </div>
        )}
      </div>

      {fusionResult && fusionStatus === 'success' && (
        <div style={{ marginTop: 30 }}>
          <h2>Fusion Result</h2>
          <DreamCard
            dream={{
              ...fusionResult,
              description: `${fusionResult.description}${fusionResult.fusionBoost ? `\n\n🚀 Boosted with ${formatUnits(fusionResult.fusionBoost.amount)} ${fusionResult.fusionBoost.token}` : ''}`
            }}
          />
        </div>
      )}

      {fusionStatus === 'error' && (
        <div style={{ 
          marginTop: 20, 
          padding: 15, 
          background: '#441', 
          border: '1px solid #f44',
          borderRadius: 6,
          color: '#f44'
        }}>
          ❌ Fusion failed. Please try again.
        </div>
      )}
    </div>
  );
}