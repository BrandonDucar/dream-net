import { useState } from 'react';
import { formatUnits, getTokenBySymbol } from '@dreamnet/shared/tokens';
import DreamCard from '@/components/DreamCard';

interface Dream {
  id: string;
  title: string;
  description: string;
  creator: string;
  bountyAmount?: string;
  bountyToken?: 'SHEEP' | 'FLBY' | 'CORE';
  dreamCloud: string;
  status: string;
}

export default function DreamMintingDemo() {
  const [dreams] = useState<Dream[]>([
    {
      id: 'dream-1',
      title: 'AI-Powered Dream Analytics',
      description: 'Advanced analytics platform for tracking dream patterns and user engagement metrics across the network.',
      creator: '0x1234...5678',
      bountyAmount: '2000000000000000000', // 2.0 SHEEP
      bountyToken: 'SHEEP',
      dreamCloud: 'ai',
      status: 'Live'
    },
    {
      id: 'dream-2',
      title: 'Cross-Chain Bridge Protocol',
      description: 'Seamless token bridging between Ethereum and Solana for enhanced interoperability.',
      creator: '0x9876...5432',
      bountyAmount: '5000000000000000000', // 5.0 CORE
      bountyToken: 'CORE',
      dreamCloud: 'defi',
      status: 'Draft'
    },
    {
      id: 'dream-3',
      title: 'Social Dream Network',
      description: 'Decentralized social platform for dream sharing and collaborative storytelling.',
      creator: '0xabcd...efgh',
      bountyAmount: '1500000000', // 1.5 FLBY (9 decimals)
      bountyToken: 'FLBY',
      dreamCloud: 'social',
      status: 'Live'
    },
    {
      id: 'dream-4',
      title: 'Gaming Integration Hub',
      description: 'Plugin system for integrating dream tokens and NFTs into popular gaming platforms.',
      creator: '0xdef0...1234',
      dreamCloud: 'gaming',
      status: 'Draft'
    }
  ]);

  const [selectedDream, setSelectedDream] = useState<string | null>(null);
  const [mintingStatus, setMintingStatus] = useState<'idle' | 'minting' | 'success' | 'error'>('idle');

  function handleDreamSelect(dreamId: string) {
    setSelectedDream(dreamId);
    setMintingStatus('idle');
  }

  function handleMintDream() {
    if (!selectedDream) return;
    
    const dream = dreams.find(d => d.id === selectedDream);
    if (!dream) return;

    setMintingStatus('minting');
    
    // Simulate minting process
    setTimeout(() => {
      console.log('Minting dream:', {
        dreamId: dream.id,
        title: dream.title,
        bountyAmount: dream.bountyAmount,
        bountyToken: dream.bountyToken,
        mintTimestamp: Date.now()
      });
      setMintingStatus('success');
    }, 2000);
  }

  const selectedDreamData = dreams.find(d => d.id === selectedDream);

  return (
    <div style={{ padding: 40 }}>
      <h1>🎨 Dream Minting Demo</h1>
      
      <p style={{ marginBottom: 30, color: '#ccc' }}>
        Select a dream to mint as an NFT. Dreams with bounties will include the reward information in the token metadata.
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))', 
        gap: 20,
        marginBottom: 40
      }}>
        {dreams.map(dream => (
          <DreamCard
            key={dream.id}
            dream={dream}
            onClick={() => handleDreamSelect(dream.id)}
            selected={selectedDream === dream.id}
          />
        ))}
      </div>

      {selectedDreamData && (
        <div style={{
          background: '#111',
          border: '1px solid #555',
          borderRadius: 8,
          padding: 20,
          marginBottom: 20
        }}>
          <h2>Mint Selected Dream</h2>
          
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ color: '#0ff', margin: '0 0 10px 0' }}>
              {selectedDreamData.title}
            </h3>
            <p style={{ color: '#ccc', marginBottom: 15 }}>
              {selectedDreamData.description}
            </p>
            
            {selectedDreamData.bountyAmount && (
              <p style={{ color: '#ffa500', fontWeight: 'bold' }}>
                🏆 Bounty: {formatUnits(selectedDreamData.bountyAmount)} {selectedDreamData.bountyToken}
              </p>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4>Mint Details:</h4>
            <ul style={{ color: '#ccc' }}>
              <li>Token Standard: ERC-721</li>
              <li>Creator: {selectedDreamData.creator}</li>
              <li>Dream Cloud: {selectedDreamData.dreamCloud}</li>
              <li>Status: {selectedDreamData.status}</li>
              {selectedDreamData.bountyAmount && (
                <li>Includes Bounty: {formatUnits(selectedDreamData.bountyAmount)} {selectedDreamData.bountyToken}</li>
              )}
            </ul>
          </div>

          <button
            onClick={handleMintDream}
            disabled={mintingStatus === 'minting'}
            style={{
              padding: '12px 24px',
              background: mintingStatus === 'minting' ? '#555' : '#0a5',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: mintingStatus === 'minting' ? 'not-allowed' : 'pointer',
              marginRight: 10
            }}
          >
            {mintingStatus === 'minting' ? '⏳ Minting...' : '🎨 Mint Dream NFT'}
          </button>

          {mintingStatus === 'success' && (
            <span style={{ color: '#0a5', fontWeight: 'bold' }}>
              ✅ Dream minted successfully!
            </span>
          )}
          
          {mintingStatus === 'error' && (
            <span style={{ color: '#f44', fontWeight: 'bold' }}>
              ❌ Minting failed. Please try again.
            </span>
          )}
        </div>
      )}
    </div>
  );
}