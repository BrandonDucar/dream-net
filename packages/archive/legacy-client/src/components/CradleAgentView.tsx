import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
import { Zap, Sparkles, ArrowUp, RefreshCw, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface EvolutionStage {
  id: string;
  name: string;
  description: string;
  progress: number;
  active: boolean;
}

interface CradleData {
  wallet: string;
  score: number;
  trustLevel: string;
  unlockedAgents: string[];
  evolutionChains: EvolutionStage[];
  activeEvolutions: number;
  totalEnergy: number;
}

const evolutionStages = [
  { name: 'SEED', icon: '🌱', color: 'text-green-400', description: 'Initial dream concept formation' },
  { name: 'SPROUT', icon: '🌿', color: 'text-green-500', description: 'First growth and idea expansion' },
  { name: 'COCOON', icon: '🛡️', color: 'text-blue-400', description: 'Protected development phase' },
  { name: 'AWAKENED', icon: '👁️', color: 'text-purple-400', description: 'Consciousness emergence' },
  { name: 'DREAM CORE', icon: '💎', color: 'text-cyan-400', description: 'Fully realized dream essence' }
];

export default function CradleAgentView() {
  const { publicKey } = useWallet();
  const { toast } = useToast();
  const [cradleData, setCradleData] = useState<CradleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('evolution');

  const fetchCradleData = async () => {
    if (!publicKey) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/wallet-scoring/${publicKey.toBase58()}`);
      const scoreData = await response.json();

      // Generate mock evolution chains for demonstration
      const mockEvolutionChains: EvolutionStage[] = [
        {
          id: 'evo-1',
          name: 'Digital Consciousness',
          description: 'Exploring AI awareness patterns',
          progress: 78,
          active: true
        },
        {
          id: 'evo-2',
          name: 'Quantum Dreams',
          description: 'Multi-dimensional dream states',
          progress: 45,
          active: true
        },
        {
          id: 'evo-3',
          name: 'Cosmic Web',
          description: 'Universal connection patterns',
          progress: 92,
          active: false
        }
      ];

      setCradleData({
        wallet: publicKey.toBase58(),
        score: scoreData.score,
        trustLevel: scoreData.trustLevel,
        unlockedAgents: scoreData.unlockedAgents,
        evolutionChains: mockEvolutionChains,
        activeEvolutions: mockEvolutionChains.filter(e => e.active).length,
        totalEnergy: Math.floor(scoreData.score * 1.5)
      });
    } catch (error) {
      console.error('Failed to fetch CRADLE data:', error);
    } finally {
      setLoading(false);
    }
  };

  const evolveChain = async (chainId: string) => {
    setLoading(true);
    try {
      // Simulate evolution process
      await new Promise(resolve => setTimeout(resolve, 1500));

      setCradleData(prev => prev ? {
        ...prev,
        evolutionChains: prev.evolutionChains.map(chain =>
          chain.id === chainId
            ? { ...chain, progress: Math.min(100, chain.progress + 15) }
            : chain
        ),
        totalEnergy: prev.totalEnergy + 10
      } : null);

      toast({
        title: "Evolution Progress",
        description: "CRADLE Agent advanced the evolution chain +15 progress"
      });
    } catch (error) {
      toast({
        title: "Evolution Failed",
        description: "Unable to process evolution request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCradleData();
  }, [publicKey]);

  if (!cradleData) {
    return (
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <div className="animate-spin h-6 w-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p>Initializing CRADLE Agent...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          CRADLE Agent - Evolution Engine
          <Badge className="text-cyan-400 border-cyan-500/20 bg-cyan-500/10">
            High Trust Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded border border-cyan-500/20 bg-cyan-500/5">
            <div className="text-2xl font-mono text-cyan-400">{cradleData.activeEvolutions}</div>
            <div className="text-xs text-muted-foreground">Active Chains</div>
          </div>
          <div className="p-3 rounded border border-purple-500/20 bg-purple-500/5">
            <div className="text-2xl font-mono text-purple-400">{cradleData.totalEnergy}</div>
            <div className="text-xs text-muted-foreground">Evolution Energy</div>
          </div>
          <div className="p-3 rounded border border-green-500/20 bg-green-500/5">
            <div className="text-2xl font-mono text-green-400">{cradleData.score}</div>
            <div className="text-xs text-muted-foreground">Trust Score</div>
          </div>
        </div>

        <Collapsible open={expandedSection === 'evolution'} onOpenChange={(open) => setExpandedSection(open ? 'evolution' : null)}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-sm">
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Evolution Chains ({cradleData.evolutionChains.length})
              </span>
              {expandedSection === 'evolution' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3">
            {cradleData.evolutionChains.map((chain) => (
              <div key={chain.id} className="p-3 rounded border border-border bg-card/30">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-cyan-400">{chain.name}</h4>
                    <p className="text-xs text-muted-foreground">{chain.description}</p>
                  </div>
                  <Badge variant={chain.active ? "default" : "secondary"} className="text-xs">
                    {chain.active ? 'Active' : 'Complete'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Progress</span>
                    <span className="text-xs font-mono">{chain.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-500"
                      style={{ width: `${chain.progress}%` }}
                    />
                  </div>
                  {chain.active && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => evolveChain(chain.id)}
                      disabled={loading}
                      className="w-full text-xs h-7"
                    >
                      <ArrowUp className="h-3 w-3 mr-1" />
                      Evolve Chain (+15)
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={expandedSection === 'stages'} onOpenChange={(open) => setExpandedSection(open ? 'stages' : null)}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between text-sm">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Evolution Stages
              </span>
              {expandedSection === 'stages' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-1 gap-2">
              {evolutionStages.map((stage, index) => (
                <div
                  key={stage.name}
                  className="p-2 rounded border border-border bg-card/20 flex items-center gap-3"
                >
                  <span className="text-lg">{stage.icon}</span>
                  <div className="flex-1">
                    <div className={`font-mono font-medium text-sm ${stage.color}`}>
                      {stage.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stage.description}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Stage {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="pt-2 border-t border-border">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCradleData}
              disabled={loading}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={loading}
              className="text-xs"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              New Evolution
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p><strong>CRADLE Agent:</strong> Manages dream evolution through 5 stages from SEED to DREAM CORE. Available only to High Trust users (80+ score).</p>
        </div>
      </CardContent>
    </Card>
  );
}