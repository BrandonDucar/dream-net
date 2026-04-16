import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { useBase } from '@/providers/BaseProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wallet, LogOut, ExternalLink } from 'lucide-react';

/**
 * Base L2 Wallet Connection Button
 */
export function BaseWalletButton() {
  const { address, isConnected, connect, disconnect, switchToBase, chainId } = useBase();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      await connect();
      // Check if on Base network, if not, prompt to switch
      if (chainId !== 8453 && chainId !== 84532) {
        await switchToBase();
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setConnecting(false);
    }
  };

  if (isConnected && address) {
    const isBaseNetwork = chainId === 8453 || chainId === 84532;
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`${
              isBaseNetwork
                ? 'border-electric-cyan text-electric-cyan'
                : 'border-yellow-500 text-yellow-500'
            }`}
          >
            <Wallet className="w-4 h-4 mr-2" />
            {address.slice(0, 6)}...{address.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!isBaseNetwork && (
            <DropdownMenuItem onClick={switchToBase}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Switch to Base
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => {
              window.open(`https://basescan.org/address/${address}`, '_blank');
            }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Basescan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={disconnect}>
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={connecting}
      className="bg-gradient-to-r from-electric-cyan to-soft-gold text-black hover:opacity-90"
    >
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}

/**
 * Display wallet address and balance
 */
export function BaseWalletInfo() {
  const { address, isConnected, provider } = useBase();
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address && provider) {
      provider.getBalance(address).then((bal: bigint) => {
        setBalance(ethers.formatEther(bal));
      });
    } else {
      setBalance(null);
    }
  }, [isConnected, address, provider]);

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-400">Connected:</span>
      <span className="font-mono text-electric-cyan">
        {address.slice(0, 6)}...{address.slice(-4)}
      </span>
      {balance && (
        <span className="text-gray-400">
          {parseFloat(balance).toFixed(4)} ETH
        </span>
      )}
    </div>
  );
}

