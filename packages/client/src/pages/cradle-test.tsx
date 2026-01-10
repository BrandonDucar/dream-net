import { useState } from 'react';
import CradleAgentView from '@/components/CradleAgentView';
import Head from '@/components/Head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowUp } from 'lucide-react';

export default function CradleTest() {
  const [showCradle, setShowCradle] = useState(false);
  const [mockScore, setMockScore] = useState(85);

  // Mock score data for testing
  const mockScoreData = {
    score: mockScore,
    trustLevel: mockScore >= 80 ? 'High' : mockScore >= 50 ? 'Medium' : 'Low',
    unlockedAgents: mockScore >= 80 ? ['LUCID', 'CANVAS', 'ROOT', 'ECHO', 'CRADLE', 'WING'] : 
                   mockScore >= 50 ? ['LUCID', 'CANVAS', 'ROOT', 'ECHO'] : ['LUCID', 'CANVAS']
  };

  return (
    <>
      <Head>
        <title>CRADLE Agent Test | Dream Network</title>
        <meta name="description" content="Test the CRADLE Agent Evolution Engine functionality" />
      </Head>
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-cyan-400" />
              <h1 className="text-3xl font-bold">CRADLE Agent Test</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Evolution Engine Testing Environment
            </p>
          </div>

          <Card className="border-border bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Mock Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm">Mock Trust Score:</span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setMockScore(35)} variant={mockScore === 35 ? "default" : "outline"}>
                    Low (35)
                  </Button>
                  <Button size="sm" onClick={() => setMockScore(65)} variant={mockScore === 65 ? "default" : "outline"}>
                    Medium (65)
                  </Button>
                  <Button size="sm" onClick={() => setMockScore(85)} variant={mockScore === 85 ? "default" : "outline"}>
                    High (85)
                  </Button>
                </div>
              </div>
              
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">
                  Current Score: <strong>{mockScore}</strong> | 
                  Trust Level: <strong>{mockScoreData.trustLevel}</strong> | 
                  CRADLE Access: <strong>{mockScoreData.unlockedAgents.includes('CRADLE') ? 'Unlocked' : 'Locked'}</strong>
                </p>
                
                <Button 
                  onClick={() => setShowCradle(!showCradle)}
                  className="flex items-center gap-2"
                  disabled={!mockScoreData.unlockedAgents.includes('CRADLE')}
                >
                  <ArrowUp className="h-4 w-4" />
                  {showCradle ? 'Hide' : 'Show'} CRADLE Agent
                </Button>
              </div>
            </CardContent>
          </Card>

          {showCradle && mockScoreData.unlockedAgents.includes('CRADLE') && (
            <CradleAgentView />
          )}

          {!mockScoreData.unlockedAgents.includes('CRADLE') && (
            <Card className="border-border bg-card/30 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  CRADLE Agent requires High trust level (80+ score) to unlock.
                  <br />
                  Current score: {mockScore} - Increase score to test CRADLE functionality.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="border-border bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>CRADLE Agent Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-cyan-400 mb-2">Evolution Management</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 5-stage evolution tracking (SEED → DREAM CORE)</li>
                    <li>• Active evolution chain monitoring</li>
                    <li>• Progress visualization and control</li>
                    <li>• Energy system integration</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-cyan-400 mb-2">Advanced Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Multi-dimensional dream states</li>
                    <li>• Quantum consciousness patterns</li>
                    <li>• Universal connection mapping</li>
                    <li>• High-trust exclusive access</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}