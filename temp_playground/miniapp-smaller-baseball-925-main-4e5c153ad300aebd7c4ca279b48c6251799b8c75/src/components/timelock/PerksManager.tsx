'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Gift, Sparkles, Trophy, Zap, Star, Coins } from 'lucide-react';
import type { TimeLock } from './LockCreator';
import { toast } from 'sonner';

interface PerksManagerProps {
  locks: TimeLock[];
}

interface Perk {
  id: string;
  name: string;
  description: string;
  requiredLocks: number;
  requiredDuration: number; // in seconds
  icon: React.ReactNode;
  reward: string;
  claimed: boolean;
}

export function PerksManager({ locks }: PerksManagerProps) {
  const [perks, setPerks] = useState<Perk[]>([
    {
      id: 'quick-lock',
      name: 'Speed Demon',
      description: 'Lock tokens for at least 5 minutes',
      requiredLocks: 1,
      requiredDuration: 5 * 60,
      icon: <Zap className="h-5 w-5" />,
      reward: '10 Points',
      claimed: false,
    },
    {
      id: 'patient-holder',
      name: 'Patient Holder',
      description: 'Lock tokens for at least 24 hours',
      requiredLocks: 1,
      requiredDuration: 24 * 60 * 60,
      icon: <Trophy className="h-5 w-5" />,
      reward: '50 Points',
      claimed: false,
    },
    {
      id: 'time-collector',
      name: 'Time Collector',
      description: 'Create 3 different time locks',
      requiredLocks: 3,
      requiredDuration: 0,
      icon: <Star className="h-5 w-5" />,
      reward: '100 Points',
      claimed: false,
    },
    {
      id: 'time-lord',
      name: 'Time Lord',
      description: 'Lock tokens for over 30 days',
      requiredLocks: 1,
      requiredDuration: 30 * 24 * 60 * 60,
      icon: <Sparkles className="h-5 w-5" />,
      reward: '500 Points + NFT Badge',
      claimed: false,
    },
  ]);

  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    // Load claimed perks from localStorage
    const savedPerks = localStorage.getItem('timelock-perks');
    const savedPoints = localStorage.getItem('timelock-points');
    if (savedPerks) {
      try {
        setPerks(JSON.parse(savedPerks));
      } catch (error) {
        // Ignore parse errors
      }
    }
    if (savedPoints) {
      try {
        setTotalPoints(parseInt(savedPoints));
      } catch (error) {
        // Ignore parse errors
      }
    }
  }, []);

  const checkPerkEligibility = (perk: Perk): boolean => {
    const eligibleLocks = locks.filter((lock) => lock.duration >= perk.requiredDuration);
    return eligibleLocks.length >= perk.requiredLocks;
  };

  const claimPerk = (perkId: string): void => {
    const perk = perks.find((p) => p.id === perkId);
    if (!perk) return;

    if (perk.claimed) {
      toast.error('Perk already claimed');
      return;
    }

    if (!checkPerkEligibility(perk)) {
      toast.error('Requirements not met');
      return;
    }

    const updatedPerks = perks.map((p) =>
      p.id === perkId ? { ...p, claimed: true } : p
    );

    const points = parseInt(perk.reward.match(/\d+/)?.[0] || '0');
    const newTotal = totalPoints + points;

    setPerks(updatedPerks);
    setTotalPoints(newTotal);

    // Save to localStorage
    localStorage.setItem('timelock-perks', JSON.stringify(updatedPerks));
    localStorage.setItem('timelock-points', newTotal.toString());

    toast.success(`Perk Claimed: ${perk.name}`, {
      description: `You earned ${perk.reward}!`,
    });
  };

  const getProgress = (perk: Perk): number => {
    const eligibleLocks = locks.filter((lock) => lock.duration >= perk.requiredDuration);
    return Math.min(100, (eligibleLocks.length / perk.requiredLocks) * 100);
  };

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Gift className="h-6 w-6 text-purple-600" />
              Perks & Rewards
            </CardTitle>
            <CardDescription>Complete challenges to earn rewards</CardDescription>
          </div>
          <div className="rounded-lg bg-white p-3 text-center shadow-sm">
            <Coins className="mx-auto mb-1 h-5 w-5 text-yellow-600" />
            <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
            <p className="text-xs text-gray-600">Points</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {perks.map((perk) => {
          const eligible = checkPerkEligibility(perk);
          const progress = getProgress(perk);

          return (
            <Card
              key={perk.id}
              className={`transition-all ${
                perk.claimed
                  ? 'border-green-200 bg-green-50/50'
                  : eligible
                    ? 'border-purple-300 bg-white'
                    : 'border-gray-200 bg-gray-50/50'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        perk.claimed
                          ? 'bg-green-100 text-green-600'
                          : eligible
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {perk.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{perk.name}</h3>
                      <p className="text-xs text-gray-600">{perk.description}</p>
                      <Badge variant="secondary" className="mt-2">
                        {perk.reward}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => claimPerk(perk.id)}
                    disabled={!eligible || perk.claimed}
                    className={`${
                      eligible && !perk.claimed
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        : ''
                    }`}
                  >
                    {perk.claimed ? 'Claimed' : 'Claim'}
                  </Button>
                </div>
                {!perk.claimed && (
                  <div className="mt-3 space-y-1">
                    <Progress value={progress} className="h-1.5" />
                    <p className="text-xs text-gray-500">
                      {Math.min(
                        locks.filter((lock) => lock.duration >= perk.requiredDuration).length,
                        perk.requiredLocks
                      )}{' '}
                      / {perk.requiredLocks} completed
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
