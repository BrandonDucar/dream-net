import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface DreamArchitectWorkshopProps {
  walletAddress?: string;
  className?: string;
}

const creationTypes = [
  { value: 'edict', label: 'Edict', description: 'Command dreams with missions and rewards', icon: '📜' },
  { value: 'challenge', label: 'Challenge', description: 'Create bounty-based objectives', icon: '🎯' },
  { value: 'miniapp', label: 'Mini-App', description: 'Build tools for the dream network', icon: '⚙️' },
  { value: 'upgrade', label: 'Upgrade', description: 'Enhance existing dream mechanics', icon: '⚡' }
];

export default function DreamArchitectWorkshop({ walletAddress, className = "" }: DreamArchitectWorkshopProps) {
  const [formData, setFormData] = useState({
    type: 'edict',
    title: '',
    description: '',
    requiredItems: [] as string[],
    rewardAmount: '',
    rewardToken: 'SHEEP',
    expires: '',
    targetCloud: 'any'
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: availableItems = [] } = useQuery({
    queryKey: ['/api/vault/items', walletAddress],
    queryFn: async () => {
      const response = await fetch(`/api/vault/items?wallet=${walletAddress}`);
      return response.json();
    },
    enabled: !!walletAddress
  });

  const createMutation = useMutation({
    mutationFn: async (creationData: any) => {
      return apiRequest('/api/architect/create', {
        method: 'POST',
        body: JSON.stringify(creationData)
      });
    },
    onSuccess: (result) => {
      toast({
        title: "Creation Launched!",
        description: `Your ${formData.type} "${formData.title}" is now live in the dream network.`,
      });
      
      // Reset form
      setFormData({
        type: 'edict',
        title: '',
        description: '',
        requiredItems: [],
        rewardAmount: '',
        rewardToken: 'SHEEP',
        expires: '',
        targetCloud: 'any'
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/edicts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/challenges'] });
    },
    onError: (error: any) => {
      toast({
        title: "Launch Failed",
        description: error.message || "Unable to launch creation.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Connect your wallet to use the architect workshop.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and description.",
        variant: "destructive"
      });
      return;
    }

    const creationData = {
      ...formData,
      creator: walletAddress,
      createdAt: Date.now(),
      status: 'active'
    };

    createMutation.mutate(creationData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemToggle = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      requiredItems: prev.requiredItems.includes(itemId)
        ? prev.requiredItems.filter(id => id !== itemId)
        : [...prev.requiredItems, itemId]
    }));
  };

  const selectedType = creationTypes.find(t => t.value === formData.type);

  return (
    <div className={`architect-panel bg-gradient-to-br from-orange-900/40 to-yellow-900/40 border border-orange-500 rounded-lg p-6 ${className}`}>
      <style>{`
        .architect-panel {
          box-shadow: 0 0 25px rgba(249, 115, 22, 0.3);
        }
        .creation-type-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .creation-type-card:hover {
          background: rgba(249, 115, 22, 0.1);
          border-color: #f97316;
        }
        .creation-type-card.selected {
          background: rgba(249, 115, 22, 0.2);
          border-color: #fb923c;
          box-shadow: 0 0 15px rgba(249, 115, 22, 0.4);
        }
        .launch-button {
          background: linear-gradient(45deg, #f97316, #eab308);
          transition: all 0.3s ease;
        }
        .launch-button:hover:not(:disabled) {
          background: linear-gradient(45deg, #ea580c, #ca8a04);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);
        }
        .item-chip {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid #374151;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .item-chip:hover {
          border-color: #f97316;
        }
        .item-chip.selected {
          background: rgba(249, 115, 22, 0.2);
          border-color: #f97316;
        }
      `}</style>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-orange-300 mb-2">🏗️ Dream Architect Workshop</h2>
        <p className="text-gray-400 text-sm">
          Design and deploy new systems for the dream network ecosystem.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-orange-300 font-semibold mb-3">Creation Type</label>
          <div className="grid grid-cols-2 gap-3">
            {creationTypes.map((type) => (
              <div
                key={type.value}
                onClick={() => handleInputChange('type', type.value)}
                className={`creation-type-card p-4 border rounded-lg ${
                  formData.type === type.value ? 'selected' : 'border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <div className="text-white font-semibold">{type.label}</div>
                    <div className="text-gray-400 text-xs">{type.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {selectedType && (
            <div className="mt-2 text-sm text-orange-400">
              Selected: {selectedType.label} - {selectedType.description}
            </div>
          )}
        </div>

        <div>
          <label className="block text-orange-300 font-semibold mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter creation title"
            required
            maxLength={100}
            className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-400"
          />
        </div>

        <div>
          <label className="block text-orange-300 font-semibold mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your creation in detail..."
            required
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:border-orange-400"
          />
        </div>

        {(formData.type === 'edict' || formData.type === 'challenge') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-orange-300 font-semibold mb-2">Reward Amount</label>
              <input
                type="number"
                value={formData.rewardAmount}
                onChange={(e) => handleInputChange('rewardAmount', e.target.value)}
                placeholder="500"
                min="1"
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-400"
              />
            </div>
            <div>
              <label className="block text-orange-300 font-semibold mb-2">Token Type</label>
              <select
                value={formData.rewardToken}
                onChange={(e) => handleInputChange('rewardToken', e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-400"
              >
                <option value="SHEEP">SHEEP</option>
                <option value="CORE">CORE</option>
                <option value="DREAM">DREAM</option>
              </select>
            </div>
          </div>
        )}

        {formData.type === 'edict' && (
          <div>
            <label className="block text-orange-300 font-semibold mb-2">Expiration Date</label>
            <input
              type="datetime-local"
              value={formData.expires}
              onChange={(e) => handleInputChange('expires', e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-400"
            />
          </div>
        )}

        <div>
          <label className="block text-orange-300 font-semibold mb-2">Required Items (Optional)</label>
          {availableItems.length > 0 ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {availableItems.map((item: any) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemToggle(item.id)}
                    className={`item-chip px-3 py-2 rounded-lg text-sm ${
                      formData.requiredItems.includes(item.id) ? 'selected' : ''
                    }`}
                  >
                    {item.icon} {item.name}
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500">
                Click items to require them for participation
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              No items available. Complete challenges to earn items first.
            </div>
          )}
        </div>

        <div>
          <label className="block text-orange-300 font-semibold mb-2">Target Cloud</label>
          <select
            value={formData.targetCloud}
            onChange={(e) => handleInputChange('targetCloud', e.target.value)}
            className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-orange-400"
          >
            <option value="any">Any Cloud</option>
            <option value="defi">DeFi</option>
            <option value="gaming">Gaming</option>
            <option value="zk">ZK Security</option>
            <option value="desci">DeSci</option>
            <option value="meme">Meme</option>
            <option value="ai">AI</option>
            <option value="nightmare">Nightmare</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={createMutation.isPending || !walletAddress}
          className="launch-button w-full py-4 px-6 rounded-lg text-white font-bold text-lg"
        >
          {createMutation.isPending ? 'Launching...' : '🚀 Launch to Network'}
        </button>
        
        {!walletAddress && (
          <p className="text-red-400 text-sm text-center">
            Connect your wallet to use the architect workshop
          </p>
        )}
      </form>

      <div className="mt-6 p-4 bg-black/50 rounded-lg border border-gray-700">
        <h4 className="text-orange-300 font-semibold mb-2">Workshop Guidelines</h4>
        <ul className="space-y-1 text-xs text-gray-400">
          <li>• Edicts generate missions with token rewards</li>
          <li>• Challenges create bounty objectives for the community</li>
          <li>• Mini-apps extend dream network functionality</li>
          <li>• Upgrades enhance existing system mechanics</li>
        </ul>
      </div>
    </div>
  );
}