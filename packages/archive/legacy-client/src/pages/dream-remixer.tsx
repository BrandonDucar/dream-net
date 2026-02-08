import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import DreamRemixer from '@/components/DreamRemixer';
import Head from '@/components/Head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Shuffle, History, Bot } from 'lucide-react';

export default function DreamRemixerPage() {
  const { walletAddress } = useAuth();
  const [remixHistory, setRemixHistory] = useState<string[]>([]);

  const handleRemixSuccess = (newDreamId: string) => {
    setRemixHistory(prev => [newDreamId, ...prev.slice(0, 4)]);
  };

  return (
    <>
      <Head>
        <title>Dream Remixer | Dream Network</title>
        <meta name="description" content="Remix existing dreams with AI-powered title generation and LUCID agent processing" />
      </Head>
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shuffle className="h-8 w-8 text-purple-400" />
              <h1 className="text-3xl font-bold">Dream Remixer</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Transform existing dreams with AI-powered creativity and LUCID agent processing
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            <div className="space-y-4">
              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Wallet Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !text-sm !w-full" />
                  
                  {walletAddress && (
                    <div className="mt-3 p-2 rounded border border-purple-500/20 bg-purple-500/5 text-sm">
                      <div className="font-medium text-purple-400">Ethereum Connected</div>
                      <div className="font-mono text-xs">
                        {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Remix Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-cyan-400" />
                    <span>LUCID Agent Processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shuffle className="h-4 w-4 text-purple-400" />
                    <span>Lineage Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shuffle className="h-4 w-4 text-green-400" />
                    <span>AI Title Generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-blue-400" />
                    <span>Remix History</span>
                  </div>
                </CardContent>
              </Card>

              {remixHistory.length > 0 && (
                <Card className="border-border bg-card/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Recent Remixes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {remixHistory.map((dreamId, index) => (
                        <div key={dreamId} className="p-2 rounded border border-border bg-card/20 text-xs">
                          <div className="font-mono">{dreamId}</div>
                          <div className="text-muted-foreground">
                            {index === 0 ? 'Just created' : `${index + 1} remix${index > 0 ? 'es' : ''} ago`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-3">
              <DreamRemixer onRemixSuccess={handleRemixSuccess} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}