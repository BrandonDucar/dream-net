'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Lock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface LockCreatorProps {
  onLockCreated: (lock: TimeLock) => void;
}

export interface TimeLock {
  id: string;
  amount: string;
  duration: number; // in seconds
  endTime: number; // timestamp
  createdAt: number;
  nftId: string;
  owner: string;
  isRedeemed: boolean;
}

const PRESET_DURATIONS = [
  { label: '5 minutes', seconds: 5 * 60 },
  { label: '3 hours', seconds: 3 * 60 * 60 },
  { label: '36 hours', seconds: 36 * 60 * 60 },
  { label: '9 days', seconds: 9 * 24 * 60 * 60 },
  { label: '1 month 3 days 11 hours', seconds: 34 * 24 * 60 * 60 + 11 * 60 * 60 },
];

export function LockCreator({ onLockCreated }: LockCreatorProps) {
  const { address, status } = useAccount();
  const [amount, setAmount] = useState('');
  const [customDays, setCustomDays] = useState('');
  const [customHours, setCustomHours] = useState('');
  const [customMinutes, setCustomMinutes] = useState('');
  const [isLocking, setIsLocking] = useState(false);

  const handleCreateLock = async (durationSeconds: number) => {
    if (status !== 'connected' || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLocking(true);

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const now = Date.now();
    const newLock: TimeLock = {
      id: `lock-${now}`,
      amount: amount,
      duration: durationSeconds,
      endTime: now + durationSeconds * 1000,
      createdAt: now,
      nftId: `NFT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      owner: address,
      isRedeemed: false,
    };

    onLockCreated(newLock);
    setAmount('');
    setCustomDays('');
    setCustomHours('');
    setCustomMinutes('');
    setIsLocking(false);

    toast.success('Time Lock Created!', {
      description: `Your time NFT ${newLock.nftId} has been minted`,
    });
  };

  const handleCustomLock = () => {
    const days = parseInt(customDays) || 0;
    const hours = parseInt(customHours) || 0;
    const minutes = parseInt(customMinutes) || 0;

    const totalSeconds = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60;

    if (totalSeconds <= 0) {
      toast.error('Please enter a valid duration');
      return;
    }

    handleCreateLock(totalSeconds);
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Lock className="h-6 w-6 text-blue-600" />
          Create Time Lock
        </CardTitle>
        <CardDescription>Lock tokens and mint a time NFT</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (ETH)</Label>
          <Input
            id="amount"
            type="number"
            step="0.001"
            placeholder="0.1"
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            className="text-lg"
            disabled={isLocking}
          />
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Preset Durations
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_DURATIONS.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                onClick={() => handleCreateLock(preset.seconds)}
                disabled={isLocking || !amount}
                className="h-auto flex-col py-3 hover:border-blue-500 hover:bg-blue-50"
              >
                <span className="text-xs font-medium">{preset.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Custom Duration
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Input
                type="number"
                placeholder="Days"
                value={customDays}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCustomDays(e.target.value)
                }
                disabled={isLocking}
                min="0"
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Hours"
                value={customHours}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCustomHours(e.target.value)
                }
                disabled={isLocking}
                min="0"
                max="23"
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Minutes"
                value={customMinutes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setCustomMinutes(e.target.value)
                }
                disabled={isLocking}
                min="0"
                max="59"
              />
            </div>
          </div>
          <Button
            onClick={handleCustomLock}
            disabled={isLocking || !amount}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLocking ? 'Creating Lock...' : 'Create Custom Lock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
