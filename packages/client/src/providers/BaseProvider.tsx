import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

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
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    // Check if already connected
    if (typeof window !== 'undefined' && window.ethereum) {
      const ethereum = window.ethereum;
      ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(ethereum as ethers.Eip1193Provider);
            setProvider(provider);
            provider.getSigner().then(setSigner);
            setAddress(accounts[0]);
            setIsConnected(true);
            provider.getNetwork().then(network => setChainId(Number(network.chainId)));
          }
        })
        .catch(console.error);
    }
  }, []);

  const connect = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask or compatible wallet not found');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum as ethers.Eip1193Provider);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setAddress(accounts[0]);
      setIsConnected(true);
      setChainId(Number(network.chainId));

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAddress(accounts[0]);
          provider.getSigner().then(setSigner);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setIsConnected(false);
    setChainId(null);
  };

  const switchToBase = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }

    const baseMainnetChainId = '0x2105'; // 8453 in hex

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: baseMainnetChainId }],
      });
    } catch (switchError: any) {
      // If chain doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: baseMainnetChainId,
                chainName: 'Base',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org'],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add Base network:', addError);
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  };

  return (
    <BaseContext.Provider
      value={{
        provider,
        signer,
        address,
        isConnected,
        chainId,
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

