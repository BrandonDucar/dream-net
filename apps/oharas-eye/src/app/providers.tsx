'use client';

import dynamic from 'next/dynamic';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { MiniAppProvider } from '@neynar/react';
import { SafeFarcasterSolanaProvider } from '~/components/providers/SafeFarcasterSolanaProvider';
import { ANALYTICS_ENABLED, RETURN_URL } from '~/lib/constants';

const WagmiProvider = dynamic(
  () => import('~/components/providers/WagmiProvider'),
  {
    ssr: false,
  }
);

export function Providers({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const solanaEndpoint =
    process.env.SOLANA_RPC_ENDPOINT || 'https://solana-rpc.publicnode.com';

  // Cast providers to any to bypass the Divergent React Type mismatch (TS2786)
  const SafeProvider = SafeFarcasterSolanaProvider as any;
  const Wagmi = WagmiProvider as any;

  return (
    <SessionProvider session={session}>
      <Wagmi>
        <MiniAppProvider
          analyticsEnabled={ANALYTICS_ENABLED}
          backButtonEnabled={true}
          returnUrl={RETURN_URL}
        >
          <SafeProvider endpoint={solanaEndpoint}>
            <AuthKitProvider config={{}}>
              {children}
            </AuthKitProvider>
          </SafeProvider>
        </MiniAppProvider>
      </Wagmi>
    </SessionProvider>
  );
}
