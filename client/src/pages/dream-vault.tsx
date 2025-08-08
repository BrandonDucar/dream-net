import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import DreamVault from '@/components/DreamVault';
import Head from '@/components/Head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Vault, Bot, Plus, RefreshCw } from 'lucide-react';

interface Dream {
  id: string;
  title: string;
  type: string;
  createdByAgent?: string;
  isDraft?: boolean;
  lineage?: {
    ancestors?: string[];
    parentA?: string;
    parentB?: string;
  };
}

export default function DreamVaultPage() {
  const { walletAddress: ethAddress } = useAuth();
  const { publicKey, connected: solanaConnected } = useWallet();
  const [, setLocation] = useLocation();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const activeWallet = solanaConnected && publicKey 
    ? publicKey.toBase58() 
    : ethAddress;

  const fetchDreams = async () => {
    if (!activeWallet) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/my-dreams?wallet=${activeWallet}`);
      const data = await res.json();
      setDreams(data);
    } catch (error) {
      console.error('Failed to fetch dreams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDreams();
  }, [activeWallet]);

  // User's exact pattern for fetching dreams with draft parameter
  useEffect(() => {
    if (!activeWallet) return;
    
    fetch(`/api/my-dreams?wallet=${activeWallet}&draft=true`)
      .then(res => res.json())
      .then(setDreams);
  }, [activeWallet]);

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

  return (
    <>
      <Head>
        <title>Dream Vault | Dream Network</title>
        <meta name="description" content="Your personal collection of dreams, minted tokens, and fused creations" />
      </Head>
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Vault className="h-8 w-8 text-cyan-400" />
              <h1 className="text-3xl font-bold">🔐 My Dream Vault</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Your personal collection of dreams, minted tokens, and fused creations
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            <div className="space-y-4">
              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Wallet Connection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium text-purple-400 mb-2">Solana (Primary)</h4>
                    <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !text-sm !w-full" />
                  </div>
                  
                  {ethAddress && (
                    <div>
                      <h4 className="font-medium text-blue-400 mb-2">Ethereum (Secondary)</h4>
                      <div className="p-2 rounded border border-blue-500/20 bg-blue-500/5 text-sm">
                        {ethAddress.slice(0, 8)}...{ethAddress.slice(-8)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Vault Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-mono text-cyan-400">{dreams.length}</div>
                    <div className="text-sm text-muted-foreground">Total Dreams</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-mono text-purple-400">
                        {dreams.filter(d => d.type === 'Vision').length}
                      </div>
                      <div className="text-muted-foreground">Visions</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-pink-400">
                        {dreams.filter(d => d.type === 'Fusion').length}
                      </div>
                      <div className="text-muted-foreground">Fusions</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-gray-400">
                        {dreams.filter(d => d.isDraft).length}
                      </div>
                      <div className="text-muted-foreground">Drafts</div>
                    </div>
                  </div>

                  <Button
                    onClick={fetchDreams}
                    disabled={!activeWallet || isLoading}
                    className="w-full"
                    size="sm"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Loading...' : 'Refresh Vault'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-4">
              {!activeWallet ? (
                <Card className="border-border bg-card/30 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <Vault className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
                    <p className="text-muted-foreground">
                      Connect a wallet to access your personal dream vault
                    </p>
                  </CardContent>
                </Card>
              ) : dreams.length === 0 ? (
                <Card className="border-border bg-card/30 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <Vault className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Empty Vault</h3>
                    <p className="text-muted-foreground mb-4">
                      Start creating dreams to build your collection
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Dream
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {/* Your exact pattern implementation */}
                  <div>
                    {dreams.map(d => (
                      <div key={d.id} style={{ 
                        border: d.isDraft ? '1px dashed #888' : '1px solid #0ff', 
                        margin: 10, 
                        padding: 10,
                        opacity: d.isDraft ? 0.7 : 1 
                      }}>
                        <h3>{d.title} {d.isDraft && '(DRAFT)'}</h3>
                        <p>Type: {d.type}</p>
                        <p>Created by: {d.createdByAgent}</p>
                        <p>Lineage: {d.lineage?.ancestors?.join(' ➝ ') || 'None'}</p>
                        <p>Status: {d.isDraft ? 'Draft' : 'Published'}</p>
                      </div>
                    ))}
                  </div>

                  {/* Enhanced visualization */}
                  <Card className="border-border bg-card/30 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Enhanced Dream Collection</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        {dreams.map((dream) => (
                          <div
                            key={dream.id}
                            className={`p-4 rounded-lg border transition-colors ${
                              dream.isDraft 
                                ? 'border-gray-500/30 bg-gray-500/5 hover:border-gray-500/50' 
                                : 'border-border bg-card/20 hover:border-cyan-500/50'
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                  <h3 className={`font-medium text-sm ${
                                    dream.isDraft ? 'text-gray-400' : 'text-foreground'
                                  }`}>
                                    {dream.title}
                                  </h3>
                                  {dream.isDraft && (
                                    <Badge variant="outline" className="text-xs bg-gray-500/20 text-gray-400 border-gray-500/20">
                                      DRAFT
                                    </Badge>
                                  )}
                                </div>
                                <Badge className={getTypeColor(dream.type)}>
                                  {dream.type}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2">
                                {dream.createdByAgent && (
                                  <Badge variant="outline" className={getAgentColor(dream.createdByAgent)}>
                                    <Bot className="h-3 w-3 mr-1" />
                                    {dream.createdByAgent}
                                  </Badge>
                                )}
                              </div>

                              {dream.lineage?.ancestors && dream.lineage.ancestors.length > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  <div className="font-medium mb-1">Lineage:</div>
                                  <div className="font-mono">
                                    {dream.lineage.ancestors.join(' ➝ ')}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="text-xs text-muted-foreground font-mono">
                                  ID: {dream.id}
                                </div>
                                
                                {dream.isDraft && (
                                  <button
                                    onClick={async () => {
                                      await fetch('/api/publish-dream', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ id: dream.id })
                                      });
                                      setLocation(`/dreams/${dream.id}`);
                                    }}
                                    className="text-xs px-2 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    🔓 Publish
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Implementation Pattern</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded border border-border bg-card/20 font-mono text-sm space-y-1">
                    <div className="text-green-400">const [dreams, setDreams] = useState([]);</div>
                    <div className="mt-2"></div>
                    <div className="text-blue-400">useEffect(() =&gt; &#123;</div>
                    <div className="ml-2">if (!publicKey) return;</div>
                    <div className="ml-2">fetch(`/api/my-dreams?wallet=$&#123;publicKey.toBase58()&#125;`)</div>
                    <div className="ml-4">.then(res =&gt; res.json())</div>
                    <div className="ml-4">.then(setDreams);</div>
                    <div className="text-blue-400">&#125;, [publicKey]);</div>
                    <div className="mt-2"></div>
                    <div className="text-purple-400">return (</div>
                    <div className="ml-2">&lt;div&gt;</div>
                    <div className="ml-4">&lt;h1&gt;🔐 My Dream Vault&lt;/h1&gt;</div>
                    <div className="ml-4">&#123;dreams.map(d =&gt; (</div>
                    <div className="ml-6">&lt;div key=&#123;d.id&#125; style=&#123;&#123; border: '1px solid #0ff', margin: 10, padding: 10 &#125;&#125;&gt;</div>
                    <div className="ml-8">&lt;h3&gt;&#123;d.title&#125;&lt;/h3&gt;</div>
                    <div className="ml-8">&lt;p&gt;Type: &#123;d.type&#125;&lt;/p&gt;</div>
                    <div className="ml-8">&lt;p&gt;Created by: &#123;d.createdByAgent&#125;&lt;/p&gt;</div>
                    <div className="ml-8">&lt;p&gt;Lineage: &#123;d.lineage?.ancestors?.join(' ➝ ') || 'None'&#125;&lt;/p&gt;</div>
                    <div className="ml-6">&lt;/div&gt;</div>
                    <div className="ml-4">))&#125;</div>
                    <div className="ml-2">&lt;/div&gt;</div>
                    <div className="text-purple-400">);</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}