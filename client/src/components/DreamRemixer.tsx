import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shuffle, Bot, Sparkles, RefreshCw } from 'lucide-react';
import SuggestTitleButton from './SuggestTitleButton';

interface Dream {
  id: string;
  title: string;
  type: string;
  createdByAgent?: string;
}

interface DreamRemixerProps {
  onRemixSuccess?: (newDreamId: string) => void;
}

export default function DreamRemixer({ onRemixSuccess }: DreamRemixerProps) {
  const { publicKey } = useWallet();
  const [availableDreams, setAvailableDreams] = useState<Dream[]>([]);
  const [selectedDreamId, setSelectedDreamId] = useState('');
  const [isRemixing, setIsRemixing] = useState(false);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');

  const wallet = publicKey?.toBase58();

  useEffect(() => {
    fetchAvailableDreams();
  }, []);

  const fetchAvailableDreams = async () => {
    try {
      const response = await fetch('/api/remix-dream/available-dreams');
      const data = await response.json();
      setAvailableDreams(data.dreams || []);
    } catch (error) {
      console.error('Failed to fetch available dreams:', error);
    }
  };

  const generateTitles = async () => {
    if (!tags.trim() || !description.trim()) {
      alert('Please provide tags and description first');
      return;
    }

    setIsGeneratingTitles(true);
    try {
      const response = await fetch('/api/dream-titles/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tags: tags.split(',').map(t => t.trim()),
          description,
          remix: true
        })
      });

      const data = await response.json();
      setTitleSuggestions(data.titleSuggestions || []);
    } catch (error) {
      console.error('Failed to generate titles:', error);
      setTitleSuggestions(['Creative Remix', 'Evolved Vision', 'Transformed Dream']);
    } finally {
      setIsGeneratingTitles(false);
    }
  };

  const handleRemix = async () => {
    if (!selectedDreamId || !wallet) {
      alert('Please select a dream and connect your wallet');
      return;
    }

    setIsRemixing(true);
    try {
      // Your exact pattern implementation
      const response = await fetch('/api/remix-dream/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalId: selectedDreamId,
          wallet
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`✨ Dream successfully remixed! New ID: ${data.newDreamId}`);
        onRemixSuccess?.(data.newDreamId);
        
        // Reset form
        setSelectedDreamId('');
        setTags('');
        setDescription('');
        setTitleSuggestions([]);
      } else {
        alert(`❌ Remix failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Remix error:', error);
      alert('❌ Remix failed: Network error');
    } finally {
      setIsRemixing(false);
    }
  };

  const selectedDream = availableDreams.find(d => d.id === selectedDreamId);

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shuffle className="h-5 w-5 text-purple-400" />
            Dream Remixer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Dream to Remix</label>
            <Select value={selectedDreamId} onValueChange={setSelectedDreamId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a dream to remix..." />
              </SelectTrigger>
              <SelectContent>
                {availableDreams.map((dream) => (
                  <SelectItem key={dream.id} value={dream.id}>
                    <div className="flex items-center gap-2">
                      <span>{dream.title}</span>
                      {dream.createdByAgent && (
                        <Badge variant="outline" className="text-xs">
                          <Bot className="h-3 w-3 mr-1" />
                          {dream.createdByAgent}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedDream && (
              <div className="p-3 rounded border border-purple-500/20 bg-purple-500/5">
                <div className="text-sm">
                  <strong>Original:</strong> {selectedDream.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Type: {selectedDream.type} | Agent: {selectedDream.createdByAgent}
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma-separated)</label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="quantum, consciousness, remix..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your remix concept..."
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">AI Title Suggestions</label>
              <Button
                onClick={generateTitles}
                disabled={isGeneratingTitles || !tags.trim() || !description.trim()}
                variant="outline"
                size="sm"
              >
                <Sparkles className={`h-4 w-4 mr-1 ${isGeneratingTitles ? 'animate-spin' : ''}`} />
                {isGeneratingTitles ? 'Generating...' : 'Generate Titles'}
              </Button>
            </div>
            
            {titleSuggestions.length > 0 && (
              <div className="grid gap-2">
                {titleSuggestions.slice(0, 3).map((title, index) => (
                  <div
                    key={index}
                    className="p-2 rounded border border-border bg-card/20 text-sm hover:border-purple-500/50 transition-colors cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(title);
                      alert('Title copied to clipboard!');
                    }}
                  >
                    {title}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleRemix}
            disabled={!selectedDreamId || !wallet || isRemixing}
            className="w-full"
            style={{ border: selectedDreamId && wallet ? '1px solid #0ff' : undefined }}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRemixing ? 'animate-spin' : ''}`} />
            {isRemixing ? 'Creating Remix...' : 'Create Remix'}
          </Button>

          {!wallet && (
            <div className="text-center text-sm text-muted-foreground">
              Connect your wallet to create remixes
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Implementation Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded border border-border bg-card/20 font-mono text-sm space-y-1">
            <div className="text-blue-400">router.post('/', (req, res) =&gt; &#123;</div>
            <div className="ml-2">const &#123; originalId, wallet &#125; = req.body;</div>
            <div className="ml-2">const original = loadDream(originalId);</div>
            <div className="mt-2"></div>
            <div className="ml-2">if (!original || !wallet) &#123;</div>
            <div className="ml-4">return res.status(400).json(&#123; success: false, error: 'Missing data' &#125;);</div>
            <div className="ml-2">&#125;</div>
            <div className="mt-2"></div>
            <div className="ml-2">const newId = `remix-$&#123;Date.now()&#125;`;</div>
            <div className="ml-2">const remix = &#123;</div>
            <div className="ml-4">...original,</div>
            <div className="ml-4">id: newId,</div>
            <div className="ml-4">title: `$&#123;original.title&#125; (Remix)`,</div>
            <div className="ml-4">lineage: &#123; ancestors: [original.id] &#125;,</div>
            <div className="ml-4">createdByAgent: 'LUCID',</div>
            <div className="ml-4">wallet, remix: true</div>
            <div className="ml-2">&#125;;</div>
            <div className="mt-2"></div>
            <div className="ml-2">saveDream(newId, remix);</div>
            <div className="ml-2">return res.json(&#123; success: true, newDreamId &#125;);</div>
            <div className="text-blue-400">&#125;);</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}