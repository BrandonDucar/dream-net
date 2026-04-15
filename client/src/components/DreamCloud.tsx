import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface DreamCloud {
  cloudId: string;
  title: string;
  dreams: number;
  remixPaths: number;
  emotions: string[];
  team: string[];
  totalRevenue: string;
  vaultsActive: number;
  missionsLive: number;
}

interface Mission {
  id: string;
  title: string;
  progress: number;
  reward: string;
  status: 'active' | 'completed' | 'pending';
  assignedTo: string;
}

interface TeamMember {
  address: string;
  role: string;
  contributions: number;
  earnings: string;
  status: 'online' | 'offline';
}

export default function DreamCloud() {
  const [cloudData, setCloudData] = useState<DreamCloud>({
    cloudId: "cloud_007",
    title: "Crypto for Kids Cloud",
    dreams: 42,
    remixPaths: 238,
    emotions: ["curiosity", "empowerment"],
    team: ["0xBrandon", "0xTina", "0xFlutter"],
    totalRevenue: "18,720 $SHEEP",
    vaultsActive: 19,
    missionsLive: 5
  });

  const [missions, setMissions] = useState<Mission[]>([
    {
      id: "mission_001",
      title: "Blockchain Basics Interactive Journey",
      progress: 78,
      reward: "2,400 $SHEEP",
      status: "active",
      assignedTo: "0xBrandon"
    },
    {
      id: "mission_002", 
      title: "Digital Wallet Adventure Game",
      progress: 92,
      reward: "3,100 $SHEEP",
      status: "active",
      assignedTo: "0xTina"
    },
    {
      id: "mission_003",
      title: "NFT Creation Workshop",
      progress: 45,
      reward: "1,800 $SHEEP",
      status: "active",
      assignedTo: "0xFlutter"
    },
    {
      id: "mission_004",
      title: "Cryptocurrency Trading Simulator",
      progress: 100,
      reward: "4,200 $SHEEP",
      status: "completed",
      assignedTo: "0xBrandon"
    },
    {
      id: "mission_005",
      title: "Smart Contract Educational Module",
      progress: 23,
      reward: "2,900 $SHEEP",
      status: "active",
      assignedTo: "0xTina"
    }
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      address: "0xBrandon",
      role: "Lead Educator",
      contributions: 89,
      earnings: "7,240 $SHEEP",
      status: "online"
    },
    {
      address: "0xTina",
      role: "Content Creator",
      contributions: 76,
      earnings: "6,180 $SHEEP",
      status: "online"
    },
    {
      address: "0xFlutter",
      role: "UX Designer",
      contributions: 67,
      earnings: "5,300 $SHEEP",
      status: "offline"
    }
  ]);

  const getEmotionColor = (emotion: string) => {
    const colors = {
      curiosity: 'from-yellow-500 to-orange-400',
      empowerment: 'from-purple-500 to-pink-400',
      wonder: 'from-blue-500 to-cyan-400',
      excitement: 'from-green-500 to-teal-400'
    };
    return colors[emotion as keyof typeof colors] || 'from-gray-500 to-gray-400';
  };

  const getMissionStatusColor = (status: string) => {
    const colors = {
      active: 'bg-blue-600 text-blue-100',
      completed: 'bg-green-600 text-green-100',
      pending: 'bg-yellow-600 text-yellow-100'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-600 text-gray-100';
  };

  const formatAddress = (address: string) => {
    return address.replace('0x', '');
  };

  const activeMissions = missions.filter(m => m.status === 'active');
  const completedMissions = missions.filter(m => m.status === 'completed');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900 to-blue-900 border border-cyan-600 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{cloudData.title}</h1>
            <p className="text-cyan-200">{cloudData.cloudId} • Educational Blockchain Experience</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{cloudData.totalRevenue}</div>
            <div className="text-cyan-200">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-zinc-900 border-zinc-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💭</span>
              <div>
                <div className="text-2xl font-bold text-white">{cloudData.dreams}</div>
                <div className="text-zinc-400 text-sm">Dreams Created</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <div className="text-2xl font-bold text-purple-400">{cloudData.remixPaths}</div>
                <div className="text-zinc-400 text-sm">Remix Paths</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏛️</span>
              <div>
                <div className="text-2xl font-bold text-cyan-400">{cloudData.vaultsActive}</div>
                <div className="text-zinc-400 text-sm">Active Vaults</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="text-2xl font-bold text-green-400">{cloudData.missionsLive}</div>
                <div className="text-zinc-400 text-sm">Live Missions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emotions & Team Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Emotions */}
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Core Emotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cloudData.emotions.map((emotion, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getEmotionColor(emotion)}`}></div>
                  <span className="text-white font-medium capitalize">{emotion}</span>
                  <div className="flex-1 bg-zinc-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${getEmotionColor(emotion)}`}
                      style={{ width: `${85 - index * 15}%` }}
                    ></div>
                  </div>
                  <span className="text-zinc-400 text-sm">{85 - index * 15}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Overview */}
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between bg-zinc-800 border border-zinc-600 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${member.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    <div>
                      <div className="text-white font-medium">{formatAddress(member.address)}</div>
                      <div className="text-zinc-400 text-sm">{member.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-300 font-medium">{member.earnings}</div>
                    <div className="text-zinc-400 text-sm">{member.contributions} contributions</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Missions */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Active Missions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeMissions.map((mission) => (
              <div key={mission.id} className="bg-zinc-800 border border-zinc-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getMissionStatusColor(mission.status)}>
                      {mission.status.toUpperCase()}
                    </Badge>
                    <h3 className="text-lg font-semibold text-white">{mission.title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">{mission.reward}</div>
                    <div className="text-zinc-400 text-sm">Reward</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Progress</span>
                    <span className="text-cyan-300">{mission.progress}%</span>
                  </div>
                  <Progress value={mission.progress} className="h-2" />
                  
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-zinc-400 text-sm">Assigned to: {formatAddress(mission.assignedTo)}</span>
                    <span className="text-zinc-500 text-sm">{mission.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mission Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mission Stats */}
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Mission Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-3">
                  <div className="text-xl font-bold text-blue-400">{activeMissions.length}</div>
                  <div className="text-zinc-400 text-sm">Active Missions</div>
                </div>
                <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-3">
                  <div className="text-xl font-bold text-green-400">{completedMissions.length}</div>
                  <div className="text-zinc-400 text-sm">Completed</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Avg. Completion Rate:</span>
                  <span className="text-cyan-300 font-medium">67%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Rewards Distributed:</span>
                  <span className="text-green-400 font-medium">12,300 $SHEEP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Pending Rewards:</span>
                  <span className="text-yellow-400 font-medium">9,100 $SHEEP</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card className="bg-zinc-900 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-cyan-400">Revenue Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: "Educational Content", amount: "8,940 $SHEEP", percentage: 48 },
                { source: "Interactive Missions", amount: "5,230 $SHEEP", percentage: 28 },
                { source: "Vault Subscriptions", amount: "3,120 $SHEEP", percentage: 17 },
                { source: "Community Rewards", amount: "1,430 $SHEEP", percentage: 7 }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-300">{item.source}</span>
                    <span className="text-cyan-400 font-medium">{item.amount}</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cloud Performance */}
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Cloud Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Engagement</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Daily Active Users:</span>
                  <span className="text-cyan-300">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Session Duration:</span>
                  <span className="text-green-400">23 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Completion Rate:</span>
                  <span className="text-blue-400">78%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Growth</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Monthly Growth:</span>
                  <span className="text-green-400">+34%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">New Dreams:</span>
                  <span className="text-purple-400">+8/week</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Revenue Growth:</span>
                  <span className="text-yellow-400">+22%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Quality</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">User Rating:</span>
                  <span className="text-cyan-300">4.8/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Content Score:</span>
                  <span className="text-green-400">92/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Safety Rating:</span>
                  <span className="text-blue-400">A+</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}