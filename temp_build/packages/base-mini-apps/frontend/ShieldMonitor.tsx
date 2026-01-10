import React, { useState, useEffect } from 'react';
import { ShieldCore } from '@dreamnet/shield-core';

export function ShieldMonitor() {
  const [shieldStatus, setShieldStatus] = useState<any>(null);

  useEffect(() => {
    const loadData = () => {
      const status = ShieldCore.status();
      setShieldStatus(status);
    };
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!shieldStatus) return <div>Loading...</div>;

  return (
    <div className="miniapp-shield-monitor">
      <div className="app-header">
        <h1>🛡️ Shield Status Monitor</h1>
        <p>Monitor DreamNet's multi-layer shield system and threat detection</p>
      </div>

      <div className="shield-overview">
        <div className={`status-badge ${shieldStatus.shieldHealth}`}>
          <h2>Shield Health: {shieldStatus.shieldHealth.toUpperCase()}</h2>
          <p>Integrity: {(shieldStatus.overallIntegrity * 100).toFixed(1)}%</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Active Layers</h3>
          <p className="stat-value">{shieldStatus.activeLayers}/{shieldStatus.totalLayers}</p>
        </div>
        <div className="stat-card">
          <h3>Threats Detected</h3>
          <p className="stat-value">{shieldStatus.threatsDetected}</p>
        </div>
        <div className="stat-card">
          <h3>Threats Blocked</h3>
          <p className="stat-value">{shieldStatus.threatsBlocked}</p>
        </div>
        <div className="stat-card">
          <h3>Spikes Fired</h3>
          <p className="stat-value">{shieldStatus.spikesFired}</p>
        </div>
        <div className="stat-card">
          <h3>Cellular Shields</h3>
          <p className="stat-value">{shieldStatus.cellularShieldCount || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Wormhole Signals</h3>
          <p className="stat-value">{shieldStatus.recentWormholeSignals?.length || 0}</p>
        </div>
      </div>

      <div className="threats-section">
        <h2>Recent Threats</h2>
        <div className="threats-list">
          {shieldStatus.recentThreats?.slice(0, 10).map((threat: any) => (
            <div key={threat.id} className={`threat-card ${threat.level}`}>
              <h3>{threat.type}</h3>
              <p>Level: {threat.level}</p>
              <p>Blocked: {threat.blocked ? '✅' : '❌'}</p>
              <p>Source: {threat.source || 'Unknown'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

