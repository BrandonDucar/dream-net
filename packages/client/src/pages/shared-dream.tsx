import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { useWallet } from '@solana/wallet-adapter-react';
import LineageThread from '@/components/LineageThread';
import Head from '@/components/Head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Eye, Bot, Edit, Shuffle, ArrowLeft } from 'lucide-react';

interface Dream {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  type: string;
  createdByAgent?: string;
  lineage?: {
    ancestors?: string[];
    children?: string[];
    parentA?: string;
    parentB?: string;
  };
  wallet: string;
  remix?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function SharedDreamPage() {
  const params = useParams();
  const dreamId = params?.id;
  const { walletAddress: ethAddress } = useAuth();
  const { publicKey: solanaPublicKey, connected: solanaConnected } = useWallet();
  const [dream, setDream] = useState<Dream | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const activeWallet = solanaConnected && solanaPublicKey 
    ? solanaPublicKey.toBase58() 
    : ethAddress;

  useEffect(() => {
    if (!dreamId) return;
    
    setIsLoading(true);
    fetch(`/api/remix-dream/${dreamId}`)
      .then(res => res.json())
      .then(data => {
        setDream(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load dream:', error);
        setIsLoading(false);
      });
  }, [dreamId]);

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'vision': return 'bg-purple-500/20 text-purple-400 border-purple-500/20';
      case 'tool': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'movement': return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'system': return 'bg-orange-500/20 text-orange-400 border-orange-500/20';
      case 'fusion': return 'bg-pink-500/20 text-pink-400 border-pink-500/20';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  const getAgentColor = (agent?: string) => {
    switch (agent) {
      case 'LUCID': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/20';
      case 'CANVAS': return 'bg-violet-500/20 text-violet-400 border-violet-500/20';
      case 'ROOT': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      case 'ECHO': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'CRADLE': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      case 'WING': return 'bg-red-500/20 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dream...</p>
        </div>
      </div>
    );
  }

  if (!dream) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Dream Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested dream could not be loaded.</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{dream.title} | Dream Network</title>
        <meta name="description" content={dream.description || 'Explore this shared dream with lineage tracking and agent attribution'} />
      </Head>
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Eye className="h-8 w-8 text-cyan-400" />
              <h1 className="text-3xl font-bold">{dream.title}</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {dream.description || 'Shared dream with lineage tracking and agent attribution'}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            <div className="space-y-4">
              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Wallet Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  <WalletMultiButton className="!bg-cyan-600 hover:!bg-cyan-700 !text-sm !w-full" />
                  
                  {ethAddress && (
                    <div className="mt-3 p-2 rounded border border-blue-500/20 bg-blue-500/5 text-sm">
                      <div className="font-medium text-blue-400">Ethereum Connected</div>
                      <div className="font-mono text-xs">
                        {ethAddress.slice(0, 8)}...{ethAddress.slice(-8)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Dream Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium text-cyan-400">ID</div>
                    <div className="font-mono text-xs">{dream.id}</div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-purple-400">Type</div>
                    <Badge className={getTypeColor(dream.type)}>{dream.type}</Badge>
                  </div>
                  
                  {dream.createdByAgent && (
                    <div>
                      <div className="font-medium text-green-400">Created By</div>
                      <Badge variant="outline" className={getAgentColor(dream.createdByAgent)}>
                        <Bot className="h-3 w-3 mr-1" />
                        {dream.createdByAgent}
                      </Badge>
                    </div>
                  )}
                  
                  {dream.remix && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/20">
                      Remix
                    </Badge>
                  )}
                  
                  <div>
                    <div className="font-medium text-yellow-400">Created</div>
                    <div className="text-xs">{new Date(dream.createdAt).toLocaleDateString()}</div>
                  </div>
                  
                  {dream.updatedAt && (
                    <div>
                      <div className="font-medium text-orange-400">Updated</div>
                      <div className="text-xs">{new Date(dream.updatedAt).toLocaleDateString()}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => window.location.href = `/edit-dream/${dream.id}`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Dream
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm"
                    onClick={() => window.location.href = '/dream-remixer'}
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Create Remix
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Dream Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">{dream.title}</h3>
                    {dream.description && (
                      <p className="text-muted-foreground">{dream.description}</p>
                    )}
                  </div>

                  {dream.tags && dream.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {dream.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Your exact LineageThread pattern */}
              <div style={{ marginTop: 40, padding: 20, background: '#111', borderRadius: 12 }}>
                <h3>🌱 Lineage</h3>

                {dream.lineage?.ancestors && dream.lineage.ancestors.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <strong>🌿 Ancestors:</strong>
                    <ul>
                      {dream.lineage.ancestors.map(id => (
                        <li key={id}>
                          <a 
                            href={`/dreams/${id}`} 
                            style={{ color: '#0ff', textDecoration: 'none' }}
                          >
                            🔗 {id}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {dream.lineage?.children && dream.lineage.children.length > 0 && (
                  <div>
                    <strong>🌿 Descendants:</strong>
                    <ul>
                      {dream.lineage.children.map(id => (
                        <li key={id}>
                          <a 
                            href={`/dreams/${id}`} 
                            style={{ color: '#0ff', textDecoration: 'none' }}
                          >
                            🔗 {id}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(!dream.lineage?.ancestors || dream.lineage.ancestors.length === 0) && 
                 (!dream.lineage?.children || dream.lineage.children.length === 0) && (
                  <p>🔗 This dream has no known lineage yet.</p>
                )}
              </div>

              {/* Enhanced LineageThread component */}
              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Enhanced Lineage View</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineageThread dream={dream} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}