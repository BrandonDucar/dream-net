import { useState, useEffect } from "react";
import type { DreamTokenEvent } from "@dreamnet/dream-token";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface DreamTokenConfig {
  maxSupply: string;
  decimals: number;
  symbol: string;
  name: string;
  emissionModel: string;
}

interface DreamTokenData {
  config: DreamTokenConfig;
  events: DreamTokenEvent[];
  topUsersByInternal: Array<{ userId: string; dream: number }>;
  topUsersByClaimable: Array<{ userId: string; claimableBalance: string }>;
  totalSimulatedIssued: string;
}

export function DreamTokenTab() {
  const [data, setData] = useState<DreamTokenData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [burning, setBurning] = useState(false);
  const [mintUserId, setMintUserId] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [burnUserId, setBurnUserId] = useState("");
  const [burnAmount, setBurnAmount] = useState("");

  const operatorToken = localStorage.getItem("operatorToken") || "";

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [configRes, eventsRes] = await Promise.all([
        fetch(`${API_BASE}/api/dream/config`),
        fetch(`${API_BASE}/api/admin/dream/events`, {
          headers: {
            Authorization: `Bearer ${operatorToken}`,
          },
        }),
      ]);

      if (!configRes.ok || !eventsRes.ok) throw new Error("Failed to fetch data");

      const configJson = await configRes.json();
      const eventsJson = await eventsRes.json();

      // Calculate totals
      const mintEvents = eventsJson.events.filter((e: DreamTokenEvent) => e.type === "mint");
      const totalIssued = mintEvents.reduce(
        (sum: bigint, e: DreamTokenEvent) => sum + BigInt(e.amount || "0"),
        BigInt(0),
      );

      // Get top users (simplified - in production, you'd query all users)
      // For now, we'll just show from events
      const userDreamMap = new Map<string, number>();
      const userClaimableMap = new Map<string, bigint>();

      // This is a simplified approach - in production, you'd query all users
      const topUsersByInternal: Array<{ userId: string; dream: number }> = [];
      const topUsersByClaimable: Array<{ userId: string; claimableBalance: string }> = [];

      setData({
        config: configJson.config,
        events: eventsJson.events,
        topUsersByInternal,
        topUsersByClaimable,
        totalSimulatedIssued: totalIssued.toString(),
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const handleMint = async () => {
    if (!mintUserId || !mintAmount) {
      setError("User ID and amount required");
      return;
    }
    setMinting(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/dream/mint-simulated`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${operatorToken}`,
        },
        body: JSON.stringify({
          userId: mintUserId,
          amount: mintAmount,
        }),
      });
      if (!res.ok) throw new Error("Failed to simulate mint");
      await fetchData();
      setMintUserId("");
      setMintAmount("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setMinting(false);
    }
  };

  const handleBurn = async () => {
    if (!burnUserId || !burnAmount) {
      setError("User ID and amount required");
      return;
    }
    setBurning(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/dream/burn-simulated`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${operatorToken}`,
        },
        body: JSON.stringify({
          userId: burnUserId,
          amount: burnAmount,
        }),
      });
      if (!res.ok) throw new Error("Failed to simulate burn");
      await fetchData();
      setBurnUserId("");
      setBurnAmount("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBurning(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="p-6">
        <div className="text-gray-400">Loading DREAM Token data...</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">DREAM Token</h2>

      {error && <div className="p-3 bg-red-900/50 text-red-200 rounded">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-900 rounded">
          <div className="text-sm text-gray-400">Max Supply</div>
          <div className="text-2xl font-bold text-blue-400">
            {parseInt(data.config.maxSupply).toLocaleString()} {data.config.symbol}
          </div>
        </div>
        <div className="p-4 bg-gray-900 rounded">
          <div className="text-sm text-gray-400">Total Simulated Issued</div>
          <div className="text-2xl font-bold text-green-400">
            {parseInt(data.totalSimulatedIssued || "0").toLocaleString()} {data.config.symbol}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-900 rounded">
        <h3 className="font-semibold mb-3">Simulate Mint</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">User ID</label>
            <input
              type="text"
              value={mintUserId}
              onChange={(e) => setMintUserId(e.target.value)}
              placeholder="user-id"
              className="w-full px-3 py-2 border rounded bg-black text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Amount</label>
            <input
              type="number"
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
              placeholder="1000"
              className="w-full px-3 py-2 border rounded bg-black text-white"
            />
          </div>
          <button
            onClick={handleMint}
            disabled={minting || !mintUserId || !mintAmount}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {minting ? "Minting..." : "Simulate Mint"}
          </button>
        </div>
      </div>

      <div className="p-4 bg-gray-900 rounded">
        <h3 className="font-semibold mb-3">Simulate Burn</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">User ID</label>
            <input
              type="text"
              value={burnUserId}
              onChange={(e) => setBurnUserId(e.target.value)}
              placeholder="user-id"
              className="w-full px-3 py-2 border rounded bg-black text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Amount</label>
            <input
              type="number"
              value={burnAmount}
              onChange={(e) => setBurnAmount(e.target.value)}
              placeholder="1000"
              className="w-full px-3 py-2 border rounded bg-black text-white"
            />
          </div>
          <button
            onClick={handleBurn}
            disabled={burning || !burnUserId || !burnAmount}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {burning ? "Burning..." : "Simulate Burn"}
          </button>
        </div>
      </div>

      <div className="p-4 bg-gray-900 rounded">
        <h3 className="font-semibold mb-3">Token Events</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">User ID</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.events.slice(0, 50).map((event) => (
                <tr key={event.id} className="border-b border-gray-800">
                  <td className="p-2">{event.type}</td>
                  <td className="p-2 text-gray-400">{event.userId || "—"}</td>
                  <td className="p-2">{parseInt(event.amount || "0").toLocaleString()}</td>
                  <td className="p-2 text-gray-400">
                    {new Date(event.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

