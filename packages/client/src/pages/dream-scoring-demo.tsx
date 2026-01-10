import { useState } from 'react';
import { SUPPORTED_TOKENS, formatUnits } from '@dreamnet/shared/tokens';
import TokenBooster from '@/components/TokenBooster';
import DreamCard from '@/components/DreamCard';

interface Dream {
  id: string;
  title: string;
  description: string;
  creator: string;
  score: number;
  boosts: Array<{
    token: string;
    amount: string;
    booster: string;
    timestamp: number;
  }>;
  dreamCloud: string;
  status: string;
}

export default function DreamScoringDemo() {
  const [dreams, setDreams] = useState<Dream[]>([
    {
      id: 'dream-1',
      title: 'Decentralized Dream Marketplace',
      description: 'A peer-to-peer platform for trading dream tokens and NFTs with automated escrow.',
      creator: '0x1234...5678',
      score: 750,
      boosts: [
        { token: 'SHEEP', amount: '1000000000000000000', booster: '0xabc...def', timestamp: Date.now() - 3600000 }
      ],
      dreamCloud: 'defi',
      status: 'Live'
    },
    {
      id: 'dream-2',
      title: 'AI Dream Pattern Recognition',
      description: 'Machine learning system to identify and classify dream patterns for better user insights.',
      creator: '0x9876...5432',
      score: 425,
      boosts: [],
      dreamCloud: 'ai',
      status: 'Draft'
    },
    {
      id: 'dream-3',
      title: 'Virtual Reality Dream Worlds',
      description: 'Immersive VR experiences based on user-submitted dreams and collaborative storytelling.',
      creator: '0xabcd...efgh',
      score: 890,
      boosts: [
        { token: 'CORE', amount: '2000000000000000000', booster: '0x123...456', timestamp: Date.now() - 7200000 },
        { token: 'SHEEP', amount: '500000000000000000', booster: '0x789...abc', timestamp: Date.now() - 1800000 }
      ],
      dreamCloud: 'gaming',
      status: 'Live'
    }
  ]);

  const [selectedDream, setSelectedDream] = useState<string | null>(null);

  function handleBoost(dreamId: string, tokenSymbol: string, amountInUnits: string) {
    setDreams(prev => prev.map(dream => {
      if (dream.id !== dreamId) return dream;
      
      const newBoost = {
        token: tokenSymbol,
        amount: amountInUnits,
        booster: localStorage.getItem('walletAddress') || '0xuser...wallet',
        timestamp: Date.now()
      };
      
      // Calculate score boost based on token and amount
      const boostValue = calculateScoreBoost(tokenSymbol, amountInUnits);
      
      return {
        ...dream,
        score: dream.score + boostValue,
        boosts: [...dream.boosts, newBoost]
      };
    }));
  }

  function calculateScoreBoost(token: string, amountInUnits: string): number {
    const tokenMultipliers = { SHEEP: 10, CORE: 25, FLBY: 15 };
    const multiplier = tokenMultipliers[token as keyof typeof tokenMultipliers] || 10;
    const amount = parseFloat(formatUnits(amountInUnits));
    return Math.floor(amount * multiplier);
  }

  function getTotalBoostValue(boosts: Dream['boosts']): string {
    const totalByToken = boosts.reduce((acc, boost) => {
      const token = boost.token;
      const current = acc[token] || '0';
      const currentBig = BigInt(current);
      const boostBig = BigInt(boost.amount);
      acc[token] = (currentBig + boostBig).toString();
      return acc;
    }, {} as Record<string, string>);

    return Object.entries(totalByToken)
      .map(([token, amount]) => `${formatUnits(amount)} ${token}`)
      .join(' + ');
  }

  const selectedDreamData = dreams.find(d => d.id === selectedDream);

  return (
    <div style={{ padding: 40 }}>
      <h1>📊 Dream Scoring Demo</h1>
      
      <p style={{ marginBottom: 30, color: '#ccc' }}>
        Boost dream scores using tokens. Higher boosts improve visibility and ranking in the network.
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))', 
        gap: 20,
        marginBottom: 40
      }}>
        {dreams.map(dream => (
          <div key={dream.id} style={{ position: 'relative' }}>
            <DreamCard
              dream={{
                ...dream,
                description: `${dream.description}\n\nScore: ${dream.score} | Boosts: ${dream.boosts.length}`
              }}
              onClick={() => setSelectedDream(dream.id)}
              selected={selectedDream === dream.id}
            />
            {dream.boosts.length > 0 && (
              <div style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: '#ffa500',
                color: '#000',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 'bold'
              }}>
                🚀 {dream.boosts.length} boost{dream.boosts.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedDreamData && (
        <div style={{
          background: '#111',
          border: '1px solid #555',
          borderRadius: 8,
          padding: 20
        }}>
          <h2>Boost Dream Score</h2>
          
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ color: '#0ff', margin: '0 0 10px 0' }}>
              {selectedDreamData.title}
            </h3>
            <div style={{ color: '#ccc', marginBottom: 15 }}>
              Current Score: <strong style={{ color: '#ffa500' }}>{selectedDreamData.score}</strong>
            </div>
            
            {selectedDreamData.boosts.length > 0 && (
              <div style={{ marginBottom: 15 }}>
                <strong>Total Boosts: {getTotalBoostValue(selectedDreamData.boosts)}</strong>
                <div style={{ fontSize: 12, color: '#999', marginTop: 5 }}>
                  {selectedDreamData.boosts.length} contribution{selectedDreamData.boosts.length !== 1 ? 's' : ''} from the community
                </div>
              </div>
            )}
          </div>

          <TokenBooster
            onBoost={(tokenSymbol, amountInUnits) => handleBoost(selectedDreamData.id, tokenSymbol, amountInUnits)}
          />

          {selectedDreamData.boosts.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <h4>Recent Boosts:</h4>
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {selectedDreamData.boosts.slice(-5).reverse().map((boost, index) => (
                  <div key={index} style={{
                    background: '#222',
                    padding: 10,
                    marginBottom: 8,
                    borderRadius: 4,
                    fontSize: 12
                  }}>
                    <div style={{ color: '#ffa500', fontWeight: 'bold' }}>
                      +{formatUnits(boost.amount)} {boost.token}
                    </div>
                    <div style={{ color: '#999' }}>
                      From: {boost.booster} • {new Date(boost.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}