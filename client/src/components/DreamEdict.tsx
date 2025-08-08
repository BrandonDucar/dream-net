import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface DreamEdictProps {
  edictId: string;
  title: string;
  fromCore: string;
  objective: string;
  reward: {
    token: string;
    amount: number;
    xp: number;
  };
  expires: number;
  progress?: {
    current: number;
    target: number;
  };
  contributors?: string[];
  walletAddress?: string;
  className?: string;
}

export default function DreamEdict({ 
  edictId,
  title,
  fromCore,
  objective,
  reward,
  expires,
  progress,
  contributors = [],
  walletAddress,
  className = ""
}: DreamEdictProps) {
  const [isContributing, setIsContributing] = useState(false);
  const [contributionType, setContributionType] = useState<'dream' | 'revival' | 'blessing'>('dream');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const contributeMutation = useMutation({
    mutationFn: async (contributionData: any) => {
      return apiRequest(`/api/edicts/${edictId}/contribute`, {
        method: 'POST',
        body: JSON.stringify(contributionData)
      });
    },
    onSuccess: (result) => {
      toast({
        title: "Contribution Recorded!",
        description: `Your ${contributionType} contribution to "${title}" has been logged.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/edicts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/edicts', edictId] });
      setIsContributing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Contribution Failed",
        description: error.message || "Unable to record contribution.",
        variant: "destructive"
      });
    }
  });

  const formatTimeRemaining = (expiresTimestamp: number) => {
    const now = Date.now();
    const timeLeft = expiresTimestamp * 1000 - now;
    
    if (timeLeft <= 0) return "Expired";
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const getProgressPercentage = () => {
    if (!progress) return 0;
    return Math.min(100, (progress.current / progress.target) * 100);
  };

  const handleContribute = () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Connect your wallet to contribute to edicts.",
        variant: "destructive"
      });
      return;
    }

    setIsContributing(true);
  };

  const submitContribution = () => {
    const contributionData = {
      wallet: walletAddress,
      type: contributionType,
      edictId,
      timestamp: Date.now()
    };

    contributeMutation.mutate(contributionData);
  };

  const isExpired = expires * 1000 < Date.now();
  const isCompleted = progress && progress.current >= progress.target;

  return (
    <div className={`dream-edict bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500 rounded-lg p-6 ${className}`}>
      <style>{`
        .dream-edict {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
        }
        .contribute-button {
          background: linear-gradient(45deg, #7c3aed, #6366f1);
          transition: all 0.3s ease;
        }
        .contribute-button:hover:not(:disabled) {
          background: linear-gradient(45deg, #6d28d9, #4f46e5);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
        }
        .contribute-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .progress-bar {
          background: linear-gradient(90deg, #7c3aed, #6366f1);
          transition: width 0.3s ease;
        }
        .contribution-option {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .contribution-option:hover {
          background: rgba(124, 58, 237, 0.1);
          border-color: #7c3aed;
        }
        .contribution-option.selected {
          background: rgba(124, 58, 237, 0.2);
          border-color: #8b5cf6;
        }
      `}</style>
      
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-purple-300">📜 {title}</h3>
          <span className={`text-xs px-2 py-1 rounded ${
            isExpired ? 'bg-red-600 text-white' : 
            isCompleted ? 'bg-green-600 text-white' : 
            'bg-purple-600 text-white'
          }`}>
            {isExpired ? 'Expired' : isCompleted ? 'Completed' : 'Active'}
          </span>
        </div>
        
        <p className="text-gray-400 text-sm mb-1">From: {fromCore}</p>
        <p className="text-gray-300 text-sm mb-3">{objective}</p>
        
        {progress && (
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progress.current}/{progress.target}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="progress-bar h-2 rounded-full"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gold-400 font-semibold">
            Reward: {reward.amount} {reward.token} + {reward.xp} XP
          </p>
          {contributors.length > 0 && (
            <p className="text-xs text-gray-400">
              {contributors.length} contributor{contributors.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <span className="timer text-cyan-400 text-sm">
          ⏳ {formatTimeRemaining(expires)}
        </span>
      </div>

      {!isContributing ? (
        <button
          onClick={handleContribute}
          disabled={isExpired || isCompleted || !walletAddress}
          className="contribute-button w-full py-3 px-4 rounded-lg text-white font-semibold"
        >
          {!walletAddress ? 'Connect Wallet to Contribute' : 
           isExpired ? 'Edict Expired' :
           isCompleted ? 'Edict Completed' : 
           'Contribute'}
        </button>
      ) : (
        <div className="space-y-4">
          <h4 className="text-purple-300 font-semibold">Choose Contribution Method</h4>
          
          <div className="space-y-2">
            {[
              { 
                id: 'dream', 
                name: 'Create Genesis Dream', 
                description: 'Spawn a new dream aligned with edict goals',
                icon: '✨'
              },
              { 
                id: 'revival', 
                name: 'Revive Nightmare', 
                description: 'Rescue a dream from nightmare status',
                icon: '🔥'
              },
              { 
                id: 'blessing', 
                name: 'Bless Existing Dream', 
                description: 'Channel energy to boost dream XP',
                icon: '🕊️'
              }
            ].map((option) => (
              <div
                key={option.id}
                onClick={() => setContributionType(option.id as any)}
                className={`contribution-option p-3 border rounded-lg ${
                  contributionType === option.id ? 'selected' : 'border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{option.icon}</span>
                  <div>
                    <div className="text-white font-medium">{option.name}</div>
                    <div className="text-gray-400 text-sm">{option.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsContributing(false)}
              className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submitContribution}
              disabled={contributeMutation.isPending}
              className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
            >
              {contributeMutation.isPending ? 'Recording...' : 'Submit Contribution'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}