import { useState } from 'react';
import { SUPPORTED_TOKENS } from '@shared/tokens';

export default function SimpleTokenDemo() {
  const [token, setToken] = useState('SHEEP');

  return (
    <div style={{ padding: 40 }}>
      <h1>Simple Token Selector</h1>
      
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>Choose Token:</label>
        <select value={token} onChange={(e) => setToken(e.target.value)}>
          {SUPPORTED_TOKENS.filter(t => !t.hiddenFromDreamNetwork).map(t => (
            <option key={t.symbol} value={t.symbol}>
              {t.symbol}
            </option>
          ))}
        </select>
      </div>

      <div style={{ 
        marginTop: 20, 
        padding: 15, 
        background: '#111', 
        border: '1px solid #555', 
        borderRadius: 8 
      }}>
        <h3>Selected: {token}</h3>
        <p>This demonstrates the exact user pattern with select element and filter.</p>
      </div>
    </div>
  );
}