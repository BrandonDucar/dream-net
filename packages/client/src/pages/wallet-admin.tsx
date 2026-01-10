import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Wallet, Settings, Play, FileJson, ScrollText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock Solana wallet adapter for demo purposes
interface WalletAdapter {
  publicKey: string | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

// Mock wallet implementation
const createMockWallet = (): WalletAdapter => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  
  // Demo wallet addresses (some are admin)
  const demoWallets = [
    "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e", // Admin
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // Admin
    "0x1234567890abcdef1234567890abcdef12345678", // Admin
    "0x8ba1f109551bD432803012645Hac136c9.5928e", // Not admin
    "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed"  // Not admin
  ];

  const [publicKey, setPublicKey] = useState<string | null>(null);

  return {
    publicKey,
    connected,
    connecting,
    connect: async () => {
      setConnecting(true);
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Randomly select a demo wallet
      const randomWallet = demoWallets[Math.floor(Math.random() * demoWallets.length)];
      setPublicKey(randomWallet);
      setConnected(true);
      setConnecting(false);
    },
    disconnect: async () => {
      setPublicKey(null);
      setConnected(false);
    }
  };
};

export default function WalletAdmin() {
  const [wallet] = useState(() => createMockWallet());
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Admin wallet list (matches server/auth.ts)
  const adminWallets = [
    "0xAbCdEf1234567890abcdef1234567890aBcDeF01",
    "0x1234567890abcdef1234567890abcdef12345678", 
    "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  ];

  // Check if connected wallet is admin
  useEffect(() => {
    if (wallet.publicKey) {
      const isAdminWallet = adminWallets
        .map(addr => addr.toLowerCase())
        .includes(wallet.publicKey.toLowerCase());
      setIsAdmin(isAdminWallet);
    } else {
      setIsAdmin(false);
    }
  }, [wallet.publicKey, adminWallets]);

  const handleConnect = async () => {
    try {
      await wallet.connect();
      toast({
        title: "Wallet Connected",
        description: `Connected to ${wallet.publicKey?.slice(0, 6)}...${wallet.publicKey?.slice(-4)}`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await wallet.disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Wallet has been disconnected",
      });
    } catch (error) {
      toast({
        title: "Disconnect Failed", 
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test/orchestration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': wallet.publicKey!
        }
      });

      if (response.ok) {
        toast({
          title: "Simulation Started",
          description: "Dream network orchestration simulation is running",
        });
      } else {
        throw new Error('Simulation failed');
      }
    } catch (error) {
      toast({
        title: "Simulation Failed",
        description: "Failed to start simulation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const viewJsonFeed = async () => {
    try {
      const response = await fetch('/api/garden/feed', {
        headers: {
          'x-wallet-address': wallet.publicKey!
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Open JSON in new window for viewing
        const jsonWindow = window.open('', '_blank');
        if (jsonWindow) {
          jsonWindow.document.write(`
            <html>
              <head><title>Garden Feed JSON</title></head>
              <body style="font-family: monospace; padding: 20px;">
                <h2>Garden Feed JSON</h2>
                <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow: auto;">
${JSON.stringify(data, null, 2)}
                </pre>
              </body>
            </html>
          `);
        }
        
        toast({
          title: "JSON Feed Retrieved",
          description: "Garden feed data opened in new window",
        });
      } else {
        throw new Error('Failed to fetch JSON feed');
      }
    } catch (error) {
      toast({
        title: "Fetch Failed",
        description: "Failed to retrieve JSON feed",
        variant: "destructive",
      });
    }
  };

  const viewCocoonLogs = () => {
    // Open console logs in new window
    const logsWindow = window.open('', '_blank');
    if (logsWindow) {
      logsWindow.document.write(`
        <html>
          <head><title>Cocoon Activity Logs</title></head>
          <body style="font-family: monospace; padding: 20px;">
            <h2>Cocoon Activity Logs</h2>
            <p>Check the browser console for real-time cocoon activity logs.</p>
            <p>Or view server logs in the terminal for detailed cocoon operations.</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <strong>Available Log Types:</strong><br/>
              • Stage transitions<br/>
              • NFT minting events<br/>
              • Contributor additions<br/>
              • Score updates<br/>
              • Notification deliveries
            </div>
          </body>
        </html>
      `);
    }

    toast({
      title: "Logs Window Opened",
      description: "Cocoon logs information displayed",
    });
  };

  if (!wallet.connected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Wallet className="h-6 w-6" />
                Dream Network Admin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <p>Connect your Solana wallet to begin</p>
              </div>
              
              <Button 
                onClick={handleConnect} 
                disabled={wallet.connecting}
                className="w-full"
              >
                {wallet.connecting ? "Connecting..." : "Connect Wallet"}
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                Demo Mode: Will randomly assign a test wallet address
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Wallet Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Connected
              </span>
              <Button variant="outline" size="sm" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Address:</label>
              <div className="font-mono text-sm bg-muted p-2 rounded mt-1">
                {wallet.publicKey}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Status:</label>
              <Badge variant={isAdmin ? "default" : "secondary"}>
                {isAdmin ? "Admin Access" : "Standard User"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Admin Controls */}
        {isAdmin ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Admin Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={runSimulation}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {loading ? "Running..." : "Run Simulation"}
                </Button>

                <Button 
                  onClick={viewJsonFeed}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FileJson className="h-4 w-4" />
                  View JSON Feed
                </Button>

                <Button 
                  onClick={viewCocoonLogs}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ScrollText className="h-4 w-4" />
                  View Cocoon Logs
                </Button>
              </div>

              <Separator />

              <div className="text-sm text-muted-foreground">
                <strong>Admin Functions:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Run Simulation: Executes full dream network orchestration</li>
                  <li>View JSON Feed: Display garden feed data for frontend integration</li>
                  <li>View Cocoon Logs: Access activity logs and system events</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <p className="text-lg font-medium mb-2">Access Restricted</p>
                <p>This wallet is not authorized for admin functions.</p>
                <p className="text-sm mt-4">
                  Contact the system administrator to request admin access.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}