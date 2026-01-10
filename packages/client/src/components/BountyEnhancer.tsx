import { useState } from 'react';
import { BOUNTY_ENHANCEMENTS, getEnhancementDescription, formatUnits, parseTokenAmount, getTokenBySymbol, type BountyEnhancement } from '@dreamnet/shared/tokens';

interface BountyEnhancerProps {
  onEnhance?: (enhancement: BountyEnhancement) => void;
  disabled?: boolean;
}

export default function BountyEnhancer({ onEnhance, disabled = false }: BountyEnhancerProps) {
  const [selectedEnhancement, setSelectedEnhancement] = useState<BountyEnhancement['type']>('double_xp');

  function handleEnhance() {
    const enhancement = BOUNTY_ENHANCEMENTS.find(e => e.type === selectedEnhancement);
    if (!enhancement) return;
    
    console.log('Applying bounty enhancement:', {
      type: enhancement.type,
      token: enhancement.token,
      cost: enhancement.cost,
      description: getEnhancementDescription(enhancement.type)
    });
    
    onEnhance?.(enhancement);
  }

  const selectedEnhancementData = BOUNTY_ENHANCEMENTS.find(e => e.type === selectedEnhancement);
  const tokenInfo = selectedEnhancementData ? getTokenBySymbol(selectedEnhancementData.token) : null;
  const costInTokens = selectedEnhancementData && tokenInfo ? 
    formatUnits(parseTokenAmount(selectedEnhancementData.cost.toString(), tokenInfo.decimals), tokenInfo.decimals) : '0';

  return (
    <div style={{
      background: '#111',
      border: '1px solid #555',
      borderRadius: 8,
      padding: 15,
      marginBottom: 20
    }}>
      <div style={{ marginBottom: 15 }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 8, 
          color: '#f0f',
          fontWeight: 'bold'
        }}>
          ⚡ Enhance Bounty?
        </label>
        <select 
          value={selectedEnhancement} 
          onChange={e => setSelectedEnhancement(e.target.value as BountyEnhancement['type'])}
          disabled={disabled}
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
          {BOUNTY_ENHANCEMENTS.map(enhancement => (
            <option key={enhancement.type} value={enhancement.type}>
              {enhancement.type.replace('_', ' ').toUpperCase()} - {enhancement.cost} {enhancement.token}
            </option>
          ))}
        </select>
      </div>

      {selectedEnhancementData && (
        <div style={{ marginBottom: 15 }}>
          <div style={{ color: '#ccc', fontSize: 14, marginBottom: 8 }}>
            {getEnhancementDescription(selectedEnhancement)}
          </div>
          <div style={{ color: '#f0f', fontSize: 12 }}>
            Cost: {costInTokens} {selectedEnhancementData.token}
          </div>
        </div>
      )}

      <button
        onClick={handleEnhance}
        disabled={disabled}
        style={{
          padding: '10px 20px',
          background: disabled ? '#555' : '#f0f',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontWeight: 'bold'
        }}
      >
        ⚡ Apply Enhancement
      </button>
    </div>
  );
}