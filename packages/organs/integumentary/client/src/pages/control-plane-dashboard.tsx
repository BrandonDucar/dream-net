/**
 * Control Plane Dashboard
 * Real-time monitoring and control for kill-switches, rate limits, and circuit breakers
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertTriangle,
  CheckCircle,
  Power,
  Gauge,
  Zap,
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from 'lucide-react';

interface ClusterRateLimit {
  clusterId: string;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  enabled: boolean;
}

interface KillSwitchState {
  globalKillSwitch: boolean;
  clusterStates: Record<string, {
    enabled: boolean;
    reason?: string;
    disabledAt?: number;
    disabledBy?: string;
  }>;
  lastUpdatedAt: number;
}

interface CircuitBreaker {
  tripped: boolean;
  tripCount: number;
  lastTripAt?: number;
  autoResetAfter?: number;
}

interface ControlConfig {
  killSwitch: KillSwitchState;
  rateLimits: ClusterRateLimit[];
  circuitBreakers: Record<string, CircuitBreaker>;
}

export default function ControlPlaneDashboard() {
  const [config, setConfig] = useState<ControlConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [rateLimitEdit, setRateLimitEdit] = useState<Partial<ClusterRateLimit>>({});
  const [showGlobalKillSwitch, setShowGlobalKillSwitch] = useState(false);

  useEffect(() => {
    fetchConfig();
    const interval = setInterval(fetchConfig, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/control');
      const data = await response.json();
      if (data.success) {
        setConfig(data.config);
      }
    } catch (error) {
      console.error('Failed to fetch control config:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGlobalKillSwitch = async (enabled: boolean) => {
    try {
      const endpoint = enabled ? '/api/control/kill-switch/enable' : '/api/control/kill-switch/disable';
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: enabled ? 'Manual activation' : 'Manual deactivation' }),
      });
      fetchConfig();
    } catch (error) {
      console.error('Failed to toggle kill-switch:', error);
    }
  };

  const toggleCluster = async (clusterId: string, enabled: boolean) => {
    try {
      const endpoint = enabled
        ? `/api/control/cluster/${clusterId}/enable`
        : `/api/control/cluster/${clusterId}/disable`;
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: enabled ? 'Manual activation' : 'Manual deactivation' }),
      });
      fetchConfig();
    } catch (error) {
      console.error('Failed to toggle cluster:', error);
    }
  };

  const updateRateLimit = async (clusterId: string) => {
    try {
      await fetch(`/api/control/cluster/${clusterId}/rate-limit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rateLimitEdit),
      });
      setRateLimitEdit({});
      setSelectedCluster(null);
      fetchConfig();
    } catch (error) {
      console.error('Failed to update rate limit:', error);
    }
  };

  const tripCircuitBreaker = async (clusterId: string) => {
    try {
      await fetch(`/api/control/cluster/${clusterId}/circuit-breaker/trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoResetAfter: 5 * 60 * 1000 }), // 5 minutes
      });
      fetchConfig();
    } catch (error) {
      console.error('Failed to trip circuit breaker:', error);
    }
  };

  const resetCircuitBreaker = async (clusterId: string) => {
    try {
      await fetch(`/api/control/cluster/${clusterId}/circuit-breaker/reset`, {
        method: 'POST',
      });
      fetchConfig();
    } catch (error) {
      console.error('Failed to reset circuit breaker:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!config) {
    return <div>Failed to load control config</div>;
  }

  const clusters = config.rateLimits || [];
  const globalKillSwitch = config.killSwitch?.globalKillSwitch || false;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Control Plane Dashboard</h1>
          <p className="text-muted-foreground">Monitor and control all DreamNet clusters</p>
        </div>
        <Button onClick={fetchConfig} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Global Kill-Switch */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Power className="h-5 w-5" />
                Global Kill-Switch
              </CardTitle>
              <CardDescription>Master control for all agent clusters</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={globalKillSwitch ? 'destructive' : 'default'}>
                {globalKillSwitch ? 'ENABLED' : 'DISABLED'}
              </Badge>
              <Switch
                checked={globalKillSwitch}
                onCheckedChange={toggleGlobalKillSwitch}
              />
            </div>
          </div>
        </CardHeader>
        {globalKillSwitch && (
          <CardContent>
            <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
              <p className="text-sm text-destructive font-medium">
                ⚠️ All clusters are currently disabled by global kill-switch
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Clusters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clusters.map((cluster) => {
          const clusterState = config.killSwitch.clusterStates[cluster.clusterId] || { enabled: true };
          const circuitBreaker = config.circuitBreakers[cluster.clusterId];
          const isEnabled = !globalKillSwitch && clusterState.enabled && !circuitBreaker?.tripped;

          return (
            <Card key={cluster.clusterId} className={!isEnabled ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">
                    {cluster.clusterId.replace(/-/g, ' ')}
                  </CardTitle>
                  <Badge variant={isEnabled ? 'default' : 'destructive'}>
                    {isEnabled ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {isEnabled ? 'ACTIVE' : 'DISABLED'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Switch
                      checked={clusterState.enabled}
                      onCheckedChange={(enabled) => toggleCluster(cluster.clusterId, enabled)}
                      disabled={globalKillSwitch}
                    />
                  </div>
                  {clusterState.reason && (
                    <p className="text-xs text-muted-foreground">{clusterState.reason}</p>
                  )}
                </div>

                {/* Rate Limits */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      Rate Limits
                    </span>
                    {selectedCluster === cluster.clusterId ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCluster(null);
                          setRateLimitEdit({});
                        }}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedCluster(cluster.clusterId);
                          setRateLimitEdit({
                            requestsPerMinute: cluster.requestsPerMinute,
                            requestsPerHour: cluster.requestsPerHour,
                            requestsPerDay: cluster.requestsPerDay,
                          });
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </div>

                  {selectedCluster === cluster.clusterId ? (
                    <div className="space-y-2 p-2 bg-muted rounded">
                      <div>
                        <Label className="text-xs">Per Minute</Label>
                        <Input
                          type="number"
                          value={rateLimitEdit.requestsPerMinute || cluster.requestsPerMinute}
                          onChange={(e) =>
                            setRateLimitEdit({
                              ...rateLimitEdit,
                              requestsPerMinute: parseInt(e.target.value),
                            })
                          }
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Per Hour</Label>
                        <Input
                          type="number"
                          value={rateLimitEdit.requestsPerHour || cluster.requestsPerHour}
                          onChange={(e) =>
                            setRateLimitEdit({
                              ...rateLimitEdit,
                              requestsPerHour: parseInt(e.target.value),
                            })
                          }
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Per Day</Label>
                        <Input
                          type="number"
                          value={rateLimitEdit.requestsPerDay || cluster.requestsPerDay}
                          onChange={(e) =>
                            setRateLimitEdit({
                              ...rateLimitEdit,
                              requestsPerDay: parseInt(e.target.value),
                            })
                          }
                          className="h-8"
                        />
                      </div>
                      <Button
                        size="sm"
                        onClick={() => updateRateLimit(cluster.clusterId)}
                        className="w-full"
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min:</span>
                        <span className="font-mono">{cluster.requestsPerMinute}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hour:</span>
                        <span className="font-mono">{cluster.requestsPerHour}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Day:</span>
                        <span className="font-mono">{cluster.requestsPerDay}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Circuit Breaker */}
                {circuitBreaker && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Circuit Breaker
                      </span>
                      <Badge variant={circuitBreaker.tripped ? 'destructive' : 'default'}>
                        {circuitBreaker.tripped ? 'TRIPPED' : 'OK'}
                      </Badge>
                    </div>
                    {circuitBreaker.tripped && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resetCircuitBreaker(cluster.clusterId)}
                          className="flex-1"
                        >
                          Reset
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => tripCircuitBreaker(cluster.clusterId)}
                          className="flex-1"
                        >
                          Trip Again
                        </Button>
                      </div>
                    )}
                    {!circuitBreaker.tripped && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => tripCircuitBreaker(cluster.clusterId)}
                        className="w-full"
                      >
                        Test Trip
                      </Button>
                    )}
                    {circuitBreaker.tripCount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Tripped {circuitBreaker.tripCount} time(s)
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clusters.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {clusters.filter(
                (c) =>
                  !globalKillSwitch &&
                  (config.killSwitch.clusterStates[c.clusterId]?.enabled !== false) &&
                  !config.circuitBreakers[c.clusterId]?.tripped
              ).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Disabled Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {clusters.filter(
                (c) =>
                  globalKillSwitch ||
                  config.killSwitch.clusterStates[c.clusterId]?.enabled === false ||
                  config.circuitBreakers[c.clusterId]?.tripped
              ).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Circuit Breakers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {Object.values(config.circuitBreakers || {}).filter((cb) => cb.tripped).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

