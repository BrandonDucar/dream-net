import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { WalletStatus } from '@/components/WalletStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { useState } from 'react';
import { Loader2, Zap, Shield, Coins } from 'lucide-react';

export default function WalletDemo() {
  const { walletAddress } = useAuth();
  const [walletAnalysis, setWalletAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Custom wallet hook pattern
  const wallet = walletAddress ? {
    publicKey: {
      toString: () => walletAddress
    },
    address: walletAddress
  } : null;
  
  const connected = !!walletAddress;

  useEffect(() => {
    if (!connected) return;
    console.log("🪪 Wallet connected:", wallet?.publicKey.toString());
  }, [connected, wallet]);

  const analyzeWallet = async () => {
    if (!walletAddress) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/echo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ walletAddress })
      });
      const data = await response.json();
      setWalletAnalysis(data.result);
    } catch (error) {
      console.error('Failed to analyze wallet:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-electric-cyan">
          Wallet Connection Demo
        </h1>
        <p className="text-muted-foreground">
          Test wallet connection and ECHO agent analysis
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <WalletStatus />
        </div>

        {connected && wallet && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Wallet Analysis</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-electric-cyan" />
                  ECHO Agent Analysis
                </CardTitle>
                <CardDescription>
                  Get trust score and access level determination
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={analyzeWallet}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Wallet with ECHO'
                  )}
                </Button>

                {walletAnalysis && (
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Trust Score:</span>
                      <Badge 
                        variant={walletAnalysis.trust_score >= 75 ? "default" : "secondary"}
                        className={walletAnalysis.trust_score >= 75 ? "bg-green-500" : ""}
                      >
                        {walletAnalysis.trust_score}%
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Access Level:</span>
                      <Badge variant="outline" className="text-electric-cyan">
                        {walletAnalysis.trust_score >= 75 ? 'CRADLE' : 'SEED'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Balance:</span>
                      <span className="text-sm font-medium">{walletAnalysis.balance_estimate}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Risk Assessment:</span>
                      <Badge 
                        variant={walletAnalysis.risk_assessment === 'low' ? "default" : "destructive"}
                        className={walletAnalysis.risk_assessment === 'low' ? "bg-green-500" : ""}
                      >
                        <Shield className="mr-1 h-3 w-3" />
                        {walletAnalysis.risk_assessment}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Categories:</span>
                      <div className="flex flex-wrap gap-1">
                        {walletAnalysis.wallet_categories?.map((category: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {category.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {connected && wallet && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify({
                connected,
                walletAddress: wallet.publicKey.toString(),
                walletAnalysis
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}