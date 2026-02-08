import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface GodDream {
  dreamId: string;
  title: string;
  status: string;
  trustScore: number;
  infected: boolean;
  remixCount: number;
  bountyAmount?: number;
  lastActivity: number;
}

interface GodCommand {
  action: string;
  dreamId: string;
  params?: any;
}

export default function GodTerminal() {
  const queryClient = useQueryClient();
  const [selectedDream, setSelectedDream] = useState<string | null>(null);
  const [executing, setExecuting] = useState<string | null>(null);

  const { data: godDreams, isLoading } = useQuery<GodDream[]>({
    queryKey: ['/api/god/dreams'],
    queryFn: async () => {
      const response = await fetch('/api/god/dreams', {
        headers: { 'x-admin-key': 'GOD_MODE_ACCESS' }
      });
      if (!response.ok) {
        throw new Error('Access denied');
      }
      return response.json();
    }
  });

  const godCommandMutation = useMutation({
    mutationFn: async (command: GodCommand) => {
      return apiRequest('/api/god/execute', {
        method: 'POST',
        headers: { 'x-admin-key': 'GOD_MODE_ACCESS' },
        body: JSON.stringify(command)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/god/dreams'] });
      setExecuting(null);
    },
    onError: () => {
      setExecuting(null);
    }
  });

  const executeCommand = (action: string, dreamId: string, params?: any) => {
    setExecuting(`${action}-${dreamId}`);
    godCommandMutation.mutate({ action, dreamId, params });
  };

  const getStatusColor = (status: string, infected: boolean) => {
    if (infected) return 'text-red-400';
    switch (status) {
      case 'active': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'quarantined': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getTrustColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    if (score >= 25) return 'text-orange-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-red-400 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading God Terminal...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-red-400 p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        <section className="god-terminal">
          <h1 className="text-4xl font-bold text-center mb-8 text-red-500">
            🧬 God Mode Terminal
          </h1>
          
          <div className="bg-gray-900 border-2 border-red-600 rounded-lg p-6 mb-8">
            <div className="text-center text-red-300 mb-4">
              <p className="text-sm">⚠️ ADMIN ACCESS LEVEL: DIVINE ⚠️</p>
              <p className="text-xs text-gray-400">Proceed with extreme caution</p>
            </div>
          </div>

          {/* God Command Panel */}
          {!godDreams || godDreams.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
              <p className="text-2xl mb-4">🌟 All dreams are pure</p>
              <p>No infected or problematic dreams detected</p>
            </div>
          ) : (
            <div className="space-y-6">
              {godDreams.map((dream) => (
                <div 
                  key={dream.dreamId}
                  className="god-command bg-gray-900 border-2 border-red-800 rounded-lg p-6 hover:border-red-600 transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold text-red-400 mb-4">
                    Dream: {dream.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                    <p>
                      <span className="text-gray-400">Status:</span>{' '}
                      <span className={`font-semibold ${getStatusColor(dream.status, dream.infected)}`}>
                        {dream.infected ? 'Infected' : dream.status.charAt(0).toUpperCase() + dream.status.slice(1)}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-400">Trust Score:</span>{' '}
                      <span className={`font-semibold ${getTrustColor(dream.trustScore)}`}>
                        {dream.trustScore}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-400">Remixes:</span>{' '}
                      <span className="text-cyan-400">{dream.remixCount}</span>
                    </p>
                  </div>

                  {dream.infected && (
                    <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded p-3 mb-4">
                      <p className="text-red-300 text-sm">
                        ⚠️ INFECTION DETECTED: This dream shows signs of malicious activity
                      </p>
                    </div>
                  )}

                  {/* God Commands */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => executeCommand('purge', dream.dreamId)}
                      disabled={executing === `purge-${dream.dreamId}` || godCommandMutation.isPending}
                      className="px-4 py-2 bg-red-800 hover:bg-red-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      {executing === `purge-${dream.dreamId}` ? (
                        <>
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Purging...
                        </>
                      ) : (
                        <>
                          🔥 Purge Dream
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => executeCommand('bonus', dream.dreamId, { amount: 1000 })}
                      disabled={executing === `bonus-${dream.dreamId}` || godCommandMutation.isPending}
                      className="px-4 py-2 bg-gold-600 hover:bg-gold-700 disabled:bg-gray-700 text-black font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      {executing === `bonus-${dream.dreamId}` ? (
                        <>
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                          Sending...
                        </>
                      ) : (
                        <>
                          ✨ Send Bonus
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => executeCommand('infect-tree', dream.dreamId)}
                      disabled={executing === `infect-tree-${dream.dreamId}` || godCommandMutation.isPending}
                      className="px-4 py-2 bg-purple-800 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      {executing === `infect-tree-${dream.dreamId}` ? (
                        <>
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Infecting...
                        </>
                      ) : (
                        <>
                          🦠 Infect Remix Tree
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => executeCommand('quarantine', dream.dreamId)}
                      disabled={executing === `quarantine-${dream.dreamId}` || godCommandMutation.isPending}
                      className="px-4 py-2 bg-orange-800 hover:bg-orange-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      {executing === `quarantine-${dream.dreamId}` ? (
                        <>
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Quarantining...
                        </>
                      ) : (
                        <>
                          🔒 Quarantine
                        </>
                      )}
                    </button>
                  </div>

                  {/* Additional Dream Details */}
                  <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">
                    <div className="flex justify-between">
                      <span>Dream ID: {dream.dreamId}</span>
                      <span>Last Activity: {new Date(dream.lastActivity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Navigation */}
        <div className="mt-12 flex justify-center gap-4">
          <button 
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-black font-semibold rounded-lg transition-colors"
            onClick={() => window.history.back()}
          >
            ← Back to Dashboard
          </button>
          <button 
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            onClick={() => window.location.href = '/dream-graveyard'}
          >
            💀 View Graveyard
          </button>
        </div>
      </div>
    </div>
  );
}