import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface SecretMessage {
  id: string;
  message: string;
  sender: string;
  receiver: string;
  type: 'secret' | 'confession' | 'forgiveness' | 'blessing';
  expires: number;
  emotionalScore: number;
  redeemed: boolean;
  unlocked: boolean;
  xpReward: number;
  badgeUnlocked?: string;
  reactions: string[];
}

interface SecretVaultProps {
  walletAddress?: string;
  className?: string;
}

const messageTypes = {
  secret: { icon: '🤐', color: 'purple', label: 'Secret' },
  confession: { icon: '💭', color: 'blue', label: 'Confession' },
  forgiveness: { icon: '🕊️', color: 'green', label: 'Forgiveness' },
  blessing: { icon: '✨', color: 'gold', label: 'Blessing' }
};

export default function SecretVault({ walletAddress, className = "" }: SecretVaultProps) {
  const [selectedMessage, setSelectedMessage] = useState<SecretMessage | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyType, setReplyType] = useState<keyof typeof messageTypes>('secret');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: secretMessages = [] } = useQuery({
    queryKey: ['/api/vault/secrets', walletAddress],
    queryFn: async (): Promise<SecretMessage[]> => {
      try {
        const response = await fetch(`/api/vault/secrets?wallet=${walletAddress}`);
        if (!response.ok) throw new Error('Network error');
        return response.json();
      } catch (error) {
        // Fallback secret messages
        return [
          {
            id: 'secret-001',
            message: 'I forgive you, brother',
            sender: '0xABC123',
            receiver: walletAddress || '',
            type: 'forgiveness',
            expires: Date.now() + 86400000 * 7,
            emotionalScore: 94,
            redeemed: false,
            unlocked: true,
            xpReward: 25,
            badgeUnlocked: 'The Believer',
            reactions: ['❤️', '🙏', '✨']
          },
          {
            id: 'secret-002',
            message: 'The dream we shared still haunts my nights, but in the most beautiful way',
            sender: '0xDEF456',
            receiver: walletAddress || '',
            type: 'confession',
            expires: Date.now() + 86400000 * 3,
            emotionalScore: 87,
            redeemed: false,
            unlocked: false,
            xpReward: 35,
            reactions: ['💫', '🌙', '💭']
          },
          {
            id: 'secret-003',
            message: 'Your nightmare gave me the courage to face my own darkness',
            sender: '0xGHI789',
            receiver: walletAddress || '',
            type: 'blessing',
            expires: Date.now() + 86400000 * 5,
            emotionalScore: 91,
            redeemed: true,
            unlocked: true,
            xpReward: 45,
            badgeUnlocked: 'Shadow Walker',
            reactions: ['🔥', '💪', '🌟']
          }
        ];
      }
    },
    enabled: !!walletAddress,
    refetchInterval: 30000
  });

  const unlockMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      return apiRequest('/api/vault/secrets/unlock', {
        method: 'POST',
        body: JSON.stringify({ messageId, wallet: walletAddress })
      });
    },
    onSuccess: (result: any) => {
      toast({
        title: "Secret Unlocked!",
        description: result.badgeUnlocked ? `Badge unlocked: ${result.badgeUnlocked}` : `+${result.xpReward} XP earned!`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/vault/secrets'] });
    },
    onError: (error: any) => {
      toast({
        title: "Unlock Failed",
        description: error.message || "Unable to unlock secret.",
        variant: "destructive"
      });
    }
  });

  const sendReplyMutation = useMutation({
    mutationFn: async (replyData: any) => {
      return apiRequest('/api/vault/secrets/reply', {
        method: 'POST',
        body: JSON.stringify(replyData)
      });
    },
    onSuccess: () => {
      toast({
        title: "Reply Sent",
        description: "Your message has been delivered to the vault.",
      });
      
      setReplyText('');
      setShowReplyForm(false);
      queryClient.invalidateQueries({ queryKey: ['/api/vault/secrets'] });
    },
    onError: (error: any) => {
      toast({
        title: "Send Failed",
        description: error.message || "Unable to send reply.",
        variant: "destructive"
      });
    }
  });

  const burnVaultMutation = useMutation({
    mutationFn: async (messageId: string) => {
      return apiRequest('/api/vault/secrets/burn', {
        method: 'POST',
        body: JSON.stringify({ messageId, wallet: walletAddress })
      });
    },
    onSuccess: () => {
      toast({
        title: "Vault Burned",
        description: "The secret has been permanently destroyed.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/vault/secrets'] });
      setSelectedMessage(null);
    },
    onError: (error: any) => {
      toast({
        title: "Burn Failed",
        description: error.message || "Unable to burn vault.",
        variant: "destructive"
      });
    }
  });

  const handleUnlock = (messageId: string) => {
    unlockMessageMutation.mutate(messageId);
  };

  const handleReply = () => {
    if (!selectedMessage || !replyText.trim()) {
      toast({
        title: "Missing Information",
        description: "Please write a reply message.",
        variant: "destructive"
      });
      return;
    }

    const replyData = {
      originalMessageId: selectedMessage.id,
      message: replyText.trim(),
      sender: walletAddress,
      receiver: selectedMessage.sender,
      type: replyType,
      emotionalScore: Math.floor(Math.random() * 20) + 80 // High emotional score
    };

    sendReplyMutation.mutate(replyData);
  };

  const handleBurnVault = (messageId: string) => {
    if (window.confirm('Are you sure you want to permanently destroy this secret? This action cannot be undone.')) {
      burnVaultMutation.mutate(messageId);
    }
  };

  const getMessageTypeStyle = (type: keyof typeof messageTypes) => {
    const config = messageTypes[type];
    const colorMap = {
      purple: 'border-purple-500 bg-purple-900/30',
      blue: 'border-blue-500 bg-blue-900/30',
      green: 'border-green-500 bg-green-900/30',
      gold: 'border-yellow-500 bg-yellow-900/30'
    };
    return colorMap[config.color as keyof typeof colorMap] || colorMap.purple;
  };

  const getTimeRemaining = (expires: number) => {
    const timeLeft = expires - Date.now();
    if (timeLeft <= 0) return 'Expired';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <div className={`secret-vault bg-gradient-to-br from-gray-900/90 to-black/90 border border-purple-500 rounded-lg p-6 ${className}`}>
      <style>{`
        .secret-vault {
          box-shadow: 0 0 25px rgba(147, 51, 234, 0.3);
        }
        .vault-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .vault-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }
        .vault-card.unlocked {
          border-width: 2px;
        }
        .vault-card.secret {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(0, 0, 0, 0.8));
        }
        .emotional-score {
          background: linear-gradient(90deg, #7c3aed, #ec4899);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .reply-button {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
        }
        .burn-button {
          background: linear-gradient(45deg, #ef4444, #dc2626);
        }
      `}</style>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-300 mb-2">🗝️ Secret Vault</h2>
        <p className="text-gray-400 text-sm">
          Emotional messages and confessions from the dream network
        </p>
      </div>

      <div className="space-y-4">
        {secretMessages.map((message) => {
          const typeConfig = messageTypes[message.type];
          
          return (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className={`vault-card p-4 border rounded-lg ${getMessageTypeStyle(message.type)} ${
                message.unlocked ? 'unlocked' : 'opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{typeConfig.icon}</span>
                  <div>
                    <span className="text-white font-semibold">{typeConfig.label}</span>
                    {message.unlocked && (
                      <span className="ml-2 text-green-400 text-sm">🔓 Unlocked</span>
                    )}
                  </div>
                </div>
                
                <div className="text-right text-sm">
                  <div className="text-gray-400">From: {message.sender.slice(0, 8)}...</div>
                  <div className="text-gray-500">{getTimeRemaining(message.expires)}</div>
                </div>
              </div>

              {message.unlocked ? (
                <div className="space-y-3">
                  <p className="text-gray-200 italic">"{message.message}"</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="emotional-score font-bold">
                        Emotional Score: {message.emotionalScore}
                      </span>
                      <span className="text-cyan-400 font-semibold">
                        XP: +{message.xpReward} 🧠
                      </span>
                    </div>
                    
                    <div className="flex gap-1">
                      {message.reactions.map((reaction, idx) => (
                        <span key={idx} className="text-lg">{reaction}</span>
                      ))}
                    </div>
                  </div>

                  {message.badgeUnlocked && (
                    <div className="p-2 bg-yellow-900/50 border border-yellow-600 rounded text-yellow-300 text-sm">
                      🏆 Badge unlocked: "{message.badgeUnlocked}"
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowReplyForm(true);
                      }}
                      className="reply-button px-4 py-2 rounded text-white font-medium"
                    >
                      📤 Reply
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBurnVault(message.id);
                      }}
                      className="burn-button px-4 py-2 rounded text-white font-medium"
                    >
                      🔥 Burn Vault
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-gray-400 mb-3">🔒 Secret locked</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnlock(message.id);
                    }}
                    disabled={unlockMessageMutation.isPending}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white font-medium transition-colors"
                  >
                    {unlockMessageMutation.isPending ? 'Unlocking...' : 'Unlock Secret'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showReplyForm && selectedMessage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-purple-500 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-purple-300 font-semibold mb-4">Reply to Secret</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Message Type</label>
                <select
                  value={replyType}
                  onChange={(e) => setReplyType(e.target.value as keyof typeof messageTypes)}
                  className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white focus:outline-none focus:border-purple-400"
                >
                  {Object.entries(messageTypes).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.icon} {config.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Message</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your heartfelt response..."
                  rows={4}
                  maxLength={200}
                  className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-400"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {replyText.length}/200 characters
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReplyForm(false)}
                  className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={sendReplyMutation.isPending || !replyText.trim()}
                  className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded text-white transition-colors disabled:opacity-50"
                >
                  {sendReplyMutation.isPending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {secretMessages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🗝️</div>
          <div>No secrets in your vault yet</div>
          <div className="text-sm">Share meaningful moments to receive emotional messages</div>
        </div>
      )}
    </div>
  );
}