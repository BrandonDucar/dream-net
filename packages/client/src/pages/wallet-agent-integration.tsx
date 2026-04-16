import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/contexts/auth-context';
import AgentStatus from '@/components/AgentStatus';
import Head from '@/components/Head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Brain, Zap, RefreshCw } from 'lucide-react';

interface ScoreData {
  score: number;
  trustLevel: 'Low' | 'Medium' | 'High';
  unlockedAgents: string[];
}

export default function WalletAgentIntegration() {
  const { walletAddress: ethAddress } = useAuth();
  const { publicKey: solanaPublicKey, connected: solanaConnected } = useWallet();
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(false);

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

  const performAgentAction = async (action: string) => {
    if (!activeWallet) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/wallet-scoring/${activeWallet}/score`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      const data = await response.json();
      
      // Update scoreData with new values
      setScoreData(prev => prev ? {
        ...prev,
        score: data.newScore,
        trustLevel: data.trustLevel,
        unlockedAgents: data.unlockedAgents
      } : null);
      
    } catch (error) {
      console.error('Failed to perform agent action:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeWallet) {
      fetchScoreData();
    } else {
      setScoreData(null);
    }
  }, [activeWallet]);

  return (
    <>
      <Head>
        <title>Wallet Agent Integration | Dream Network</title>
        <meta name="description" content="Complete wallet integration with agent status visualization" />
      </Head>
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="h-8 w-8 text-purple-400" />
              <h1 className="text-3xl font-bold">Wallet Agent Integration</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Connect your wallet to see available Dream Network agents
            </p>
          </div>

          <Card className="border-border bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Wallet Connection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-400">Ethereum (SIWE)</h4>
                  {ethAddress ? (
                    <div className="p-3 rounded border border-blue-500/20 bg-blue-500/5">
                      <p className="text-sm font-mono">{ethAddress.slice(0, 8)}...{ethAddress.slice(-8)}</p>
                      <p className="text-xs text-green-400">Connected</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-400">Solana</h4>
                  <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
                </div>
              </div>
              
              {activeWallet && (
                <div className="pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    Active Wallet: <code className="font-mono">{activeWallet.slice(0, 8)}...{activeWallet.slice(-8)}</code>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchScoreData}
                    disabled={loading}
                    className="mr-2"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Score
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => performAgentAction('dream_submission')}
                    disabled={loading}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Perform Action (+10)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Implementation of your exact pattern */}
          {scoreData && (
            <Card className="border-border bg-card/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-2">🧠 Wallet Trust Score: {scoreData.score}</h2>
                <h3 className="text-xl font-semibold mb-4">🎖 Trust Level: {scoreData.trustLevel}</h3>
                <AgentStatus agents={scoreData.unlockedAgents} />
              </CardContent>
            </Card>
          )}

          {!activeWallet && (
            <Card className="border-border bg-card/30 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Please connect your wallet to view agent status and trust scoring.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="border-border bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Implementation Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded border border-border bg-card/20 font-mono text-sm space-y-1">
                <div className="text-green-400">import AgentStatus from '../components/AgentStatus';</div>
                <div className="mt-3"></div>
                <div>{`{scoreData && (`}</div>
                <div className="ml-4">{`<>`}</div>
                <div className="ml-8">{`<h2>🧠 Wallet Trust Score: {scoreData.score}</h2>`}</div>
                <div className="ml-8">{`<h3>🎖 Trust Level: {scoreData.trustLevel}</h3>`}</div>
                <div className="ml-8">{`<AgentStatus agents={scoreData.unlockedAgents} />`}</div>
                <div className="ml-4">{`</>`}</div>
                <div>{`)}`}</div>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p><strong>Agent Requirements:</strong></p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>LUCID, CANVAS: Available immediately (0 points)</li>
                  <li>ROOT, ECHO: Medium trust required (50+ points)</li>
                  <li>CRADLE, WING: High trust required (80+ points)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}