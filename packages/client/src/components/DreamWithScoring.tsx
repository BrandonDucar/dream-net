import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Target, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Dream {
  id: string;
  name: string;
  description: string;
  creator: string;
  tags: string[];
  status: 'draft' | 'active' | 'completed';
  score?: number;
  trustLevel?: 'Low' | 'Medium' | 'High';
  wallet?: string;
  evolveCount?: number;
  contributorCount?: number;
}

interface ScoreData {
  score: number;
  trustLevel: 'Low' | 'Medium' | 'High';
  unlockedAgents: string[];
}

interface DreamWithScoringProps {
  dream: Dream;
  onDreamUpdate?: (dream: Dream) => void;
}

export default function DreamWithScoring({ dream, onDreamUpdate }: DreamWithScoringProps) {
  const { walletAddress: ethAddress } = useAuth();
  const { publicKey: solanaPublicKey, connected: solanaConnected } = useWallet();
  const { toast } = useToast();
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [dreamData, setDreamData] = useState<Dream>(dream);

  // Determine active wallet
  const activeWallet = solanaConnected && solanaPublicKey 
    ? solanaPublicKey.toBase58() 
    : ethAddress;

  const fetchScoreData = async () => {
    if (!activeWallet) return;
    
    try {
      const response = await fetch(`/api/wallet-scoring/${activeWallet}`);
      const data = await response.json();
      setScoreData(data);
    } catch (error) {
      console.error('Failed to fetch score data:', error);
    }
  };

  const updateDreamWithScore = async () => {
    if (!scoreData || !activeWallet) return;

    setLoading(true);
    try {
      // Update dream with wallet scoring data
      const updatedDream: Dream = {
        ...dreamData,
        score: scoreData.score,
        trustLevel: scoreData.trustLevel,
        wallet: activeWallet,
        evolveCount: (dreamData.evolveCount || 0) + 1
      };

      setDreamData(updatedDream);
      
      // Notify parent component
      if (onDreamUpdate) {
        onDreamUpdate(updatedDream);
      }

      toast({
        title: "Dream Enhanced",
        description: `Dream scored with ${scoreData.trustLevel} trust level (${scoreData.score} points)`
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update dream with scoring data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const evolveDream = async () => {
    if (!scoreData) return;

    setLoading(true);
    try {
      // Simulate dream evolution based on trust level
      const evolutionBonus = scoreData.trustLevel === 'High' ? 25 : 
                           scoreData.trustLevel === 'Medium' ? 15 : 10;
      
      const updatedDream: Dream = {
        ...dreamData,
        score: (dreamData.score || 0) + evolutionBonus,
        evolveCount: (dreamData.evolveCount || 0) + 1,
        status: dreamData.status === 'draft' ? 'active' : dreamData.status
      };

      setDreamData(updatedDream);
      
      if (onDreamUpdate) {
        onDreamUpdate(updatedDream);
      }

      toast({
        title: "Dream Evolution",
        description: `Dream evolved! +${evolutionBonus} points from ${scoreData.trustLevel} trust`
      });
    } catch (error) {
      toast({
        title: "Evolution Failed",
        description: "Failed to evolve dream",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScoreData();
  }, [activeWallet]);

  const getTrustColor = (trustLevel: string) => {
    switch (trustLevel) {
      case 'High': return 'text-green-400 border-green-500/20 bg-green-500/10';
      case 'Medium': return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10';
      case 'Low': return 'text-red-400 border-red-500/20 bg-red-500/10';
      default: return 'text-gray-400 border-gray-500/20 bg-gray-500/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'active': return 'text-blue-400';
      case 'draft': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5 text-purple-400" />
          {dreamData.name}
          {dreamData.trustLevel && (
            <Badge className={getTrustColor(dreamData.trustLevel)}>
              {dreamData.trustLevel}
            </Badge>
          )}
          <Badge variant="outline" className={getStatusColor(dreamData.status)}>
            {dreamData.status.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>{dreamData.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-2 rounded border border-purple-500/20 bg-purple-500/5">
            <div className="text-lg font-mono text-purple-400">{dreamData.score || 0}</div>
            <div className="text-xs text-muted-foreground">Dream Score</div>
          </div>
          <div className="p-2 rounded border border-blue-500/20 bg-blue-500/5">
            <div className="text-lg font-mono text-blue-400">{dreamData.evolveCount || 0}</div>
            <div className="text-xs text-muted-foreground">Evolutions</div>
          </div>
          <div className="p-2 rounded border border-green-500/20 bg-green-500/5">
            <div className="text-lg font-mono text-green-400">{dreamData.contributorCount || 1}</div>
            <div className="text-xs text-muted-foreground">Contributors</div>
          </div>
        </div>

        {scoreData && (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Wallet Trust Score</span>
                <span className="text-sm font-mono">{scoreData.score}/100</span>
              </div>
              <Progress value={scoreData.score} className="h-2" />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={updateDreamWithScore}
                disabled={loading || !!dreamData.wallet}
                className="text-xs flex-1"
              >
                <Target className="h-3 w-3 mr-1" />
                {dreamData.wallet ? 'Linked' : 'Link Wallet'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={evolveDream}
                disabled={loading || !dreamData.wallet}
                className="text-xs flex-1"
              >
                <Zap className="h-3 w-3 mr-1" />
                Evolve Dream
              </Button>
            </div>
          </div>
        )}

        {dreamData.wallet && (
          <div className="p-3 rounded border border-border bg-card/20">
            <div className="text-xs space-y-1">
              <p><strong>Linked Wallet:</strong> <code className="font-mono">{dreamData.wallet.slice(0, 8)}...{dreamData.wallet.slice(-8)}</code></p>
              <p><strong>Trust Level:</strong> <span className={dreamData.trustLevel === 'High' ? 'text-green-400' : dreamData.trustLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'}>
                {dreamData.trustLevel}
              </span></p>
              <p><strong>Tags:</strong> {dreamData.tags.join(', ')}</p>
            </div>
          </div>
        )}

        {!activeWallet && (
          <div className="text-center p-3 border border-yellow-500/20 bg-yellow-500/5 rounded">
            <p className="text-xs text-yellow-400">
              Connect a wallet to enable dream scoring and evolution features
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}