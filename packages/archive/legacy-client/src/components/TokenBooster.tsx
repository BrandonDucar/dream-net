import { useState } from 'react';
import { SUPPORTED_TOKENS, parseTokenAmount, formatUnits, getTokenBySymbol } from '@dreamnet/shared/tokens';

interface TokenBoosterProps {
  onBoost?: (tokenSymbol: string, amount: string) => void;
  disabled?: boolean;
}

export default function TokenBooster({ onBoost, disabled = false }: TokenBoosterProps) {
  const [selectedToken, setSelectedToken] = useState('SHEEP');
  const [boostAmount, setBoostAmount] = useState('');

  function handleBoost() {
    if (!boostAmount || parseFloat(boostAmount) <= 0) return;
    
    const token = getTokenBySymbol(selectedToken);
    if (!token) return;
    
    const amountInUnits = parseTokenAmount(boostAmount, token.decimals);
    
    console.log('Token boost:', {
      token: selectedToken,
      amount: boostAmount,
      amountInUnits,
      formattedAmount: formatUnits(amountInUnits, token.decimals)
    });
    
    onBoost?.(selectedToken, amountInUnits);
    setBoostAmount('');
  }

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
          color: '#ffa500',
          fontWeight: 'bold'
        }}>
          💰 Boost with Token?
        </label>
        <select 
          value={selectedToken} 
          onChange={e => setSelectedToken(e.target.value)}
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
          {SUPPORTED_TOKENS.map(t => (
            <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 15 }}>
        <input
          type="number"
          step="0.1"
          value={boostAmount}
          onChange={e => setBoostAmount(e.target.value)}
          placeholder="Amount to spend"
          disabled={disabled}
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
        onClick={handleBoost}
        disabled={disabled || !boostAmount || parseFloat(boostAmount) <= 0}
        style={{
          padding: '10px 20px',
          background: (disabled || !boostAmount || parseFloat(boostAmount) <= 0) ? '#555' : '#ffa500',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: (disabled || !boostAmount || parseFloat(boostAmount) <= 0) ? 'not-allowed' : 'pointer',
          fontWeight: 'bold'
        }}
      >
        🚀 Boost with {selectedToken}
      </button>

      {boostAmount && parseFloat(boostAmount) > 0 && (
        <div style={{ 
          marginTop: 10, 
          fontSize: 12, 
          color: '#999' 
        }}>
          Will spend: {boostAmount} {selectedToken}
        </div>
      )}
    </div>
  );
}