import React, { useState, useEffect } from 'react';
import { WhalePackCore } from '@dreamnet/whale-pack-core';

export function WhalePackCommerce() {
  const [status, setStatus] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      const whaleStatus = WhalePackCore.status();
      setStatus(whaleStatus);
      setPlans(whaleStatus.plans || []);
    };
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return <div>Loading...</div>;

  return (
    <div className="miniapp-whale-pack">
      <div className="app-header">
        <h1>🐋 Whale Pack Commerce</h1>
        <p>TikTok Shop integration and commerce analytics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Content Plans</h3>
          <p className="stat-value">{status.planCount}</p>
        </div>
        <div className="stat-card">
          <h3>Products</h3>
          <p className="stat-value">{status.productCount}</p>
        </div>
        <div className="stat-card">
          <h3>Audiences</h3>
          <p className="stat-value">{status.audienceCount}</p>
        </div>
        <div className="stat-card">
          <h3>Engagement</h3>
          <p className="stat-value">{status.totalEngagements}</p>
        </div>
      </div>

      <div className="plans-section">
        <h2>Content Plans</h2>
        <div className="plans-list">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h3>{plan.hook}</h3>
              <p>{plan.script}</p>
              <div className="plan-meta">
                <span>Status: {plan.status}</span>
                <span>Channel: {plan.channel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

