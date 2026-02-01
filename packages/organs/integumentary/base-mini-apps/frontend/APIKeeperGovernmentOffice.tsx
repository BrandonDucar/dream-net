import React, { useState, useEffect } from 'react';
import { APIKeeperCore } from '@dreamnet/api-keeper-core';
import { DreamStateCore } from '@dreamnet/dream-state-core';

export function APIKeeperGovernmentOffice() {
  const [apiKeeperStatus, setAPIKeeperStatus] = useState(APIKeeperCore.status());
  const [department, setDepartment] = useState<any>(null);
  const [providers, setProviders] = useState(APIKeeperCore.listProviders());
  const [keys, setKeys] = useState(APIKeeperCore.listKeys());
  const [railGuards, setRailGuards] = useState(APIKeeperCore.listActiveRailGuards());
  const [recentActions, setRecentActions] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      // Get API Keeper status
      setAPIKeeperStatus(APIKeeperCore.status());
      setProviders(APIKeeperCore.listProviders());
      setKeys(APIKeeperCore.listKeys());
      setRailGuards(APIKeeperCore.listActiveRailGuards());

      // Get API Keeper department
      const departments = DreamStateCore.listDepartments();
      const apiKeeperDept = departments.find((d) => d.id === 'dept:api-keeper');
      setDepartment(apiKeeperDept);

      // Get recent government actions for API Keeper
      const allActions = DreamStateCore.listRecentActions(50);
      const apiKeeperActions = allActions.filter(
        (action) => action.department === 'dept:api-keeper'
      );
      setRecentActions(apiKeeperActions.slice(0, 10));

      // Get proposals related to API Keeper
      const allProposals = DreamStateCore.listProposals();
      const apiKeeperProposals = allProposals.filter((p) => {
        const dept = p.meta?.department;
        return dept === 'dept:api-keeper' || p.title.toLowerCase().includes('api');
      });
      setProposals(apiKeeperProposals.slice(0, 5));
    };

    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const createBudgetProposal = () => {
    // Create a proposal for API Keeper budget
    const proposal = DreamStateCore.createProposal(
      'system',
      'API Keeper Budget Allocation',
      `Propose budget allocation for API Keeper Department. Current monthly spend: $${apiKeeperStatus.costThisMonth.toFixed(2)}`,
      {
        department: 'dept:api-keeper',
        type: 'budget',
        currentSpend: apiKeeperStatus.costThisMonth,
      }
    );
    DreamStateCore.openProposal(proposal.id);
    // Reload proposals
    const allProposals = DreamStateCore.listProposals();
    setProposals(allProposals.filter((p) => p.meta?.department === 'dept:api-keeper').slice(0, 5));
  };

  const createRailGuardProposal = (name: string, type: string, limit: number) => {
    const proposal = DreamStateCore.createProposal(
      'system',
      `API Keeper Rail Guard: ${name}`,
      `Propose new rail guard: ${name} (${type}) with limit ${limit}`,
      {
        department: 'dept:api-keeper',
        type: 'rail-guard',
        railGuard: { name, type, limit },
      }
    );
    DreamStateCore.openProposal(proposal.id);
    const allProposals = DreamStateCore.listProposals();
    setProposals(allProposals.filter((p) => p.meta?.department === 'dept:api-keeper').slice(0, 5));
  };

  return (
    <div className="miniapp-api-keeper-office">
      <div className="app-header">
        <h1>🏛️ API Keeper Government Office</h1>
        <p>Manage API Keeper Department operations, budgets, and governance</p>
      </div>

      {/* Department Overview */}
      {department && (
        <div className="department-overview">
          <div className="dept-card large">
            <h2>{department.name}</h2>
            <p className="dept-leader">Leader: {department.leader}</p>
            <div className="dept-responsibilities">
              <h3>Responsibilities:</h3>
              <ul>
                {department.responsibilities.map((resp: string, i: number) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
            {department.budget && (
              <p className="dept-budget">Budget: ${department.budget.toFixed(2)}</p>
            )}
          </div>
        </div>
      )}

      {/* Financial Overview */}
      <div className="financial-section">
        <h2>💰 Financial Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Cost Today</h3>
            <p className="stat-value">${apiKeeperStatus.costToday.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Cost This Month</h3>
            <p className="stat-value">${apiKeeperStatus.costThisMonth.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Requests Today</h3>
            <p className="stat-value">{apiKeeperStatus.requestsToday}</p>
          </div>
          <div className="stat-card">
            <h3>Total Requests</h3>
            <p className="stat-value">{apiKeeperStatus.totalRequests}</p>
          </div>
        </div>
      </div>

      {/* Department Resources */}
      <div className="resources-section">
        <h2>🔑 Department Resources</h2>
        <div className="resources-grid">
          <div className="resource-card">
            <h3>API Providers</h3>
            <p className="resource-count">{apiKeeperStatus.providerCount}</p>
            <p className="resource-label">{apiKeeperStatus.activeProviderCount} active</p>
          </div>
          <div className="resource-card">
            <h3>API Keys</h3>
            <p className="resource-count">{apiKeeperStatus.keyCount}</p>
            <p className="resource-label">{apiKeeperStatus.activeKeyCount} active</p>
          </div>
          <div className="resource-card">
            <h3>Rail Guards</h3>
            <p className="resource-count">{railGuards.length}</p>
            <p className="resource-label">Active safety limits</p>
          </div>
        </div>
      </div>

      {/* Governance Actions */}
      <div className="governance-section">
        <h2>🗳️ Governance</h2>
        <div className="governance-actions">
          <button onClick={createBudgetProposal} className="action-button">
            Create Budget Proposal
          </button>
          <button
            onClick={() => createRailGuardProposal('Monthly Budget', 'monthly-cost', 500)}
            className="action-button"
          >
            Propose Monthly Budget Limit
          </button>
          <button
            onClick={() => createRailGuardProposal('Daily Budget', 'daily-cost', 20)}
            className="action-button"
          >
            Propose Daily Budget Limit
          </button>
        </div>

        {/* Active Proposals */}
        {proposals.length > 0 && (
          <div className="proposals-list">
            <h3>Active Proposals</h3>
            {proposals.map((proposal) => (
              <div key={proposal.id} className="proposal-card">
                <h4>{proposal.title}</h4>
                <p>{proposal.description}</p>
                <div className="proposal-status">
                  <span>Status: {proposal.status}</span>
                  <span>For: {proposal.votesFor}</span>
                  <span>Against: {proposal.votesAgainst}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Government Actions */}
      <div className="actions-section">
        <h2>📋 Recent Government Actions</h2>
        {recentActions.length > 0 ? (
          <div className="actions-list">
            {recentActions.map((action) => (
              <div key={action.id} className="action-card">
                <div className="action-header">
                  <span className="action-type">{action.type}</span>
                  <span className="action-time">
                    {new Date(action.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="action-description">{action.action}</p>
                <p className="action-author">Authorized by: {action.authorizedBy}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-actions">No recent actions recorded</p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="quick-stats-section">
        <h2>📊 Quick Stats</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Top Provider:</span>
            <span className="stat-value">
              {providers.length > 0
                ? providers.sort((a, b) => b.quality - a.quality)[0].name
                : 'N/A'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Most Used Key:</span>
            <span className="stat-value">
              {keys.length > 0
                ? keys.sort((a, b) => b.usageThisMonth - a.usageThisMonth)[0].name
                : 'N/A'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg Cost/Request:</span>
            <span className="stat-value">
              $
              {apiKeeperStatus.totalRequests > 0
                ? (apiKeeperStatus.costThisMonth / apiKeeperStatus.totalRequests).toFixed(4)
                : '0.0000'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

