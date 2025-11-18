import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  dream: number;
  sheep: number;
  streakDays: number;
}

interface RewardsLeaderboardProps {
  currentUserId?: string;
  type?: "dream" | "sheep" | "streak";
}

export function RewardsLeaderboard({ currentUserId, type = "dream" }: RewardsLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<"dream" | "sheep" | "streak">(type);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/rewards/leaderboard?type=${selectedType}&limit=50`);
        if (res.ok) {
          const json = await res.json();
          setLeaderboard(json.leaderboard || []);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [selectedType]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const formatAddress = (address: string) => {
    if (!address) return "—";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-gray-900/50 rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Leaderboard
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedType("dream")}
            className={`px-3 py-1 rounded text-sm transition ${
              selectedType === "dream"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            DREAM
          </button>
          <button
            onClick={() => setSelectedType("sheep")}
            className={`px-3 py-1 rounded text-sm transition ${
              selectedType === "sheep"
                ? "bg-yellow-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            SHEEP
          </button>
          <button
            onClick={() => setSelectedType("streak")}
            className={`px-3 py-1 rounded text-sm transition ${
              selectedType === "streak"
                ? "bg-orange-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            Streak
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading leaderboard...</div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No entries yet. Be the first!</div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry) => {
            const isCurrentUser = currentUserId?.toLowerCase() === entry.userId.toLowerCase();
            return (
              <div
                key={entry.userId}
                className={`p-4 rounded-lg border transition ${
                  isCurrentUser
                    ? "bg-cyan-900/30 border-cyan-500/50"
                    : entry.rank <= 3
                    ? "bg-gray-800/50 border-gray-700/50"
                    : "bg-gray-900/30 border-gray-800/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold w-12 text-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div>
                      <div className={`font-semibold ${isCurrentUser ? "text-cyan-400" : "text-white"}`}>
                        {formatAddress(entry.userId)}
                        {isCurrentUser && <span className="ml-2 text-xs text-cyan-400">(You)</span>}
                      </div>
                      {entry.streakDays > 0 && (
                        <div className="text-xs text-gray-400">
                          🔥 {entry.streakDays} day streak
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {selectedType === "dream" && (
                      <>
                        <div className="text-lg font-bold text-blue-400">{entry.dream.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">DREAM</div>
                      </>
                    )}
                    {selectedType === "sheep" && (
                      <>
                        <div className="text-lg font-bold text-yellow-400">{entry.sheep.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">SHEEP</div>
                      </>
                    )}
                    {selectedType === "streak" && (
                      <>
                        <div className="text-lg font-bold text-orange-400">{entry.streakDays}</div>
                        <div className="text-xs text-gray-400">days</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

