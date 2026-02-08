/**
 * Mini App Page
 * Dynamic route for individual mini apps
 */

import React from 'react';
import { useRoute } from 'wouter';
import { getMiniApp, getMiniAppComponent } from '@/miniapps/registry';
import { useBase } from '@/providers/BaseProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function MiniAppPage() {
  const [match, params] = useRoute('/miniapps/:id');
  const { isConnected, connect } = useBase();

  if (!match || !params) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Mini app not found</p>
            <Link href="/miniapps">
              <Button variant="link" className="mt-4">
                Back to Mini Apps
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const app = getMiniApp(params.id);
  const Component = getMiniAppComponent(params.id);

  if (!app) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Mini app not found</p>
            <Link href="/miniapps">
              <Button variant="link" className="mt-4">
                Back to Mini Apps
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Agent Runner Logic
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState<any>(null);
  const [running, setRunning] = React.useState(false);

  const handleRun = async () => {
    if (!app?.agentId) return;
    setRunning(true);
    setOutput(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://dreamnet-api-minimal-qa6y4okh2a-uc.a.run.app';
      const res = await fetch(`${API_URL}/api/dreamhub/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: app.id,
          input: { prompt: input, ...JSON.parse(input || '{}') }, // Try to parse as JSON, fallback to prompt
          context: { userId: 'user', sessionId: 'session' }
        })
      });
      const data = await res.json();
      setOutput(data);
    } catch (err) {
      console.error(err);
      setOutput({ error: 'Failed to run agent' });
    } finally {
      setRunning(false);
    }
  };

  if (app.agentId) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/miniapps">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{app.name}</h1>
            <Badge variant="outline" className="border-electric-cyan text-electric-cyan">Agent</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Input</CardTitle>
                <CardDescription>Provide input for the agent (JSON or text)</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <textarea
                  className="flex-1 min-h-[200px] w-full p-4 rounded-md bg-muted font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-electric-cyan"
                  placeholder='{"mission": "analyze"}'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button onClick={handleRun} disabled={running} className="w-full">
                  {running ? 'Running...' : 'Run Agent'}
                </Button>
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Output</CardTitle>
                <CardDescription>Agent execution results</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 bg-muted rounded-md p-4 overflow-auto max-h-[600px]">
                {output ? (
                  <pre className="text-xs font-mono whitespace-pre-wrap">
                    {JSON.stringify(output, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    No output yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // If wallet required but not connected, show connect prompt
  if (app.requiresWallet && !isConnected && Component) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <Link href="/miniapps">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mini Apps
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>{app.name}</CardTitle>
              <CardDescription>{app.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">This mini app requires a connected wallet.</p>
              <Button onClick={connect}>Connect Wallet</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render the mini app component
  if (!Component) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Mini app component not found</p>
            <Link href="/miniapps">
              <Button variant="link" className="mt-4">
                Back to Mini Apps
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/miniapps">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mini Apps
            </Button>
          </Link>
        </div>
      </div>
      <Component />
    </div>
  );
}


