import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Sparkles, Users, Award, Flame } from 'lucide-react';

interface SeasonalEvent {
  name: string;
  isActive: boolean;
  daysRemaining?: number;
  theme: string;
  bonuses?: {
    xpMultiplier: number;
    vaultDropChance: number;
    remixMultiplier: number;
  };
  specialTokens?: string[];
  featuredBadges?: string[];
  progress?: {
    totalParticipants: number;
    lucidTokensEarned: number;
    vaultSecretsUnlocked: number;
    chainRemixesCreated: number;
  };
  nextEvent?: {
    name: string;
    start: string;
    countdown: string;
  };
}

export function SeasonalEventBanner() {
  const [timeLeft, setTimeLeft] = useState('');
  
  const { data: seasonalEvent, isLoading } = useQuery<SeasonalEvent>({
    queryKey: ['/api/events/seasonal'],
    refetchInterval: 60000 // Refresh every minute
  });

  useEffect(() => {
    if (seasonalEvent?.isActive && seasonalEvent.daysRemaining) {
      const timer = setInterval(() => {
        const days = seasonalEvent.daysRemaining || 0;
        const hours = Math.floor((days % 1) * 24);
        setTimeLeft(`${Math.floor(days)}d ${hours}h remaining`);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [seasonalEvent]);

  if (isLoading) {
    return (
      <Card className="border border-cyan-500/20 bg-gradient-to-r from-slate-900 to-slate-800">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-cyan-500/20 rounded mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!seasonalEvent?.isActive) {
    return (
      <Card className="border border-slate-600/20 bg-gradient-to-r from-slate-900 to-slate-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-slate-300 font-medium">No Active Event</p>
              {seasonalEvent?.nextEvent && (
                <p className="text-sm text-slate-400">
                  Next: {seasonalEvent.nextEvent.name} in {seasonalEvent.nextEvent.countdown}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const themeColors = {
    light: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
    dark: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30',
    nature: 'from-green-500/20 to-emerald-500/20 border-green-500/30'
  };

  const themeGradient = themeColors[seasonalEvent.theme as keyof typeof themeColors] || themeColors.light;

  return (
    <Card className={`border bg-gradient-to-r ${themeGradient}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {seasonalEvent.name}
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  LIVE
                </Badge>
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-300 mt-1">
                <Clock className="w-4 h-4" />
                {timeLeft}
              </div>
            </div>
          </div>
          
          {seasonalEvent.specialTokens && (
            <div className="flex gap-2">
              {seasonalEvent.specialTokens.map(token => (
                <Badge key={token} variant="outline" className="border-yellow-500/50 text-yellow-300">
                  {token}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Bonuses */}
        {seasonalEvent.bonuses && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {seasonalEvent.bonuses.xpMultiplier}x
              </div>
              <div className="text-xs text-slate-400">XP Boost</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round(seasonalEvent.bonuses.vaultDropChance * 100)}%
              </div>
              <div className="text-xs text-slate-400">Vault Drop</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {seasonalEvent.bonuses.remixMultiplier}x
              </div>
              <div className="text-xs text-slate-400">Remix Reward</div>
            </div>
          </div>
        )}

        {/* Progress Stats */}
        {seasonalEvent.progress && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">
                {seasonalEvent.progress.totalParticipants.toLocaleString()} participants
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-slate-300">
                {seasonalEvent.progress.lucidTokensEarned.toLocaleString()} LUCID earned
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-300">
                {seasonalEvent.progress.vaultSecretsUnlocked} secrets unlocked
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-slate-300">
                {seasonalEvent.progress.chainRemixesCreated} chain remixes
              </span>
            </div>
          </div>
        )}

        {/* Featured Badges */}
        {seasonalEvent.featuredBadges && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-400 mr-2">Featured Badges:</span>
            {seasonalEvent.featuredBadges.map((badge, index) => (
              <Badge key={index} variant="outline" className="border-yellow-500/30 text-yellow-300">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}