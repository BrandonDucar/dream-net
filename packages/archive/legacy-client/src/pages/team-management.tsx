import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface TeamMember {
  teamId: string;
  roles: string[];
  badges: string[];
  walletAddress: string;
  joinedAt: number;
  xpContributed: number;
  lastActive: number;
}

interface Team {
  teamId: string;
  name: string;
  description: string;
  memberCount: number;
  totalXP: number;
  cloudId: string;
  createdAt: number;
  isPublic: boolean;
  maxMembers: number;
  members: string[];
  revivedDreams: number;
  currentBounties: number;
  specialization?: string;
}

interface TeamData {
  teams: Team[];
  myMemberships: TeamMember[];
  availableRoles: string[];
  availableBadges: string[];
}

export default function TeamManagement() {
  const queryClient = useQueryClient();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: teamData, isLoading } = useQuery<TeamData>({
    queryKey: ['/api/teams/management'],
    queryFn: async () => {
      const response = await fetch('/api/teams/management');
      if (!response.ok) {
        throw new Error('Failed to fetch team data');
      }
      return response.json();
    }
  });

  const joinTeamMutation = useMutation({
    mutationFn: async ({ teamId, roles }: { teamId: string; roles: string[] }) => {
      return apiRequest(`/api/teams/${teamId}/join`, {
        method: 'POST',
        body: JSON.stringify({ roles }),
        headers: { 'x-wallet-address': '0xTEAM_MEMBER' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams/management'] });
    }
  });

  const updateRolesMutation = useMutation({
    mutationFn: async ({ teamId, roles, badges }: { teamId: string; roles: string[]; badges: string[] }) => {
      return apiRequest(`/api/teams/${teamId}/update-profile`, {
        method: 'PUT',
        body: JSON.stringify({ roles, badges }),
        headers: { 'x-wallet-address': '0xTEAM_MEMBER' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams/management'] });
    }
  });

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'reviver': 'text-purple-400',
      'scout': 'text-green-400', 
      'guardian': 'text-blue-400',
      'architect': 'text-gold-400',
      'hunter': 'text-red-400',
      'mentor': 'text-cyan-400'
    };
    return colors[role] || 'text-gray-400';
  };

  const getBadgeIcon = (badge: string) => {
    const icons: Record<string, string> = {
      'dream-savior': '🧬',
      'glitch-tamer': '⚡',
      'bounty-hunter': '🎯',
      'remix-master': '🔄',
      'first-steps': '👶',
      'bone-collector': '💀'
    };
    return icons[badge] || '🏅';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading team management...</div>
        </div>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="min-h-screen bg-black text-red-400 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Failed to load team data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gold-400">
          🤝 Team Management
        </h1>

        {/* My Team Memberships */}
        <section className="bg-gray-900 border border-cyan-500 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">👥 My Teams</h2>
          
          {teamData.myMemberships.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p className="text-xl mb-4">Not part of any teams yet</p>
              <p>Join a team below to start collaborating!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamData.myMemberships.map((membership) => {
                const team = teamData.teams.find(t => t.teamId === membership.teamId);
                return (
                  <div key={membership.teamId} className="bg-black border border-cyan-600 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gold-400 mb-3">
                      {team?.name || membership.teamId}
                    </h3>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <span className="text-gray-400">Roles:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {membership.roles.map((role, index) => (
                            <span 
                              key={index}
                              className={`px-3 py-1 bg-gray-800 rounded-full text-xs font-semibold ${getRoleColor(role)}`}
                            >
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-gray-400">Badges:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {membership.badges.map((badge, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-purple-900 text-purple-300 rounded-full text-xs flex items-center gap-1"
                            >
                              {getBadgeIcon(badge)} {badge.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-4">
                      <div>
                        <span className="block">XP Contributed:</span>
                        <span className="text-cyan-400 font-semibold">{membership.xpContributed.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block">Joined:</span>
                        <span className="text-green-400">{new Date(membership.joinedAt).toLocaleDateString()}</span>
                      </div>
                      {team && (
                        <>
                          <div>
                            <span className="block">Team Revival Count:</span>
                            <span className="text-purple-400 font-semibold">{team.revivedDreams}</span>
                          </div>
                          <div>
                            <span className="block">Active Bounties:</span>
                            <span className="text-gold-400 font-semibold">{team.currentBounties}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        updateRolesMutation.mutate({
                          teamId: membership.teamId,
                          roles: membership.roles,
                          badges: membership.badges
                        });
                      }}
                      className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-black font-semibold rounded-lg transition-colors"
                    >
                      Update Profile
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Available Teams */}
        <section className="bg-gray-900 border border-gray-600 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-400 mb-6">🌟 Available Teams</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamData.teams
              .filter(team => !teamData.myMemberships.find(m => m.teamId === team.teamId))
              .map((team) => (
              <div key={team.teamId} className="bg-black border border-gray-700 rounded-lg p-6 hover:border-cyan-500 transition-colors">
                <h3 className="text-xl font-bold text-cyan-400 mb-3">{team.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{team.description}</p>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Members:</span>
                    <span className="text-cyan-400">{team.memberCount}/{team.maxMembers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total XP:</span>
                    <span className="text-gold-400">{team.totalXP.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cloud:</span>
                    <span className="text-purple-400 capitalize">{team.cloudId.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className={team.isPublic ? 'text-green-400' : 'text-orange-400'}>
                      {team.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Revived Dreams:</span>
                    <span className="text-purple-400">{team.revivedDreams}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Bounties:</span>
                    <span className="text-gold-400">{team.currentBounties}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    joinTeamMutation.mutate({
                      teamId: team.teamId,
                      roles: ['scout'] // Default role
                    });
                  }}
                  disabled={joinTeamMutation.isPending || team.memberCount >= team.maxMembers}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {team.memberCount >= team.maxMembers ? 'Team Full' : 'Join Team'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Role and Badge Reference */}
        <section className="bg-gray-900 border border-purple-500 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-6">📋 Roles & Badges Reference</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Available Roles</h3>
              <div className="space-y-2">
                {teamData.availableRoles.map((role, index) => (
                  <div key={index} className={`p-3 bg-black rounded border-l-4 border-cyan-500`}>
                    <span className={`font-semibold ${getRoleColor(role)}`}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                      {role === 'reviver' && 'Specializes in restoring abandoned dreams'}
                      {role === 'scout' && 'Explores new opportunities and connections'}
                      {role === 'guardian' && 'Protects team resources and integrity'}
                      {role === 'architect' && 'Designs and builds complex systems'}
                      {role === 'hunter' && 'Focuses on bounty completion and rewards'}
                      {role === 'mentor' && 'Guides and teaches other team members'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-4">Badge Collection</h3>
              <div className="space-y-2">
                {teamData.availableBadges.map((badge, index) => (
                  <div key={index} className="p-3 bg-black rounded border-l-4 border-purple-500">
                    <span className="font-semibold text-purple-300 flex items-center gap-2">
                      {getBadgeIcon(badge)} {badge.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                      {badge === 'dream-savior' && 'Revived an infected or abandoned dream'}
                      {badge === 'glitch-tamer' && 'Successfully debugged complex system issues'}
                      {badge === 'bounty-hunter' && 'Completed multiple bounty challenges'}
                      {badge === 'remix-master' && 'Created innovative dream remixes'}
                      {badge === 'first-steps' && 'Submitted first dream to the ecosystem'}
                      {badge === 'bone-collector' && 'Explored the dreams graveyard'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

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
            🏆 View Badges
          </button>
        </div>
      </div>
    </div>
  );
}