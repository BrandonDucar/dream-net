import React, { useState, useEffect } from 'react';
import { APIKeeperCore } from '@dreamnet/api-keeper-core';

export function APIKeeperDashboard() {
  const [status, setStatus] = useState(APIKeeperCore.status());
  const [providers, setProviders] = useState(APIKeeperCore.listProviders());
  const [keys, setKeys] = useState(APIKeeperCore.listKeys());
  const [railGuards, setRailGuards] = useState(APIKeeperCore.listActiveRailGuards());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(APIKeeperCore.status());
      setProviders(APIKeeperCore.listProviders());
      setKeys(APIKeeperCore.listKeys());
      setRailGuards(APIKeeperCore.listActiveRailGuards());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="miniapp-api-keeper">
      <div className="app-header">
        <h1>🔑 API Keeper Dashboard</h1>
        <p>Manage API keys, monitor costs, and configure rail guards</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Providers</h3>
          <p className="stat-value">{status.providerCount}</p>
          <p className="stat-label">{status.activeProviderCount} active</p>
        </div>
        <div className="stat-card">
          <h3>API Keys</h3>
          <p className="stat-value">{status.keyCount}</p>
          <p className="stat-label">{status.activeKeyCount} active</p>
        </div>
        <div className="stat-card">
          <h3>Cost Today</h3>
          <p className="stat-value">${status.costToday.toFixed(2)}</p>
          <p className="stat-label">${status.costThisMonth.toFixed(2)} this month</p>
        </div>
        <div className="stat-card">
          <h3>Requests</h3>
          <p className="stat-value">{status.requestsToday}</p>
          <p className="stat-label">{status.totalRequests} total</p>
        </div>
      </div>

      <div className="sections">
        <section className="providers-section">
          <h2>API Providers</h2>
          <div className="providers-list">
            {providers.map((provider) => (
              <div key={provider.id} className="provider-card">
                <h3>{provider.name}</h3>
                <p>{provider.description}</p>
                <div className="provider-metrics">
                  <span>Quality: {(provider.quality * 100).toFixed(0)}%</span>
                  <span>Reliability: {(provider.reliability * 100).toFixed(0)}%</span>
                  {provider.pricing.payPerUse?.pricePerRequest && (
                    <span>Cost: ${provider.pricing.payPerUse.pricePerRequest.toFixed(4)}/req</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="keys-section">
          <h2>API Keys</h2>
          <div className="keys-list">
            {keys.map((key) => (
              <div key={key.id} className="key-card">
                <h3>{key.name}</h3>
                <p>Provider: {key.providerId}</p>
                <p>Status: {key.status}</p>
                <p>Usage: {key.usageThisMonth} this month</p>
                <p>Cost: ${key.costThisMonth.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rail-guards-section">
          <h2>Rail Guards</h2>
          <div className="guards-list">
            {railGuards.map((guard) => (
              <div key={guard.id} className="guard-card">
                <h3>{guard.name}</h3>
                <p>Type: {guard.type}</p>
                <p>Limit: {guard.limit}</p>
                <p>Current: {guard.current}</p>
                <p>Action: {guard.action}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

