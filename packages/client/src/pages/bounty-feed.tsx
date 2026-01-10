import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface Bounty {
  bountyId: string;
  dreamId: string;
  token: string;
  amount: number;
  claimed: boolean;
  expires: number;
  claimedBy?: string;
  claimer?: string;
  submission?: string;
  proof?: string;
  claimSubmission?: string;
  claimProof?: string;
  claimDate?: number;
  hiddenBonus?: boolean;
}

export default function BountyFeed() {
  const { data: bounties, isLoading } = useQuery({
    queryKey: ['/api/dream-clouds/bounties'],
  });

  const claimBountyMutation = useMutation({
    mutationFn: async (dreamId: string) => {
      return apiRequest(`/api/dream-clouds/${dreamId}/claim-bounty`, {
        method: 'POST',
        headers: { 'x-wallet-address': '0xBOUNTYHUNTER' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dream-clouds/bounties'] });
    }
  });

  const formatExpiry = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading bounties...</div>
        </div>
      </div>
    );
  }

  const activeBounties = bounties?.filter((bounty: Bounty) => !bounty.claimed) || [];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bounty-feed">
          <h2 className="text-3xl font-bold mb-8 text-center">🌈 Active Bounties</h2>

          <div className="space-y-6">
            {activeBounties.map((bounty: Bounty) => (
              <div key={bounty.bountyId} className="bounty-card bg-gray-900 border border-gray-700 rounded-lg p-6">
                <p className="mb-3">
                  <strong className="text-cyan-400">Dream:</strong> 
                  <span className="ml-2 text-white">Dream ID {bounty.dreamId}</span>
                </p>
                
                <p className="mb-3">
                  <strong className="text-yellow-400">Reward:</strong> 
                  <span className="ml-2 text-white">{bounty.amount} ${bounty.token}</span>
                  {bounty.hiddenBonus && (
                    <span className="ml-2 text-purple-400 text-xs">🎁 Hidden Bonus</span>
                  )}
                </p>
                
                <p className="mb-4">
                  <strong className="text-orange-400">Expires:</strong> 
                  <span className="ml-2 text-white">{formatExpiry(bounty.expires)}</span>
                </p>
                
                <button
                  onClick={() => claimBountyMutation.mutate(bounty.dreamId)}
                  disabled={claimBountyMutation.isPending}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  {claimBountyMutation.isPending ? 'Claiming...' : 'Claim This Bounty'}
                </button>

                {bounty.bountyId && (
                  <div className="mt-3 text-xs text-gray-400">
                    Bounty ID: {bounty.bountyId}
                  </div>
                )}
              </div>
            ))}

            {activeBounties.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg">No active bounties available</div>
                <div className="text-gray-500 text-sm mt-2">Check back later for new opportunities</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .bounty-feed {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .bounty-card {
          border: 1px solid #374151;
          border-radius: 12px;
          padding: 24px;
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .bounty-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(6, 182, 212, 0.1);
          border-color: #06b6d4;
        }
        
        .bounty-card p {
          margin-bottom: 12px;
          font-size: 16px;
          line-height: 1.5;
        }
        
        .bounty-card strong {
          font-weight: 600;
        }
        
        .bounty-card button {
          font-size: 16px;
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        
        .bounty-card button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
        }
      `}</style>
    </div>
  );
}