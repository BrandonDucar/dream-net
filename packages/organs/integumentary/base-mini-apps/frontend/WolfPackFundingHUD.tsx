import React, { useState } from 'react';

type LeadStatus = 'New' | 'Contacted' | 'Warm' | 'Closed';

interface InvestorLead {
  id: string;
  name: string;
  email: string;
  score: number;
  status: LeadStatus;
  lastContact?: string;
  notes?: string;
}

export function WolfPackFundingHUD() {
  const [filter, setFilter] = useState<LeadStatus | 'All'>('All');
  const [leads] = useState<InvestorLead[]>([
    {
      id: '1',
      name: 'VC Alpha Fund',
      email: 'contact@vcalpha.com',
      score: 92,
      status: 'Warm',
      lastContact: '2024-01-15',
      notes: 'Very interested, follow up next week',
    },
    {
      id: '2',
      name: 'Beta Capital',
      email: 'info@betacap.com',
      score: 78,
      status: 'Contacted',
      lastContact: '2024-01-10',
    },
    {
      id: '3',
      name: 'Gamma Ventures',
      email: 'hello@gammavc.com',
      score: 85,
      status: 'Warm',
      lastContact: '2024-01-12',
    },
    {
      id: '4',
      name: 'Delta Angels',
      email: 'invest@deltaangels.com',
      score: 65,
      status: 'New',
    },
    {
      id: '5',
      name: 'Epsilon Partners',
      email: 'partners@epsilon.com',
      score: 88,
      status: 'Closed',
      lastContact: '2024-01-08',
      notes: 'Successfully closed!',
    },
  ]);

  const filteredLeads = filter === 'All' 
    ? leads 
    : leads.filter(lead => lead.status === filter);

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Contacted':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Warm':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Closed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🐺 Wolf Pack Funding HUD
          </h1>
          <p className="text-gray-400 mb-6">Track investor leads and funding pipeline</p>

          <div className="mb-6">
            <div className="flex gap-2 flex-wrap">
              {(['All', 'New', 'Contacted', 'Warm', 'Closed'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === status
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {status} ({status === 'All' ? leads.length : leads.filter(l => l.status === status).length})
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>No leads found for this filter</p>
              </div>
            ) : (
              filteredLeads.map(lead => (
                <div
                  key={lead.id}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(lead.status)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">{lead.name}</h3>
                        <span className={`text-sm font-semibold ${getScoreColor(lead.score)}`}>
                          Score: {lead.score}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{lead.email}</p>
                      {lead.lastContact && (
                        <p className="text-xs text-gray-400 mt-1">
                          Last contact: {lead.lastContact}
                        </p>
                      )}
                      {lead.notes && (
                        <p className="text-sm text-gray-300 mt-2 italic">{lead.notes}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded capitalize ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-400">
              📝 TODO: Connect to wolfpack-funding-core for real lead data
            </p>
            <p className="text-sm text-gray-400 mt-1">
              📝 TODO: Integrate with /api/wolf-pack/leads endpoint
            </p>
            <p className="text-sm text-gray-400 mt-1">
              📝 TODO: Add lead creation and editing functionality
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

