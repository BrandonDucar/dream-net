import { useQuery } from '@tanstack/react-query';

interface CloudStats {
  id: string;
  name: string;
  xp: number;
  level: number;
  members: number;
  recentActivity: number;
}

interface CloudLeaderboardProps {
  className?: string;
  limit?: number;
}

export default function CloudLeaderboard({ className = "", limit = 10 }: CloudLeaderboardProps) {
  const { data: clouds = [] } = useQuery({
    queryKey: ['/api/cloud/leaderboard', limit],
    queryFn: async (): Promise<CloudStats[]> => {
      const response = await fetch(`/api/cloud/leaderboard?limit=${limit}`);
      return response.json();
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className={`bg-gray-900 border border-purple-500 rounded-lg p-6 ${className}`}>
      <h3 className="text-2xl font-bold text-purple-400 mb-4">🏆 Cloud Leaderboard</h3>
      
      <table className="cloud-leaderboard w-full">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="text-left py-2 text-white font-semibold">Rank</th>
            <th className="text-left py-2 text-white font-semibold">Cloud</th>
            <th className="text-center py-2 text-white font-semibold">XP</th>
            <th className="text-center py-2 text-white font-semibold">Level</th>
            <th className="text-center py-2 text-white font-semibold">Members</th>
          </tr>
        </thead>
        <tbody>
          {clouds.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-8 text-gray-400">
                No cloud data available
              </td>
            </tr>
          ) : (
            clouds.map((cloud, index) => (
              <tr 
                key={cloud.id} 
                className={`border-b border-gray-700 hover:bg-gray-800 transition-colors ${
                  index < 3 ? 'bg-gradient-to-r from-gray-800 to-transparent' : ''
                }`}
              >
                <td className="py-3 px-2">
                  <span className="text-lg">{getRankIcon(index)}</span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-semibold">{cloud.name}</span>
                    {cloud.recentActivity > 0 && (
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Active"></span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-2 text-center">
                  <span className="text-gold-400 font-mono">{cloud.xp.toLocaleString()}</span>
                </td>
                <td className="py-3 px-2 text-center">
                  <span className="text-purple-400 font-semibold">L{cloud.level}</span>
                </td>
                <td className="py-3 px-2 text-center">
                  <span className="text-gray-300">{cloud.members}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {clouds.length > 0 && (
        <div className="mt-4 text-center text-xs text-gray-400">
          Updated every 30 seconds • Total clouds: {clouds.length}
        </div>
      )}
    </div>
  );
}