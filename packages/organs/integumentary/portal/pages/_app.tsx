import type { AppProps } from 'next/app';
import { OnchainAuthProvider } from '../providers/OnchainAuthProvider';
import { MetabolicHUD } from '@dreamnet/shared';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <OnchainAuthProvider>
            <Component {...pageProps} />
            <MetabolicHUD />
        </OnchainAuthProvider>
    );
}
