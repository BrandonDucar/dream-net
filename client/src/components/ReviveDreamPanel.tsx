import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ReviveDreamPanelProps {
  dreamId: string;
  dreamTitle: string;
  bountyAmount: number;
  bountyToken: string;
  walletAddress?: string;
  onReviveSuccess?: () => void;
  className?: string;
}

export default function ReviveDreamPanel({ 
  dreamId, 
  dreamTitle, 
  bountyAmount, 
  bountyToken,
  walletAddress,
  onReviveSuccess,
  className = "" 
}: ReviveDreamPanelProps) {
  const [reviveMethod, setReviveMethod] = useState<'blessing' | 'community' | 'evolution'>('blessing');
  const [reviveMessage, setReviveMessage] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reviveMutation = useMutation({
    mutationFn: async (reviveData: any) => {
      return apiRequest(`/api/dreams/${dreamId}/revive`, {
        method: 'POST',
        body: JSON.stringify(reviveData)
      });
    },
    onSuccess: (result) => {
      toast({
        title: "Dream Revived!",
        description: `"${dreamTitle}" has been saved from nightmare status. You earned ${bountyAmount} ${bountyToken}!`,
      });
      
      setReviveMessage('');
      queryClient.invalidateQueries({ queryKey: ['/api/dreams'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dreams', dreamId] });
      
      if (onReviveSuccess) {
        onReviveSuccess();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Revival Failed",
        description: error.message || "Unable to revive this dream right now.",
        variant: "destructive"
      });
    }
  });

  const handleRevive = () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to revive dreams.",
        variant: "destructive"
      });
      return;
    }

    const reviveData = {
      wallet: walletAddress,
      method: reviveMethod,
      message: reviveMessage || "Bringing this dream back to life ✨",
      bountyAmount,
      bountyToken
    };

    reviveMutation.mutate(reviveData);
  };

  const reviveMethods = [
    {
      id: 'blessing',
      name: 'Blessing Revival',
      description: 'Channel positive energy to restore the dream',
      cost: '1 SHEEP + gas',
      effectiveness: '85%',
      icon: '🕊️'
    },
    {
      id: 'community',
      name: 'Community Intervention',
      description: 'Rally others to collectively revive the dream',
      cost: 'Social coordination',
      effectiveness: '95%',
      icon: '👥'
    },
    {
      id: 'evolution',
      name: 'Forced Evolution',
      description: 'Transform the nightmare into a new evolution',
      cost: '5 SHEEP + catalyst',
      effectiveness: '100%',
      icon: '🔄'
    }
  ];

  const selectedMethod = reviveMethods.find(m => m.id === reviveMethod);

  return (
    <div className={`revive-dream-panel bg-gradient-to-br from-purple-900/30 to-green-900/30 border border-purple-500 rounded-lg p-6 ${className}`}>
      <style>{`
        .revive-dream-panel {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
        }
        .method-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .method-card:hover {
          background: rgba(147, 51, 234, 0.1);
          border-color: #8b5cf6;
        }
        .method-card.selected {
          background: rgba(147, 51, 234, 0.2);
          border-color: #a855f7;
          box-shadow: 0 0 15px rgba(147, 51, 234, 0.4);
        }
        .revive-button {
          background: linear-gradient(45deg, #10b981, #059669);
          transition: all 0.3s ease;
        }
        .revive-button:hover:not(:disabled) {
          background: linear-gradient(45deg, #059669, #047857);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        }
      `}</style>
      
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-purple-300 mb-2">
          🌟 Revive "{dreamTitle}"
        </h3>
        <p className="text-gray-400 text-sm">
          This dream has fallen into nightmare status. Choose your revival method to claim the bounty.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <h4 className="text-purple-300 font-semibold">Revival Methods</h4>
        {reviveMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => setReviveMethod(method.id as any)}
            className={`method-card p-4 border rounded-lg ${
              reviveMethod === method.id ? 'selected' : 'border-gray-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{method.icon}</span>
              <div className="flex-1">
                <h5 className="text-white font-semibold">{method.name}</h5>
                <p className="text-gray-400 text-sm mb-2">{method.description}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-cyan-400">Cost: {method.cost}</span>
                  <span className="text-green-400">Success: {method.effectiveness}</span>
                </div>
              </div>
              {reviveMethod === method.id && (
                <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-purple-300 font-semibold mb-2">Revival Message</label>
        <textarea
          value={reviveMessage}
          onChange={(e) => setReviveMessage(e.target.value)}
          placeholder="Share your intention for reviving this dream..."
          rows={3}
          maxLength={200}
          className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-400"
        />
        <div className="text-xs text-gray-500 mt-1">
          {reviveMessage.length}/200 characters
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-purple-400 hover:text-purple-300 text-sm underline transition-colors"
        >
          {showDetails ? 'Hide Revival Details' : 'Show Revival Process'}
        </button>
        
        <div className="text-right">
          <div className="text-gold-400 font-bold">
            Bounty: {bountyAmount} {bountyToken}
          </div>
          <div className="text-xs text-gray-400">
            Plus revival bonus XP
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mb-6 p-4 bg-black/50 rounded-lg border border-purple-700">
          <h4 className="text-purple-300 font-semibold mb-2">Revival Process</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p><strong>Selected Method:</strong> {selectedMethod?.name}</p>
            <p><strong>Process:</strong> {selectedMethod?.description}</p>
            <p><strong>Required Cost:</strong> {selectedMethod?.cost}</p>
            <p><strong>Success Rate:</strong> {selectedMethod?.effectiveness}</p>
          </div>
          
          <div className="mt-3 p-3 bg-green-900/30 rounded border border-green-700">
            <p className="text-xs text-green-200">
              <strong>Revival Bonus:</strong> Successfully reviving nightmares grants additional XP, 
              potential evolution catalysts, and community reputation points.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={handleRevive}
        disabled={reviveMutation.isPending || !walletAddress}
        className="revive-button w-full py-4 px-6 rounded-lg text-white font-bold text-lg"
      >
        {reviveMutation.isPending ? 'Reviving Dream...' : 'Revive and Claim Bounty'}
      </button>
      
      {!walletAddress && (
        <p className="text-red-400 text-sm mt-2 text-center">
          Connect your wallet to revive dreams
        </p>
      )}
    </div>
  );
}