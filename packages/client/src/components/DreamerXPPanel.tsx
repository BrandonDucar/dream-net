import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface DreamerXPPanelProps {
  walletAddress?: string;
  className?: string;
}

interface SeasonReward {
  type: 'SHEEP' | 'CORE' | 'DREAM';
  amount: number;
  bonus?: string;
  claimable: boolean;
}

export default function DreamerXPPanel({ walletAddress, className = "" }: DreamerXPPanelProps) {
  const [timeUntilDrop, setTimeUntilDrop] = useState('');
  const [showRewardModal, setShowRewardModal] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: seasonData } = useQuery({
    queryKey: ['/api/seasons/current', walletAddress],
    queryFn: async () => {
      const response = await fetch(`/api/seasons/current?wallet=${walletAddress}`);
      return response.json();
    },
    enabled: !!walletAddress,
    refetchInterval: 60000
  });

  const { data: pendingRewards = [] } = useQuery({
    queryKey: ['/api/rewards/pending', walletAddress],
    queryFn: async (): Promise<SeasonReward[]> => {
      const response = await fetch(`/api/rewards/pending?wallet=${walletAddress}`);
      return response.json();
    },
    enabled: !!walletAddress
  });

  const claimRewardMutation = useMutation({
    mutationFn: async (rewardData: any) => {
      return apiRequest('/api/rewards/claim', {
        method: 'POST',
        body: JSON.stringify(rewardData)
      });
    },
    onSuccess: (result) => {
      toast({
        title: "Rewards Claimed!",
        description: `You received ${result.reward.amount} ${result.reward.type} tokens${result.bonus ? ` and ${result.bonus}` : ''}!`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/rewards/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/seasons/current'] });
      setShowRewardModal(false);
    },
    onError: (error: any) => {
      toast({
        title: "Claim Failed",
        description: error.message || "Unable to claim rewards.",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const nextDrop = new Date();
      nextDrop.setUTCHours(0, 0, 0, 0);
      nextDrop.setUTCDate(nextDrop.getUTCDate() + (7 - nextDrop.getUTCDay())); // Next Sunday
      
      const timeLeft = nextDrop.getTime() - now.getTime();
      
      if (timeLeft <= 0) {
        setTimeUntilDrop('Available Now!');
        return;
      }
      
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
      if (days > 0) {
        setTimeUntilDrop(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeUntilDrop(`${hours}h ${minutes}m`);
      } else {
        setTimeUntilDrop(`${minutes}m`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const getXPProgress = () => {
    if (!seasonData) return 0;
    const nextThreshold = getNextUnlockThreshold(seasonData.totalXP);
    const prevThreshold = getPreviousThreshold(seasonData.totalXP);
    return ((seasonData.totalXP - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
  };

  const getNextUnlockThreshold = (currentXP: number) => {
    const thresholds = [500, 1000, 2000, 3500, 5000, 7500, 10000];
    return thresholds.find(t => t > currentXP) || 15000;
  };

  const getPreviousThreshold = (currentXP: number) => {
    const thresholds = [0, 500, 1000, 2000, 3500, 5000, 7500, 10000];
    const reversed = [...thresholds].reverse();
    return reversed.find(t => t <= currentXP) || 0;
  };

  const getUnlockName = (xp: number) => {
    if (xp >= 10000) return 'Legendary Creator';
    if (xp >= 7500) return 'Master Architect';
    if (xp >= 5000) return 'Dream Fusion Master';
    if (xp >= 3500) return 'Core Manipulator';
    if (xp >= 2000) return 'Remix Boost';
    if (xp >= 1000) return 'Evolution Accelerator';
    if (xp >= 500) return 'Blessing Multiplier';
    return 'Starter Bonus';
  };

  const handleClaimRewards = () => {
    if (!walletAddress || pendingRewards.length === 0) return;
    
    const claimData = {
      wallet: walletAddress,
      seasonXP: seasonData?.totalXP || 0,
      rewards: pendingRewards
    };
    
    claimRewardMutation.mutate(claimData);
  };

  if (!walletAddress) {
    return (
      <div className={`dreamer-xp-panel bg-gray-900/80 border border-gray-600 rounded-lg p-6 ${className}`}>
        <div className="text-center text-gray-400">
          Connect your wallet to view season progress
        </div>
      </div>
    );
  }

  return (
    <div className={`dreamer-xp-panel bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500 rounded-lg p-6 ${className}`}>
      <style>{`
        .dreamer-xp-panel {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }
        .xp-progress-bar {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.3s ease;
        }
        .claim-button {
          background: linear-gradient(45deg, #f59e0b, #eab308);
          transition: all 0.3s ease;
        }
        .claim-button:hover:not(:disabled) {
          background: linear-gradient(45deg, #d97706, #ca8a04);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
        }
        .reward-card {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid #fbbf2440;
          transition: all 0.3s ease;
        }
        .reward-card:hover {
          border-color: #fbbf24;
          background: rgba(0, 0, 0, 0.8);
        }
      `}</style>
      
      <div className="mb-4">
        <h3 className="text-xl font-bold text-blue-300 mb-2">🌟 Your XP This Season</h3>
        {seasonData && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white">Total XP: <strong>{seasonData.totalXP.toLocaleString()}</strong></span>
              <span className="text-blue-400">Rank: <strong>#{seasonData.rank}</strong></span>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Progress to next unlock</span>
                <span>{seasonData.totalXP}/{getNextUnlockThreshold(seasonData.totalXP)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="xp-progress-bar h-3 rounded-full"
                  style={{ width: `${getXPProgress()}%` }}
                ></div>
              </div>
              <div className="text-sm text-purple-400">
                Next Unlock: <em>{getUnlockName(getNextUnlockThreshold(seasonData.totalXP))}</em>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 p-3 bg-black/50 rounded-lg border border-blue-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-blue-300 font-semibold">Weekly Reward Drop</span>
          <span className="text-cyan-400 text-sm" id="xp-timer">{timeUntilDrop}</span>
        </div>
        
        {pendingRewards.length > 0 && (
          <div className="space-y-2">
            {pendingRewards.map((reward, index) => (
              <div key={index} className="reward-card p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gold-400 font-semibold">
                      {reward.amount} {reward.type} Tokens
                    </div>
                    {reward.bonus && (
                      <div className="text-sm text-purple-400">
                        Bonus: {reward.bonus}
                      </div>
                    )}
                  </div>
                  <div className="text-green-400 text-sm">
                    Ready to claim!
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={handleClaimRewards}
              disabled={claimRewardMutation.isPending}
              className="claim-button w-full py-2 px-4 rounded-lg text-white font-semibold text-sm"
            >
              {claimRewardMutation.isPending ? 'Claiming...' : 'Claim All Rewards'}
            </button>
          </div>
        )}
        
        {pendingRewards.length === 0 && (
          <div className="text-gray-400 text-sm text-center">
            No pending rewards. Keep contributing to earn more!
          </div>
        )}
      </div>

      {seasonData?.badges && seasonData.badges.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-blue-300 font-semibold text-sm">Recent Badges</h4>
          <div className="space-y-1">
            {seasonData.badges.slice(0, 3).map((badge: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <span className="text-gold-400">🏆</span>
                <span className="text-white">{badge.name}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{badge.earnedBy}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}