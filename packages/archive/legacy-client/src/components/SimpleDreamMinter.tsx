import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, CheckCircle } from 'lucide-react';

interface Dream {
  id: string;
  name?: string;
  title?: string;
}

interface SimpleDreamMinterProps {
  dream: Dream;
  hasCradleAccess: boolean;
}

export default function SimpleDreamMinter({ dream, hasCradleAccess }: SimpleDreamMinterProps) {
  const { publicKey } = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);

  // Your exact handleMint pattern
  const handleMint = async () => {
    const res = await fetch('/api/mint-dream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dreamId: dream.id, wallet: publicKey?.toBase58() })
    });

    const data = await res.json();
    if (data.success) {
      alert('🎉 Dream successfully minted to your wallet!');
      setIsMinted(true);
    } else {
      alert('❌ Mint failed: ' + data.error);
    }
  };

  const performMint = async () => {
    if (!publicKey || !hasCradleAccess || isMinted) return;

    setIsMinting(true);
    try {
      await handleMint();
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Card className="border-border bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-400" />
          {dream.name || dream.title || 'Untitled Dream'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Dream ID: <code className="font-mono">{dream.id}</code>
        </div>

        {isMinted ? (
          <Badge className="text-green-400 border-green-500/20 bg-green-500/10 w-full justify-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Successfully Minted
          </Badge>
        ) : hasCradleAccess ? (
          <button
            onClick={performMint}
            disabled={isMinting || !publicKey}
            style={{
              marginTop: 30,
              padding: '10px 20px',
              background: '#0ff',
              color: '#000',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: 8,
              boxShadow: '0 0 15px #0ff',
              cursor: 'pointer',
              width: '100%',
              opacity: (isMinting || !publicKey) ? 0.6 : 1
            }}
          >
            {isMinting ? '⚡ Minting...' : '🪙 Mint Dream Token'}
          </button>
        ) : (
          <p style={{ color: '#888', marginTop: 30, textAlign: 'center' }}>
            🔒 Minting locked — CRADLE agent required (score 80+)
          </p>
        )}

        {!publicKey && (
          <div className="text-center p-3 border border-yellow-500/20 bg-yellow-500/5 rounded">
            <p className="text-xs text-yellow-400">
              Connect a Solana wallet to mint dreams
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}