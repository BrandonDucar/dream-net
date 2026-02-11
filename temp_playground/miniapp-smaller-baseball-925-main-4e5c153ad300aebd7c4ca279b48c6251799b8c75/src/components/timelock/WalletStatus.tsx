'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { sdk } from '@farcaster/miniapp-sdk';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Loader2 } from 'lucide-react';

export function WalletStatus() {
  const { address, status } = useAccount();
  const [farcasterUsername, setFarcasterUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFarcasterContext() {
      try {
        await sdk.actions.ready();
        const context = await sdk.context;
        if (!cancelled) {
          setFarcasterUsername(context?.user?.username ?? null);
          setIsLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setFarcasterUsername(null);
          setIsLoading(false);
        }
      }
    }

    if (status === 'connected') {
      loadFarcasterContext();
    } else {
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [status]);

  if (isLoading || status === 'connecting' || status === 'reconnecting') {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="flex items-center gap-3 p-4">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <span className="text-sm text-blue-900">Connecting wallet...</span>
        </CardContent>
      </Card>
    );
  }

  if (!address) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-orange-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-900">Smart Wallet Required</p>
              <p className="text-xs text-orange-700">
                Open this app in Warpcast or refresh your session
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <Wallet className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Connected</p>
            <p className="text-xs text-gray-600">
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
              {farcasterUsername && <span className="ml-1">@{farcasterUsername}</span>}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
