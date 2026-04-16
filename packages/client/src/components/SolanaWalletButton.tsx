import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';

export default function SolanaWalletButton() {
  const { connected, publicKey } = useWallet();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
      <WalletMultiButton style={{
        background: '#663399',
        borderRadius: 4,
        padding: '10px 20px',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px'
      }} />
      
      {connected && publicKey && (
        <div style={{ 
          padding: '8px 16px', 
          background: '#0f0', 
          color: '#000', 
          borderRadius: 4,
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          ✅ {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
        </div>
      )}
    </div>
  );
}