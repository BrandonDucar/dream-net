import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.js';
import { Button } from './ui/button.js';
import { Badge } from './ui/badge.js';
import { PlayCircle, StopCircle, RefreshCw } from 'lucide-react';

export function LifecycleDemo() {
  const { walletAddress } = useAuth();
  const [componentKey, setComponentKey] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  // Custom wallet hook pattern
  const wallet = walletAddress ? {
    publicKey: {
      toString: () => walletAddress
    },
    address: walletAddress
  } : null;
  
  const connected = !!walletAddress;

  useEffect(() => {
    console.log("💥 Component Mounted");
    return () => {
      console.log("💀 Component Unmounted");
    };
  }, []);

  useEffect(() => {
    if (!connected) return;
    console.log("🪪 Wallet connected:", wallet?.publicKey.toString());
  }, [connected, wallet]);

  const remountComponent = () => {
    setComponentKey(prev => prev + 1);
  };

  const toggleRunning = () => {
    setIsRunning(prev => !prev);
    console.log(isRunning ? "⏹️ Stopping demo" : "▶️ Starting demo");
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-electric-cyan" />
          Component Lifecycle Demo
        </CardTitle>
        <CardDescription>
          Demonstrates useEffect patterns with mount/unmount logging and wallet connection tracking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={toggleRunning}
            variant={isRunning ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <StopCircle className="h-4 w-4" />
                Stop Demo
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" />
                Start Demo
              </>
            )}
          </Button>
          
          <Button
            onClick={remountComponent}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Remount Component
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Component State</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                Key: {componentKey}
              </Badge>
              <Badge variant={isRunning ? "default" : "outline"}>
                {isRunning ? "Running" : "Stopped"}
              </Badge>
              <Badge variant={connected ? "default" : "secondary"}>
                {connected ? "Wallet Connected" : "No Wallet"}
              </Badge>
            </div>
          </div>

          {connected && wallet && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Wallet Info</h3>
              <div className="text-xs font-mono bg-muted p-2 rounded">
                {wallet.publicKey.toString().slice(0, 20)}...
              </div>
            </div>
          )}
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Console Logging Pattern</h4>
          <pre className="text-xs font-mono text-muted-foreground">
{`useEffect(() => {
  console.log("💥 Component Mounted");
  return () => {
    console.log("💀 Component Unmounted");
  };
}, []);

useEffect(() => {
  if (!connected) return;
  console.log("🪪 Wallet connected:", wallet?.publicKey.toString());
}, [connected, wallet]);`}
          </pre>
        </div>

        <div className="text-sm text-muted-foreground">
          Open your browser's developer console to see the lifecycle logs in action.
          Click "Remount Component" to trigger mount/unmount cycles.
        </div>
      </CardContent>
    </Card>
  );
}

// Wrapper component that can be remounted
export function LifecycleDemoWrapper() {
  const [key, setKey] = useState(0);

  return (
    <div className="space-y-4">
      <LifecycleDemo key={key} />
      <div className="text-center">
        <Button 
          onClick={() => setKey(prev => prev + 1)}
          variant="outline"
          size="sm"
        >
          Force Remount (External)
        </Button>
      </div>
    </div>
  );
}