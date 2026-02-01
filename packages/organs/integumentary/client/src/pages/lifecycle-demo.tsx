import { useEffect } from 'react';
import { LifecycleDemoWrapper } from '@/components/LifecycleDemo';
import { WalletStatus } from '@/components/WalletStatus';

export default function LifecycleDemoPage() {
  useEffect(() => {
    console.log("💥 Component Mounted");
    return () => {
      console.log("💀 Component Unmounted");
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-electric-cyan">
          Component Lifecycle Demo
        </h1>
        <p className="text-muted-foreground">
          Demonstrates useEffect patterns with mount/unmount logging and wallet integration
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Wallet Integration</h2>
          <WalletStatus />
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Lifecycle Tracking</h2>
          <LifecycleDemoWrapper />
        </div>
      </div>

      <div className="mt-12 p-6 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">How to Use</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Open your browser's developer console (F12)</li>
          <li>Watch for "💥 Component Mounted" messages when components load</li>
          <li>Click "Remount Component" to see unmount/mount cycles</li>
          <li>Connect a wallet to see wallet-specific logging</li>
          <li>Navigate away and back to see page-level mount/unmount</li>
        </ol>
      </div>
    </div>
  );
}