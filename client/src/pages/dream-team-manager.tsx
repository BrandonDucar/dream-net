import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface TeamMember {
  wallet: string;
  role: string;
  xp: number;
  revivals: number;
  badges: string[];
  joined: number;
}

interface DreamTeam {
  teamId: string;
  name: string;
  cloud: string;
  members: TeamMember[];
  teamXP: number;
  rank: string;
  currentBounties?: number;
  completedMissions?: number;
}

interface TeamActivity {
  logId: string;
  timestamp: number;
  type: 'resurrection' | 'bounty' | 'mission' | 'achievement';
  actor: string;
  target: string;
  description: string;
  impact: string[];
}

export default function DreamTeamManager() {
  const queryClient = useQueryClient();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [inviteWallet, setInviteWallet] = useState('');
  const [newBountyTitle, setNewBountyTitle] = useState('');

  const { data: teams, isLoading } = useQuery<DreamTeam[]>({
    queryKey: ['/api/dream-clouds/teams'],
    queryFn: async () => {
      const response = await fetch('/api/dream-clouds/teams');
      if (!response.ok) {
        throw new Error('Failed to fetch dream teams');
      }
      return response.json();
    }
  });

  const { data: activities } = useQuery<TeamActivity[]>({
    queryKey: ['/api/dream-clouds/teams/activities'],
    queryFn: async () => {
      const response = await fetch('/api/dream-clouds/teams/activities');
      if (!response.ok) {
        throw new Error('Failed to fetch team activities');
      }
      return response.json();
    }
  });

  const inviteMemberMutation = useMutation({
    mutationFn: async ({ teamId, wallet }: { teamId: string; wallet: string }) => {
      return apiRequest(`/api/dream-clouds/teams/${teamId}/invite`, {
        method: 'POST',
        body: JSON.stringify({ wallet })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dream-clouds/teams'] });
      setInviteWallet('');
    }
  });

  const assignBountyMutation = useMutation({
    mutationFn: async ({ teamId, title }: { teamId: string; title: string }) => {
      return apiRequest(`/api/dream-clouds/teams/${teamId}/assign-bounty`, {
        method: 'POST',
        body: JSON.stringify({ title })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dream-clouds/teams'] });
      setNewBountyTitle('');
    }
  });

  const getBadgeIcon = (badge: string) => {
    const icons: Record<string, string> = {
      'Healer': '🔥',
      'OG': '✨', 
      'Blessed': '🎖',
      'Strategist': '💡',
      'Sheep': '🐑',
      'Reviver': '⚡',
      'Guardian': '🛡️',
      'Explorer': '🔍'
    };
    return icons[badge] || '⭐';
  };

  const getRankColor = (rank: string) => {
    const colors: Record<string, string> = {
      'Gold': 'text-gold-400',
      'Silver': 'text-gray-300',
      'Bronze': 'text-orange-400',
      'Diamond': 'text-cyan-400'
    };
    return colors[rank] || 'text-gray-400';
  };

  const getCloudIcon = (cloud: string) => {
    const icons: Record<string, string> = {
      'zk-cloud': '🛡️',
      'defi-vaults': '💰',
      'ai-research': '🧠',
      'meme-factory': '🎭'
    };
    return icons[cloud] || '☁️';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading dream teams...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-8">
      <div className="max-w-6xl mx-auto">
        <section className="team-manager">
          <h1 className="text-4xl font-bold text-center mb-8 text-gold-400">
            👥 Dream Team Manager
          </h1>

          {/* Team Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {teams?.map((team) => (
              <section key={team.teamId} className="dream-team-panel bg-gray-900 border border-cyan-500 rounded-lg p-8">
                <h2 className="text-3xl font-bold text-cyan-400 mb-4">
                  {team.name} {getCloudIcon(team.cloud)}
                </h2>
                
                <p className="text-lg mb-6">
                  <span className="text-gray-400">Total XP:</span>{' '}
                  <span className="text-purple-400 font-bold">{team.teamXP.toLocaleString()}</span>
                  {' '}—{' '}
                  <span className="text-gray-400">Rank:</span>{' '}
                  <span className={`font-bold ${getRankColor(team.rank)}`}>{team.rank}</span>
                </p>

                <ul className="member-list space-y-3 mb-8">
                  {team.members.map((member, index) => (
                    <li key={index} className="bg-black border border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-cyan-300 font-mono">{member.wallet}</span>
                          <span className="text-gray-400 mx-2">—</span>
                          <span className="text-purple-400 font-semibold">{member.role}</span>
                          <span className="text-gray-400 mx-2">—</span>
                          <span className="text-green-400 font-bold">{member.xp.toLocaleString()} XP</span>
                        </div>
                        
                        <span className="badges flex gap-1">
                          {member.badges.map((badge, badgeIndex) => (
                            <span key={badgeIndex} className="text-lg" title={badge}>
                              {getBadgeIcon(badge)}
                            </span>
                          ))}
                        </span>
                      </div>
                      
                      {member.revivals > 0 && (
                        <div className="mt-2 text-sm text-gray-400">
                          ⚡ {member.revivals} revivals • Joined {new Date(member.joined * 1000).toLocaleDateString()}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Team Actions */}
                <div className="space-y-4">
                  {/* Invite Member */}
                  {selectedTeam === team.teamId ? (
                    <div className="bg-black border border-cyan-600 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-cyan-400 mb-3">Invite New Member</h4>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={inviteWallet}
                          onChange={(e) => setInviteWallet(e.target.value)}
                          placeholder="Enter wallet address..."
                          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-cyan-500 focus:outline-none"
                        />
                        <button
                          onClick={() => inviteMemberMutation.mutate({ teamId: team.teamId, wallet: inviteWallet })}
                          disabled={inviteMemberMutation.isPending || !inviteWallet.trim()}
                          className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white font-semibold rounded transition-colors"
                        >
                          Send Invite
                        </button>
                      </div>
                      <button
                        onClick={() => setSelectedTeam(null)}
                        className="mt-2 text-sm text-gray-400 hover:text-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedTeam(team.teamId)}
                      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Invite Member
                    </button>
                  )}

                  {/* Assign Remix Bounty */}
                  {selectedTeam === `${team.teamId}-bounty` ? (
                    <div className="bg-black border border-purple-600 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-purple-400 mb-3">Assign Remix Bounty</h4>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={newBountyTitle}
                          onChange={(e) => setNewBountyTitle(e.target.value)}
                          placeholder="Enter bounty title..."
                          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-purple-500 focus:outline-none"
                        />
                        <button
                          onClick={() => assignBountyMutation.mutate({ teamId: team.teamId, title: newBountyTitle })}
                          disabled={assignBountyMutation.isPending || !newBountyTitle.trim()}
                          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold rounded transition-colors"
                        >
                          Assign
                        </button>
                      </div>
                      <button
                        onClick={() => setSelectedTeam(null)}
                        className="mt-2 text-sm text-gray-400 hover:text-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedTeam(`${team.teamId}-bounty`)}
                      className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Assign Remix Bounty
                    </button>
                  )}
                </div>

                {/* Team Stats */}
                <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="text-cyan-400 font-bold">{team.members.length}</div>
                    <div className="text-gray-400">Members</div>
                  </div>
                  <div>
                    <div className="text-purple-400 font-bold">{team.currentBounties || 0}</div>
                    <div className="text-gray-400">Active Bounties</div>
                  </div>
                  <div>
                    <div className="text-gold-400 font-bold">{team.completedMissions || 0}</div>
                    <div className="text-gray-400">Completed</div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Team Activity Feed */}
          <div className="bg-gray-900 border border-gold-500 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gold-400 mb-6">📊 Recent Team Activities</h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activities?.map((activity) => (
                <div key={activity.logId} className="bg-black border border-gray-600 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">
                          {activity.type === 'resurrection' ? '✨' : 
                           activity.type === 'bounty' ? '💰' : 
                           activity.type === 'mission' ? '🎯' : '🏆'}
                        </span>
                        <span className="text-cyan-400 font-semibold capitalize">{activity.type}</span>
                        <span className="text-gray-400 text-sm">
                          {new Date(activity.timestamp * 1000).toLocaleString()}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 mb-2">{activity.description}</p>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">By:</span>
                        <span className="text-purple-400 font-mono">{activity.actor}</span>
                        <span className="text-gray-400">Target:</span>
                        <span className="text-cyan-400">{activity.target}</span>
                      </div>
                      
                      {activity.impact.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {activity.impact.map((impact, index) => (
                            <span key={index} className="px-2 py-1 bg-green-800 text-green-300 rounded text-xs">
                              {impact}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-center gap-4">
            <button 
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-black font-semibold rounded-lg transition-colors"
              onClick={() => window.history.back()}
            >
              ← Back to Dashboard
            </button>
            <button 
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              onClick={() => window.location.href = '/badge-board'}
            >
              🏅 Badge Board
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}