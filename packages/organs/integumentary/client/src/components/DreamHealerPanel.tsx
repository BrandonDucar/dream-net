import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Activity, Shield, Zap, CheckCircle, Clock } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';

interface NightmareAgent {
  dreamId: string;
  agent: string;
  status: string;
  lastAction: string;
  powerLevel: number;
  corruptionLevel: number;
  influenceRadius: number;
  assignedBy: string;
  assignedAt: string;
  log: Array<{
    timestamp: string;
    action: string;
    severity: 'info' | 'warning' | 'critical';
  }>;
}

interface ResolutionResponse {
  success: boolean;
  resolution: {
    dreamId: string;
    resolvedBy: string;
    resolution: string;
    resolvedAt: string;
    description: string;
    effect: string;
    reward: string;
    previousCorruption: number;
    finalCorruption: number;
    agentsAffected: string[];
  };
  message: string;
  trustRestored: boolean;
  timestamp: string;
}

const DreamInfectionList = () => {
  const { data: infections, isLoading, refetch } = useQuery<NightmareAgent[]>({
    queryKey: ['/api/nightmare/agents/tracking'],
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'tracking': return <Activity className="w-4 h-4" />;
      case 'amplifying': return <AlertTriangle className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {infections?.map((infection) => (
        <Card key={`${infection.dreamId}-${infection.agent}`} className="border-red-200 dark:border-red-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                {getStatusIcon(infection.status)}
                Dream {infection.dreamId}
              </CardTitle>
              <Badge variant="destructive" className="flex items-center gap-1">
                {infection.agent}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Power Level</div>
                <div className="font-semibold">{infection.powerLevel}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Corruption</div>
                <div className="font-semibold text-red-500">{infection.corruptionLevel}%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Influence</div>
                <div className="font-semibold">{infection.influenceRadius}m</div>
              </div>
              <div>
                <div className="text-muted-foreground">Status</div>
                <div className="font-semibold capitalize">{infection.status}</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground mb-2">Corruption Level</div>
              <Progress value={infection.corruptionLevel} className="h-2" />
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Last Action</div>
              <div className="text-sm text-muted-foreground">{infection.lastAction}</div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Recent Activity</div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {infection.log.slice(-3).map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(entry.severity)}`}></div>
                    <span className="text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                    <span>{entry.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const HealingActions = () => {
  const [selectedDream, setSelectedDream] = useState<string>('');
  const [resolutionType, setResolutionType] = useState<'transmuted' | 'purified' | 'contained'>('transmuted');

  const resolveMutation = useMutation({
    mutationFn: async (data: { dreamId: string; resolvedBy: string; resolution: string }) => {
      const response = await fetch('/api/nightmare/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to resolve dream');
      return response.json() as Promise<ResolutionResponse>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nightmare/agents/tracking'] });
      setSelectedDream('');
    }
  });

  const logActionMutation = useMutation({
    mutationFn: async (data: { dreamId: string; agent: string; action: string; timestamp?: number }) => {
      const response = await fetch('/api/nightmare/agents/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to log action');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nightmare/agents/tracking'] });
    }
  });

  const handleResolve = () => {
    if (!selectedDream) return;
    
    resolveMutation.mutate({
      dreamId: selectedDream,
      resolvedBy: '0xYourWallet',
      resolution: resolutionType
    });
  };

  const handleLogAction = (dreamId: string, agent: string, action: string) => {
    logActionMutation.mutate({
      dreamId,
      agent,
      action,
      timestamp: Math.floor(Date.now() / 1000)
    });
  };

  const resolutionOptions = [
    {
      type: 'transmuted' as const,
      title: 'Transmute',
      description: 'Convert corruption into pure energy',
      reward: '50 CORE tokens + XP boost',
      icon: <Zap className="w-4 h-4" />
    },
    {
      type: 'purified' as const,
      title: 'Purify',
      description: 'Complete cleansing of nightmare influences',
      reward: '75 CORE tokens + Elite status',
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      type: 'contained' as const,
      title: 'Contain',
      description: 'Isolate and monitor corruption',
      reward: '25 CORE tokens',
      icon: <Shield className="w-4 h-4" />
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Healing Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Infected Dream</label>
          <select 
            value={selectedDream} 
            onChange={(e) => setSelectedDream(e.target.value)}
            className="w-full p-2 border rounded-md bg-background"
          >
            <option value="">Choose dream to heal...</option>
            <option value="infected_dream_123">infected_dream_123</option>
            <option value="dark_vision_456">dark_vision_456</option>
            <option value="shadow_realm_789">shadow_realm_789</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-3 block">Resolution Method</label>
          <div className="grid gap-3">
            {resolutionOptions.map((option) => (
              <div
                key={option.type}
                onClick={() => setResolutionType(option.type)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  resolutionType === option.type 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {option.icon}
                  <span className="font-medium">{option.title}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  {option.description}
                </div>
                <div className="text-xs text-primary font-medium">
                  Reward: {option.reward}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleResolve}
            disabled={!selectedDream || resolveMutation.isPending}
            className="flex-1"
          >
            {resolveMutation.isPending ? 'Resolving...' : `${resolutionType === 'transmuted' ? 'Transmute' : resolutionType === 'purified' ? 'Purify' : 'Contain'} Dream`}
          </Button>
          <Button 
            variant="outline"
            onClick={() => handleLogAction(selectedDream || 'infected_dream_123', 'WHISPER', 'Manual intervention initiated')}
            disabled={logActionMutation.isPending}
          >
            {logActionMutation.isPending ? 'Logging...' : 'Log Action'}
          </Button>
        </div>

        {resolveMutation.data && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800 dark:text-green-200">
                {resolveMutation.data.message}
              </span>
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              {resolveMutation.data.resolution.description}
            </div>
            <div className="text-sm font-medium text-green-800 dark:text-green-200 mt-1">
              Reward: {resolveMutation.data.resolution.reward}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function DreamHealerPanel() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold">Infected Dream Monitor</h2>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold mb-4">Active Infections</h3>
          <DreamInfectionList />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Healing Actions</h3>
          <HealingActions />
        </div>
      </div>
    </div>
  );
}