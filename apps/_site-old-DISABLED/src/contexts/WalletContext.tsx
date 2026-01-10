import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { OnchainKitProvider, OnchainKitConfig } from "@coinbase/onchainkit";
import { getBaseAppContext, isBaseApp } from '../lib/base-app.js';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

// OnchainKit configuration
const onchainKitConfig: OnchainKitConfig = {
  apiKey: import.meta.env.VITE_ONCHAINKIT_API_KEY || "",
  chain: {
    id: 8453, // Base mainnet
    name: "Base",
    network: "base",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: { http: ["https://mainnet.base.org"] },
      public: { http: ["https://mainnet.base.org"] },
    },
    blockExplorers: {
      default: { name: "BaseScan", url: "https://basescan.org" },
    },
  },
  wallet: {
    appName: "DreamNet",
    appIcon: "https://dreamnet.ink/favicon.ico",
  },
};

export function WalletProvider({ children }: WalletProviderProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing connection on mount
  useEffect(() => {
    // If in Base App, check for wallet from context
    if (isBaseApp()) {
      const context = getBaseAppContext();
      if (context.walletAddress) {
        setAddress(context.walletAddress);
        return;
      }
    }

    const savedAddress = localStorage.getItem("wallet_address");
    if (savedAddress) {
      setAddress(savedAddress);
    }

    // Listen for wallet changes
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAddress(accounts[0]);
          localStorage.setItem("wallet_address", accounts[0]);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      // Check if already connected
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            localStorage.setItem("wallet_address", accounts[0]);
          }
        });

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  const connect = async () => {
    // If in Base App, wallet should already be connected
    if (isBaseApp()) {
      const context = getBaseAppContext();
      if (context.walletAddress) {
        setAddress(context.walletAddress);
        return;
      }
    }

    if (typeof window === "undefined" || !window.ethereum) {
      setError("No wallet detected. Please install MetaMask or Coinbase Wallet.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const account = accounts[0];
        setAddress(account);
        localStorage.setItem("wallet_address", account);

        // Trigger login reward if available
        try {
          await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/rewards/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: account }),
          });
        } catch (err) {
          console.warn("Failed to grant login reward:", err);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
      console.error("Wallet connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    localStorage.removeItem("wallet_address");
    setError(null);
  };

  return (
    <OnchainKitProvider config={onchainKitConfig}>
      <WalletContext.Provider
        value={{
          address,
          isConnected: !!address,
          isConnecting,
          connect,
          disconnect,
          error,
        }}
      >
        {children}
      </WalletContext.Provider>
    </OnchainKitProvider>
  );
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

