import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet } from 'lucide-react';

export default function WalletHeader() {
  const { publicKey, connected } = useWallet();

  return (
    <div className="flex items-center gap-4 p-4 bg-card/50 border border-border rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Wallet className="h-5 w-5 text-purple-400" />
        <span className="text-sm font-medium text-muted-foreground">Solana Wallet</span>
      </div>
      
      <div className="flex items-center gap-3">
        <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-purple-800 hover:!from-purple-700 hover:!to-purple-900 !border-purple-500 !text-white !font-medium !px-4 !py-2 !rounded-md !transition-all !duration-200" />
        
        {connected && publicKey && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-mono">
              {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-4)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}