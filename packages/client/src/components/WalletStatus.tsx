import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.js';
import { Badge } from './ui/badge.js';
import { Button } from './ui/button.js';
import { Wallet, CheckCircle, AlertCircle } from 'lucide-react';

export function WalletStatus() {
  const { walletAddress, isLoading } = useAuth();
  
  // Custom wallet hook pattern matching your requirement
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

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-electric-cyan border-t-transparent"></div>
            <span className="text-sm text-muted-foreground">Checking wallet...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (connected && wallet) {
    return (
      <Card className="w-full max-w-md border-green-500/20 bg-green-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-400">
            <CheckCircle className="h-5 w-5" />
            Wallet Connected
          </CardTitle>
          <CardDescription>
            Connected to Dream Network with access to all features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Address:</span>
            <Badge variant="secondary" className="bg-electric-cyan/20 text-electric-cyan">
              {truncateAddress(wallet.address)}
            </Badge>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-yellow-500/20 bg-yellow-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-400">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
        <CardDescription>
          Connect your wallet to access Dream Network features and AI agents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        <Button 
          onClick={() => window.location.href = '/wallet'} 
          className="w-full bg-electric-cyan hover:bg-electric-cyan/80 text-black"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect MetaMask
        </Button>
      </CardContent>
    </Card>
  );
}