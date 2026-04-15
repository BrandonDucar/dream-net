import React from "react";
import { governor } from "../governor/config";

function getCookie(name: string) {
  return document.cookie.split("; ").find((c) => c.startsWith(name + "="));
}
const isAdmin = () => !!getCookie("dreamnet_admin");

export default function AdminOverlay() {
  const [open, setOpen] = React.useState(false);
  const [isAdminView, setIsAdminView] = React.useState(isAdmin());

  React.useEffect(() => {
    setIsAdminView(isAdmin());
  }, []);

  if (!isAdminView) return null;

  return (
    <div
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 9999,
        background: "rgba(0,0,0,0.8)",
        color: "#fff",
        padding: 16,
        borderRadius: 12,
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <button onClick={() => setOpen(!open)} style={{ marginBottom: 8 }}>
        {open ? "\u25B2" : "\u25BC"} Admin Overlay
      </button>
      {open && (
        <div style={{ minWidth: 280 }}>
          <div
            style={{
              opacity: 0.8,
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            Mode: <b>{governor.mode}</b> · QPS: <b>{governor.maxQPS}</b> ·
            Concurrency: <b>{governor.maxConcurrency}</b>
          </div>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            <li>
              Simulation: <b>{String(governor.simulation)}</b>
            </li>
            <li>
              Feature: Agents <b>{String(governor.featureAgents)}</b>
            </li>
            <li>
              Feature: Payments <b>{String(governor.featurePayments)}</b>
            </li>
          </ul>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <a href="/api/admin/logout" style={{ color: "#ddd" }}>
              Logout
            </a>
            <a
              href="/api/health"
              style={{ color: "#ddd" }}
              target="_blank"
              rel="noreferrer"
            >
              /health
            </a>
          </div>
          <div
            style={{
              marginTop: 8,
              borderTop: "1px solid #333",
              paddingTop: 8,
              fontSize: 12,
              opacity: 0.8,
            }}
          >
            Speedometer (placeholder): show p50/p95 from Vercel Analytics,
            errors, spend.
          </div>
        </div>
      )}
    </div>
  );
}
