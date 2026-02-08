import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface VaultItem {
  id: string;
  name: string;
  type: 'powerup' | 'tool' | 'key' | 'material';
  description: string;
  effects?: string[];
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Badge {
  id: string;
  name: string;
  description: string;
  earnedBy: string;
  icon: string;
  timestamp: number;
}

interface DreamVaultProps {
  walletAddress?: string;
  className?: string;
}

const rarityColors = {
  common: 'border-gray-500 text-gray-300',
  rare: 'border-blue-500 text-blue-300',
  epic: 'border-purple-500 text-purple-300',
  legendary: 'border-gold-500 text-gold-300'
};

export default function DreamVault({ walletAddress, className = "" }: DreamVaultProps) {
  const [activeTab, setActiveTab] = useState<'items' | 'badges' | 'titles' | 'fusion'>('items');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [fusionResult, setFusionResult] = useState<any>(null);
  const [showTitleSelector, setShowTitleSelector] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vaultData } = useQuery({
    queryKey: ['/api/vault', walletAddress],
    queryFn: async () => {
      const response = await fetch(`/api/vault?wallet=${walletAddress}`);
      return response.json();
    },
    enabled: !!walletAddress
  });

  const fusionMutation = useMutation({
    mutationFn: async (fusionData: any) => {
      return apiRequest('/api/vault/fuse-items', {
        method: 'POST',
        body: JSON.stringify(fusionData)
      });
    },
    onSuccess: (result) => {
      setFusionResult(result.fusionResult);
      toast({
        title: "Fusion Successful!",
        description: `Created ${result.fusionResult.name} with enhanced effects!`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/vault'] });
      setSelectedItems([]);
    },
    onError: (error: any) => {
      toast({
        title: "Fusion Failed",
        description: error.message || "Unable to fuse items.",
        variant: "destructive"
      });
    }
  });

  const changeTitleMutation = useMutation({
    mutationFn: async (titleData: any) => {
      return apiRequest('/api/vault/change-title', {
        method: 'POST',
        body: JSON.stringify(titleData)
      });
    },
    onSuccess: () => {
      toast({
        title: "Title Changed!",
        description: "Your active title has been updated.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/vault'] });
      setShowTitleSelector(false);
    }
  });

  const handleFusion = () => {
    if (selectedItems.length !== 2) {
      toast({
        title: "Select Two Items",
        description: "Choose exactly 2 items to fuse together.",
        variant: "destructive"
      });
      return;
    }

    const fusionData = {
      wallet: walletAddress,
      items: selectedItems
    };

    fusionMutation.mutate(fusionData);
  };

  const handleItemSelect = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    } else if (selectedItems.length < 2) {
      setSelectedItems(prev => [...prev, itemId]);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    changeTitleMutation.mutate({
      wallet: walletAddress,
      newTitle
    });
  };

  if (!walletAddress) {
    return (
      <div className={`dream-vault bg-gray-900/80 border border-gray-600 rounded-lg p-6 ${className}`}>
        <div className="text-center text-gray-400">
          Connect your wallet to access your Dream Vault
        </div>
      </div>
    );
  }

  return (
    <div className={`dream-vault bg-gradient-to-br from-gray-900/90 to-black/90 border border-cyan-500 rounded-lg p-6 ${className}`}>
      <style>{`
        .dream-vault {
          box-shadow: 0 0 25px rgba(6, 182, 212, 0.3);
        }
        .vault-tab {
          transition: all 0.3s ease;
        }
        .vault-tab.active {
          background: rgba(6, 182, 212, 0.3);
          border-color: #06b6d4;
          color: white;
        }
        .item-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .item-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        .item-card.selected {
          background: rgba(6, 182, 212, 0.2);
          border-color: #06b6d4;
        }
        .fusion-button {
          background: linear-gradient(45deg, #8b5cf6, #06b6d4);
          transition: all 0.3s ease;
        }
        .fusion-button:hover:not(:disabled) {
          background: linear-gradient(45deg, #7c3aed, #0891b2);
          transform: translateY(-1px);
        }
        .badge-card {
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid #fbbf2440;
          transition: all 0.3s ease;
        }
        .badge-card:hover {
          border-color: #fbbf24;
          background: rgba(0, 0, 0, 0.8);
        }
      `}</style>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">🔐 My Dream Vault</h2>
        
        <div className="flex gap-2 mb-4">
          {[
            { id: 'items', label: 'Mystery Items', icon: '🎁' },
            { id: 'badges', label: 'Badges', icon: '🏅' },
            { id: 'titles', label: 'Titles', icon: '👑' },
            { id: 'fusion', label: 'Fusion Lab', icon: '🧪' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`vault-tab px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'active' 
                  : 'border-gray-600 text-gray-400 hover:text-white hover:border-gray-500'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'items' && (
        <section className="vault-items">
          <h3 className="text-lg font-semibold text-cyan-300 mb-4">🎁 Mystery Items</h3>
          
          {vaultData?.items?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vaultData.items.map((item: VaultItem) => (
                <div
                  key={item.id}
                  className={`item-card p-4 rounded-lg border-2 bg-black/50 ${rarityColors[item.rarity]}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                      {item.effects && (
                        <ul className="space-y-1">
                          {item.effects.map((effect, idx) => (
                            <li key={idx} className="text-xs text-green-400">
                              • {effect}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No mystery items in your vault yet. Complete challenges to earn items!
            </div>
          )}
        </section>
      )}

      {activeTab === 'badges' && (
        <section className="vault-badges">
          <h3 className="text-lg font-semibold text-cyan-300 mb-4">🏅 Badges</h3>
          
          {vaultData?.badges?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {vaultData.badges.map((badge: Badge) => (
                <div key={badge.id} className="badge-card p-4 rounded-lg text-center">
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <h4 className="font-semibold text-white text-sm">{badge.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{badge.earnedBy}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No badges earned yet. Participate in the dream network to earn badges!
            </div>
          )}
        </section>
      )}

      {activeTab === 'titles' && (
        <section className="vault-titles">
          <h3 className="text-lg font-semibold text-cyan-300 mb-4">👑 Titles</h3>
          
          <div className="p-4 bg-black/50 rounded-lg border border-gray-700 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-400">Active Title:</span>
                <span className="text-gold-400 font-bold ml-2">
                  {vaultData?.activeTitle || 'None'}
                </span>
              </div>
              <button
                onClick={() => setShowTitleSelector(!showTitleSelector)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white text-sm transition-colors"
              >
                Change Title
              </button>
            </div>
          </div>

          {showTitleSelector && vaultData?.titles && (
            <div className="space-y-2">
              {vaultData.titles.map((title: string) => (
                <button
                  key={title}
                  onClick={() => handleTitleChange(title)}
                  disabled={title === vaultData.activeTitle}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    title === vaultData.activeTitle
                      ? 'border-gold-500 bg-gold-500/20 text-gold-300'
                      : 'border-gray-600 bg-black/30 text-white hover:border-gray-500'
                  }`}
                >
                  {title}
                  {title === vaultData.activeTitle && (
                    <span className="float-right text-gold-400">✓ Active</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'fusion' && (
        <section className="vault-fusion">
          <h3 className="text-lg font-semibold text-cyan-300 mb-4">🧪 Item Fusion Lab</h3>
          
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              Select exactly 2 items to fuse them into a more powerful creation.
            </p>
            
            {vaultData?.items?.length >= 2 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vaultData.items.map((item: VaultItem) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemSelect(item.id)}
                    className={`item-card p-3 rounded-lg border-2 bg-black/50 ${
                      selectedItems.includes(item.id) ? 'selected' : 'border-gray-600'
                    } ${rarityColors[item.rarity]}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-400">{item.type}</p>
                      </div>
                      {selectedItems.includes(item.id) && (
                        <div className="ml-auto w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                You need at least 2 items to perform fusion.
              </div>
            )}

            {selectedItems.length === 2 && (
              <button
                onClick={handleFusion}
                disabled={fusionMutation.isPending}
                className="fusion-button w-full py-3 px-6 rounded-lg text-white font-bold"
              >
                {fusionMutation.isPending ? 'Fusing...' : '🔬 Fuse Items'}
              </button>
            )}

            {fusionResult && (
              <div className="p-4 bg-gradient-to-r from-purple-900/50 to-cyan-900/50 rounded-lg border border-purple-500">
                <h4 className="text-purple-300 font-bold mb-2">✨ Fusion Success!</h4>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌟</span>
                  <div>
                    <div className="text-white font-semibold">{fusionResult.name}</div>
                    <div className="text-sm text-gray-400">Type: {fusionResult.type}</div>
                    {fusionResult.effects && (
                      <div className="text-sm text-green-400 mt-1">
                        Effects: {fusionResult.effects.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}