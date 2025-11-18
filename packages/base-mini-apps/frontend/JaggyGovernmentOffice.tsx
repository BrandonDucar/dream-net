import React, { useState, useEffect } from 'react';
import JaggyCore from '@dreamnet/jaggy-core';
import { DreamStateCore } from '@dreamnet/dream-state-core';

export function JaggyGovernmentOffice() {
  const [jaggyStatus, setJaggyStatus] = useState(JaggyCore.status());
  const [department, setDepartment] = useState<any>(null);
  const [hunts, setHunts] = useState(JaggyCore.getActiveHunts());
  const [territories, setTerritories] = useState(JaggyCore.getTerritories());
  const [memories, setMemories] = useState(JaggyCore.getMemories());
  const [recentActions, setRecentActions] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      // Get Jaggy status
      setJaggyStatus(JaggyCore.status());
      setHunts(JaggyCore.getActiveHunts());
      setTerritories(JaggyCore.getTerritories());
      setMemories(JaggyCore.getMemories());

      // Get Jaggy department
      const departments = DreamStateCore.listDepartments();
      const jaggyDept = departments.find((d) => d.id === 'dept:jaggy');
      setDepartment(jaggyDept);

      // Get recent government actions for Jaggy
      const allActions = DreamStateCore.listRecentActions(50);
      const jaggyActions = allActions.filter(
        (action) => action.department === 'dept:jaggy'
      );
      setRecentActions(jaggyActions.slice(0, 10));

      // Get proposals related to Jaggy
      const allProposals = DreamStateCore.listProposals();
      const jaggyProposals = allProposals.filter((p) => {
        const dept = p.meta?.department;
        return dept === 'dept:jaggy' || p.title.toLowerCase().includes('jaggy') || p.title.toLowerCase().includes('sentinel');
      });
      setProposals(jaggyProposals.slice(0, 5));
    };

    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const createTerritoryProposal = (name: string, type: string) => {
    const proposal = DreamStateCore.createProposal(
      'system',
      `Jaggy Territory Expansion: ${name}`,
      `Propose new territory for Jaggy to watch: ${name} (${type})`,
      {
        department: 'dept:jaggy',
        type: 'territory',
        territory: { name, type },
      }
    );
    DreamStateCore.openProposal(proposal.id);
    const allProposals = DreamStateCore.listProposals();
    setProposals(allProposals.filter((p) => p.meta?.department === 'dept:jaggy').slice(0, 5));
  };

  return (
    <div className="miniapp-jaggy-office">
      <div className="app-header">
        <h1>🐱 Silent Sentinel Government Office</h1>
        <p>Monitor Jaggy's operations, territories, and Base fame</p>
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
          </div>
        </div>
      )}

      {/* Jaggy Status */}
      <div className="status-section">
        <h2>🐱 Jaggy Status</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Status</h3>
            <p className="stat-value">{jaggyStatus.status}</p>
          </div>
          <div className="stat-card">
            <h3>Stealth Level</h3>
            <p className="stat-value">{jaggyStatus.stealthLevel}/100</p>
          </div>
          <div className="stat-card">
            <h3>Independence</h3>
            <p className="stat-value">{jaggyStatus.independence}/100</p>
          </div>
          <div className="stat-card">
            <h3>Base Fame</h3>
            <p className="stat-value">{jaggyStatus.baseFame.toFixed(1)}/100</p>
          </div>
          <div className="stat-card">
            <h3>Kills</h3>
            <p className="stat-value">{jaggyStatus.kills}</p>
          </div>
          <div className="stat-card">
            <h3>Discovered</h3>
            <p className="stat-value">{jaggyStatus.webhooksDiscovered}</p>
          </div>
          <div className="stat-card">
            <h3>Implemented</h3>
            <p className="stat-value">{jaggyStatus.webhooksImplemented}</p>
          </div>
          <div className="stat-card">
            <h3>Threats Neutralized</h3>
            <p className="stat-value">{jaggyStatus.threatsNeutralized}</p>
          </div>
        </div>
      </div>

      {/* Territories */}
      <div className="territories-section">
        <h2>🗺️ Territories Watched</h2>
        <div className="territories-grid">
          {territories.map((territory) => (
            <div key={territory.id} className="territory-card">
              <h3>{territory.name}</h3>
              <p className="territory-type">Type: {territory.type}</p>
              <p className="territory-status">
                {territory.watched ? '✅ Watching' : '⏸️ Paused'}
              </p>
              <p className="territory-discoveries">
                Discoveries: {territory.discoveries}
              </p>
              <p className="territory-threats">
                Threats: {territory.threats}
              </p>
              <p className="territory-last-scanned">
                Last Scanned: {territory.lastScanned ? new Date(territory.lastScanned).toLocaleString() : 'Never'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Hunts */}
      <div className="hunts-section">
        <h2>🎯 Active Hunts</h2>
        {hunts.length > 0 ? (
          <div className="hunts-list">
            {hunts.map((hunt) => (
              <div key={hunt.id} className="hunt-card">
                <div className="hunt-header">
                  <span className="hunt-status">{hunt.status}</span>
                  <span className="hunt-territory">{hunt.territory}</span>
                </div>
                <p className="hunt-target">{hunt.target}</p>
                <p className="hunt-time">
                  Discovered: {new Date(hunt.discoveredAt).toLocaleString()}
                  {hunt.implementedAt && (
                    <> | Implemented: {new Date(hunt.implementedAt).toLocaleString()}</>
                  )}
                </p>
                {hunt.stealth && <span className="stealth-badge">🥷 Silent</span>}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-hunts">No active hunts. Jaggy is watching...</p>
        )}
      </div>

      {/* Memories */}
      <div className="memories-section">
        <h2>🧠 Jaggy's Memories</h2>
        <div className="memories-list">
          {memories.slice(-10).reverse().map((memory) => (
            <div key={memory.id} className="memory-card">
              <div className="memory-header">
                <span className={`memory-success ${memory.success ? 'success' : 'failed'}`}>
                  {memory.success ? '✅' : '❌'}
                </span>
                <span className="memory-action">{memory.action}</span>
                <span className="memory-strength">Strength: {(memory.strength * 100).toFixed(0)}%</span>
              </div>
              <p className="memory-pattern">{memory.pattern}</p>
              <p className="memory-time">
                {new Date(memory.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Governance */}
      <div className="governance-section">
        <h2>🗳️ Governance</h2>
        <div className="governance-actions">
          <button
            onClick={() => createTerritoryProposal('GitHub Repositories', 'external')}
            className="action-button"
          >
            Propose GitHub Territory
          </button>
          <button
            onClick={() => createTerritoryProposal('Service Configs', 'api')}
            className="action-button"
          >
            Propose Service Config Territory
          </button>
        </div>

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

      {/* Recent Actions */}
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
    </div>
  );
}

