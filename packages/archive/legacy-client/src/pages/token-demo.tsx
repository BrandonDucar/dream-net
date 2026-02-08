import { useState } from 'react';
import { getDefaultToken, getVisibleTokens, getTokenBySymbol, SUPPORTED_TOKENS } from '@dreamnet/shared';
import TokenSelector from '@/components/TokenSelector';

export default function TokenDemo() {
  const [token, setToken] = useState(getDefaultToken().symbol);
  const [amount, setAmount] = useState('');
  const [showHidden, setShowHidden] = useState(false);

  const selectedToken = getTokenBySymbol(token) || getDefaultToken();

  function handleMint() {
    console.log('Minting token:', {
      token: selectedToken.symbol,
      amount: amount,
      address: selectedToken.address,
      decimals: selectedToken.decimals
    });
  }

  const visibleTokens = SUPPORTED_TOKENS.filter(t => !t.hiddenFromDreamNetwork);

  return (
    <div style={{ padding: 40 }}>
      <h1>💎 Token Management</h1>

      <div style={{ marginBottom: 20 }}>
        <h3>Available Tokens ({visibleTokens.length} visible)</h3>
        <ul>
          {visibleTokens.map(token => (
            <li key={token.symbol} style={{ marginBottom: 8 }}>
              <strong>{token.symbol}</strong> - {token.name}
              {token.default && <span style={{ color: '#0ff' }}> (Default)</span>}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>Select Token:</label>
        <TokenSelector
          token={token}
          setToken={setToken}
          showHidden={showHidden}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>
          <input
            type="checkbox"
            checked={showHidden}
            onChange={(e) => setShowHidden(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Show hidden tokens (Admin)
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          style={{
            padding: '8px 12px',
            background: '#111',
            border: '1px solid #555',
            borderRadius: 6,
            color: '#fff',
            width: 200
          }}
        />
      </div>

      <button
        onClick={handleMint}
        disabled={!amount || parseFloat(amount) <= 0}
        style={{
          padding: '12px 24px',
          background: selectedToken.default ? '#0a5' : '#f0a',
          color: '#fff',
          border: '1px solid #555',
          borderRadius: 6,
          cursor: 'pointer'
        }}
      >
        💎 Mint {selectedToken.symbol}
      </button>

      <div style={{
        marginTop: 30,
        padding: 15,
        background: '#111',
        border: '1px solid #555',
        borderRadius: 8
      }}>
        <h4>Selected Token Details:</h4>
        <p><strong>Symbol:</strong> {selectedToken.symbol}</p>
        <p><strong>Name:</strong> {selectedToken.name}</p>
        <p><strong>Decimals:</strong> {selectedToken.decimals}</p>
        <p><strong>Address:</strong> {selectedToken.address}</p>
        <p><strong>Default:</strong> {selectedToken.default ? 'Yes' : 'No'}</p>
        {selectedToken.hiddenFromDreamNetwork && (
          <p style={{ color: '#f44' }}>
            <strong>Status:</strong> 🔒 BLOCKED FROM SYSTEM INTEL
          </p>
        )}
      </div>
    </div>
  );
}