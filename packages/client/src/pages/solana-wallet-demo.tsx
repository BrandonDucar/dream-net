// WalletConnectionProvider is now provided globally in App.tsx
import SolanaWalletButton from '@/components/SolanaWalletButton';
import WalletHeader from '@/components/WalletHeader';
import { useWallet } from '@solana/wallet-adapter-react';
import Head from '@/components/Head';

function SolanaWalletContent() {
  const { connected, publicKey, wallet } = useWallet();

  return (
    <div style={{ padding: 40, background: '#000', color: '#0ff' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 20 }}>🟣 Solana Wallet Integration</h1>
      
      <div style={{ marginBottom: 30 }}>
        <WalletHeader />
        <div style={{ marginTop: 20 }}>
          <SolanaWalletButton />
        </div>
      </div>

      {connected && publicKey && (
        <div style={{ 
          background: '#111', 
          border: '1px solid #0ff', 
          padding: 20, 
          borderRadius: 8,
          marginBottom: 20
        }}>
          <h3>✅ Wallet Connected</h3>
          <p><strong>Address:</strong> <code>{publicKey.toBase58()}</code></p>
          <p><strong>Wallet:</strong> {wallet?.adapter.name || 'Unknown'}</p>
        </div>
      )}

      <div style={{ 
        background: '#222', 
        border: '1px solid #666', 
        padding: 20, 
        borderRadius: 8 
      }}>
        <h3>🔧 Dream Network Solana Features</h3>
        <ul style={{ lineHeight: 1.6 }}>
          <li>SOL-based dream claiming transactions</li>
          <li>Solana wallet authentication for dreams</li>
          <li>Cross-chain compatibility with Ethereum</li>
          <li>NFT minting on Solana blockchain</li>
          <li>SPL token rewards for contributors</li>
        </ul>
        
        {!connected && (
          <p style={{ color: '#ffd93d', marginTop: 15 }}>
            💡 Connect a Solana wallet to access these features
          </p>
        )}
      </div>
    </div>
  );
}

export default function SolanaWalletDemo() {
  return (
    <>
      <Head>
        <title>🟣 Solana Wallet Demo | Dream Network</title>
        <meta name="description" content="Connect your Solana wallet to the Dream Network for SOL-based transactions and cross-chain functionality." />
        <meta property="og:title" content="🟣 Solana Wallet Demo | Dream Network" />
        <meta property="og:description" content="Connect your Solana wallet to the Dream Network for SOL-based transactions." />
        <meta property="og:type" content="website" />
      </Head>
      <SolanaWalletContent />
    </>
  );
}