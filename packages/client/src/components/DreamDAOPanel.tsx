import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface DAOProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  category: 'feature' | 'economic' | 'governance' | 'integration';
  status: 'voting' | 'pending' | 'approved' | 'rejected';
  votesYes: number;
  votesNo: number;
  totalVotes: number;
  deadline: number;
  requiredQuorum: number;
}

interface DreamDAOPanelProps {
  walletAddress?: string;
  className?: string;
}

export default function DreamDAOPanel({ walletAddress, className = "" }: DreamDAOPanelProps) {
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'feature'
  });
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: proposals = [] } = useQuery({
    queryKey: ['/api/dao/proposals'],
    queryFn: async (): Promise<DAOProposal[]> => {
      try {
        const response = await fetch('/api/dao/proposals');
        if (!response.ok) throw new Error('Network error');
        return response.json();
      } catch (error) {
        // Fallback DAO proposals
        return [
          {
            id: 'prop-001',
            title: 'Add Remix Chain XP Boost',
            description: 'Implement XP multipliers for dreams that spawn successful remix chains',
            proposer: '0xDAO1',
            category: 'economic',
            status: 'voting',
            votesYes: 54,
            votesNo: 46,
            totalVotes: 100,
            deadline: Date.now() + 86400000 * 3, // 3 days
            requiredQuorum: 75
          },
          {
            id: 'prop-002',
            title: 'Open New Dream Cloud: Reality Hacking',
            description: 'Create a specialized cloud for AR/VR and metaverse-related dreams',
            proposer: '0xDAO2',
            category: 'feature',
            status: 'pending',
            votesYes: 0,
            votesNo: 0,
            totalVotes: 0,
            deadline: Date.now() + 86400000 * 2, // 2 days
            requiredQuorum: 100
          },
          {
            id: 'prop-003',
            title: 'Nightmare Decay Rate Adjustment',
            description: 'Reduce the time before dreams become nightmares from 14 to 21 days',
            proposer: '0xDAO3',
            category: 'governance',
            status: 'voting',
            votesYes: 23,
            votesNo: 18,
            totalVotes: 41,
            deadline: Date.now() + 86400000 * 5, // 5 days
            requiredQuorum: 50
          }
        ];
      }
    },
    refetchInterval: 60000
  });

  const voteMutation = useMutation({
    mutationFn: async (voteData: any) => {
      return apiRequest('/api/dao/vote', {
        method: 'POST',
        body: JSON.stringify(voteData)
      });
    },
    onSuccess: () => {
      toast({
        title: "Vote Recorded!",
        description: "Your vote has been submitted to the DAO.",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/dao/proposals'] });
    },
    onError: (error: any) => {
      toast({
        title: "Vote Failed",
        description: error.message || "Unable to record vote.",
        variant: "destructive"
      });
    }
  });

  const createProposalMutation = useMutation({
    mutationFn: async (proposalData: any) => {
      return apiRequest('/api/dao/propose', {
        method: 'POST',
        body: JSON.stringify(proposalData)
      });
    },
    onSuccess: () => {
      toast({
        title: "Proposal Submitted!",
        description: "Your proposal will enter voting phase after review.",
      });
      
      setNewProposal({ title: '', description: '', category: 'feature' });
      setShowCreateProposal(false);
      queryClient.invalidateQueries({ queryKey: ['/api/dao/proposals'] });
    },
    onError: (error: any) => {
      toast({
        title: "Proposal Failed",
        description: error.message || "Unable to submit proposal.",
        variant: "destructive"
      });
    }
  });

  const handleVote = (proposalId: string, support: boolean) => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Connect your wallet to participate in governance.",
        variant: "destructive"
      });
      return;
    }

    voteMutation.mutate({
      proposalId,
      voter: walletAddress,
      support,
      timestamp: Date.now()
    });
  };

  const handleCreateProposal = () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Connect your wallet to create proposals.",
        variant: "destructive"
      });
      return;
    }

    if (!newProposal.title.trim() || !newProposal.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and description.",
        variant: "destructive"
      });
      return;
    }

    createProposalMutation.mutate({
      ...newProposal,
      proposer: walletAddress,
      createdAt: Date.now()
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      voting: 'text-blue-400',
      pending: 'text-yellow-400',
      approved: 'text-green-400',
      rejected: 'text-red-400'
    };
    return colors[status as keyof typeof colors] || 'text-gray-400';
  };

  const getTimeRemaining = (deadline: number) => {
    const timeLeft = deadline - Date.now();
    if (timeLeft <= 0) return 'Voting ended';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <div className={`dao-panel bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500 rounded-lg p-6 ${className}`}>
      <style>{`
        .dao-panel {
          box-shadow: 0 0 25px rgba(99, 102, 241, 0.3);
        }
        .proposal-card {
          transition: all 0.3s ease;
        }
        .proposal-card:hover {
          background: rgba(99, 102, 241, 0.1);
          border-color: #6366f1;
        }
        .vote-button {
          transition: all 0.3s ease;
        }
        .vote-button.yes {
          background: linear-gradient(45deg, #10b981, #059669);
        }
        .vote-button.no {
          background: linear-gradient(45deg, #ef4444, #dc2626);
        }
        .vote-button:hover {
          transform: translateY(-1px);
        }
        .progress-bar {
          transition: width 0.3s ease;
        }
      `}</style>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-300 mb-2">📜 DreamDAO Proposals</h2>
        <p className="text-gray-400 text-sm">
          Community governance for the Dream Network ecosystem
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {proposals.map((proposal) => {
          const yesPercentage = proposal.totalVotes > 0 ? (proposal.votesYes / proposal.totalVotes) * 100 : 0;
          const noPercentage = proposal.totalVotes > 0 ? (proposal.votesNo / proposal.totalVotes) * 100 : 0;
          const quorumProgress = (proposal.totalVotes / proposal.requiredQuorum) * 100;
          
          return (
            <div key={proposal.id} className="proposal-card p-4 bg-black/50 border border-gray-600 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">{proposal.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{proposal.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Proposed by: {proposal.proposer.slice(0, 8)}...</span>
                    <span className={getStatusColor(proposal.status)}>
                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </span>
                    <span>{getTimeRemaining(proposal.deadline)}</span>
                  </div>
                </div>
              </div>

              {proposal.status === 'voting' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-400">{yesPercentage.toFixed(1)}% Yes</span>
                    <span className="text-gray-400">{proposal.totalVotes} votes</span>
                    <span className="text-red-400">{noPercentage.toFixed(1)}% No</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="flex h-full">
                      <div 
                        className="progress-bar bg-green-500"
                        style={{ width: `${yesPercentage}%` }}
                      ></div>
                      <div 
                        className="progress-bar bg-red-500"
                        style={{ width: `${noPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVote(proposal.id, true)}
                        disabled={voteMutation.isPending}
                        className="vote-button yes px-4 py-2 rounded text-white font-medium"
                      >
                        Vote Yes
                      </button>
                      <button
                        onClick={() => handleVote(proposal.id, false)}
                        disabled={voteMutation.isPending}
                        className="vote-button no px-4 py-2 rounded text-white font-medium"
                      >
                        Vote No
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Quorum: {Math.min(100, quorumProgress).toFixed(1)}%
                    </div>
                  </div>
                </div>
              )}

              {proposal.status === 'pending' && (
                <div className="text-center py-2 text-yellow-400 text-sm">
                  Voting begins in {getTimeRemaining(proposal.deadline)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!showCreateProposal ? (
        <button
          onClick={() => setShowCreateProposal(true)}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-colors"
        >
          Submit Proposal
        </button>
      ) : (
        <div className="p-4 bg-black/60 border border-indigo-600 rounded-lg">
          <h4 className="text-indigo-300 font-semibold mb-4">Create New Proposal</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={newProposal.title}
                onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Proposal title..."
                maxLength={100}
                className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                value={newProposal.description}
                onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the proposal..."
                rows={4}
                maxLength={500}
                className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white placeholder-gray-500 resize-none focus:outline-none focus:border-indigo-400"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select
                value={newProposal.category}
                onChange={(e) => setNewProposal(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-400"
              >
                <option value="feature">Feature</option>
                <option value="economic">Economic</option>
                <option value="governance">Governance</option>
                <option value="integration">Integration</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateProposal(false)}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProposal}
                disabled={createProposalMutation.isPending}
                className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded text-white transition-colors"
              >
                {createProposalMutation.isPending ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}