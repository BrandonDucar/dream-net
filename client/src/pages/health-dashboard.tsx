/**
 * Health Dashboard
 * Visual health overview for all clusters
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ClusterHealth {
  clusterId: string;
  status: "healthy" | "degraded" | "down" | "unknown";
  lastCheck: number;
  uptime: number;
  checks: Array<{
    name: string;
    status: string;
    latency?: number;
  }>;
}

export default function HealthDashboard() {
  const [health, setHealth] = useState<Record<string, ClusterHealth>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      if (data.success) {
        setHealth(data.health);
      }
    } catch (error) {
      console.error('Failed to fetch health:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerCheck = async (clusterId: string) => {
    try {
      await fetch(`/api/health/${clusterId}/check`, { method: 'POST' });
      fetchHealth();
    } catch (error) {
      console.error('Failed to trigger check:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4" />;
      case 'down':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const clusters = Object.values(health);
  const healthyCount = clusters.filter(c => c.status === 'healthy').length;
  const degradedCount = clusters.filter(c => c.status === 'degraded').length;
  const downCount = clusters.filter(c => c.status === 'down').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Health Dashboard</h1>
          <p className="text-muted-foreground">Monitor health of all clusters</p>
        </div>
        <Button onClick={fetchHealth} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clusters.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-600">Healthy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{healthyCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-yellow-600">Degraded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{degradedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-600">Down</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{downCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Clusters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clusters.map((cluster) => (
          <Card key={cluster.clusterId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg capitalize">
                  {cluster.clusterId.replace(/-/g, ' ')}
                </CardTitle>
                <Badge className={getStatusColor(cluster.status)}>
                  {getStatusIcon(cluster.status)}
                  <span className="ml-1">{cluster.status.toUpperCase()}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Check:</span>
                  <span>{new Date(cluster.lastCheck).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uptime:</span>
                  <span>{Math.floor(cluster.uptime / 1000)}s</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Health Checks:</div>
                {cluster.checks.map((check, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span>{check.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(check.status)}>
                        {check.status}
                      </Badge>
                      {check.latency && <span>{check.latency}ms</span>}
                    </div>
                  </div>
                ))}
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => triggerCheck(cluster.clusterId)}
                className="w-full"
              >
                Run Check Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

