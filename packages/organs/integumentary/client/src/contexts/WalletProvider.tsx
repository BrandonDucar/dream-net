import { createContext, ReactNode } from 'react';
import { useWalletConnection, WalletContextType } from '../hooks/use-wallet.js';

const WalletContext = createContext<WalletContextType | null>(null);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const walletConnection = useWalletConnection();

  return (
    <WalletContext.Provider value={walletConnection}>
      {children}
    </WalletContext.Provider>
  );
}

export { WalletContext };