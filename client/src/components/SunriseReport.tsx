import { useState, useEffect } from "react";

interface ServiceStatus {
  name: string;
  status: "ok" | "degraded" | "down";
  version: string;
  latency_ms: number;
  kpis: {
    new_users_24h: number;
    events_24h: number;
    errors_24h: number;
  };
  last_block: number;
  error?: string;
}

interface SunriseReport {
  timestamp: string;
  services: ServiceStatus[];
  summary: {
    total_services: number;
    healthy: number;
    degraded: number;
    down: number;
  };
}

export function SunriseReport() {
  const [report, setReport] = useState<SunriseReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sunrise-report/latest")
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("No report available yet");
          }
          throw new Error(`Failed to fetch report: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="sunrise-report">
        <h2>🌅 DreamNet Sunrise Report</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sunrise-report">
        <h2>🌅 DreamNet Sunrise Report</h2>
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="sunrise-report">
        <h2>🌅 DreamNet Sunrise Report</h2>
        <p>No report available yet. Run the heartbeat script to generate a report.</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return "✅";
      case "degraded":
        return "⚠️";
      case "down":
        return "❌";
      default:
        return "❓";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "#10b981";
      case "degraded":
        return "#f59e0b";
      case "down":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="sunrise-report" style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h2>🌅 DreamNet Sunrise Report</h2>
      <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
        Generated: {new Date(report.timestamp).toLocaleString()}
      </p>

      <div style={{ marginBottom: "2rem" }}>
        <h3>Summary</h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <strong>Total Services:</strong> {report.summary.total_services}
          </div>
          <div style={{ color: "#10b981" }}>
            <strong>Healthy:</strong> {report.summary.healthy}
          </div>
          <div style={{ color: "#f59e0b" }}>
            <strong>Degraded:</strong> {report.summary.degraded}
          </div>
          <div style={{ color: "#ef4444" }}>
            <strong>Down:</strong> {report.summary.down}
          </div>
        </div>
      </div>

      <div>
        <h3>Services</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Service</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Status</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Version</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Latency</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>New Users (24h)</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Events (24h)</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Errors (24h)</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Last Block</th>
            </tr>
          </thead>
          <tbody>
            {report.services.map((service, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  backgroundColor: idx % 2 === 0 ? "#f9fafb" : "white",
                }}
              >
                <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                  {service.name}
                </td>
                <td style={{ padding: "0.5rem", color: getStatusColor(service.status) }}>
                  {getStatusIcon(service.status)} {service.status}
                </td>
                <td style={{ padding: "0.5rem" }}>v{service.version}</td>
                <td style={{ padding: "0.5rem" }}>{service.latency_ms}ms</td>
                <td style={{ padding: "0.5rem" }}>{service.kpis.new_users_24h}</td>
                <td style={{ padding: "0.5rem" }}>{service.kpis.events_24h}</td>
                <td style={{ padding: "0.5rem", color: service.kpis.errors_24h > 0 ? "#ef4444" : "#10b981" }}>
                  {service.kpis.errors_24h}
                </td>
                <td style={{ padding: "0.5rem" }}>{service.last_block || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {report.services.some((s) => s.error) && (
        <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "0.5rem" }}>
          <h4 style={{ color: "#dc2626", marginBottom: "0.5rem" }}>Errors</h4>
          {report.services
            .filter((s) => s.error)
            .map((service, idx) => (
              <div key={idx} style={{ marginBottom: "0.5rem" }}>
                <strong>{service.name}:</strong> {service.error}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

