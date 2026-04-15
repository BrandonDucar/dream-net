import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coins, Lock, Zap, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScoreData {
  score: number;
  trustLevel: 'Low' | 'Medium' | 'High';
  unlockedAgents: string[];
}

interface DreamTokenMinterProps {
  scoreData?: ScoreData | null;
  dreamId?: string;
  dreamName?: string;
}

export default function DreamTokenMinter({ scoreData, dreamId, dreamName }: DreamTokenMinterProps) {
  const { walletAddress: ethAddress } = useAuth();
  const { publicKey: solanaPublicKey, connected: solanaConnected } = useWallet();
  const { toast } = useToast();
  const [isMinting, setIsMinting] = useState(false);
  const [mintedTokens, setMintedTokens] = useState<any[]>([]);

  const activeWallet = solanaConnected && solanaPublicKey 
    ? solanaPublicKey.toBase58() 
    : ethAddress;

  const hasCradleAccess = scoreData?.unlockedAgents.includes('CRADLE') || false;
  const canMint = hasCradleAccess && activeWallet;

  const handleMint = async () => {
    if (!canMint || !scoreData) return;

    setIsMinting(true);
    try {
      const response = await fetch('/api/mint-dream-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: activeWallet,
          dreamId: dreamId || `dream-${Date.now()}`,
          dreamName: dreamName || 'Untitled Dream',
          trustLevel: scoreData.trustLevel,
          score: scoreData.score
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setMintedTokens(prev => [...prev, result]);
        toast({
          title: "Dream Token Minted! 🪙",
          description: `Token ID: ${result.tokenId} - Value: ${result.value} DTC`
        });
      } else {
        throw new Error(result.error || 'Minting failed');
      }
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Card className="border-border bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-400" />
          Dream Token Minting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scoreData && (
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 rounded border border-border bg-card/20">
              <div className="text-lg font-mono text-cyan-400">{scoreData.score}</div>
              <div className="text-xs text-muted-foreground">Trust Score</div>
            </div>
            <div className="p-2 rounded border border-border bg-card/20">
              <div className="text-lg font-mono text-purple-400">{scoreData.trustLevel}</div>
              <div className="text-xs text-muted-foreground">Trust Level</div>
            </div>
            <div className="p-2 rounded border border-border bg-card/20">
              <div className="text-lg font-mono text-green-400">{scoreData.unlockedAgents.length}/6</div>
              <div className="text-xs text-muted-foreground">Agents</div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">CRADLE Access Progress</span>
              <span className="text-sm font-mono">{scoreData?.score || 0}/80</span>
            </div>
            <Progress value={Math.min((scoreData?.score || 0) / 80 * 100, 100)} className="h-2" />
          </div>

          {hasCradleAccess ? (
            <Badge className="text-green-400 border-green-500/20 bg-green-500/10 w-full justify-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              CRADLE Agent Unlocked
            </Badge>
          ) : (
            <Badge variant="outline" className="text-red-400 border-red-500/20 bg-red-500/10 w-full justify-center">
              <Lock className="h-3 w-3 mr-1" />
              CRADLE Agent Locked (Need 80+ score)
            </Badge>
          )}
        </div>

        {/* Implementation of your exact pattern */}
        {scoreData?.unlockedAgents.includes('CRADLE') ? (
          <button
            onClick={handleMint}
            disabled={isMinting || !activeWallet}
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
              opacity: (isMinting || !activeWallet) ? 0.6 : 1
            }}
          >
            {isMinting ? '⚡ Minting...' : '🪙 Mint Dream Token'}
          </button>
        ) : (
          <p style={{ color: '#888', marginTop: 30, textAlign: 'center' }}>
            🔒 Minting locked — CRADLE agent required (score 80+)
          </p>
        )}

        {!activeWallet && (
          <div className="text-center p-3 border border-yellow-500/20 bg-yellow-500/5 rounded">
            <p className="text-xs text-yellow-400">
              Connect a wallet to enable dream token minting
            </p>
          </div>
        )}

        {mintedTokens.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recently Minted Tokens:</h4>
            {mintedTokens.slice(-3).map((token, index) => (
              <div key={index} className="p-2 rounded border border-green-500/20 bg-green-500/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono">#{token.tokenId}</span>
                  <span className="text-green-400">{token.value} DTC</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {token.dreamName} • {new Date(token.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}