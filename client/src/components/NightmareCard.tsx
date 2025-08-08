import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface NightmareCardProps {
  dreamId: string;
  dreamTitle: string;
  nightmareSince: number;
  bountyAmount: number;
  bountyToken: string;
  walletAddress?: string;
  className?: string;
}

export default function NightmareCard({ 
  dreamId, 
  dreamTitle, 
  nightmareSince, 
  bountyAmount, 
  bountyToken,
  walletAddress,
  className = "" 
}: NightmareCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const claimMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/dreams/${dreamId}/claim-nightmare`, {
        method: 'POST',
        body: JSON.stringify({ 
          wallet: walletAddress,
          claimType: 'revival',
          reviveBonus: true
        })
      });
    },
    onSuccess: () => {
      toast({
        title: "Nightmare Claimed!",
        description: `You've claimed the ${bountyAmount} ${bountyToken} bounty for reviving this dream.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dreams'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dreams', dreamId] });
    },
    onError: (error: any) => {
      toast({
        title: "Claim Failed",
        description: error.message || "Unable to claim this nightmare right now.",
        variant: "destructive"
      });
    }
  });

  const handleClaim = () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to claim nightmares.",
        variant: "destructive"
      });
      return;
    }
    claimMutation.mutate();
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className={`dream-card nightmare bg-gradient-to-br from-red-900/40 to-black border-2 border-red-600 rounded-lg p-6 ${className}`}>
      <style>{`
        .nightmare {
          box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);
          animation: nightmareGlow 3s ease-in-out infinite alternate;
        }
        @keyframes nightmareGlow {
          from { box-shadow: 0 0 20px rgba(220, 38, 38, 0.4); }
          to { box-shadow: 0 0 30px rgba(220, 38, 38, 0.7), 0 0 40px rgba(220, 38, 38, 0.3); }
        }
        .nightmare-corruption {
          background: linear-gradient(45deg, #dc2626, #991b1b, #7f1d1d);
          background-size: 200% 200%;
          animation: corruptionShift 4s ease-in-out infinite;
        }
        @keyframes corruptionShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-pulse">☠️</span>
          <div>
            <h2 className="text-xl font-bold text-red-300">Nightmare Form</h2>
            <p className="text-sm text-gray-400">
              Corrupted {formatTimeAgo(nightmareSince)}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-gold-400 font-bold">
            {bountyAmount} {bountyToken}
          </div>
          <div className="text-xs text-gray-400">Bounty Reward</div>
        </div>
      </div>

      <div className="nightmare-corruption p-4 rounded-lg mb-4">
        <h3 className="text-white font-semibold mb-2">"{dreamTitle}"</h3>
        <p className="text-red-200 text-sm italic">
          This dream has fallen into shadow due to low XP and inactivity...
        </p>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-red-400 hover:text-red-300 text-sm underline transition-colors"
        >
          {showDetails ? 'Hide Details' : 'View Corruption Details'}
        </button>
        
        <button
          onClick={handleClaim}
          disabled={claimMutation.isPending || !walletAddress}
          className="claim-bounty bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {claimMutation.isPending ? 'Claiming...' : 'Claim Nightmare'}
        </button>
      </div>

      {showDetails && (
        <div className="mt-4 p-4 bg-black/50 rounded-lg border border-red-800">
          <h4 className="text-red-300 font-semibold mb-2">Corruption Analysis</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• XP Level: Below critical threshold (&lt;100)</li>
            <li>• Activity Status: Dormant for extended period</li>
            <li>• Corruption Type: Shadow Manifestation</li>
            <li>• Revival Method: Community intervention required</li>
          </ul>
          
          <div className="mt-3 p-2 bg-red-900/30 rounded border border-red-700">
            <p className="text-xs text-red-200">
              <strong>Revival Bonus:</strong> Successfully claiming this nightmare 
              grants additional XP and potential evolution catalyst.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}