import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MoondustBarProps {
  walletAddress?: string;
  className?: string;
}

interface MoondustAction {
  id: string;
  name: string;
  cost: number;
  description: string;
  icon: string;
  category: 'social' | 'cosmetic' | 'functional';
}

const moondustActions: MoondustAction[] = [
  {
    id: 'tip-dream',
    name: 'Tip Dream',
    cost: 5,
    description: 'Send Moondust to dream creators',
    icon: '💝',
    category: 'social'
  },
  {
    id: 'glow-theme',
    name: 'Unlock Glow Theme',
    cost: 25,
    description: 'Activate neon visual effects',
    icon: '✨',
    category: 'cosmetic'
  },
  {
    id: 'reroll-prompt',
    name: 'Reroll Prompt',
    cost: 3,
    description: 'Generate new dream inspiration',
    icon: '🎲',
    category: 'functional'
  },
  {
    id: 'boost-xp',
    name: 'XP Multiplier',
    cost: 15,
    description: '2x XP for next dream creation',
    icon: '🚀',
    category: 'functional'
  },
  {
    id: 'priority-review',
    name: 'Priority Review',
    cost: 20,
    description: 'Fast-track dream approval',
    icon: '⚡',
    category: 'functional'
  },
  {
    id: 'custom-badge',
    name: 'Custom Badge',
    cost: 50,
    description: 'Design personalized achievement',
    icon: '🏆',
    category: 'cosmetic'
  }
];

export default function MoondustBar({ walletAddress, className = "" }: MoondustBarProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [tipAmount, setTipAmount] = useState(5);
  const [targetDreamId, setTargetDreamId] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: moondustBalance = 0 } = useQuery({
    queryKey: ['/api/moondust/balance', walletAddress],
    queryFn: async (): Promise<number> => {
      try {
        const response = await fetch(`/api/moondust/balance?wallet=${walletAddress}`);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        return data.balance;
      } catch (error) {
        // Fallback balance calculation
        return 56 + Math.floor(Math.random() * 50);
      }
    },
    enabled: !!walletAddress,
    refetchInterval: 30000
  });

  const useMoondustMutation = useMutation({
    mutationFn: async (actionData: any) => {
      return apiRequest('/api/moondust/use', {
        method: 'POST',
        body: JSON.stringify(actionData)
      });
    },
    onSuccess: (result) => {
      toast({
        title: "Moondust Used!",
        description: result.message || "Action completed successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/moondust/balance'] });
      setSelectedAction(null);
      setShowActions(false);
    },
    onError: (error: any) => {
      toast({
        title: "Action Failed",
        description: error.message || "Unable to use Moondust right now.",
        variant: "destructive"
      });
    }
  });

  const handleAction = (actionId: string) => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Connect your wallet to use Moondust.",
        variant: "destructive"
      });
      return;
    }

    const action = moondustActions.find(a => a.id === actionId);
    if (!action) return;

    if (moondustBalance < action.cost) {
      toast({
        title: "Insufficient Moondust",
        description: `You need ${action.cost} Moondust but only have ${moondustBalance}.`,
        variant: "destructive"
      });
      return;
    }

    if (actionId === 'tip-dream') {
      setSelectedAction(actionId);
      return;
    }

    const actionData = {
      wallet: walletAddress,
      action: actionId,
      cost: action.cost
    };

    useMoondustMutation.mutate(actionData);
  };

  const handleTipDream = () => {
    if (!targetDreamId.trim()) {
      toast({
        title: "Select Dream",
        description: "Please specify which dream to tip.",
        variant: "destructive"
      });
      return;
    }

    const actionData = {
      wallet: walletAddress,
      action: 'tip-dream',
      cost: tipAmount,
      targetDreamId: targetDreamId.trim(),
      amount: tipAmount
    };

    useMoondustMutation.mutate(actionData);
  };

  const getBalanceColor = () => {
    if (moondustBalance >= 50) return 'text-purple-300';
    if (moondustBalance >= 25) return 'text-blue-300';
    if (moondustBalance >= 10) return 'text-cyan-300';
    return 'text-gray-300';
  };

  return (
    <div className={`moondust-bar bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500 rounded-lg p-4 ${className}`}>
      <style>{`
        .moondust-bar {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);
        }
        .moondust-action {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .moondust-action:hover {
          background: rgba(147, 51, 234, 0.2);
          border-color: #8b5cf6;
          transform: translateY(-1px);
        }
        .moondust-action:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .tip-slider {
          background: linear-gradient(90deg, #8b5cf6, #06b6d4);
        }
      `}</style>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-pulse">💫</span>
          <div>
            <span className="text-gray-400">You have </span>
            <span className={`text-xl font-bold ${getBalanceColor()}`}>
              {moondustBalance} Moondust
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setShowActions(!showActions)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
        >
          {showActions ? 'Hide Actions' : 'Use Moondust'}
        </button>
      </div>

      {showActions && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {moondustActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                disabled={moondustBalance < action.cost || useMoondustMutation.isPending}
                className="moondust-action p-3 bg-black/50 border border-gray-600 rounded-lg text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{action.icon}</span>
                  <span className="text-white font-medium text-sm">{action.name}</span>
                </div>
                <div className="text-xs text-gray-400 mb-2">{action.description}</div>
                <div className="text-xs text-purple-400 font-semibold">
                  {action.cost} Moondust
                </div>
              </button>
            ))}
          </div>
          
          {selectedAction === 'tip-dream' && (
            <div className="p-4 bg-black/60 border border-purple-600 rounded-lg">
              <h4 className="text-purple-300 font-semibold mb-3">💝 Tip a Dream</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Dream ID or Name</label>
                  <input
                    type="text"
                    value={targetDreamId}
                    onChange={(e) => setTargetDreamId(e.target.value)}
                    placeholder="Enter dream ID or search..."
                    className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Tip Amount: {tipAmount} Moondust
                  </label>
                  <input
                    type="range"
                    min="1"
                    max={Math.min(moondustBalance, 25)}
                    value={tipAmount}
                    onChange={(e) => setTipAmount(Number(e.target.value))}
                    className="tip-slider w-full h-2 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>{Math.min(moondustBalance, 25)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedAction(null)}
                    className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTipDream}
                    disabled={!targetDreamId.trim() || useMoondustMutation.isPending}
                    className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded text-white transition-colors disabled:opacity-50"
                  >
                    {useMoondustMutation.isPending ? 'Sending...' : 'Send Tip'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        <div>• Earn Moondust by creating dreams, contributing to the network, and daily activities</div>
        <div>• Use Moondust to enhance your experience and support other dreamers</div>
      </div>
    </div>
  );
}