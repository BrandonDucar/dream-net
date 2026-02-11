'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Gift, TrendingUp, CheckCircle2, Timer } from 'lucide-react';
import type { TimeLock } from './LockCreator';
import { toast } from 'sonner';

interface TimeLockListProps {
  locks: TimeLock[];
  onRedeem: (lockId: string) => void;
  onTransfer: (lockId: string) => void;
}

export function TimeLockList({ locks, onRedeem, onTransfer }: TimeLockListProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (locks.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">No Time Locks Yet</h3>
          <p className="text-sm text-gray-600">
            Create your first time lock to start earning perks!
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatTimeRemaining = (endTime: number): string => {
    const remaining = Math.max(0, endTime - currentTime);
    const seconds = Math.floor((remaining / 1000) % 60);
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);
    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);

    if (days > 0) {
      const remainingHours = Math.floor((seconds % 86400) / 3600);
      return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days} days`;
    }
    if (hours > 0) {
      const remainingMinutes = Math.floor((seconds % 3600) / 60);
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hours`;
    }
    return `${minutes} minutes`;
  };

  const getProgress = (lock: TimeLock): number => {
    const elapsed = currentTime - lock.createdAt;
    const total = lock.endTime - lock.createdAt;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const isUnlocked = (lock: TimeLock): boolean => {
    return currentTime >= lock.endTime;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Your Time Locks</h2>
        <Badge variant="secondary" className="text-sm">
          {locks.filter((l) => !l.isRedeemed).length} Active
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {locks.map((lock) => {
          const unlocked = isUnlocked(lock);
          const progress = getProgress(lock);

          return (
            <Card
              key={lock.id}
              className={`border-2 transition-all ${
                unlocked
                  ? 'border-green-300 bg-gradient-to-br from-green-50 to-blue-50'
                  : 'border-blue-200 bg-white'
              } ${lock.isRedeemed ? 'opacity-60' : ''}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Timer className="h-5 w-5" />
                      {lock.amount} ETH
                    </CardTitle>
                    <p className="text-xs text-gray-600">{formatDuration(lock.duration)}</p>
                  </div>
                  <Badge
                    variant={unlocked ? 'default' : 'secondary'}
                    className={unlocked ? 'bg-green-600' : ''}
                  >
                    {lock.isRedeemed ? 'Redeemed' : unlocked ? 'Unlocked' : 'Locked'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time Remaining</span>
                    <span className="font-mono font-semibold text-gray-900">
                      {unlocked ? 'Complete' : formatTimeRemaining(lock.endTime)}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-xs font-medium text-blue-900">Time NFT</p>
                  <p className="font-mono text-sm font-bold text-blue-700">{lock.nftId}</p>
                </div>

                <div className="flex gap-2">
                  {!lock.isRedeemed && unlocked && (
                    <Button
                      onClick={() => onRedeem(lock.id)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Redeem
                    </Button>
                  )}
                  {!lock.isRedeemed && (
                    <Button
                      onClick={() => onTransfer(lock.id)}
                      variant="outline"
                      className="flex-1 border-purple-200 hover:bg-purple-50"
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Transfer
                    </Button>
                  )}
                  {lock.isRedeemed && (
                    <Button disabled className="flex-1" variant="secondary">
                      <Gift className="mr-2 h-4 w-4" />
                      Claimed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
