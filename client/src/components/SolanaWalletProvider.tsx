import { FC, ReactNode } from 'react';
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider
} from '@solana/wallet-adapter-react-ui';
import type { Adapter } from '@solana/wallet-adapter-base';

// Import styles for the wallet adapter UI
import '@solana/wallet-adapter-react-ui/styles.css';

// Note: PhantomWalletAdapter would be imported here when @solana/wallet-adapter-wallets installs successfully
// For now using empty wallets array - the WalletMultiButton will still work for browser extension detection
const wallets: Adapter[] = [
  // new PhantomWalletAdapter() would be added here when package is available
];

export const WalletConnectionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};