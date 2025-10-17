"use client";

import { useEffect, useState } from "react";

/**
 * Status component displays the current health of the Dream Network.
 * It fetches the `/api/health` endpoint on mount and shows whether
 * the system is online along with the timestamp returned by the API.
 */
export default function Status() {
  const [status, setStatus] = useState<{ ok: boolean; now?: string } | null>(
    null
  );

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        setStatus(data);
      } catch (error) {
        // If the request fails, mark status as offline
        setStatus({ ok: false });
      }
    }
    fetchStatus();
  }, []);

  return (
    <div className="bg-gray-50 border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-2">Status</h2>
      {status ? (
        status.ok ? (
          <p className="text-green-600">
            Online{status.now ? ` — ${new Date(status.now).toLocaleString()}` : ""}
          </p>
        ) : (
          <p className="text-red-600">Offline</p>
        )
      ) : (
        <p className="text-gray-500">Checking...</p>
      )}
    </div>
  );
}
