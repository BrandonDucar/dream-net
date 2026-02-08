import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '../lib/wagmi';

const queryClient = new QueryClient();

interface OnchainAuthProviderProps {
    children: ReactNode;
}

/**
 * OnchainAuthProvider wraps the application with Wagmi and OnchainKit providers.
 * It also includes React Query's QueryClientProvider which is required by Wagmi.
 */
export function OnchainAuthProvider({ children }: OnchainAuthProviderProps) {
    const apiKey = process.env.NEXT_PUBLIC_CDP_API_KEY || ''; // Coinbase CDP API Key

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={apiKey}
                    chain={base}
                >
                    {children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
