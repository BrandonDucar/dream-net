import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Clock, AlertCircle, Palette, Zap, Users } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';

interface RemixSubmission {
  remixer: string;
  title: string;
  description: string;
  tags: string[];
  type: 'Reimagine' | 'Enhance' | 'Fusion';
}

interface RemixResponse {
  success: boolean;
  remix: {
    id: string;
    title: string;
    type: string;
    status: string;
    expectedReward: {
      baseCORE: number;
      bonusCORE: number;
      XPBoost: string;
      specialBadge: string;
    };
  };
  message: string;
  nextSteps: string[];
  estimatedReview: string;
}

interface TrackingData {
  remixId: string;
  currentStage: string;
  progress: number;
  stages: Array<{
    name: string;
    status: 'completed' | 'in_progress' | 'pending';
    completedAt?: string;
    startedAt?: string;
    estimatedStart?: string;
  }>;
  communityVotes: {
    positive: number;
    negative: number;
    neutral: number;
    totalVoters: number;
  };
}

const RemixSubmissionForm = () => {
  const [formData, setFormData] = useState<RemixSubmission>({
    remixer: '0xUSER',
    title: '',
    description: '',
    tags: [],
    type: 'Reimagine'
  });
  const [tagInput, setTagInput] = useState('');

  const submitMutation = useMutation({
    mutationFn: async (data: RemixSubmission) => {
      const response = await fetch('/api/dreams/remix-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to submit remix');
      return response.json() as Promise<RemixResponse>;
    },
    onSuccess: () => {
      setFormData({
        remixer: '0xUSER',
        title: '',
        description: '',
        tags: [],
        type: 'Reimagine'
      });
      setTagInput('');
    }
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      submitMutation.mutate(formData);
    }
  };

  const remixTypeIcons = {
    'Reimagine': <Palette className="w-4 h-4" />,
    'Enhance': <Zap className="w-4 h-4" />,
    'Fusion': <Users className="w-4 h-4" />
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Submit Dream Remix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Remix Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter your remix title..."
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your remix vision..."
              rows={3}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Remix Type</label>
            <Select value={formData.type} onValueChange={(value: 'Reimagine' | 'Enhance' | 'Fusion') => 
              setFormData(prev => ({ ...prev, type: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Reimagine">
                  <div className="flex items-center gap-2">
                    {remixTypeIcons.Reimagine}
                    Reimagine - Complete transformation
                  </div>
                </SelectItem>
                <SelectItem value="Enhance">
                  <div className="flex items-center gap-2">
                    {remixTypeIcons.Enhance}
                    Enhance - Amplify original vision
                  </div>
                </SelectItem>
                <SelectItem value="Fusion">
                  <div className="flex items-center gap-2">
                    {remixTypeIcons.Fusion}
                    Fusion - Merge concepts
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tags..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={submitMutation.isPending} className="w-full">
            {submitMutation.isPending ? 'Submitting...' : 'Submit Remix'}
          </Button>

          {submitMutation.data && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  {submitMutation.data.message}
                </span>
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <div>Remix ID: {submitMutation.data.remix.id}</div>
                <div>Expected Review: {submitMutation.data.estimatedReview}</div>
                <div>Reward: {submitMutation.data.remix.expectedReward.baseCORE + submitMutation.data.remix.expectedReward.bonusCORE} CORE + {submitMutation.data.remix.expectedReward.specialBadge} badge</div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

const RemixTracker = ({ remixId }: { remixId: string }) => {
  const { data: tracking, isLoading } = useQuery<TrackingData>({
    queryKey: [`/api/dreams/remix/tracking/${remixId}`],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tracking) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Remix Progress</span>
          <Badge variant="outline">{tracking.progress}% Complete</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={tracking.progress} className="h-2" />
        
        <div className="space-y-3">
          {tracking.stages.map((stage, index) => (
            <div key={stage.name} className="flex items-center gap-3">
              {getStageIcon(stage.status)}
              <div className="flex-1">
                <div className="font-medium capitalize">{stage.name.replace('_', ' ')}</div>
                <div className="text-sm text-muted-foreground">
                  {stage.status === 'completed' && stage.completedAt && 
                    `Completed ${new Date(stage.completedAt).toLocaleString()}`}
                  {stage.status === 'in_progress' && stage.startedAt && 
                    `Started ${new Date(stage.startedAt).toLocaleString()}`}
                  {stage.status === 'pending' && stage.estimatedStart && 
                    `Estimated start: ${new Date(stage.estimatedStart).toLocaleString()}`}
                </div>
              </div>
              <Badge variant={stage.status === 'completed' ? 'default' : stage.status === 'in_progress' ? 'secondary' : 'outline'}>
                {stage.status}
              </Badge>
            </div>
          ))}
        </div>

        {tracking.communityVotes && (
          <div className="pt-4 border-t">
            <div className="text-sm font-medium mb-2">Community Votes</div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div className="text-center">
                <div className="text-green-600 font-medium">{tracking.communityVotes.positive}</div>
                <div className="text-muted-foreground">Positive</div>
              </div>
              <div className="text-center">
                <div className="text-red-600 font-medium">{tracking.communityVotes.negative}</div>
                <div className="text-muted-foreground">Negative</div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 font-medium">{tracking.communityVotes.neutral}</div>
                <div className="text-muted-foreground">Neutral</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{tracking.communityVotes.totalVoters}</div>
                <div className="text-muted-foreground">Total</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function RemixSubmissionTracker() {
  const [activeRemixId, setActiveRemixId] = useState<string>('');

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <Palette className="w-5 h-5 text-purple-500" />
        </div>
        <h2 className="text-2xl font-bold">Dream Remix System</h2>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold mb-4">Submit New Remix</h3>
          <RemixSubmissionForm />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Track Remix Progress</h3>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Enter remix ID to track..."
                value={activeRemixId}
                onChange={(e) => setActiveRemixId(e.target.value)}
              />
            </div>
            {activeRemixId && <RemixTracker remixId={activeRemixId} />}
          </div>
        </div>
      </div>
    </div>
  );
}