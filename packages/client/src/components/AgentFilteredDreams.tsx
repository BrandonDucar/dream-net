import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Bot, Filter, RotateCcw, RefreshCw } from 'lucide-react';
import { filterDreamsByWalletAccess, getWalletScore, generateScoreData } from '@/utils/wallet-filtering';

interface Dream {
  id: string;
  title?: string;
  name?: string;
  createdByAgent?: string;
}

interface AgentFilteredDreamsProps {
  initialDreams: Dream[];
}

export default function AgentFilteredDreams({ initialDreams }: AgentFilteredDreamsProps) {
  const { publicKey } = useWallet();
  const [dreams, setDreams] = useState<Dream[]>(initialDreams);
  const [filteredDreams, setFilteredDreams] = useState<Dream[]>(initialDreams);
  const [mockScore, setMockScore] = useState([65]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [walletProvided, setWalletProvided] = useState(false);
  const [realWalletScore, setRealWalletScore] = useState<any>(null);
  const [selectedAgent, setSelectedAgent] = useState('');

  const scoreData = generateScoreData(mockScore[0]);
  const wallet = publicKey?.toBase58();

  // Your exact filtering pattern implementation
  const applyWalletFiltering = async () => {
    if (!walletProvided || !wallet) {
      setFilteredDreams(dreams);
      return;
    }

    setIsFiltering(true);
    
    try {
      const score = await getWalletScore(wallet); // from /echo-score
      const unlockedAgents = score && score.score >= 80 ? ['LUCID', 'CANVAS', 'ROOT', 'ECHO', 'CRADLE', 'WING']
                           : score && score.score >= 50 ? ['LUCID', 'CANVAS', 'ROOT', 'ECHO']
                           : ['LUCID', 'CANVAS'];
      
      let filtered = dreams.filter(d => 
        !d.createdByAgent || unlockedAgents.includes(d.createdByAgent)
      );

      // Apply agent-specific filter if selected
      if (selectedAgent) {
        filtered = filtered.filter(d => d.createdByAgent === selectedAgent);
      }
      
      setFilteredDreams(filtered);
      setRealWalletScore(score);
    } catch (error) {
      console.error('Filtering failed:', error);
      setFilteredDreams(dreams);
    } finally {
      setIsFiltering(false);
    }
  };

  const applyMockFiltering = () => {
    const unlockedAgents = mockScore[0] >= 80 ? ['LUCID', 'CANVAS', 'ROOT', 'ECHO', 'CRADLE', 'WING']
                         : mockScore[0] >= 50 ? ['LUCID', 'CANVAS', 'ROOT', 'ECHO']
                         : ['LUCID', 'CANVAS'];
    
    let filtered = dreams.filter(d => 
      !d.createdByAgent || unlockedAgents.includes(d.createdByAgent)
    );

    // Apply agent-specific filter if selected
    if (selectedAgent) {
      filtered = filtered.filter(d => d.createdByAgent === selectedAgent);
    }
    
    setFilteredDreams(filtered);
  };

  const resetFiltering = () => {
    setWalletProvided(false);
    setMockScore([65]);
    setFilteredDreams(dreams);
    setRealWalletScore(null);
    setSelectedAgent('');
  };

  useEffect(() => {
    if (walletProvided) {
      applyWalletFiltering();
    } else {
      applyMockFiltering();
    }
  }, [dreams, walletProvided, mockScore, wallet, selectedAgent]);

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-400" />
            Agent-Based Dream Filtering
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Mock Score Control</h4>
              <div className="flex justify-between items-center">
                <span className="text-sm">Score: {mockScore[0]}</span>
                <Badge className={
                  mockScore[0] >= 80 ? 'bg-green-500/20 text-green-400' :
                  mockScore[0] >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }>
                  {scoreData.trustLevel}
                </Badge>
              </div>
              <Slider
                value={mockScore}
                onValueChange={setMockScore}
                max={100}
                step={1}
                className="w-full"
                disabled={walletProvided}
              />
              <div className="text-xs text-muted-foreground">
                Unlocked: {scoreData.unlockedAgents.join(', ')}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Real Wallet Score</h4>
              <div className="space-y-2">
                <Button
                  onClick={() => setWalletProvided(!walletProvided)}
                  variant={walletProvided ? "default" : "outline"}
                  className="w-full"
                  disabled={!wallet}
                >
                  {walletProvided ? 'Using Real Score' : 'Use Real Wallet Score'}
                </Button>
                
                {realWalletScore && (
                  <div className="p-2 rounded border border-border bg-card/20">
                    <div className="text-sm">
                      Real Score: <strong>{realWalletScore.score}</strong>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {realWalletScore.unlockedAgents?.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={resetFiltering} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button 
              onClick={applyWalletFiltering} 
              size="sm" 
              disabled={!walletProvided || isFiltering}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isFiltering ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Filter by Agent</h4>
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
                Showing only dreams from {selectedAgent} agent
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono text-blue-400">{dreams.length}</div>
            <div className="text-sm text-muted-foreground">Total Dreams</div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono text-green-400">{filteredDreams.length}</div>
            <div className="text-sm text-muted-foreground">Accessible Dreams</div>
          </CardContent>
        </Card>
        
        <Card className="border-border bg-card/30 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-mono text-purple-400">
              {dreams.length - filteredDreams.length}
            </div>
            <div className="text-sm text-muted-foreground">Filtered Out</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>
            Filtered Dreams ({filteredDreams.length})
            {selectedAgent && (
              <Badge variant="outline" className="ml-2 text-xs">
                <Bot className="h-3 w-3 mr-1" />
                {selectedAgent}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {filteredDreams.map((dream) => (
              <div
                key={dream.id}
                className="p-3 rounded border border-border bg-card/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {dream.title || dream.name || `Dream ${dream.id}`}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-1">
                      {dream.id}
                    </div>
                  </div>
                  {dream.createdByAgent && (
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                    >
                      <Bot className="h-3 w-3 mr-1" />
                      {dream.createdByAgent}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            
            {filteredDreams.length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                <Filter className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No dreams accessible with current agent permissions</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Implementation Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded border border-border bg-card/20 font-mono text-sm space-y-1">
            <div className="text-blue-400">if (walletProvided) &#123;</div>
            <div className="ml-2">const score = getWalletScore(wallet); // from /echo-score</div>
            <div className="ml-2">const unlockedAgents = score &gt;= 80 ? ['LUCID', 'CANVAS', 'ROOT', 'CRADLE', 'WING']</div>
            <div className="ml-12">: score &gt;= 50 ? ['LUCID', 'CANVAS', 'ROOT']</div>
            <div className="ml-12">: ['LUCID', 'CANVAS'];</div>
            <div className="ml-2">dreams = dreams.filter(d =&gt; unlockedAgents.includes(d.createdByAgent));</div>
            <div className="text-blue-400">&#125;</div>
            <div className="mt-3 text-green-400">// Agent-specific filtering</div>
            <div className="text-green-400">&lt;select onChange=&#123;e =&gt; setSelectedAgent(e.target.value)&#125;&gt;</div>
            <div className="ml-2">&lt;option value=""&gt;All Agents&lt;/option&gt;</div>
            <div className="ml-2">&#123;scoreData?.unlockedAgents.map(agent =&gt; (</div>
            <div className="ml-4">&lt;option key=&#123;agent&#125; value=&#123;agent&#125;&gt;&#123;agent&#125;&lt;/option&gt;</div>
            <div className="ml-2">))&#125;</div>
            <div className="text-green-400">&lt;/select&gt;</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}