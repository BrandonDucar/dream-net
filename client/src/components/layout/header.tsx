import { useLocation } from "wouter";
import { Search, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { NotificationCenter } from "@/components/notification-center";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const pageData = {
  "/": {
    title: "Dashboard Overview",
    description: "Monitor and manage your dream network"
  },
  "/dashboard": {
    title: "Dashboard Overview",
    description: "Monitor and manage your dream network"
  },
  "/dreams": {
    title: "Dreams Management",
    description: "Review and manage dream submissions"
  },
  "/cocoons": {
    title: "Cocoons Management",
    description: "Monitor cocoon lifecycle and transformations"
  },
  "/cores": {
    title: "Dream Cores Activity",
    description: "Track Dream Core energy and resonance"
  },
  "/wallets": {
    title: "Wallets Score Management",
    description: "Manage user wallet scores and rewards"
  },
  "/contributors": {
    title: "Contributors Analytics",
    description: "Track and recognize top contributors"
  }
};

export default function Header() {
  const [location] = useLocation();
  const { walletAddress } = useAuth();
  const { publicKey: solanaPublicKey, connected: solanaConnected } = useWallet();
  const currentPage = pageData[location as keyof typeof pageData] || pageData["/"];

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{currentPage.title}</h2>
          <p className="text-sm text-muted-foreground">{currentPage.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          {walletAddress && (
            <NotificationCenter walletAddress={walletAddress} />
          )}
          
          {/* Solana Wallet Integration */}
          <div className="flex items-center gap-2">
            {solanaConnected && solanaPublicKey && (
              <div className="flex items-center gap-2 px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-md">
                <Wallet className="h-3 w-3 text-purple-400" />
                <span className="text-purple-400 text-xs font-mono">
                  {solanaPublicKey.toBase58().slice(0, 4)}...{solanaPublicKey.toBase58().slice(-4)}
                </span>
              </div>
            )}
            <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !border-purple-500 !text-white !text-xs !px-3 !py-1 !rounded-md !h-8" />
          </div>
          
          <Button variant="outline" size="icon">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
