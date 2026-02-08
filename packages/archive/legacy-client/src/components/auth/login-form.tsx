import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CloudMoon, Wallet, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { useEffect } from 'react';

export default function LoginForm() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [walletAddress, setWalletAddress] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const { login, signInWithEthereum } = useAuth();
  const { toast } = useToast();

  // Automatically attempt login when wallet is connected via Wagmi/OnchainKit
  useEffect(() => {
    if (isConnected && address) {
      handleOnchainLogin(address);
    }
  }, [isConnected, address]);

  const handleOnchainLogin = async (connectedAddress: string) => {
    setIsLogging(true);
    try {
      const success = await login(connectedAddress);
      if (success) {
        toast({
          title: "Sovereign Access Granted",
          description: `Logged in with address: ${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}`,
        });
      }
    } catch (error) {
      console.error('Onchain login failed:', error);
    } finally {
      setIsLogging(false);
    }
  };

  const handleSocialLogin = (provider: 'x' | 'farcaster' | 'base') => {
    setIsLogging(true);
    try {
      connect({ connector: coinbaseWallet() });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Unable to connect social account",
        variant: "destructive",
      });
      setIsLogging(false);
    }
  };

  // Development mode check
  const DEV_MODE = import.meta.env.DEV && import.meta.env.VITE_DEV_AUTH === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsLogging(true);
    try {
      const success = await login(walletAddress.trim());
      if (!success) {
        toast({
          title: "Access Denied",
          description: "This wallet address is not authorized for admin access",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Unable to validate wallet address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLogging(false);
    }
  };

  const handleSiweLogin = async () => {
    setIsLogging(true);
    try {
      const success = await signInWithEthereum();
      if (!success) {
        toast({
          title: "Sign-In Failed",
          description: "Unable to authenticate with wallet",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign-In Successful",
          description: "Authenticated with Ethereum wallet",
          variant: "default",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign-In Failed",
        description: error.message || "Wallet authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLogging(false);
    }
  };

  const handleDemoLogin = async () => {
    // For demo purposes, use a configured admin wallet
    const demoWallet = '0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e';
    setWalletAddress(demoWallet);
    setIsLogging(true);
    try {
      const success = await login(demoWallet);
      if (!success) {
        toast({
          title: "Demo Login Failed",
          description: "Demo wallet not configured as admin",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Demo Login Successful",
          description: "Logged in as demo admin",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Demo Login Failed",
        description: "Unable to connect with demo wallet",
        variant: "destructive",
      });
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-electric-cyan to-soft-gold rounded-lg flex items-center justify-center">
            <CloudMoon className="w-8 h-8 text-black" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold">Dream Network Admin</CardTitle>
            <p className="text-muted-foreground">Connect your admin wallet to access the dashboard</p>
            <p className="text-xs text-muted-foreground mt-2">
              Coming soon: DreamSnail NFT-based authentication
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Address</Label>
              <Input
                id="wallet"
                type="text"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="font-mono"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-electric-cyan text-black hover:bg-electric-cyan/90 font-medium"
              disabled={isLogging}
            >
              {isLogging ? "Connecting..." : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Web3 Authentication</span>
            </div>
          </div>

          <Button
            onClick={handleSiweLogin}
            className="w-full bg-gradient-to-r from-electric-cyan to-soft-gold text-black hover:opacity-90 font-medium"
            disabled={isLogging}
          >
            {isLogging ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                {DEV_MODE ? "Dev: Auto Sign-In" : "Sign-In with Ethereum"}
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Social Sovereignty</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('x')}
              className="border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/10"
              disabled={isLogging}
            >
              Login with X
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('farcaster')}
              className="border-[#855DCD]/30 hover:bg-[#855DCD]/10"
              disabled={isLogging}
            >
              Farcaster
            </Button>
          </div>

          <Button
            onClick={() => handleSocialLogin('base')}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 font-medium"
            disabled={isLogging}
          >
            {isLogging ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Initializing Smart Wallet...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Login with Base (Smart Wallet)
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Demo Access</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleDemoLogin}
            className="w-full border-electric-cyan/50 hover:bg-electric-cyan/10"
            disabled={isLogging}
          >
            {isLogging ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting Demo...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Demo Admin Login
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Only authorized admin wallets can access this dashboard.</p>
            <p className="text-xs text-electric-cyan">
              Demo wallet: 0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}