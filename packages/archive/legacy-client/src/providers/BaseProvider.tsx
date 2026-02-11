import { ReactNode, createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import { useAccount, useConfig, useDisconnect, useSwitchChain } from 'wagmi';
import { getEip1193Provider } from '@wagmi/core';

interface BaseContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

const BaseContext = createContext<BaseContextType | undefined>(undefined);

interface BaseProviderProps {
  children: ReactNode;
}

/**
 * Base L2 Provider using ethers.js
 * Provides Base network integration and wallet connection
 */
export function BaseProvider({ children }: BaseProviderProps) {
  const { address, isConnected, chainId: wagmiChainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const config = useConfig();

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  // Synchronize ethers provider/signer with Wagmi connection
  useEffect(() => {
    const updateEthers = async () => {
      if (isConnected && address) {
        try {
          // Get the EIP-1193 provider from Wagmi config
          const eip1193Provider = await getEip1193Provider(config);
          if (eip1193Provider) {
            const browserProvider = new ethers.BrowserProvider(eip1193Provider);
            const ethersSigner = await browserProvider.getSigner();
            setProvider(browserProvider);
            setSigner(ethersSigner);
          }
        } catch (error) {
          console.error('Failed to sync ethers provider:', error);
        }
      } else {
        setProvider(null);
        setSigner(null);
      }
    };

    updateEthers();
  }, [isConnected, address, config]);

  const connect = async () => {
    // Note: Social logins and Smart Wallet connection should be handled via Wagmi directly.
    // This legacy connect function can still be used to trigger default connection.
    console.warn('BaseProvider.connect called. Redirecting to unified connect flow.');
  };

  const switchToBase = async () => {
    try {
      await switchChain({ chainId: 8453 }); // Base Mainnet
    } catch (error) {
      console.error('Failed to switch to Base:', error);
    }
  };

  return (
    <BaseContext.Provider
      value={{
        provider,
        signer,
        address: address || null,
        isConnected,
        chainId: wagmiChainId || null,
        connect,
        disconnect,
        switchToBase,
      }}
    >
      {children}
    </BaseContext.Provider>
  );
}

export function useBase() {
  const context = useContext(BaseContext);
  if (context === undefined) {
    throw new Error('useBase must be used within a BaseProvider');
  }
  return context;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

