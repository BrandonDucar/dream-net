import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Zap, 
  Eye, 
  ArrowRight,
  Dna
} from 'lucide-react';

interface Dream {
  id: string;
  title: string;
  content: string;
  score: number;
  evolving?: boolean;
  evolutionPath?: string;
  creatorWallet: string;
}

interface MutationPanelProps {
  children: React.ReactNode;
}

interface EvolutionOptionsProps {
  dream: Dream;
}

export function MutationPanel({ children }: MutationPanelProps) {
  return (
    <Card className="border border-green-500/30 bg-gradient-to-r from-green-900/20 to-emerald-900/20 mt-4">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Dna className="w-5 h-5 text-green-400" />
          <Badge variant="outline" className="border-green-500/50 text-green-300">
            Evolution Available
          </Badge>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export function EvolutionOptions({ dream }: EvolutionOptionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const evolveDreamMutation = useMutation({
    mutationFn: async ({ dreamId, path }: { dreamId: string; path: string }) => {
      return apiRequest('/api/dreams/evolve', {
        method: 'POST',
        body: { dreamId, evolutionPath: path }
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Evolution Complete!",
        description: `Dream evolved into ${data.evolutionPath} form`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/dreams'] });
    },
    onError: () => {
      toast({
        title: "Evolution Failed",
        description: "Unable to evolve dream at this time",
        variant: "destructive"
      });
    }
  });

  const evolutionPaths = [
    {
      name: 'Visionary',
      description: 'Enhances creative vision and artistic expression',
      icon: Eye,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      name: 'Protean',
      description: 'Adapts and transforms based on community feedback',
      icon: Sparkles,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      name: 'Oracle',
      description: 'Develops predictive and analytical capabilities',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-green-300 mb-2">🌱 Evolution Unlocked!</h3>
        <p className="text-sm text-slate-300">
          As a top dreamer, this dream may now evolve into a new form.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {evolutionPaths.map((path) => {
          const IconComponent = path.icon;
          return (
            <Card 
              key={path.name} 
              className={`${path.borderColor} ${path.bgColor} hover:scale-105 transition-transform cursor-pointer`}
            >
              <CardContent className="p-4 text-center">
                <div className="mb-3">
                  <IconComponent className={`w-8 h-8 ${path.color} mx-auto mb-2`} />
                  <h4 className={`font-bold ${path.color}`}>{path.name}</h4>
                </div>
                
                <p className="text-xs text-slate-400 mb-4 h-12">
                  {path.description}
                </p>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => evolveDreamMutation.mutate({ 
                    dreamId: dream.id, 
                    path: path.name 
                  })}
                  disabled={evolveDreamMutation.isPending}
                  className={`w-full ${path.borderColor} ${path.color} hover:${path.bgColor}`}
                >
                  {evolveDreamMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                      Evolving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Evolve
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-xs text-slate-500 text-center mt-4">
        Evolution is permanent and will transform your dream's capabilities and scoring potential.
      </div>
    </div>
  );
}