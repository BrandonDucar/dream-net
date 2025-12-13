import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LatentSession {
  id: string;
  createdAt: string;
  source: string;
  task: string;
  inputPrompt: string;
  decodedOutput?: string;
  relatedAgents?: string[];
  onchainContext?: {
    chain?: string;
    walletAddress?: string;
    tokenAddress?: string;
  };
}

export default function LatentSessionsPanel() {
  const [sessions, setSessions] = useState<LatentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/latent-sessions?limit=20')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setSessions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch latent sessions:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latent Collaboration Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latent Collaboration Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">Error loading sessions: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Latent Collaboration Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-muted-foreground">No latent sessions found.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map(session => (
              <div key={session.id} className="border rounded p-4 bg-card/20">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-electric-cyan">{session.source}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(session.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm mb-2">
                  <strong>Task:</strong> {session.task}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {session.inputPrompt.slice(0, 200)}
                  {session.inputPrompt.length > 200 ? '...' : ''}
                </p>
                {session.decodedOutput && (
                  <p className="text-xs mb-2">
                    <strong>Output:</strong> {session.decodedOutput.slice(0, 200)}
                    {session.decodedOutput.length > 200 ? '...' : ''}
                  </p>
                )}
                {session.relatedAgents && session.relatedAgents.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">
                      <strong>Agents:</strong> {session.relatedAgents.join(', ')}
                    </span>
                  </div>
                )}
                {session.onchainContext && (
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">
                      <strong>Onchain:</strong> {session.onchainContext.chain}
                      {session.onchainContext.walletAddress && (
                        <> • {session.onchainContext.walletAddress.slice(0, 8)}...</>
                      )}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

