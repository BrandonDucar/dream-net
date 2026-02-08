import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/contexts/auth-context';
import DreamTokenMinter from '@/components/DreamTokenMinter';
import Head from '@/components/Head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Coins, Zap, RotateCcw, TrendingUp } from 'lucide-react';

interface ScoreData {
  score: number;
  trustLevel: 'Low' | 'Medium' | 'High';
  unlockedAgents: string[];
}

const sampleDreams = [
  { id: 'dream-1', name: 'Quantum Consciousness Bridge' },
  { id: 'dream-2', name: 'Digital Empathy Network' },
  { id: 'dream-3', name: 'Collective Memory Archive' },
  { id: 'dream-4', name: 'Synaptic Reality Engine' },
  { id: 'dream-5', name: 'Holographic Storytelling Matrix' }
];

export default function TokenMintingDemo() {
  const { walletAddress: ethAddress } = useAuth();
  const { publicKey: solanaPublicKey, connected: solanaConnected } = useWallet();
  const [mockScore, setMockScore] = useState([65]);
  const [selectedDream, setSelectedDream] = useState(sampleDreams[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const activeWallet = solanaConnected && solanaPublicKey 
    ? solanaPublicKey.toBase58() 
    : ethAddress;

  const generateScoreData = (score: number): ScoreData => {
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

  const scoreData = generateScoreData(mockScore[0]);

  const animateToMintingLevel = () => {
    setIsAnimating(true);
    let currentScore = mockScore[0];
    const targetScore = 85;
    
    const interval = setInterval(() => {
      currentScore += 2;
      setMockScore([currentScore]);
      
      if (currentScore >= targetScore) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 100);
  };

  const resetDemo = () => {
    setMockScore([25]);
    setIsAnimating(false);
  };

  return (
    <>
      <Head>
        <title>Dream Token Minting Demo | Dream Network</title>
        <meta name="description" content="Interactive demonstration of dream token minting with CRADLE agent access control" />
      </Head>
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Coins className="h-8 w-8 text-yellow-400" />
              <h1 className="text-3xl font-bold">Dream Token Minting Demo</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Mint dream tokens with CRADLE agent access (80+ trust score required)
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Wallet Connection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div>
                      <h4 className="font-medium text-blue-400 mb-2">Ethereum (SIWE)</h4>
                      {ethAddress ? (
                        <div className="p-2 rounded border border-blue-500/20 bg-blue-500/5 text-sm">
                          {ethAddress.slice(0, 8)}...{ethAddress.slice(-8)}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-purple-400 mb-2">Solana</h4>
                      <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !text-sm" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Trust Score Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium">Mock Trust Score</span>
                      <span className="text-lg font-mono text-cyan-400">{mockScore[0]}/100</span>
                    </div>
                    <Slider
                      value={mockScore}
                      onValueChange={setMockScore}
                      max={100}
                      step={1}
                      className="w-full"
                      disabled={isAnimating}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Button
                      onClick={animateToMintingLevel}
                      disabled={isAnimating}
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      {isAnimating ? 'Boosting Score...' : 'Boost to Minting Level (85)'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={resetDemo}
                      disabled={isAnimating}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset to Low Score
                    </Button>
                  </div>

                  <div className="p-3 rounded border border-border bg-card/20">
                    <h4 className="font-medium mb-2">Current Status:</h4>
                    <div className="text-sm space-y-1">
                      <div className={scoreData.trustLevel === 'High' ? 'text-green-400' : 'text-muted-foreground'}>
                        Trust Level: <strong>{scoreData.trustLevel}</strong>
                      </div>
                      <div className={scoreData.unlockedAgents.includes('CRADLE') ? 'text-green-400' : 'text-red-400'}>
                        CRADLE Access: {scoreData.unlockedAgents.includes('CRADLE') ? '✓ Unlocked' : '✗ Locked'}
                      </div>
                      <div>
                        Active Agents: {scoreData.unlockedAgents.length}/6
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Dream Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {sampleDreams.map((dream) => (
                      <button
                        key={dream.id}
                        onClick={() => setSelectedDream(dream)}
                        className={`p-3 text-left rounded border transition-colors ${
                          selectedDream.id === dream.id
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-border bg-card/20 hover:border-cyan-500/50'
                        }`}
                      >
                        <div className="font-medium">{dream.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {dream.id}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <DreamTokenMinter 
                scoreData={scoreData}
                dreamId={selectedDream.id}
                dreamName={selectedDream.name}
              />

              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Implementation Pattern</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded border border-border bg-card/20 font-mono text-sm space-y-1">
                    <div className="text-cyan-400">{`{scoreData?.unlockedAgents.includes('CRADLE') ? (`}</div>
                    <div className="ml-2">{`<button`}</div>
                    <div className="ml-4">{`onClick={handleMint}`}</div>
                    <div className="ml-4">{`style={{`}</div>
                    <div className="ml-6">{`marginTop: 30,`}</div>
                    <div className="ml-6">{`padding: '10px 20px',`}</div>
                    <div className="ml-6">{`background: '#0ff',`}</div>
                    <div className="ml-6">{`color: '#000',`}</div>
                    <div className="ml-6">{`fontWeight: 'bold',`}</div>
                    <div className="ml-6">{`border: 'none',`}</div>
                    <div className="ml-6">{`borderRadius: 8,`}</div>
                    <div className="ml-6">{`boxShadow: '0 0 15px #0ff',`}</div>
                    <div className="ml-6">{`cursor: 'pointer'`}</div>
                    <div className="ml-4">{`}}`}</div>
                    <div className="ml-2">{`>`}</div>
                    <div className="ml-4">{`🪙 Mint Dream Token`}</div>
                    <div className="ml-2">{`</button>`}</div>
                    <div className="text-cyan-400">{`) : (`}</div>
                    <div className="ml-2">{`<p style={{ color: '#888', marginTop: 30 }}>`}</div>
                    <div className="ml-4">{`🔒 Minting locked — CRADLE agent required (score 80+)`}</div>
                    <div className="ml-2">{`</p>`}</div>
                    <div className="text-cyan-400">{`)}`}</div>
                  </div>
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p><strong>Features:</strong></p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>Conditional rendering based on CRADLE agent access</li>
                      <li>Cyan glow button styling for unlocked state</li>
                      <li>Clear locked state messaging</li>
                      <li>Wallet integration with minting API</li>
                      <li>Real-time trust score validation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}