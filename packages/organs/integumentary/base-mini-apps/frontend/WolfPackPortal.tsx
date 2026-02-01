import React, { useState, useEffect } from 'react';
import { WolfPackFundingCore } from '@dreamnet/wolfpack-funding-core';

export function WolfPackPortal() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      const status = WolfPackFundingCore.status();
      const view = WolfPackFundingCore.getFundingDashboardView();
      setDashboard(view);
      setLeads(view.leads || []);
    };
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!dashboard) return <div>Loading...</div>;

  return (
    <div className="miniapp-wolf-pack">
      <div className="app-header">
        <h1>🐺 Wolf Pack Funding Portal</h1>
        <p>View funding leads, track outreach, and manage grants</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Leads</h3>
          <p className="stat-value">{dashboard.totalLeads}</p>
        </div>
        <div className="stat-card">
          <h3>Hot Leads</h3>
          <p className="stat-value">{dashboard.hotLeadCount}</p>
        </div>
        <div className="stat-card">
          <h3>Queue Items</h3>
          <p className="stat-value">{dashboard.queueItemCount}</p>
        </div>
        <div className="stat-card">
          <h3>Follow-Ups Due</h3>
          <p className="stat-value">{dashboard.followUpDueCount}</p>
        </div>
        <div className="stat-card">
          <h3>Grant Drafts</h3>
          <p className="stat-value">{dashboard.grantDraftCount}</p>
        </div>
      </div>

      <div className="leads-table">
        <h2>Funding Leads</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Score</th>
              <th>Hot</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>{lead.type}</td>
                <td>{(lead.priorityScore * 100).toFixed(0)}</td>
                <td>{lead.isHot ? '🔥' : ''}</td>
                <td>{lead.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

