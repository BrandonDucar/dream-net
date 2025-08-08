import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { 
  User, 
  Zap, 
  Brain, 
  Trophy, 
  Star, 
  Activity,
  CheckCircle,
  Circle,
  ArrowUp,
  Lock,
  Unlock
} from 'lucide-react';

interface WalletProfile {
  wallet: string;
  score: number;
  mindBalance: number;
  mindEnergy: number;
  maxMindEnergy: number;
  agentsUnlocked: string[];
  totalAgents: number;
  stats: {
    dreamsCreated: number;
    remixesCompleted: number;
    secretsUnlocked: number;
    badgesEarned: number;
    seasonalEventParticipation: number;
  };
  progression: {
    level: number;
    xp: number;
    nextLevelXp: number;
    xpToNext: number;
  };
  mindEnergyUsage: {
    lastUsed: number;
    regenRate: number;
    actions: Array<{
      action: string;
      cost: number;
      timestamp: number;
    }>;
  };
  achievements: Array<{
    name: string;
    earned: boolean;
    description: string;
    progress?: number;
  }>;
  badges?: string[];
  permissions: {
    canCreateDreams: boolean;
    canAccessSecretVault: boolean;
    canParticipateInDAO: boolean;
    canActivateAgents: boolean;
    canAccessEliteFeatures?: boolean;
    maxDailyActions: number;
  };
  tier?: string;
  specialAccess?: string[];
}

interface WalletProfileDashboardProps {
  walletAddress: string;
}

export function WalletProfileDashboard({ walletAddress }: WalletProfileDashboardProps) {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery<WalletProfile>({
    queryKey: [`/api/wallet/profile/${walletAddress}`],
    enabled: !!walletAddress
  });

  const updateMindEnergyMutation = useMutation({
    mutationFn: async ({ energyChange, action }: { energyChange: number; action: string }) => {
      return apiRequest('/api/wallet/mind-energy', {
        method: 'POST',
        body: { walletAddress, energyChange, action }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/wallet/profile/${walletAddress}`] });
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border border-cyan-500/20 bg-slate-900">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-cyan-500/20 rounded mb-4"></div>
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className="border border-red-500/20 bg-slate-900">
        <CardContent className="p-6">
          <p className="text-red-400">Failed to load wallet profile</p>
        </CardContent>
      </Card>
    );
  }

  const energyPercentage = (profile.mindEnergy / profile.maxMindEnergy) * 100;
  const xpPercentage = ((profile.progression.xp - (profile.progression.nextLevelXp - profile.progression.xpToNext)) / profile.progression.xpToNext) * 100;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border border-cyan-500/30 bg-gradient-to-r from-slate-900 to-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <User className="w-6 h-6 text-cyan-400" />
            Dreamer Profile
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
              Score: {profile.score}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="font-mono text-sm text-slate-300 break-all">
            {profile.wallet}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{profile.mindBalance}</div>
              <div className="text-xs text-slate-400">MIND Balance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{profile.mindEnergy}</div>
              <div className="text-xs text-slate-400">MIND Energy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{profile.agentsUnlocked.length}</div>
              <div className="text-xs text-slate-400">Agents Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{profile.progression.level}</div>
              <div className="text-xs text-slate-400">Level</div>
            </div>
          </div>
          
          {/* Tier and Badges */}
          <div className="flex items-center justify-between">
            {profile.tier && (
              <Badge 
                variant="outline" 
                className={`${
                  profile.tier === 'Elite' 
                    ? 'border-yellow-500/50 text-yellow-300 bg-yellow-500/10' 
                    : 'border-cyan-500/50 text-cyan-300'
                }`}
              >
                {profile.tier} Tier
              </Badge>
            )}
            
            {profile.badges && (
              <div className="flex gap-2">
                {profile.badges.map(badge => (
                  <Badge key={badge} variant="secondary" className="bg-slate-700 text-slate-200">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mind Energy Card */}
        <Card className="border border-yellow-500/20 bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-300">
              <Zap className="w-5 h-5" />
              Mind Energy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">{profile.mindEnergy} / {profile.maxMindEnergy}</span>
              <span className="text-yellow-400">{energyPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={energyPercentage} className="bg-slate-700" />
            
            <div className="text-xs text-slate-400">
              Regenerates {profile.mindEnergyUsage.regenRate} energy/hour
            </div>

            <div className="space-y-2">
              <div className="text-sm text-slate-300 font-medium">Recent Usage:</div>
              {profile.mindEnergyUsage.actions.slice(0, 3).map((action, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="text-slate-400">{action.action}</span>
                  <span className="text-red-400">-{action.cost}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateMindEnergyMutation.mutate({ energyChange: 10, action: 'Rest Bonus' })}
                disabled={updateMindEnergyMutation.isPending}
                className="border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/10"
              >
                <ArrowUp className="w-3 h-3 mr-1" />
                Rest (+10)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progression Card */}
        <Card className="border border-purple-500/20 bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-300">
              <Star className="w-5 h-5" />
              Progression
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">Level {profile.progression.level}</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">XP Progress</span>
                <span className="text-purple-400">{profile.progression.xpToNext} to next</span>
              </div>
              <Progress value={xpPercentage} className="bg-slate-700" />
              <div className="text-xs text-slate-400 text-center">
                {profile.progression.xp} / {profile.progression.nextLevelXp} XP
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agents Card */}
        <Card className="border border-green-500/20 bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-300">
              <Brain className="w-5 h-5" />
              Agents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {profile.agentsUnlocked.length} / {profile.totalAgents}
              </div>
              <div className="text-xs text-slate-400">Unlocked</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {profile.agentsUnlocked.map(agent => (
                <Badge key={agent} variant="outline" className="border-green-500/50 text-green-300 text-xs">
                  <Unlock className="w-3 h-3 mr-1" />
                  {agent}
                </Badge>
              ))}
            </div>

            {profile.specialAccess && profile.specialAccess.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs text-yellow-400 font-medium">Special Access:</div>
                {profile.specialAccess.map(access => (
                  <Badge key={access} variant="outline" className="border-yellow-500/30 text-yellow-300 text-xs block">
                    ⭐ {access}
                  </Badge>
                ))}
              </div>
            )}
            
            {(!profile.specialAccess || profile.specialAccess.length === 0) && (
              <div className="text-xs text-slate-400">
                Next: META (Score 80+, Level 20+)
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border border-cyan-500/20 bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-300">
              <Activity className="w-5 h-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-slate-400">Dreams Created</div>
                <div className="text-cyan-400 font-bold">{profile.stats.dreamsCreated}</div>
              </div>
              <div>
                <div className="text-slate-400">Remixes</div>
                <div className="text-cyan-400 font-bold">{profile.stats.remixesCompleted}</div>
              </div>
              <div>
                <div className="text-slate-400">Secrets Unlocked</div>
                <div className="text-cyan-400 font-bold">{profile.stats.secretsUnlocked}</div>
              </div>
              <div>
                <div className="text-slate-400">Badges Earned</div>
                <div className="text-cyan-400 font-bold">{profile.stats.badgesEarned}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Card */}
        <Card className="border border-orange-500/20 bg-slate-900 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-300">
              <Trophy className="w-5 h-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profile.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-slate-700 bg-slate-800/50">
                  {achievement.earned ? (
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white">{achievement.name}</div>
                    <div className="text-xs text-slate-400">{achievement.description}</div>
                    {!achievement.earned && achievement.progress !== undefined && (
                      <div className="mt-2">
                        <Progress value={(achievement.progress / 50) * 100} className="h-1" />
                        <div className="text-xs text-slate-500 mt-1">{achievement.progress}/50</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}