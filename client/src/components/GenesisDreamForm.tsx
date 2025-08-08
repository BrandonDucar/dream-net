import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface GenesisDreamFormProps {
  walletAddress?: string;
  onDreamCreated?: (dreamId: string) => void;
  className?: string;
}

const cloudOptions = [
  { value: 'defi', label: '🌊 DeFi', description: 'Decentralized Finance innovations' },
  { value: 'gaming', label: '🎮 Gaming', description: 'Web3 gaming experiences' },
  { value: 'zksync', label: '🛡️ ZK Security', description: 'Zero-knowledge proofs and privacy' },
  { value: 'desci', label: '🧬 DeSci', description: 'Decentralized science research' },
  { value: 'memes', label: '🔥 Meme', description: 'Viral content and culture' },
  { value: 'ai', label: '🤖 AI', description: 'Artificial intelligence tools' },
  { value: 'tools', label: '🔧 Tools', description: 'Developer utilities' },
  { value: 'social', label: '👥 Social', description: 'Community platforms' },
  { value: 'art', label: '🎨 Art', description: 'Creative expressions' }
];

export default function GenesisDreamForm({ walletAddress, onDreamCreated, className = "" }: GenesisDreamFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cloud: 'defi',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createDreamMutation = useMutation({
    mutationFn: async (dreamData: any) => {
      return apiRequest('/api/dreams', {
        method: 'POST',
        body: JSON.stringify(dreamData)
      });
    },
    onSuccess: (result) => {
      toast({
        title: "Dream Spawned!",
        description: `Your dream "${formData.title}" has been created in the ${formData.cloud} cloud.`,
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        cloud: 'defi',
        tags: ''
      });
      
      // Invalidate dreams cache
      queryClient.invalidateQueries({ queryKey: ['/api/dreams'] });
      
      // Callback for parent component
      if (onDreamCreated && result.dream?.id) {
        onDreamCreated(result.dream.id);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Dream Creation Failed",
        description: error.message || "Unable to create dream right now.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create dreams.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and description for your dream.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    const dreamData = {
      name: formData.title.trim(),
      title: formData.title.trim(), // Legacy compatibility
      description: formData.description.trim(),
      creator: walletAddress,
      wallet: walletAddress, // Legacy compatibility
      dreamCloud: formData.cloud,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      coreType: 'Vision', // Default for new dreams
      status: 'Draft',
      evolved: false,
      xp: 0,
      level: 1,
      remixCount: 0,
      fusionCount: 0,
      blessCount: 0,
      nightmareEscapes: 0,
      blessings: []
    };

    createDreamMutation.mutate(dreamData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedCloud = cloudOptions.find(cloud => cloud.value === formData.cloud);

  return (
    <div className={`genesis-dream-container bg-gray-900 border border-cyan-500 rounded-lg p-6 ${className}`}>
      <style>{`
        .genesis-dream-container {
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
        }
        .dream-input {
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid #374151;
          transition: all 0.3s ease;
        }
        .dream-input:focus {
          border-color: #06b6d4;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
          outline: none;
        }
        .cloud-selector {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid #374151;
        }
        .spawn-button {
          background: linear-gradient(45deg, #06b6d4, #3b82f6);
          transition: all 0.3s ease;
        }
        .spawn-button:hover:not(:disabled) {
          background: linear-gradient(45deg, #0891b2, #2563eb);
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);
        }
        .spawn-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">✨ Genesis Dream Creation</h2>
        <p className="text-gray-400 text-sm">
          Manifest your vision into the dream network. Choose your cloud wisely.
        </p>
      </div>

      <form id="genesis-dream-form" onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-cyan-300 font-semibold mb-2">Dream Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="What is your dream called?"
            required
            maxLength={100}
            className="dream-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-500"
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.title.length}/100 characters
          </div>
        </div>

        <div>
          <label className="block text-cyan-300 font-semibold mb-2">Vision Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your vision in detail..."
            required
            rows={4}
            maxLength={500}
            className="dream-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 resize-none"
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.description.length}/500 characters
          </div>
        </div>

        <div>
          <label className="block text-cyan-300 font-semibold mb-2">Dream Cloud</label>
          <select
            name="cloud"
            value={formData.cloud}
            onChange={(e) => handleInputChange('cloud', e.target.value)}
            className="cloud-selector w-full px-4 py-3 rounded-lg text-white"
          >
            {cloudOptions.map(cloud => (
              <option key={cloud.value} value={cloud.value}>
                {cloud.label}
              </option>
            ))}
          </select>
          {selectedCloud && (
            <div className="text-xs text-gray-400 mt-1">
              {selectedCloud.description}
            </div>
          )}
        </div>

        <div>
          <label className="block text-cyan-300 font-semibold mb-2">Tags (Optional)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            placeholder="ai, defi, gaming (comma separated)"
            className="dream-input w-full px-4 py-3 rounded-lg text-white placeholder-gray-500"
          />
          <div className="text-xs text-gray-500 mt-1">
            Separate multiple tags with commas
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !walletAddress}
            className="spawn-button w-full py-4 px-6 rounded-lg text-white font-bold text-lg"
          >
            {isSubmitting ? 'Spawning Dream...' : 'Spawn Dream'}
          </button>
          
          {!walletAddress && (
            <p className="text-red-400 text-sm mt-2 text-center">
              Connect your wallet to spawn dreams
            </p>
          )}
        </div>
      </form>

      <div className="mt-6 p-4 bg-black/50 rounded-lg border border-gray-700">
        <h4 className="text-purple-300 font-semibold mb-2">Dream Genesis Info</h4>
        <ul className="space-y-1 text-xs text-gray-400">
          <li>• New dreams start at Level 1 with 0 XP</li>
          <li>• Reach Level 3 to trigger evolution</li>
          <li>• Blessings from the community grant XP</li>
          <li>• Inactive dreams may become nightmares</li>
        </ul>
      </div>
    </div>
  );
}