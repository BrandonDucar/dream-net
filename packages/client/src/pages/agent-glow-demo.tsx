import { useState } from 'react';
import AgentStatus from '@/components/AgentStatus';
import Head from '@/components/Head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Zap, Play, RotateCcw } from 'lucide-react';

export default function AgentGlowDemo() {
  const [score, setScore] = useState([45]);
  const [isAnimating, setIsAnimating] = useState(true);

  const generateUnlockedAgents = (score: number): string[] => {
    if (score >= 80) {
      return ['LUCID', 'CANVAS', 'ROOT', 'ECHO', 'CRADLE', 'WING'];
    } else if (score >= 50) {
      return ['LUCID', 'CANVAS', 'ROOT', 'ECHO'];
    } else {
      return ['LUCID', 'CANVAS'];
    }
  };

  const unlockedAgents = generateUnlockedAgents(score[0]);

  const animateScore = () => {
    setIsAnimating(true);
    let currentScore = 0;
    const targetScore = 90;
    const interval = setInterval(() => {
      currentScore += 2;
      setScore([currentScore]);
      if (currentScore >= targetScore) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 100);
  };

  const resetDemo = () => {
    setScore([0]);
    setIsAnimating(false);
  };

  return (
    <>
      <Head>
        <title>Agent Glow Animation Demo | Dream Network</title>
        <meta name="description" content="Interactive demonstration of agent unlock animations with cyan glow effects" />
      </Head>
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="h-8 w-8 text-cyan-400" />
              <h1 className="text-3xl font-bold">Agent Glow Animation Demo</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Watch agents unlock with glowing cyan animations as trust score increases
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border bg-card/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Trust Score Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium">Trust Score</span>
                    <span className="text-lg font-mono text-cyan-400">{score[0]}/100</span>
                  </div>
                  <Slider
                    value={score}
                    onValueChange={setScore}
                    max={100}
                    step={1}
                    className="w-full"
                    disabled={isAnimating}
                  />
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={animateScore}
                    disabled={isAnimating}
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isAnimating ? 'Animating...' : 'Animate to Max Score'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={resetDemo}
                    disabled={isAnimating}
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Demo
                  </Button>
                </div>

                <div className="p-3 rounded border border-border bg-card/20">
                  <h4 className="font-medium mb-2">Unlock Thresholds:</h4>
                  <div className="text-sm space-y-1">
                    <div className={score[0] >= 0 ? 'text-green-400' : 'text-muted-foreground'}>
                      ✓ 0+ points: LUCID, CANVAS
                    </div>
                    <div className={score[0] >= 50 ? 'text-green-400' : 'text-muted-foreground'}>
                      {score[0] >= 50 ? '✓' : '○'} 50+ points: ROOT, ECHO
                    </div>
                    <div className={score[0] >= 80 ? 'text-green-400' : 'text-muted-foreground'}>
                      {score[0] >= 80 ? '✓' : '○'} 80+ points: CRADLE, WING
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Animation Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded border border-border bg-card/20 font-mono text-sm">
                  <div className="text-cyan-400 mb-2">CSS Keyframes:</div>
                  <div>@keyframes glow {`{`}</div>
                  <div className="ml-2">0% {`{ box-shadow: 0 0 8px #0ff; }`}</div>
                  <div className="ml-2">50% {`{ box-shadow: 0 0 20px #0ff; }`}</div>
                  <div className="ml-2">100% {`{ box-shadow: 0 0 8px #0ff; }`}</div>
                  <div>{`}`}</div>
                  <div className="mt-2">.unlocked {`{`}</div>
                  <div className="ml-2">animation: glow 2s infinite;</div>
                  <div>{`}`}</div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p><strong>Animation Features:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Cyan glow pulsing every 2 seconds</li>
                    <li>8px to 20px shadow intensity variation</li>
                    <li>Infinite loop for continuous visual feedback</li>
                    <li>Applied only to unlocked agents</li>
                    <li>Smooth transitions between states</li>
                  </ul>
                </div>

                <div className="p-3 rounded border border-green-500/20 bg-green-500/5">
                  <p className="text-sm">
                    <strong className="text-green-400">Active Agents:</strong> {unlockedAgents.length}/6
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {unlockedAgents.join(', ')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Live Agent Status with Glow Animation</CardTitle>
            </CardHeader>
            <CardContent>
              <AgentStatus agents={unlockedAgents} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}