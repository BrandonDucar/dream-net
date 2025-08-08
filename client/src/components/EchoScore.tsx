import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Eye, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EchoScoreData {
  wallet: string;
  score: number;
  trustLevel: 'Low' | 'Medium' | 'High';
  unlockedAgents: string[];
  status: string;
}

export default function EchoScore() {
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();
  const [scoreData, setScoreData] = useState<EchoScoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScore = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/wallet-scoring/${publicKey.toBase58()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch score: ${response.status}`);
      }
      const data = await response.json();
      setScoreData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load score';
      setError(errorMessage);
      console.error('Echo score fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateScore = async (action: string) => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/wallet-scoring/${publicKey.toBase58()}/score`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update score: ${response.status}`);
      }
      
      const data = await response.json();
      setScoreData(prev => prev ? {
        ...prev,
        score: data.newScore,
        trustLevel: data.trustLevel,
        unlockedAgents: data.unlockedAgents
      } : null);

      toast({
        title: "ECHO Agent Action",
        description: `${action} completed. Score: ${data.previousScore} → ${data.newScore}`
      });
    } catch (err) {
      toast({
        title: "Action Failed",
        description: "Failed to update wallet score",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      fetchScore();
    } else {
      setScoreData(null);
      setError(null);
    }
  }, [publicKey, connected]);

  const getTrustColor = (trustLevel: string) => {
    switch (trustLevel) {
      case 'High': return 'text-green-400 border-green-500/20 bg-green-500/10';
      case 'Medium': return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10';
      case 'Low': return 'text-red-400 border-red-500/20 bg-red-500/10';
      default: return 'text-gray-400 border-gray-500/20 bg-gray-500/10';
    }
  };

  const isEchoUnlocked = scoreData?.unlockedAgents.includes('ECHO') || false;

  if (!connected || !publicKey) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Eye className="h-8 w-8 mx-auto mb-2 text-purple-400" />
            <p>Connect your Solana wallet to access ECHO Agent</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading && !scoreData) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <div className="animate-spin h-6 w-6 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>Loading score...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center text-red-400">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Error: {error}</p>
            <Button 
              variant="outline" 
              onClick={fetchScore} 
              className="mt-3 text-xs"
              disabled={loading}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!scoreData) return null;

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Eye className="h-5 w-5 text-purple-400" />
          ECHO Agent - Wallet Mirror
          <Badge className={getTrustColor(scoreData.trustLevel)}>
            {scoreData.trustLevel}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Trust Score</span>
            <span className="text-sm font-mono text-green-400">{scoreData.score}/100</span>
          </div>
          <Progress value={scoreData.score} className="h-2" />
        </div>

        <div className="p-3 rounded border border-purple-500/20 bg-purple-500/5">
          <h4 className="text-sm font-medium text-purple-400 mb-2">Wallet Analysis</h4>
          <div className="text-xs space-y-1 text-muted-foreground">
            <p><strong>Address:</strong> <code className="font-mono">{publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}</code></p>
            <p><strong>ECHO Access:</strong> <span className={isEchoUnlocked ? 'text-green-400' : 'text-red-400'}>
              {isEchoUnlocked ? 'Unlocked' : 'Locked (50+ score required)'}
            </span></p>
            <p><strong>Unlocked Agents:</strong> {scoreData.unlockedAgents.join(', ')}</p>
          </div>
        </div>

        {isEchoUnlocked && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-purple-400">ECHO Agent Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateScore('agent_interaction')}
                disabled={loading}
                className="text-xs h-8"
              >
                <Zap className="h-3 w-3 mr-1" />
                Mirror Scan (+3)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateScore('contribution')}
                disabled={loading}
                className="text-xs h-8"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Contribute (+8)
              </Button>
            </div>
          </div>
        )}

        {!isEchoUnlocked && (
          <div className="p-3 rounded border border-yellow-500/20 bg-yellow-500/5">
            <p className="text-xs text-yellow-400">
              ECHO Agent requires Medium trust level (50+ score). Current: {scoreData.score}
            </p>
          </div>
        )}

        <div className="pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p><strong>ECHO Agent Features:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Wallet behavior analysis</li>
              <li>Cross-chain activity monitoring</li>
              <li>Trust score calculations</li>
              <li>Agent access management</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}