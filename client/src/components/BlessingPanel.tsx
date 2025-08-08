import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Blessing {
  wallet: string;
  message: string;
  amount: number;
  timestamp: number;
}

interface BlessingPanelProps {
  dreamId: string;
  walletAddress?: string;
  className?: string;
}

export default function BlessingPanel({ dreamId, walletAddress, className = "" }: BlessingPanelProps) {
  const [message, setMessage] = useState('');
  const [showBlessings, setShowBlessings] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: blessings = [] } = useQuery({
    queryKey: ['/api/dreams', dreamId, 'blessings'],
    queryFn: async (): Promise<Blessing[]> => {
      const response = await fetch(`/api/dreams/${dreamId}/blessings`);
      return response.json();
    }
  });

  const blessMutation = useMutation({
    mutationFn: async ({ message, amount }: { message: string; amount: number }) => {
      return apiRequest(`/api/dreams/${dreamId}/bless`, {
        method: 'POST',
        body: JSON.stringify({ 
          wallet: walletAddress,
          message: message.trim() || "Blessed with positive energy ✨",
          amount 
        })
      });
    },
    onSuccess: () => {
      toast({
        title: "Dream Blessed!",
        description: "Your blessing has been added to this dream.",
      });
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['/api/dreams', dreamId, 'blessings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dreams'] });
    },
    onError: (error: any) => {
      toast({
        title: "Blessing Failed",
        description: error.message || "Unable to bless this dream right now.",
        variant: "destructive"
      });
    }
  });

  const handleBless = () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to bless dreams.",
        variant: "destructive"
      });
      return;
    }
    blessMutation.mutate({ message, amount: 1 });
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const truncateWallet = (wallet: string) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  return (
    <div className={`blessing-container ${className}`}>
      <section className="blessing-panel bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500 rounded-lg p-6">
        <h3 className="text-xl font-bold text-purple-300 mb-4">🕊️ Bless This Dream</h3>
        
        <div className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a note of hope..."
            className="w-full h-20 bg-black border border-purple-600 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400"
            maxLength={200}
          />
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {message.length}/200 characters
            </span>
            <button
              onClick={handleBless}
              disabled={blessMutation.isPending || !walletAddress}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {blessMutation.isPending ? 'Blessing...' : 'Bless with 1 SHEEP'}
            </button>
          </div>
        </div>
      </section>

      <div className="dream-bless-stats mt-4 flex items-center justify-between bg-black border border-gray-700 rounded-lg p-4">
        <span className="text-pink-400 font-semibold">
          ❤️ {blessings.length} Blessing{blessings.length !== 1 ? 's' : ''}
        </span>
        
        {blessings.length > 0 && (
          <button
            onClick={() => setShowBlessings(!showBlessings)}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
          >
            {showBlessings ? 'Hide' : 'View All'}
          </button>
        )}
      </div>

      {showBlessings && blessings.length > 0 && (
        <div className="bless-display mt-4 bg-black border border-purple-600 rounded-lg p-4">
          <h4 className="text-purple-300 font-semibold mb-3">Recent Blessings</h4>
          <ul className="bless-list space-y-3 max-h-64 overflow-y-auto">
            {blessings
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((blessing, index) => (
                <li 
                  key={`${blessing.wallet}-${blessing.timestamp}-${index}`}
                  className="flex items-start gap-3 p-3 bg-purple-900/20 rounded-lg border border-purple-800"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-purple-300 text-sm font-mono">
                        {truncateWallet(blessing.wallet)}
                      </strong>
                      <span className="text-gold-400 text-xs font-semibold">
                        ({blessing.amount} SHEEP)
                      </span>
                      <span className="text-gray-500 text-xs">
                        {formatTimeAgo(blessing.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm italic">
                      "{blessing.message}"
                    </p>
                  </div>
                </li>
              ))}
          </ul>
          
          {blessings.length > 5 && (
            <div className="mt-3 text-center">
              <span className="text-xs text-gray-400">
                Showing {Math.min(blessings.length, 10)} of {blessings.length} blessings
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}