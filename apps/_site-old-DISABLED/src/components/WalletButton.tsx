import { useWallet } from '../contexts/WalletContext.js';
import { Wallet, LogOut, Loader2 } from "lucide-react";

export function WalletButton() {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();

  if (isConnecting) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-cyan-400 border-2 border-cyan-500/50 rounded-lg opacity-50 cursor-not-allowed"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Connecting...
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-cyan-400 border-2 border-cyan-500/30 rounded-lg bg-cyan-500/10">
          <Wallet className="h-4 w-4" />
          <span className="font-mono text-xs">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
          title="Disconnect wallet"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </button>
  );
}

