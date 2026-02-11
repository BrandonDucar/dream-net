'use client'
import { useState, useEffect } from 'react';
import { WalletStatus } from '@/components/timelock/WalletStatus';
import { LockCreator } from '@/components/timelock/LockCreator';
import { TimeLockList } from '@/components/timelock/TimeLockList';
import { PerksManager } from '@/components/timelock/PerksManager';
import type { TimeLock } from '@/components/timelock/LockCreator';
import { Toaster } from '@/components/ui/sonner';
import { Lock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";

export default function TimeLockPlayground() {
    const { addMiniApp } = useAddMiniApp();
    const isInFarcaster = useIsInFarcaster()
    useQuickAuth(isInFarcaster)
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }

      }

    

      tryAddMiniApp()
    }, [addMiniApp])
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          if (document.readyState !== 'complete') {
            await new Promise<void>(resolve => {
              if (document.readyState === 'complete') {
                resolve()
              } else {
                window.addEventListener('load', () => resolve(), { once: true })
              }

            })
          }

    

          await sdk.actions.ready()
          console.log('Farcaster SDK initialized successfully - app fully loaded')
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error)
          
          setTimeout(async () => {
            try {
              await sdk.actions.ready()
              console.log('Farcaster SDK initialized on retry')
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError)
            }

          }, 1000)
        }

      }

    

      initializeFarcaster()
    }, [])
  const [locks, setLocks] = useState<TimeLock[]>([]);

  useEffect(() => {
    // Load locks from localStorage
    const savedLocks = localStorage.getItem('timelock-locks');
    if (savedLocks) {
      try {
        setLocks(JSON.parse(savedLocks));
      } catch (error) {
        // Ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    // Save locks to localStorage
    if (locks.length > 0) {
      localStorage.setItem('timelock-locks', JSON.stringify(locks));
    }
  }, [locks]);

  const handleLockCreated = (newLock: TimeLock): void => {
    setLocks((prev) => [newLock, ...prev]);
  };

  const handleRedeem = (lockId: string): void => {
    setLocks((prev) =>
      prev.map((lock) =>
        lock.id === lockId
          ? { ...lock, isRedeemed: true }
          : lock
      )
    );
    toast.success('Time Lock Redeemed!', {
      description: 'Your tokens have been unlocked and returned',
    });
  };

  const handleTransfer = (lockId: string): void => {
    const lock = locks.find((l) => l.id === lockId);
    if (!lock) return;

    toast.success('Transfer Initiated', {
      description: `Time NFT ${lock.nftId} is ready to trade`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Toaster position="top-center" richColors />

      {/* Hero Header */}
      <div className="border-b border-blue-200 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">TimeLock Playground</h1>
              <p className="text-sm text-blue-100">
                Turn time into an onchain asset on Base
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 grid grid-cols-3 gap-4 rounded-lg bg-white/10 p-4 backdrop-blur">
            <div className="text-center">
              <p className="text-2xl font-bold">{locks.length}</p>
              <p className="text-xs text-blue-100">Total Locks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {locks.filter((l) => !l.isRedeemed).length}
              </p>
              <p className="text-xs text-blue-100">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {locks.reduce((sum, l) => sum + parseFloat(l.amount), 0).toFixed(3)}
              </p>
              <p className="text-xs text-blue-100">ETH Locked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        {/* Wallet Status */}
        <WalletStatus />

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Lock Creator */}
          <div className="space-y-6 lg:col-span-2">
            <LockCreator onLockCreated={handleLockCreated} />
            <TimeLockList locks={locks} onRedeem={handleRedeem} onTransfer={handleTransfer} />
          </div>

          {/* Right Column - Perks */}
          <div className="lg:col-span-1">
            <PerksManager locks={locks} />
          </div>
        </div>

        {/* Info Section */}
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white/50 p-6 text-center backdrop-blur">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-purple-600" />
          <h3 className="mb-2 text-lg font-bold text-gray-900">
            A New Mechanic for Base
          </h3>
          <p className="text-sm text-gray-600">
            Lock tokens for weird durations. Get time NFTs. Earn perks. Trade your locks like
            collectibles. Time is now a tradeable asset onchain! ⏰
          </p>
        </div>
      </div>
    </div>
  );
}
