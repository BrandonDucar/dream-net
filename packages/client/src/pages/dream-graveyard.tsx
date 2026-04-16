import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface DeadDream {
  dreamId: string;
  title: string;
  status: string;
  deathReason: string;
  dateAbandoned: number;
  lastAttemptedBy: string;
}

export default function DreamGraveyard() {
  const queryClient = useQueryClient();
  const [revivingDream, setRevivingDream] = useState<string | null>(null);

  const { data: graveyardDreams, isLoading, error } = useQuery<DeadDream[]>({
    queryKey: ['/api/dreams/graveyard'],
    queryFn: async () => {
      const response = await fetch('/api/dreams/graveyard');
      if (!response.ok) {
        throw new Error('Failed to fetch graveyard');
      }
      return response.json();
    }
  });

  const reviveMutation = useMutation({
    mutationFn: async (dreamId: string) => {
      return apiRequest(`/api/dreams/${dreamId}/revive`, {
        method: 'POST',
        headers: { 'x-wallet-address': '0xREVIVER' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dreams/graveyard'] });
      setRevivingDream(null);
    },
    onError: () => {
      setRevivingDream(null);
    }
  });

  const handleRevival = (dreamId: string) => {
    setRevivingDream(dreamId);
    reviveMutation.mutate(dreamId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading the graveyard...</div>
        </div>
      </div>
    );
  }

  if (error || !graveyardDreams) {
    return (
      <div className="min-h-screen bg-black text-red-400 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Failed to load the graveyard</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-8">
      <div className="max-w-6xl mx-auto">
        <section className="dream-graveyard">
          <h1 className="text-4xl font-bold text-center mb-8 text-red-400">
            ☠️ The Dream Graveyard
          </h1>
          
          <div className="text-center mb-8 text-gray-400">
            <p>Where abandoned dreams rest in eternal digital slumber</p>
            <p className="text-sm">Total deceased: {graveyardDreams.length}</p>
          </div>

          {graveyardDreams.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
              <p className="text-2xl mb-4">🌸 The graveyard is empty</p>
              <p>All dreams are thriving in the ecosystem</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {graveyardDreams.map((dream) => (
                <div 
                  key={dream.dreamId}
                  className="dead-dream-card glitchy bg-gray-900 border-2 border-red-800 rounded-lg p-6 hover:border-red-600 transition-all duration-300 relative overflow-hidden"
                  style={{
                    filter: 'hue-rotate(180deg) saturate(0.3)',
                    animation: 'flicker 3s infinite alternate'
                  }}
                >
                  {/* Glitch overlay effect */}
                  <div 
                    className="absolute inset-0 bg-red-900 opacity-10 pointer-events-none"
                    style={{
                      background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,0,0,0.1) 2px, rgba(255,0,0,0.1) 4px)',
                      animation: 'glitch 0.3s infinite linear alternate-reverse'
                    }}
                  />
                  
                  <h3 className="text-xl font-bold text-red-400 mb-4 relative z-10">
                    🕸️ {dream.title}
                  </h3>
                  
                  <div className="space-y-2 text-sm relative z-10">
                    <p>
                      <strong className="text-gray-400">Status:</strong>{' '}
                      <span className="text-red-300 capitalize">{dream.status}</span>
                    </p>
                    <p>
                      <strong className="text-gray-400">Cause of Death:</strong>{' '}
                      <span className="text-gray-300">{dream.deathReason}</span>
                    </p>
                    <p>
                      <strong className="text-gray-400">Date Abandoned:</strong>{' '}
                      <span className="text-gray-300">
                        {new Date(dream.dateAbandoned * 1000).toLocaleDateString()}
                      </span>
                    </p>
                    <p>
                      <strong className="text-gray-400">Last Attempted By:</strong>{' '}
                      <span className="text-gray-300 font-mono text-xs">
                        {dream.lastAttemptedBy}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleRevival(dream.dreamId)}
                    disabled={revivingDream === dream.dreamId || reviveMutation.isPending}
                    className="mt-6 w-full px-4 py-2 bg-purple-800 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors relative z-10 flex items-center justify-center gap-2"
                  >
                    {revivingDream === dream.dreamId ? (
                      <>
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Reviving...
                      </>
                    ) : (
                      <>
                        🪄 Attempt Revival
                      </>
                    )}
                  </button>
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
            onClick={() => window.location.href = '/bounty-feed'}
          >
            💀 View Active Dreams
          </button>
        </div>
      </div>

      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes glitch {
          0% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
          100% { transform: translateX(0); }
        }
        
        .glitchy:hover {
          animation: flicker 0.15s infinite, glitch 0.3s infinite;
        }
      `}</style>
    </div>
  );
}