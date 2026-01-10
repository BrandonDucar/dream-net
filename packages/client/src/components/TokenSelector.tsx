import { SUPPORTED_TOKENS, getTokenBySymbol } from '@dreamnet/shared/tokens';

interface TokenSelectorProps {
  token: string;
  setToken: (symbol: string) => void;
  showHidden?: boolean;
}

export default function TokenSelector({ token, setToken, showHidden = false }: TokenSelectorProps) {
  const availableTokens = showHidden ? SUPPORTED_TOKENS : SUPPORTED_TOKENS.filter(t => !t.hiddenFromDreamNetwork);

  return (
    <select 
      value={token} 
      onChange={(e) => setToken(e.target.value)}
      style={{
        padding: '8px 12px',
        background: '#111',
        border: '1px solid #555',
        borderRadius: 6,
        color: '#fff',
        cursor: 'pointer',
        minWidth: 120
      }}
    >
      {availableTokens.map(t => (
        <option key={t.symbol} value={t.symbol}>
          {t.symbol}
        </option>
      ))}
    </select>
  );
}