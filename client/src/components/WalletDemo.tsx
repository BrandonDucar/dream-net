import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wallet, Check, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletInfo {
  type: 'ethereum' | 'solana';
  address: string;
  connected: boolean;
  network?: string;
}

export default function WalletDemo() {
  const { walletAddress: ethAddress } = useAuth();
  const { publicKey: solanaPublicKey, connected: solanaConnected, wallet } = useWallet();
  const { toast } = useToast();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const wallets: WalletInfo[] = [
    {
      type: 'ethereum',
      address: ethAddress || 'user-wallet-address',
      connected: !!ethAddress,
      network: 'Ethereum Mainnet'
    },
    {
      type: 'solana',
      address: solanaPublicKey?.toBase58() || 'Not connected',
      connected: solanaConnected,
      network: 'Solana Mainnet-Beta'
    }
  ];

  const copyToClipboard = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard"
      });
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Cross-Chain Wallet Integration</h2>
        <p className="text-muted-foreground">
          Your connected wallets for Dream Network operations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {wallets.map((walletInfo) => (
          <Card key={walletInfo.type} className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className={`h-5 w-5 ${
                  walletInfo.type === 'ethereum' ? 'text-blue-400' : 'text-purple-400'
                }`} />
                {walletInfo.type === 'ethereum' ? 'Ethereum Wallet' : 'Solana Wallet'}
                <Badge 
                  variant={walletInfo.connected ? "default" : "secondary"}
                  className={walletInfo.connected ? 
                    "bg-green-500/20 text-green-400 border-green-500/20" : 
                    "bg-gray-500/20 text-gray-400 border-gray-500/20"
                  }
                >
                  {walletInfo.connected ? 'Connected' : 'Disconnected'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Network</label>
                <p className="text-sm">{walletInfo.network}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 text-xs font-mono bg-muted/50 px-2 py-1 rounded border">
                    {walletInfo.connected && walletInfo.address !== 'user-wallet-address' ? 
                      `${walletInfo.address.slice(0, 8)}...${walletInfo.address.slice(-8)}` :
                      walletInfo.address
                    }
                  </code>
                  {walletInfo.connected && walletInfo.address !== 'user-wallet-address' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => copyToClipboard(walletInfo.address)}
                    >
                      {copiedAddress === walletInfo.address ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {walletInfo.type === 'solana' && wallet && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Wallet Type</label>
                  <p className="text-sm">{wallet.adapter.name}</p>
                </div>
              )}

              <div className="pt-2">
                <div className="text-xs text-muted-foreground">
                  {walletInfo.type === 'ethereum' ? (
                    <div>
                      <p>• SIWE authentication</p>
                      <p>• Admin access control</p>
                      <p>• ETH-based transactions</p>
                    </div>
                  ) : (
                    <div>
                      <p>• SOL-based claiming</p>
                      <p>• SPL token rewards</p>
                      <p>• Solana NFT minting</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Dream Network Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-400">Ethereum Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Admin dashboard access</li>
                <li>• Dream submission approval</li>
                <li>• Contributor management</li>
                <li>• ETH-based dream claiming</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-400">Solana Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Fast SOL transactions</li>
                <li>• Low-cost dream operations</li>
                <li>• SPL token rewards</li>
                <li>• Solana NFT collections</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}