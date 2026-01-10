import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/contexts/auth-context';
import AgentStatus from '@/components/AgentStatus';
import Head from '@/components/Head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Settings, RefreshCw, Shield } from 'lucide-react';

interface ScoreData {
  score: number;
  trustLevel: 'Low' | 'Medium' | 'High';
  unlockedAgents: string[];
}

export default function AgentStatusDemo() {
  const { walletAddress: ethAddress } = useAuth();
  const { publicKey: solanaPublicKey, connected: solanaConnected } = useWallet();
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mockScore, setMockScore] = useState(35);

  // Determine active wallet
  const activeWallet = solanaConnected && solanaPublicKey 
    ? solanaPublicKey.toBase58() 
    : ethAddress;

  const fetchScoreData = async () => {
    if (!activeWallet) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/wallet-scoring/${activeWallet}`);
      const data = await response.json();
      setScoreData(data);
    } catch (error) {
      console.error('Failed to fetch score data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (score: number): ScoreData => {
    let trustLevel: 'Low' | 'Medium' | 'High';
    let unlockedAgents: string[];

    if (score >= 80) {
      trustLevel = 'High';
      unlockedAgents = ['LUCID', 'CANVAS', 'ROOT', 'ECHO', 'CRADLE', 'WING'];
    } else if (score >= 50) {
      trustLevel = 'Medium';
      unlockedAgents = ['LUCID', 'CANVAS', 'ROOT', 'ECHO'];
    } else {
      trustLevel = 'Low';
      unlockedAgents = ['LUCID', 'CANVAS'];
    }

    return { score, trustLevel, unlockedAgents };
  };

  useEffect(() => {
    if (activeWallet) {
      fetchScoreData();
    }
  }, [activeWallet]);

  // Use real data if available, otherwise use mock data
  const displayData = scoreData || generateMockData(mockScore);

  return (
    <>
      <Head>
        <title>Agent Status Demo | Dream Network</title>
        <meta name="description" content="Demonstration of agent status based on wallet trust scores" />
      </Head>
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Settings className="h-8 w-8 text-cyan-400" />
              <h1 className="text-3xl font-bold">Agent Status Demo</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              View agent access based on wallet trust scores
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border bg-card/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  Current Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Trust Score</span>
                    <span className="text-sm font-mono">{displayData.score}/100</span>
                  </div>
                  <Progress value={displayData.score} className="h-3" />
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 rounded border border-border bg-card/20">
                    <div className="text-lg font-mono text-cyan-400">{displayData.score}</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                  <div className="p-2 rounded border border-border bg-card/20">
                    <div className="text-lg font-mono text-purple-400">{displayData.trustLevel}</div>
                    <div className="text-xs text-muted-foreground">Trust</div>
                  </div>
                  <div className="p-2 rounded border border-border bg-card/20">
                    <div className="text-lg font-mono text-green-400">{displayData.unlockedAgents.length}/6</div>
                    <div className="text-xs text-muted-foreground">Agents</div>
                  </div>
                </div>

                {activeWallet ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>Wallet:</strong> {activeWallet.slice(0, 8)}...{activeWallet.slice(-8)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchScoreData}
                      disabled={loading}
                      className="w-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Score
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    Connect wallet for live scoring
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border bg-card/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Mock Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Test different trust levels to see agent access changes
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Mock Score: {mockScore}</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={mockScore}
                      onChange={(e) => setMockScore(parseInt(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setMockScore(25)} variant="outline">
                      Low (25)
                    </Button>
                    <Button size="sm" onClick={() => setMockScore(65)} variant="outline">
                      Medium (65)
                    </Button>
                    <Button size="sm" onClick={() => setMockScore(90)} variant="outline">
                      High (90)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Agent Access Status</CardTitle>
            </CardHeader>
            <CardContent>
              <AgentStatus agents={displayData.unlockedAgents} />
            </CardContent>
          </Card>

          <Card className="border-border bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Agent Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="font-medium text-green-400 mb-2">Basic Agents (0 points)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• LUCID - Logic Unification & Command Interface</li>
                    <li>• CANVAS - Visual Layer Weaver</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-yellow-400 mb-2">Medium Trust (50+ points)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• ROOT - Subconscious Architect</li>
                    <li>• ECHO - Wallet Mirror</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-400 mb-2">High Trust (80+ points)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• CRADLE - Evolution Engine</li>
                    <li>• WING - Messenger & Mint Agent</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}