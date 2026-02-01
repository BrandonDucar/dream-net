import React from 'react';
import { useQuery } from '@tanstack/react-query';
import DreamCard from '@/components/DreamCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dna, 
  Eye, 
  Sparkles, 
  Zap,
  Archive,
  Loader2
} from 'lucide-react';

interface EvolvedDream {
  id: string;
  title: string;
  content: string;
  score: number;
  creatorWallet: string;
  evolved: boolean;
  evolutionPath: string;
  specialAbility: string;
  originalScore: number;
  evolutionTimestamp: number;
  created: number;
}

export default function EvolvedArchive() {
  const { data: dreams, isLoading, error } = useQuery<EvolvedDream[]>({
    queryKey: ['/api/evolved-dreams'],
  });

  const getEvolutionStats = () => {
    if (!dreams) return { total: 0, visionary: 0, protean: 0, oracle: 0 };
    return {
      total: dreams.length,
      visionary: dreams.filter(d => d.evolutionPath === 'Visionary').length,
      protean: dreams.filter(d => d.evolutionPath === 'Protean').length,
      oracle: dreams.filter(d => d.evolutionPath === 'Oracle').length,
    };
  };

  const stats = getEvolutionStats();

  if (isLoading) {
    return (
      <div className="p-10">
        <div className="flex items-center justify-center min-h-96">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            <span className="text-slate-300">Loading evolved dreams...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">Archive Access Error</h2>
            <p className="text-red-300">Unable to load evolved dreams archive</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Archive className="w-8 h-8 text-cyan-400" />
          <h1 className="text-4xl font-bold text-white">Evolved Dream Archive</h1>
        </div>
        <p className="text-slate-300 text-lg mb-6">
          A collection of dreams that have transcended their original form through evolution
        </p>

        {/* Evolution Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-cyan-500/30 bg-slate-900/50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Dna className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-medium text-slate-300">Total Evolved</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-purple-500/5">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium text-slate-300">Visionary</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{stats.visionary}</div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-slate-300">Protean</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">{stats.protean}</div>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-slate-300">Oracle</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">{stats.oracle}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dream Grid */}
      {dreams && dreams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dreams.map((dream) => (
            <DreamCard key={dream.id} dream={dream}>
              <div className="mt-4 p-3 rounded-lg border border-green-500/30 bg-green-500/5">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="border-green-500/50 text-green-300">
                    Evolved {new Date(dream.evolutionTimestamp).toLocaleDateString()}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    +{dream.score - dream.originalScore} pts
                  </span>
                </div>
              </div>
            </DreamCard>
          ))}
        </div>
      ) : (
        <Card className="border-slate-700 bg-slate-800/50">
          <CardContent className="p-12 text-center">
            <Dna className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400 mb-2">No Evolved Dreams Yet</h3>
            <p className="text-slate-500">
              Dreams with scores of 85+ from creators with 120+ reputation can evolve into new forms
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}