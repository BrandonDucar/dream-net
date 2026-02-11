import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, CheckCircle, Clock, ExternalLink } from 'lucide-react';

interface Dream {
  id: string;
  name?: string;
  title?: string;
  description?: string;
}

interface DreamMinterProps {
  dream: Dream;
  scoreData?: {
    score: number;
    trustLevel: string;
    unlockedAgents: string[];
  } | null;
}

interface MintStatus {
  isMinted: boolean;
  tokenId?: string;
  mintedAt?: string;
  transactionHash?: string;
}

export default function DreamMinter({ dream, scoreData }: DreamMinterProps) {
  const { publicKey } = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<MintStatus | null>(null);

  const canMint = scoreData?.unlockedAgents.includes('CRADLE') || false;
  const wallet = publicKey?.toBase58();

  // Implementation of your exact pattern
  const handleMint = async () => {
    const res = await fetch('/api/mint-dream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dreamId: dream.id, wallet: publicKey?.toBase58() })
    });

    const data = await res.json();
    if (data.success) {
      alert('🎉 Dream successfully minted to your wallet!');
      // Refresh mint status
      checkMintStatus();
    } else {
      alert('❌ Mint failed: ' + data.error);
    }
  };

  const checkMintStatus = async () => {
    if (!wallet) return;

    try {
      const res = await fetch(`/api/mint-status/${dream.id}/${wallet}`);
      const data = await res.json();
      setMintStatus(data);
    } catch (error) {
      console.error('Failed to check mint status:', error);
    }
  };

  const performMint = async () => {
    if (!wallet || !canMint) return;

    setIsMinting(true);
    try {
      await handleMint();
    } finally {
      setIsMinting(false);
    }
  };

  useEffect(() => {
    checkMintStatus();
  }, [wallet, dream.id]);

  return (
    <Card className="border-border bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-400" />
          Dream Minting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded border border-border bg-card/20">
          <h4 className="font-medium text-lg">{dream.name || dream.title || 'Untitled Dream'}</h4>
          <p className="text-sm text-muted-foreground mt-1">ID: {dream.id}</p>
          {dream.description && (
            <p className="text-sm text-muted-foreground mt-2">{dream.description}</p>
          )}
        </div>

        {mintStatus?.isMinted ? (
          <div className="space-y-3">
            <Badge className="text-green-400 border-green-500/20 bg-green-500/10 w-full justify-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              Already Minted
            </Badge>
            
            <div className="p-3 rounded border border-green-500/20 bg-green-500/5">
              <div className="text-sm space-y-1">
                <p><strong>Token ID:</strong> <code className="font-mono">{mintStatus.tokenId}</code></p>
                <p><strong>Minted:</strong> {new Date(mintStatus.mintedAt!).toLocaleString()}</p>
                {mintStatus.transactionHash && (
                  <p className="flex items-center gap-1">
                    <strong>Transaction:</strong> 
                    <code className="font-mono text-xs">{mintStatus.transactionHash.slice(0, 10)}...{mintStatus.transactionHash.slice(-10)}</code>
                    <ExternalLink className="h-3 w-3" />
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {scoreData?.unlockedAgents.includes('CRADLE') ? (
              <button
                onClick={handleMint}
                disabled={isMinting || !wallet}
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
                  opacity: (isMinting || !wallet) ? 0.6 : 1
                }}
              >
                {isMinting ? '⚡ Minting...' : '🪙 Mint Dream Token'}
              </button>
            ) : (
              <p style={{ color: '#888', marginTop: 30, textAlign: 'center' }}>
                🔒 Minting locked — CRADLE agent required (score 80+)
              </p>
            )}
          </div>
        )}

        {!wallet && (
          <div className="text-center p-3 border border-yellow-500/20 bg-yellow-500/5 rounded">
            <p className="text-xs text-yellow-400">
              Connect a Solana wallet to mint dreams
            </p>
          </div>
        )}

        {scoreData && (
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded border border-border bg-card/20">
              <div className="font-mono text-cyan-400">{scoreData.score}</div>
              <div className="text-muted-foreground">Score</div>
            </div>
            <div className="p-2 rounded border border-border bg-card/20">
              <div className="font-mono text-purple-400">{scoreData.trustLevel}</div>
              <div className="text-muted-foreground">Trust</div>
            </div>
            <div className="p-2 rounded border border-border bg-card/20">
              <div className="font-mono text-green-400">{scoreData.unlockedAgents.length}/6</div>
              <div className="text-muted-foreground">Agents</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}