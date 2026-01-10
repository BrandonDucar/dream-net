import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Filter, RotateCcw } from 'lucide-react';

interface Dream {
  id: string;
  title?: string;
  name?: string;
  createdByAgent?: string;
}

interface ScoreData {
  score: number;
  trustLevel: string;
  unlockedAgents: string[];
}

interface EnhancedAgentFilterProps {
  dreams: Dream[];
  scoreData: ScoreData;
  onFilteredDreamsChange: (dreams: Dream[]) => void;
}

export default function EnhancedAgentFilter({ 
  dreams, 
  scoreData, 
  onFilteredDreamsChange 
}: EnhancedAgentFilterProps) {
  const [selectedAgent, setSelectedAgent] = useState('');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(true);

  const filterDreams = () => {
    let filtered = dreams;

    // Filter by unlocked agents if enabled
    if (showUnlockedOnly) {
      filtered = filtered.filter(d => 
        !d.createdByAgent || scoreData.unlockedAgents.includes(d.createdByAgent)
      );
    }

    // Filter by specific agent if selected
    if (selectedAgent) {
      filtered = filtered.filter(d => d.createdByAgent === selectedAgent);
    }

    onFilteredDreamsChange(filtered);
  };

  const resetFilters = () => {
    setSelectedAgent('');
    setShowUnlockedOnly(true);
  };

  useEffect(() => {
    filterDreams();
  }, [selectedAgent, showUnlockedOnly, dreams, scoreData]);

  const agentCounts = scoreData.unlockedAgents.reduce((acc, agent) => {
    acc[agent] = dreams.filter(d => d.createdByAgent === agent).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="border-border bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-400" />
          Enhanced Agent Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by Agent</label>
            {/* Your exact pattern */}
            <select 
              onChange={e => setSelectedAgent(e.target.value)}
              value={selectedAgent}
              className="w-full p-2 rounded border border-border bg-card text-sm"
            >
              <option value="">All Agents</option>
              {scoreData?.unlockedAgents.map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
            {selectedAgent && (
              <div className="text-xs text-muted-foreground">
                Showing only {selectedAgent} dreams ({agentCounts[selectedAgent] || 0})
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Access Control</label>
            <Button
              variant={showUnlockedOnly ? "default" : "outline"}
              onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
              className="w-full text-sm"
            >
              {showUnlockedOnly ? 'Unlocked Only' : 'Show All'}
            </Button>
            <div className="text-xs text-muted-foreground">
              Trust Level: {scoreData.trustLevel} ({scoreData.score}/100)
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Agent Access Status</h4>
          <div className="grid grid-cols-2 gap-2">
            {['LUCID', 'CANVAS', 'ROOT', 'ECHO', 'CRADLE', 'WING'].map(agent => {
              const isUnlocked = scoreData.unlockedAgents.includes(agent);
              const count = dreams.filter(d => d.createdByAgent === agent).length;
              
              return (
                <div
                  key={agent}
                  className={`p-2 rounded border text-xs ${
                    isUnlocked 
                      ? 'border-green-500/20 bg-green-500/5 text-green-400' 
                      : 'border-red-500/20 bg-red-500/5 text-red-400'
                  } ${selectedAgent === agent ? 'ring-2 ring-blue-500/50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Bot className="h-3 w-3" />
                      <span className="font-medium">{agent}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs opacity-70">
                    {isUnlocked ? '✓ Unlocked' : '✗ Locked'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={resetFilters} variant="outline" size="sm" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}