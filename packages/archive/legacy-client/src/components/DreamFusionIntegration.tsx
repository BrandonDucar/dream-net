import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import FusionChamber from './FusionChamber.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Zap } from 'lucide-react';

interface Dream {
  id: string;
  title: string;
  name?: string;
}

interface ScoreData {
  score: number;
  trustLevel: string;
  unlockedAgents: string[];
}

interface DreamFusionIntegrationProps {
  claimedDreams: Dream[];
  scoreData?: ScoreData | null;
}

export default function DreamFusionIntegration({ claimedDreams, scoreData }: DreamFusionIntegrationProps) {
  const { publicKey } = useWallet();
  const [fusionHistory, setFusionHistory] = useState<any[]>([]);

  const hasWingAccess = scoreData?.unlockedAgents.includes('WING') || false;

  const fetchFusionHistory = async () => {
    if (!publicKey) return;
    
    try {
      const res = await fetch(`/api/fusions/${publicKey.toBase58()}`);
      const data = await res.json();
      setFusionHistory(data.fusions || []);
    } catch (error) {
      console.error('Failed to fetch fusion history:', error);
    }
  };

  useEffect(() => {
    fetchFusionHistory();
  }, [publicKey]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono text-cyan-400">{claimedDreams.length}</div>
            <div className="text-sm text-muted-foreground">Available Dreams</div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono text-purple-400">{scoreData?.score || 0}</div>
            <div className="text-sm text-muted-foreground">Trust Score</div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono text-green-400">{fusionHistory.length}</div>
            <div className="text-sm text-muted-foreground">Fusions Created</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card className="border-border bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-purple-400" />
                Dream Fusion Chamber
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                {hasWingAccess ? (
                  <Badge className="text-green-400 border-green-500/20 bg-green-500/10">
                    <Zap className="h-3 w-3 mr-1" />
                    WING Agent Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-red-400 border-red-500/20 bg-red-500/10">
                    WING Agent Required (80+ score)
                  </Badge>
                )}
              </div>
              
              {/* Your exact usage pattern */}
              <FusionChamber
                dreams={claimedDreams}
                wallet={publicKey?.toBase58()}
                enabled={scoreData?.unlockedAgents.includes('WING') || false}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-border bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Available Dreams</CardTitle>
            </CardHeader>
            <CardContent>
              {claimedDreams.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {claimedDreams.map((dream) => (
                    <div key={dream.id} className="p-2 rounded border border-border bg-card/20">
                      <div className="font-medium text-sm">
                        {dream.title || dream.name || `Dream ${dream.id}`}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {dream.id}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FlaskConical className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No claimed dreams available for fusion</p>
                </div>
              )}
            </CardContent>
          </Card>

          {fusionHistory.length > 0 && (
            <Card className="border-border bg-card/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Fusion History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {fusionHistory.slice(0, 5).map((fusion, index) => (
                    <div key={index} className="p-3 rounded border border-purple-500/20 bg-purple-500/5">
                      <div className="font-medium text-sm">{fusion.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Tags: {fusion.tags.slice(0, 3).join(', ')}
                      </div>
                      <div className="text-xs text-purple-400 mt-1">
                        {fusion.lineage.ancestors.join(' + ')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(fusion.fusedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}