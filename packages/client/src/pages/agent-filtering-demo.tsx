import { useState } from 'react';
import AgentFilteredDreams from '@/components/AgentFilteredDreams';
import EnhancedAgentFilter from '@/components/EnhancedAgentFilter';
import Head from '@/components/Head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Filter, Plus, Bot } from 'lucide-react';

interface Dream {
  id: string;
  title: string;
  createdByAgent?: string;
}

const sampleDreams: Dream[] = [
  { id: 'dream-1', title: 'Quantum Consciousness Bridge', createdByAgent: 'LUCID' },
  { id: 'dream-2', title: 'Digital Empathy Network', createdByAgent: 'CANVAS' },
  { id: 'dream-3', title: 'Collective Memory Archive', createdByAgent: 'ROOT' },
  { id: 'dream-4', title: 'Synaptic Reality Engine', createdByAgent: 'ECHO' },
  { id: 'dream-5', title: 'Evolution Tracking System', createdByAgent: 'CRADLE' },
  { id: 'dream-6', title: 'Cross-Chain Messenger', createdByAgent: 'WING' },
  { id: 'dream-7', title: 'Basic Vision Framework', createdByAgent: 'LUCID' },
  { id: 'dream-8', title: 'Creative Design Tool', createdByAgent: 'CANVAS' },
  { id: 'dream-9', title: 'User-Generated Dream', createdByAgent: undefined },
  { id: 'dream-10', title: 'Community Contribution', createdByAgent: undefined }
];

const agentDescriptions = {
  'LUCID': 'Logic Unification & Command Interface Daemon (Available: 0+ score)',
  'CANVAS': 'Visual Layer Weaver (Available: 0+ score)',
  'ROOT': 'Subconscious Architect (Available: 50+ score)',
  'ECHO': 'Wallet Mirror (Available: 50+ score)',
  'CRADLE': 'Evolution Engine (Available: 80+ score)',
  'WING': 'Messenger & Mint Agent (Available: 80+ score)'
};

export default function AgentFilteringDemo() {
  const [dreams, setDreams] = useState<Dream[]>(sampleDreams);
  const [filteredDreams, setFilteredDreams] = useState<Dream[]>(sampleDreams);
  const [mockScore] = useState(75);

  const scoreData = {
    score: mockScore,
    trustLevel: mockScore >= 80 ? 'High' : mockScore >= 50 ? 'Medium' : 'Low',
    unlockedAgents: mockScore >= 80 ? ['LUCID', 'CANVAS', 'ROOT', 'ECHO', 'CRADLE', 'WING']
                  : mockScore >= 50 ? ['LUCID', 'CANVAS', 'ROOT', 'ECHO']
                  : ['LUCID', 'CANVAS']
  };

  const addRandomDream = () => {
    const agents = ['LUCID', 'CANVAS', 'ROOT', 'ECHO', 'CRADLE', 'WING'];
    const titles = [
      'Neural Bridge Constructor',
      'Temporal Perception Shifter',
      'Biomimetic Learning Collective',
      'Reality Synthesis Laboratory',
      'Consciousness Amplifier Network',
      'Quantum Storytelling Engine'
    ];

    const randomAgent = Math.random() > 0.3 ? agents[Math.floor(Math.random() * agents.length)] : undefined;
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    
    const newDream: Dream = {
      id: `dream-${Date.now()}`,
      title: randomTitle,
      createdByAgent: randomAgent
    };

    setDreams(prev => [...prev, newDream]);
  };

  return (
    <>
      <Head>
        <title>Agent-Based Dream Filtering | Dream Network</title>
        <meta name="description" content="Filter dreams based on wallet trust scores and agent access levels" />
      </Head>
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Filter className="h-8 w-8 text-blue-400" />
              <h1 className="text-3xl font-bold">Agent-Based Dream Filtering</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Filter dreams based on wallet trust scores and unlocked agent access levels
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            <div className="space-y-4">
              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Wallet Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !text-sm !w-full" />
                </CardContent>
              </Card>

              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Dream Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={addRandomDream} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Random Dream
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3">
                    Total Dreams: {dreams.length}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Agent Access Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs">
                    {Object.entries(agentDescriptions).map(([agent, desc]) => (
                      <div key={agent} className="p-2 rounded border border-border bg-card/20">
                        <div className="flex items-center gap-1 mb-1">
                          <Bot className="h-3 w-3" />
                          <strong>{agent}</strong>
                        </div>
                        <p className="text-muted-foreground">{desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <EnhancedAgentFilter
                dreams={dreams}
                scoreData={scoreData}
                onFilteredDreamsChange={setFilteredDreams}
              />
              
              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Filtered Results ({filteredDreams.length} dreams)</CardTitle>
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
                            <div className="font-medium text-sm">{dream.title}</div>
                            <div className="text-xs text-muted-foreground font-mono mt-1">
                              {dream.id}
                            </div>
                          </div>
                          {dream.createdByAgent && (
                            <Badge variant="outline" className="text-xs">
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
                        <p>No dreams match the current filter criteria</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <AgentFilteredDreams initialDreams={dreams} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}