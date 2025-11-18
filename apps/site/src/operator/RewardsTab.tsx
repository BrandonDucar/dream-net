import { useState, useEffect } from "react";
import type { UserBalances, RewardEvent } from "@dreamnet/rewards-engine";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface RewardsData {
  balance: UserBalances;
  events: RewardEvent[];
}

export function RewardsTab() {
  const [userId, setUserId] = useState("");
  const [data, setData] = useState<RewardsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adjusting, setAdjusting] = useState(false);
  const [deltaDream, setDeltaDream] = useState("");
  const [deltaSheep, setDeltaSheep] = useState("");
  const [reason, setReason] = useState("");

  const operatorToken = localStorage.getItem("operatorToken") || "";

  const fetchUserRewards = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/rewards/${userId}`, {
        headers: {
          Authorization: `Bearer ${operatorToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch rewards");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjust = async () => {
    if (!userId) return;
    if (!deltaDream && !deltaSheep) {
      setError("At least one delta is required");
      return;
    }
    setAdjusting(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/rewards/${userId}/adjust`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${operatorToken}`,
        },
        body: JSON.stringify({
          deltaDream: deltaDream ? parseInt(deltaDream, 10) : undefined,
          deltaSheep: deltaSheep ? parseInt(deltaSheep, 10) : undefined,
          reason,
        }),
      });
      if (!res.ok) throw new Error("Failed to adjust balance");
      await fetchUserRewards();
      setDeltaDream("");
      setDeltaSheep("");
      setReason("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">User Rewards</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">User ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
              className="flex-1 px-3 py-2 border rounded bg-black text-white"
            />
            <button
              onClick={fetchUserRewards}
              disabled={!userId || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Fetch"}
            </button>
          </div>
        </div>

        {error && <div className="p-3 bg-red-900/50 text-red-200 rounded">{error}</div>}

        {data && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-900 rounded">
                <div className="text-sm text-gray-400">DREAM Balance</div>
                <div className="text-2xl font-bold text-blue-400">{data.balance.dream}</div>
              </div>
              <div className="p-4 bg-gray-900 rounded">
                <div className="text-sm text-gray-400">SHEEP Balance</div>
                <div className="text-2xl font-bold text-yellow-400">{data.balance.sheep}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-900 rounded">
                <div className="text-sm text-gray-400">Streak Days</div>
                <div className="text-xl font-semibold">{data.balance.streakDays || 0}</div>
              </div>
              <div className="p-4 bg-gray-900 rounded">
                <div className="text-sm text-gray-400">Last Daily Claim</div>
                <div className="text-sm">
                  {data.balance.lastDailyClaimAt
                    ? new Date(data.balance.lastDailyClaimAt).toLocaleString()
                    : "Never"}
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-900 rounded">
              <h3 className="font-semibold mb-3">Adjust Balance</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Delta DREAM</label>
                  <input
                    type="number"
                    value={deltaDream}
                    onChange={(e) => setDeltaDream(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border rounded bg-black text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Delta SHEEP</label>
                  <input
                    type="number"
                    value={deltaSheep}
                    onChange={(e) => setDeltaSheep(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border rounded bg-black text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Reason</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Admin adjustment reason"
                    className="w-full px-3 py-2 border rounded bg-black text-white"
                  />
                </div>
                <button
                  onClick={handleAdjust}
                  disabled={adjusting || (!deltaDream && !deltaSheep)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {adjusting ? "Adjusting..." : "Adjust Balance"}
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-900 rounded">
              <h3 className="font-semibold mb-3">Recent Reward Events</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">DREAM</th>
                      <th className="text-left p-2">SHEEP</th>
                      <th className="text-left p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.events.map((event) => (
                      <tr key={event.id} className="border-b border-gray-800">
                        <td className="p-2">{event.type}</td>
                        <td className={`p-2 ${event.deltaDream > 0 ? "text-green-400" : event.deltaDream < 0 ? "text-red-400" : ""}`}>
                          {event.deltaDream > 0 ? "+" : ""}
                          {event.deltaDream}
                        </td>
                        <td className={`p-2 ${event.deltaSheep > 0 ? "text-green-400" : event.deltaSheep < 0 ? "text-red-400" : ""}`}>
                          {event.deltaSheep > 0 ? "+" : ""}
                          {event.deltaSheep}
                        </td>
                        <td className="p-2 text-gray-400">
                          {new Date(event.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

