import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, Bot, Zap, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CradleAgentView from './CradleAgentView';
import AgentStatus from './AgentStatus';
import DreamTokenMinter from './DreamTokenMinter';

interface WalletScore {
  wallet: string;
  score: number;
  trustLevel: 'Low' | 'Medium' | 'High';
  unlockedAgents: string[];
  status: string;
}

const agentDescriptions = {
  LUCID: 'Logic Unification & Command Interface Daemon',
  CANVAS: 'Visual Layer Weaver',
  ROOT: 'Subconscious Architect',
  ECHO: 'Wallet Mirror',
  CRADLE: 'Evolution Engine',
  WING: 'Messenger & Mint Agent'
};

export default function WalletScoring() {
  const { walletAddress: ethAddress } = useAuth();
  const { publicKey: solanaPublicKey, connected: solanaConnected } = useWallet();
  const { toast } = useToast();
  const [ethScore, setEthScore] = useState<WalletScore | null>(null);
  const [solanaScore, setSolanaScore] = useState<WalletScore | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWalletScore = async (wallet: string, type: 'ethereum' | 'solana') => {
    try {
      const response = await fetch(`/api/wallet-scoring/${wallet}`);
      const data = await response.json();
      
      if (type === 'ethereum') {
        setEthScore(data);
      } else {
        setSolanaScore(data);
      }
    } catch (error) {
      console.error(`Failed to fetch ${type} wallet score:`, error);
    }
  };

  const updateScore = async (wallet: string, action: string, type: 'ethereum' | 'solana') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/wallet-scoring/${wallet}/score`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      const data = await response.json();
      
      if (type === 'ethereum') {
        setEthScore(prev => prev ? { ...prev, score: data.newScore, trustLevel: data.trustLevel, unlockedAgents: data.unlockedAgents } : null);
      } else {
        setSolanaScore(prev => prev ? { ...prev, score: data.newScore, trustLevel: data.trustLevel, unlockedAgents: data.unlockedAgents } : null);
      }

      toast({
        title: "Score Updated",
        description: `${action} completed. Score: ${data.previousScore} → ${data.newScore}`
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update wallet score",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ethAddress) {
      fetchWalletScore(ethAddress, 'ethereum');
    }
    if (solanaConnected && solanaPublicKey) {
      fetchWalletScore(solanaPublicKey.toBase58(), 'solana');
    }
  }, [ethAddress, solanaConnected, solanaPublicKey]);

  const getTrustColor = (trustLevel: string) => {
    switch (trustLevel) {
      case 'High': return 'text-green-400 border-green-500/20 bg-green-500/10';
      case 'Medium': return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10';
      case 'Low': return 'text-red-400 border-red-500/20 bg-red-500/10';
      default: return 'text-gray-400 border-gray-500/20 bg-gray-500/10';
    }
  };

  const renderWalletCard = (scoreData: WalletScore | null, type: 'ethereum' | 'solana', address: string | null) => (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className={`h-5 w-5 ${type === 'ethereum' ? 'text-blue-400' : 'text-purple-400'}`} />
          {type === 'ethereum' ? 'Ethereum' : 'Solana'} Trust Score
          {scoreData && (
            <Badge className={getTrustColor(scoreData.trustLevel)}>
              {scoreData.trustLevel}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scoreData && address ? (
          <>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Trust Score</span>
                <span className="text-sm font-mono">{scoreData.score}/100</span>
              </div>
              <Progress value={scoreData.score} className="h-2" />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Unlocked Agents ({scoreData.unlockedAgents.length}/6)
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(agentDescriptions).map(([agent, description]) => {
                  const isUnlocked = scoreData.unlockedAgents.includes(agent);
                  return (
                    <div 
                      key={agent}
                      className={`p-2 rounded text-xs border ${
                        isUnlocked 
                          ? 'border-green-500/20 bg-green-500/10 text-green-400' 
                          : 'border-gray-500/20 bg-gray-500/10 text-gray-500'
                      }`}
                    >
                      <div className="font-mono font-medium">{agent}</div>
                      <div className="text-xs opacity-80">{description}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateScore(address, 'dream_submission', type)}
                disabled={loading}
                className="text-xs"
              >
                <Zap className="h-3 w-3 mr-1" />
                Submit Dream (+10)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateScore(address, 'fusion_claim', type)}
                disabled={loading}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Claim Fusion (+15)
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            {address ? 'Loading trust score...' : `Connect ${type} wallet to view trust score`}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const hasCradleAccess = ethScore?.unlockedAgents.includes('CRADLE') || solanaScore?.unlockedAgents.includes('CRADLE');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Wallet Trust & Agent Access</h2>
        <p className="text-muted-foreground">
          Your trust score determines which Dream Network agents you can access
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {renderWalletCard(ethScore, 'ethereum', ethAddress)}
        {renderWalletCard(solanaScore, 'solana', solanaConnected && solanaPublicKey ? solanaPublicKey.toBase58() : null)}
      </div>

      {hasCradleAccess && (
        <CradleAgentView />
      )}

      {(ethScore || solanaScore) && (
        <Card className="border-border bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Agent Access Status</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-bold mb-2">🧠 Wallet Trust Score: {ethScore?.score || solanaScore?.score}</h2>
            <h3 className="text-md font-semibold mb-4">🎖 Trust Level: {ethScore?.trustLevel || solanaScore?.trustLevel}</h3>
            <AgentStatus agents={ethScore?.unlockedAgents || solanaScore?.unlockedAgents || []} />
          </CardContent>
        </Card>
      )}

      {(ethScore || solanaScore) && (
        <DreamTokenMinter 
          scoreData={ethScore || solanaScore || undefined}
          dreamId="current-session"
          dreamName="Live Wallet Session"
        />
      )}

      <Card className="border-border bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Trust Level Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Badge className="text-red-400 border-red-500/20 bg-red-500/10">Low Trust (0-49)</Badge>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• LUCID (Command Interface)</li>
                <li>• CANVAS (Visual Creation)</li>
                <li>• Basic dream operations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Badge className="text-yellow-400 border-yellow-500/20 bg-yellow-500/10">Medium Trust (50-79)</Badge>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• ROOT (Subconscious Access)</li>
                <li>• ECHO (Wallet Mirror)</li>
                <li>• Advanced dream features</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Badge className="text-green-400 border-green-500/20 bg-green-500/10">High Trust (80-100)</Badge>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• CRADLE (Evolution Engine)</li>
                <li>• WING (Mint & Messenger)</li>
                <li>• Full platform access</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}