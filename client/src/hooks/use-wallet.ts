import { useState, useEffect, createContext, useContext } from 'react';

export interface WalletContextType {
  wallet: {
    publicKey: {
      toString(): string;
    };
    address: string;
  } | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export function useWalletConnection() {
  const [wallet, setWallet] = useState<WalletContextType['wallet']>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask not detected. Please install MetaMask.');
      return;
    }

    try {
      setConnecting(true);
      setError(null);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWallet({
          publicKey: {
            toString: () => address
          },
          address
        });
        setConnected(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setWallet(null);
    setConnected(false);
    setError(null);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        const address = accounts[0];
        setWallet({
          publicKey: {
            toString: () => address
          },
          address
        });
        setConnected(true);
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // Check if already connected
    window.ethereum.request({ method: 'eth_accounts' })
      .then((accounts: string[]) => {
        if (accounts.length > 0) {
          handleAccountsChanged(accounts);
        }
      });

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  return {
    wallet,
    connected,
    connecting,
    connect,
    disconnect,
    error
  };
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}