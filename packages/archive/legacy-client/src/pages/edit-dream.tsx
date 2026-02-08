import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { useWallet } from '@solana/wallet-adapter-react';
import Head from '@/components/Head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Edit3, Save, ArrowLeft, Bot } from 'lucide-react';
import SuggestTitleButton from '@/components/SuggestTitleButton';

interface Dream {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  type: string;
  createdByAgent?: string;
  lineage?: {
    ancestors?: string[];
    parentA?: string;
    parentB?: string;
  };
  wallet: string;
  remix?: boolean;
  isDraft?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function EditDreamPage() {
  const params = useParams();
  const dreamId = params?.id;
  const [, setLocation] = useLocation();
  const { walletAddress: ethAddress } = useAuth();
  const { publicKey: solanaPublicKey, connected: solanaConnected } = useWallet();
  const [dream, setDream] = useState<Dream | null>(null);
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const activeWallet = solanaConnected && solanaPublicKey 
    ? solanaPublicKey.toBase58() 
    : ethAddress;

  useEffect(() => {
    if (!dreamId) return;
    
    setIsLoading(true);
    fetch(`/api/dream/${dreamId}`)
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

  const handleSave = async (isDraft = false) => {
    if (!dream) return;
    
    setSaving(true);
    try {
      const dreamToSave = {
        ...dream,
        isDraft,
        updatedAt: new Date().toISOString()
      };

      const res = await fetch('/api/save-dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dreamToSave)
      });
      const data = await res.json();
      
      if (data.success) {
        alert(isDraft ? '💾 Draft saved successfully!' : '✅ Dream published successfully!');
        setLocation(`/dream-vault`);
      } else {
        alert('❌ Save failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Save failed: Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    const res = await fetch('/api/save-dream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...dream, isDraft: true })
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setLocation(`/dream-vault`);
    } else {
      alert('❌ Save failed');
    }
  };

  const updateDream = (updates: Partial<Dream>) => {
    if (!dream) return;
    setDream({ ...dream, ...updates });
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
          <Button onClick={() => setLocation('/dream-vault')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vault
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Dream | Dream Network</title>
        <meta name="description" content="Edit and update your dream remix with enhanced tools and AI assistance" />
      </Head>
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Edit3 className="h-8 w-8 text-green-400" />
              <h1 className="text-3xl font-bold">📝 Edit Dream Remix</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Update and refine your dream with enhanced editing tools
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            <div className="space-y-4">
              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Wallet Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  <WalletMultiButton className="!bg-green-600 hover:!bg-green-700 !text-sm !w-full" />
                  
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
                  <CardTitle>Dream Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium text-cyan-400">ID</div>
                    <div className="font-mono text-xs">{dream.id}</div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-purple-400">Type</div>
                    <Badge variant="outline">{dream.type}</Badge>
                  </div>
                  
                  {dream.createdByAgent && (
                    <div>
                      <div className="font-medium text-green-400">Created By</div>
                      <Badge variant="outline" className="text-xs">
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
                  
                  {dream.lineage?.ancestors && dream.lineage.ancestors.length > 0 && (
                    <div>
                      <div className="font-medium text-yellow-400 mb-1">Lineage</div>
                      <div className="text-xs font-mono">
                        {dream.lineage.ancestors.join(' ➝ ')}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              {/* Your exact pattern implementation */}
              <div style={{ padding: 40 }}>
                <Card className="border-border bg-card/30 backdrop-blur-sm mb-6">
                  <CardContent className="p-6">
                    <label className="block text-sm font-medium mb-2">Title:</label>
                    <SuggestTitleButton
                      onTitleSuggested={(title) => updateDream({ title })}
                      description={dream.description || ''}
                      tags={dream.tags || []}
                      remix={dream.remix}
                      style="inline"
                    />
                    <input
                      type="text"
                      value={dream.title}
                      onChange={e => updateDream({ title: e.target.value })}
                      style={{ width: '100%', marginBottom: 20 }}
                      className="w-full p-2 rounded border border-border bg-card text-sm"
                    />
                    
                    <label className="block text-sm font-medium mb-2">Description:</label>
                    <textarea
                      value={dream.description || ''}
                      onChange={e => updateDream({ description: e.target.value })}
                      style={{ width: '100%', height: 100, marginBottom: 20 }}
                      className="w-full p-2 rounded border border-border bg-card text-sm resize-none"
                    />
                    
                    <label className="block text-sm font-medium mb-2">Tags (comma separated):</label>
                    <input
                      type="text"
                      value={dream.tags?.join(', ') || ''}
                      onChange={e => updateDream({ tags: e.target.value.split(',').map(t => t.trim()) })}
                      style={{ width: '100%', marginBottom: 20 }}
                      className="w-full p-2 rounded border border-border bg-card text-sm"
                    />
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => handleSave(false)}
                        disabled={saving || !activeWallet}
                        style={{
                          background: '#0f0',
                          color: '#000',
                          padding: '10px 20px',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: (saving || !activeWallet) ? 'not-allowed' : 'pointer',
                          opacity: (saving || !activeWallet) ? 0.6 : 1,
                          width: '100%',
                          marginBottom: '10px'
                        }}
                      >
                        {saving ? 'Publishing...' : 'Publish Dream'}
                      </button>
                      
                      <button
                        onClick={handleSaveDraft}
                        disabled={saving || !activeWallet}
                        style={{
                          background: '#ffa500',
                          color: '#000',
                          padding: 10,
                          border: 'none',
                          borderRadius: '6px',
                          cursor: (saving || !activeWallet) ? 'not-allowed' : 'pointer',
                          opacity: (saving || !activeWallet) ? 0.6 : 1,
                          width: '100%'
                        }}
                      >
                        📦 {saving ? 'Saving...' : 'Save as Draft'}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced editing interface */}
              <Card className="border-border bg-card/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Enhanced Editor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <div className="flex gap-2">
                      <Input
                        value={dream.title}
                        onChange={(e) => updateDream({ title: e.target.value })}
                        placeholder="Enter dream title..."
                        className="flex-1"
                      />
                      <SuggestTitleButton
                        onTitleSuggested={(title) => updateDream({ title })}
                        description={dream.description || ''}
                        tags={dream.tags || []}
                        remix={dream.remix}
                        style="button"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={dream.description || ''}
                      onChange={(e) => updateDream({ description: e.target.value })}
                      placeholder="Describe your dream..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <Input
                      value={dream.tags?.join(', ') || ''}
                      onChange={(e) => updateDream({ tags: e.target.value.split(',').map(t => t.trim()) })}
                      placeholder="quantum, consciousness, remix..."
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {dream.tags?.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex gap-3">
                    <button
                      onClick={async () => {
                        await fetch('/api/publish-dream', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: dream?.id })
                        });
                        setLocation(`/dreams/${dream?.id}`);
                      }}
                      disabled={saving || !activeWallet}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded border border-cyan-500"
                    >
                      🔓 Publish
                    </button>
                    
                    <Button
                      onClick={handleSaveDraft}
                      disabled={saving || !activeWallet}
                      className="flex-1"
                      style={{ background: '#ffa500', color: '#000', padding: 10, marginLeft: 10 }}
                    >
                      📦 {saving ? 'Saving...' : 'Save as Draft'}
                    </Button>
                    </div>
                    
                    <Button
                      onClick={() => setLocation('/dream-vault')}
                      variant="outline"
                      className="w-full"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>

                  {!activeWallet && (
                    <div className="text-center text-sm text-muted-foreground">
                      Connect your wallet to save changes
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}