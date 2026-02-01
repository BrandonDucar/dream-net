import React, { useState, useEffect } from 'react';
import WebhookNervousCore from '@dreamnet/webhook-nervous-core';
import { DreamStateCore } from '@dreamnet/dream-state-core';

export function MyceliumGovernmentOffice() {
  const [webhookStatus, setWebhookStatus] = useState(WebhookNervousCore.status());
  const [department, setDepartment] = useState<any>(null);
  const [neurons, setNeurons] = useState(WebhookNervousCore.getNeurons());
  const [synapses, setSynapses] = useState(WebhookNervousCore.getSynapses());
  const [antibodies, setAntibodies] = useState(WebhookNervousCore.getAntibodies());
  const [mycelia, setMycelia] = useState(WebhookNervousCore.getMycelia());
  const [pheromoneTrails, setPheromoneTrails] = useState(WebhookNervousCore.getPheromoneTrails());
  const [recentActions, setRecentActions] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      // Get Webhook Nervous Core status
      setWebhookStatus(WebhookNervousCore.status());
      setNeurons(WebhookNervousCore.getNeurons());
      setSynapses(WebhookNervousCore.getSynapses());
      setAntibodies(WebhookNervousCore.getAntibodies());
      setMycelia(WebhookNervousCore.getMycelia());
      setPheromoneTrails(WebhookNervousCore.getPheromoneTrails());

      // Get Mycelium department
      const departments = DreamStateCore.listDepartments();
      const myceliumDept = departments.find((d) => d.id === 'dept:mycelium');
      setDepartment(myceliumDept);

      // Get recent government actions for Mycelium
      const allActions = DreamStateCore.listRecentActions(50);
      const myceliumActions = allActions.filter(
        (action) => action.department === 'dept:mycelium'
      );
      setRecentActions(myceliumActions.slice(0, 10));

      // Get proposals related to Mycelium
      const allProposals = DreamStateCore.listProposals();
      const myceliumProposals = allProposals.filter((p) => {
        const dept = p.meta?.department;
        return dept === 'dept:mycelium' || p.title.toLowerCase().includes('mycelium') || p.title.toLowerCase().includes('webhook');
      });
      setProposals(myceliumProposals.slice(0, 5));
    };

    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const createAntibodyProposal = (type: string, pattern: string) => {
    const proposal = DreamStateCore.createProposal(
      'system',
      `Mycelium Antibody: ${type}`,
      `Propose new security antibody: ${type} with pattern ${pattern}`,
      {
        department: 'dept:mycelium',
        type: 'antibody',
        antibody: { type, pattern },
      }
    );
    DreamStateCore.openProposal(proposal.id);
    const allProposals = DreamStateCore.listProposals();
    setProposals(allProposals.filter((p) => p.meta?.department === 'dept:mycelium').slice(0, 5));
  };

  return (
    <div className="miniapp-mycelium-office">
      <div className="app-header">
        <h1>🍄 Mycelium Network Government Office</h1>
        <p>Manage biomimetic webhook network, routing, and security</p>
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

      {/* Network Status */}
      <div className="status-section">
        <h2>🧠 Network Status</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Neurons</h3>
            <p className="stat-value">{webhookStatus.neurons.total}</p>
            <p className="stat-label">{webhookStatus.neurons.healthy} healthy</p>
          </div>
          <div className="stat-card">
            <h3>Synapses</h3>
            <p className="stat-value">{webhookStatus.synapses.total}</p>
            <p className="stat-label">{webhookStatus.synapses.active} active</p>
          </div>
          <div className="stat-card">
            <h3>Antibodies</h3>
            <p className="stat-value">{webhookStatus.immuneSystem.antibodies}</p>
            <p className="stat-label">{webhookStatus.immuneSystem.memoryCells} memory cells</p>
          </div>
          <div className="stat-card">
            <h3>Mycelium Networks</h3>
            <p className="stat-value">{webhookStatus.mycelium.networks}</p>
            <p className="stat-label">{webhookStatus.mycelium.totalHyphae} paths</p>
          </div>
          <div className="stat-card">
            <h3>Pheromone Trails</h3>
            <p className="stat-value">{webhookStatus.antColony.pheromoneTrails}</p>
            <p className="stat-label">{webhookStatus.antColony.activeAnts} active ants</p>
          </div>
          <div className="stat-card">
            <h3>Network Health</h3>
            <p className="stat-value">{webhookStatus.health}/100</p>
            <p className="stat-label">{webhookStatus.health >= 80 ? '✅ Healthy' : webhookStatus.health >= 50 ? '⚠️ Degraded' : '❌ Critical'}</p>
          </div>
        </div>
      </div>

      {/* Neurons */}
      <div className="neurons-section">
        <h2>🧠 Neurons (Webhook Endpoints)</h2>
        <div className="neurons-list">
          {neurons.length > 0 ? (
            neurons.map((neuron) => (
              <div key={neuron.id} className="neuron-card">
                <div className="neuron-header">
                  <span className={`neuron-health ${neuron.health}`}>
                    {neuron.health === 'healthy' ? '✅' : neuron.health === 'degraded' ? '⚠️' : '❌'}
                  </span>
                  <span className="neuron-type">{neuron.type}</span>
                  {neuron.circuitBreakerTripped && <span className="circuit-breaker">⚡ Tripped</span>}
                </div>
                <p className="neuron-address">{neuron.address}</p>
                <p className="neuron-stats">
                  Failures: {neuron.failureCount} | Last Ping: {new Date(neuron.lastPing).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="no-neurons">No neurons registered yet. Webhooks will auto-discover when available.</p>
          )}
        </div>
      </div>

      {/* Mycelium Networks */}
      <div className="mycelium-section">
        <h2>🍄 Mycelium Networks</h2>
        <div className="mycelium-list">
          {mycelia.length > 0 ? (
            mycelia.map((network) => (
              <div key={network.id} className="mycelium-card">
                <h3>{network.name}</h3>
                <p className="mycelium-status">
                  {network.active ? '✅ Active' : '⏸️ Inactive'}
                </p>
                <p className="mycelium-hyphae">
                  Hyphae: {network.hyphae.length}
                </p>
                <p className="mycelium-root">
                  Root Neuron: {network.rootNeuronId}
                </p>
              </div>
            ))
          ) : (
            <p className="no-mycelium">No mycelium networks created yet. Networks form automatically as webhooks connect.</p>
          )}
        </div>
      </div>

      {/* Pheromone Trails */}
      <div className="trails-section">
        <h2>🐜 Pheromone Trails</h2>
        <div className="trails-list">
          {pheromoneTrails.length > 0 ? (
            pheromoneTrails.map((trail) => (
              <div key={trail.id} className="trail-card">
                <div className="trail-header">
                  <span className="trail-strength">
                    Strength: {(trail.pheromoneLevel * 100).toFixed(1)}%
                  </span>
                  <span className="trail-path">
                    Path: {trail.path.join(' → ')}
                  </span>
                </div>
                <p className="trail-updated">
                  Last Updated: {new Date(trail.lastUpdated).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="no-trails">No pheromone trails yet. Trails form as webhooks are successfully delivered.</p>
          )}
        </div>
      </div>

      {/* Governance */}
      <div className="governance-section">
        <h2>🗳️ Governance</h2>
        <div className="governance-actions">
          <button
            onClick={() => createAntibodyProposal('rate_limit', '100_requests_per_minute')}
            className="action-button"
          >
            Propose Rate Limit Antibody
          </button>
          <button
            onClick={() => createAntibodyProposal('payload_size', 'max_1MB')}
            className="action-button"
          >
            Propose Payload Size Antibody
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

