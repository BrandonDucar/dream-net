import { useState } from 'react';
import { SUPPORTED_TOKENS, type BountyToken, formatUnits, parseTokenAmount, type BountyEnhancement } from '@dreamnet/shared/tokens';
import DreamCard from '@/components/DreamCard';
import BountyEnhancer from '@/components/BountyEnhancer';

interface Bounty {
  id: string;
  title: string;
  description: string;
  bountyToken: BountyToken;
  bountyAmount: string; // Raw token units
  creator: string;
  status: 'open' | 'in_progress' | 'completed';
  bountyEnhancement?: {
    type: 'double_xp' | 'priority_boost' | 'viral_spread' | 'expert_review';
    token: string;
    cost: number;
  };
  fusionBoost?: {
    token: string;
    amount: string;
  };
  createdAt: string;
}

export default function BountyExplorer() {
  const [bounties] = useState<Bounty[]>([
    {
      id: 'bounty-1',
      title: 'Fix Nightmare Dream Processing',
      description: 'Resolve issues with nightmare classification and scoring',
      bountyToken: 'SHEEP',
      bountyAmount: '1000000000000000000', // 1.0 SHEEP
      creator: '0x1234...5678',
      status: 'open',
      createdAt: '2024-01-15'
    },
    {
      id: 'bounty-2',
      title: 'Implement Dream Fusion Analytics',
      description: 'Add analytics dashboard for dream fusion metrics',
      bountyToken: 'CORE',
      bountyAmount: '5000000000000000000', // 5.0 CORE
      creator: '0x9876...5432',
      status: 'in_progress',
      bountyEnhancement: {
        type: 'double_xp',
        token: 'SHEEP',
        cost: 250
      },
      createdAt: '2024-01-10'
    },
    {
      id: 'bounty-3',
      title: 'Enhanced Dream Scoring Algorithm',
      description: 'Improve AI scoring for dream quality assessment',
      bountyToken: 'FLBY',
      bountyAmount: '2500000000', // 2.5 FLBY (9 decimals)
      creator: '0xabcd...efgh',
      status: 'completed',
      fusionBoost: {
        token: 'SHEEP',
        amount: '500000000000000000' // 0.5 SHEEP boost
      },
      createdAt: '2024-01-05'
    }
  ]);

  const [newBounty, setNewBounty] = useState({
    title: '',
    description: '',
    bountyToken: 'SHEEP' as BountyToken,
    bountyAmount: '1.0'
  });

  function getTokenInfo(symbol: BountyToken) {
    return SUPPORTED_TOKENS.find(t => t.symbol === symbol)!;
  }

  function formatBountyAmount(amount: string, token: BountyToken) {
    const tokenInfo = getTokenInfo(token);
    return `${formatUnits(amount, tokenInfo.decimals)} ${token}`;
  }

  function handleSubmitBounty() {
    const tokenInfo = getTokenInfo(newBounty.bountyToken);
    const amountInUnits = parseTokenAmount(newBounty.bountyAmount, tokenInfo.decimals);
    
    console.log('Creating bounty:', {
      ...newBounty,
      bountyAmount: amountInUnits, // Store in raw token units
      rawAmount: amountInUnits,
      formattedAmount: formatUnits(amountInUnits, tokenInfo.decimals)
    });
    
    // Reset form
    setNewBounty({
      title: '',
      description: '',
      bountyToken: 'SHEEP',
      bountyAmount: '1.0'
    });
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#0a5';
      case 'in_progress': return '#f0a';
      case 'completed': return '#555';
      default: return '#fff';
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>💰 Bounty Explorer</h1>
      
      <div style={{ marginBottom: 40 }}>
        <h2>Active Bounties</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))', 
          gap: 20 
        }}>
          {bounties.map(bounty => (
            <DreamCard
              key={bounty.id}
              dream={{
                id: bounty.id,
                title: bounty.title,
                description: bounty.description,
                creator: bounty.creator,
                bountyAmount: bounty.bountyAmount,
                bountyToken: bounty.bountyToken,
                bountyEnhancement: bounty.bountyEnhancement,
                status: bounty.status,
                fusionBoost: bounty.fusionBoost
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ 
        background: '#111', 
        border: '1px solid #555', 
        borderRadius: 8, 
        padding: 20 
      }}>
        <h2>Create New Bounty</h2>
        
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Title:</label>
          <input
            type="text"
            value={newBounty.title}
            onChange={(e) => setNewBounty({...newBounty, title: e.target.value})}
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

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Description:</label>
          <textarea
            value={newBounty.description}
            onChange={(e) => setNewBounty({...newBounty, description: e.target.value})}
            style={{
              width: '100%',
              height: 80,
              padding: '8px 12px',
              background: '#222',
              border: '1px solid #555',
              borderRadius: 4,
              color: '#fff'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 15, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Bounty Token:</label>
            <select 
              value={newBounty.bountyToken} 
              onChange={(e) => setNewBounty({...newBounty, bountyToken: e.target.value as BountyToken})}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: '#222',
                border: '1px solid #555',
                borderRadius: 4,
                color: '#fff'
              }}
            >
              {SUPPORTED_TOKENS.filter(t => !t.hiddenFromDreamNetwork).map(t => (
                <option key={t.symbol} value={t.symbol}>
                  {t.symbol}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>Amount:</label>
            <input
              type="number"
              step="0.1"
              value={newBounty.bountyAmount}
              onChange={(e) => setNewBounty({...newBounty, bountyAmount: e.target.value})}
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
        </div>

        <BountyEnhancer
          onEnhance={(enhancement) => console.log('Enhancement applied:', enhancement)}
        />

        <button
          onClick={handleSubmitBounty}
          disabled={!newBounty.title || !newBounty.description}
          style={{
            padding: '12px 24px',
            background: newBounty.title && newBounty.description ? '#0a5' : '#555',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: newBounty.title && newBounty.description ? 'pointer' : 'not-allowed'
          }}
        >
          💰 Create Bounty
        </button>
      </div>
    </div>
  );
}