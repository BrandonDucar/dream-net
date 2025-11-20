import { useState, useEffect } from "react";
import type { UserBalances } from "@dreamnet/rewards-engine";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface RewardsWidgetProps {
  userId: string;
  onLoginReward?: () => void;
}

export function RewardsWidget({ userId, onLoginReward }: RewardsWidgetProps) {
  const [balance, setBalance] = useState<UserBalances | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claimingDaily, setClaimingDaily] = useState(false);
  const [claimingWeekly, setClaimingWeekly] = useState(false);

  const fetchBalance = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/rewards/balance?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch balance");
      const json = await res.json();
      setBalance(json.balance);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchBalance();
    // Grant login reward on mount (silently)
    if (userId && onLoginReward) {
      fetch(`${API_BASE}/api/rewards/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
      }).catch(() => {
        // Silently fail
      });
    }
  }, [userId]);

  const canClaimDaily = () => {
    if (!balance?.lastDailyClaimAt) return true;
    const lastClaim = new Date(balance.lastDailyClaimAt);
    const now = new Date();
    const hoursSince = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
    return hoursSince >= 24;
  };

  const canClaimWeekly = () => {
    if (!balance?.lastWeeklyClaimAt) return true;
    const lastClaim = new Date(balance.lastWeeklyClaimAt);
    const now = new Date();
    const daysSince = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince >= 7;
  };

  const handleDailyClaim = async () => {
    if (!userId || !canClaimDaily()) return;
    setClaimingDaily(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/rewards/daily-claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to claim daily reward");
      }
      const json = await res.json();
      setBalance(json.balance);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setClaimingDaily(false);
    }
  };

  const handleWeeklyClaim = async () => {
    if (!userId || !canClaimWeekly()) return;
    setClaimingWeekly(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/rewards/weekly-claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to claim weekly reward");
      }
      const json = await res.json();
      setBalance(json.balance);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setClaimingWeekly(false);
    }
  };

  if (loading && !balance) {
    return (
      <div className="p-4 bg-gray-900/50 rounded-lg border border-white/10">
        <div className="text-sm text-gray-400">Loading rewards...</div>
      </div>
    );
  }

  if (!balance) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-900/50 rounded-lg border border-white/10 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Rewards</h3>
        <button
          onClick={fetchBalance}
          className="text-xs text-gray-400 hover:text-white transition"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-2 bg-red-900/30 text-red-200 text-xs rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-blue-900/20 rounded border border-blue-500/20">
          <div className="text-xs text-blue-300/80 mb-1">DREAM</div>
          <div className="text-xl font-bold text-blue-400">{balance.dream}</div>
        </div>
        <div className="p-3 bg-yellow-900/20 rounded border border-yellow-500/20">
          <div className="text-xs text-yellow-300/80 mb-1">SHEEP</div>
          <div className="text-xl font-bold text-yellow-400">{balance.sheep}</div>
        </div>
      </div>

      {balance.streakDays && balance.streakDays > 0 && (
        <div className="text-xs text-gray-400">
          Streak: {balance.streakDays} day{balance.streakDays !== 1 ? "s" : ""}
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={handleDailyClaim}
          disabled={!canClaimDaily() || claimingDaily}
          className="w-full px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded text-sm text-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {claimingDaily ? "Claiming..." : canClaimDaily() ? "Claim Daily" : "Daily Claimed"}
        </button>
        <button
          onClick={handleWeeklyClaim}
          disabled={!canClaimWeekly() || claimingWeekly}
          className="w-full px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded text-sm text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {claimingWeekly ? "Claiming..." : canClaimWeekly() ? "Claim Weekly" : "Weekly Claimed"}
        </button>
      </div>
    </div>
  );
}

