import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
    chains: [base, baseSepolia],
    multiInjectedProviderDiscovery: true,
    connectors: [
        coinbaseWallet({
            appName: 'DreamNet',
            preference: 'smartWalletOnly',
        }),
    ],
    ssr: true,
    transports: {
        [base.id]: http(),
        [baseSepolia.id]: http(),
    },
});
