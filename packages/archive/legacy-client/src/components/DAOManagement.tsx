import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DAOMember {
  wallet: string;
  joinedAt: string;
  votingPower: number;
  contributionScore: number;
}

interface DAOProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votes: { wallet: string; power: number; support: boolean }[];
  createdAt: string;
  endsAt: string;
}

interface DAO {
  name: string;
  type: string;
  focus: string;
  vault: string;
  votingModel: string;
  initialMembers: string[];
  totalMembers: number;
  totalProposals: number;
  treasuryBalance: string;
  governanceToken: string;
}

export default function DAOManagement() {
  const [selectedDAO, setSelectedDAO] = useState<DAO | null>(null);
  const [members, setMembers] = useState<DAOMember[]>([]);
  const [proposals, setProposals] = useState<DAOProposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with Dream Drifters DAO data
    const dreamDriftersDAO: DAO = {
      name: "Dream Drifters",
      type: "Theme DAO",
      focus: "Whispers of melancholy and joy",
      vault: "dream007",
      votingModel: "Quadratic",
      initialMembers: ["dreamer.eth", "petal.sol", "starborn.bnb"],
      totalMembers: 3,
      totalProposals: 2,
      treasuryBalance: "1,247 $SHEEP",
      governanceToken: "DRIFT"
    };

    const mockMembers: DAOMember[] = [
      {
        wallet: "dreamer.eth",
        joinedAt: "2024-01-01",
        votingPower: 45,
        contributionScore: 892
      },
      {
        wallet: "petal.sol",
        joinedAt: "2024-01-02",
        votingPower: 38,
        contributionScore: 756
      },
      {
        wallet: "starborn.bnb",
        joinedAt: "2024-01-03",
        votingPower: 32,
        contributionScore: 634
      }
    ];

    const mockProposals: DAOProposal[] = [
      {
        id: "prop_001",
        title: "Allocate 500 $SHEEP for Melancholy Dream Collection",
        description: "Fund creation of 10 dreams exploring themes of beautiful sadness and nostalgic reflection",
        proposer: "dreamer.eth",
        status: "active",
        votes: [
          { wallet: "dreamer.eth", power: 45, support: true },
          { wallet: "petal.sol", power: 38, support: true }
        ],
        createdAt: "2024-01-05T10:00:00Z",
        endsAt: "2024-01-12T10:00:00Z"
      },
      {
        id: "prop_002",
        title: "Partner with Joy Collective for Cross-DAO Event",
        description: "Collaborate on dream fusion event combining melancholy and joy themes",
        proposer: "petal.sol",
        status: "pending",
        votes: [],
        createdAt: "2024-01-06T14:30:00Z",
        endsAt: "2024-01-13T14:30:00Z"
      }
    ];

    setSelectedDAO(dreamDriftersDAO);
    setMembers(mockMembers);
    setProposals(mockProposals);
    setLoading(false);
  }, []);

  const calculateQuadraticVotingPower = (tokens: number): number => {
    return Math.floor(Math.sqrt(tokens));
  };

  const getVotingStatus = (proposal: DAOProposal) => {
    const totalVotes = proposal.votes.reduce((sum, vote) => sum + vote.power, 0);
    const supportVotes = proposal.votes.filter(v => v.support).reduce((sum, vote) => sum + vote.power, 0);
    const againstVotes = totalVotes - supportVotes;
    
    return {
      totalVotes,
      supportVotes,
      againstVotes,
      supportPercentage: totalVotes > 0 ? (supportVotes / totalVotes) * 100 : 0
    };
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-zinc-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!selectedDAO) {
    return (
      <div className="p-6 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-red-400">No DAO Selected</h2>
        <p className="text-zinc-400 mt-2">Please select a DAO to manage</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* DAO Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-600 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{selectedDAO.name}</h1>
            <p className="text-purple-200 text-lg">{selectedDAO.focus}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="bg-purple-800 text-purple-100 px-3 py-1 rounded-full text-sm">
                {selectedDAO.type}
              </span>
              <span className="bg-blue-800 text-blue-100 px-3 py-1 rounded-full text-sm">
                {selectedDAO.votingModel} Voting
              </span>
              <span className="bg-green-800 text-green-100 px-3 py-1 rounded-full text-sm">
                Vault: {selectedDAO.vault}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">{selectedDAO.treasuryBalance}</div>
            <div className="text-zinc-300">Treasury Balance</div>
          </div>
        </div>
      </div>

      {/* DAO Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">{selectedDAO.totalMembers}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400">Active Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {proposals.filter(p => p.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400">Governance Token</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{selectedDAO.governanceToken}</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400">Vault ID</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{selectedDAO.vault}</div>
          </CardContent>
        </Card>
      </div>

      {/* Members Section */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">DAO Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.wallet} className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg border border-zinc-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {member.wallet.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-white">{member.wallet}</div>
                    <div className="text-sm text-zinc-400">Joined {member.joinedAt}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-300">
                    {member.votingPower} VP
                  </div>
                  <div className="text-sm text-zinc-400">
                    Score: {member.contributionScore}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dream Enhancement Section */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Recent Dream Enhancement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-yellow-900 to-orange-900 border border-yellow-600 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔍</span>
                <div>
                  <h4 className="font-bold text-white">Dream 108 Enhanced</h4>
                  <p className="text-yellow-200 text-sm">Added Curiosity emotion</p>
                </div>
              </div>
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                ACTIVE
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-yellow-300 font-medium">Effect:</span>
                <p className="text-white">Expanded remix audience + Remix Toolchain Access</p>
              </div>
              <div>
                <span className="text-yellow-300 font-medium">Audience Boost:</span>
                <p className="text-white">2.3x multiplier active</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposals Section */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Active Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proposals.map((proposal) => {
              const votingStatus = getVotingStatus(proposal);
              return (
                <div key={proposal.id} className="p-4 bg-zinc-800 rounded-lg border border-zinc-600">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{proposal.title}</h3>
                      <p className="text-zinc-300 mt-1">{proposal.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                        <span>By {proposal.proposer}</span>
                        <span>Ends {new Date(proposal.endsAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      proposal.status === 'active' ? 'bg-green-800 text-green-100' :
                      proposal.status === 'passed' ? 'bg-blue-800 text-blue-100' :
                      proposal.status === 'rejected' ? 'bg-red-800 text-red-100' :
                      'bg-yellow-800 text-yellow-100'
                    }`}>
                      {proposal.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Voting Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">Support: {votingStatus.supportVotes} VP</span>
                      <span className="text-red-400">Against: {votingStatus.againstVotes} VP</span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${votingStatus.supportPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-zinc-400 text-center">
                      {votingStatus.supportPercentage.toFixed(1)}% Support ({votingStatus.totalVotes} total VP)
                    </div>
                  </div>

                  {/* Vote Buttons */}
                  {proposal.status === 'active' && (
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                        Vote Yes
                      </button>
                      <button className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                        Vote No
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quadratic Voting Info */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Quadratic Voting System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">How It Works</h4>
              <p className="text-zinc-300 text-sm mb-4">
                Voting power is calculated as the square root of your {selectedDAO.governanceToken} tokens, 
                ensuring more equitable participation and preventing whale dominance.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">100 DRIFT tokens</span>
                  <span className="text-purple-300">10 Voting Power</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">400 DRIFT tokens</span>
                  <span className="text-purple-300">20 Voting Power</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">900 DRIFT tokens</span>
                  <span className="text-purple-300">30 Voting Power</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Governance Benefits</h4>
              <ul className="text-zinc-300 text-sm space-y-1">
                <li>• Prevents wealth concentration attacks</li>
                <li>• Encourages broader participation</li>
                <li>• Balances influence across members</li>
                <li>• Promotes collaborative decision-making</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}