/**
 * Heartbeat Dashboard
 * Real-time monitoring of all DreamNet subsystems
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  Heart,
  Zap,
  Shield,
  RefreshCw,
  Clock,
  Database,
  Wrench,
} from 'lucide-react';

interface HeartbeatStatus {
  heartbeat: {
    lastRunAt: number | null;
    snapshot: {
      version: { major: number; minor: number; patch: number; label?: string };
      heartbeatAt: number;
      globalHealth: {
        infraHealth: number;
        economyHealth: number;
        socialHealth: number;
        dreamPipelineHealth: number;
      };
      subsystems: Array<{
        name: string;
        status: "ok" | "warn" | "error" | "unknown";
        details?: string;
        lastUpdatedAt?: number;
      }>;
    };
    stats: {
      uptime: number;
      averageHealth: { infra: number; economy: number; social: number; pipeline: number };
      totalAlerts: number;
      criticalAlerts: number;
      resolvedAlerts: number;
    };
    activeAlerts: number;
    trends: number;
  };
}

export default function HeartbeatDashboard() {
  const [status, setStatus] = useState<HeartbeatStatus | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [recovery, setRecovery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchHeartbeat();
    const interval = setInterval(fetchHeartbeat, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchHeartbeat = async () => {
    try {
      const [statusRes, alertsRes, trendsRes, recoveryRes] = await Promise.all([
        fetch('/api/heartbeat'),
        fetch('/api/heartbeat/alerts?active=true'),
        fetch('/api/heartbeat/trends'),
        fetch('/api/heartbeat/recovery'),
      ]);

      if (statusRes.ok) {
        const data = await statusRes.json();
        setStatus(data);
      }

      if (alertsRes.ok) {
        const data = await alertsRes.json();
        setAlerts(data.alerts || []);
      }

      if (trendsRes.ok) {
        const data = await trendsRes.json();
        setTrends(data.trends || []);
      }

      if (recoveryRes.ok) {
        const data = await recoveryRes.json();
        setRecovery(data.actions || []);
      }

      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch heartbeat:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'text-green-400';
      case 'warn': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'ok': return 'bg-green-500/20 border-green-500/30';
      case 'warn': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatUptime = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-400" />
          <p className="text-gray-400">Loading heartbeat status...</p>
        </div>
      </div>
    );
  }

  const snapshot = status?.heartbeat.snapshot;
  const stats = status?.heartbeat.stats;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400 flex items-center gap-3">
                <Heart className="w-8 h-8 animate-pulse" />
                DreamNet Heartbeat
              </h1>
              <p className="text-gray-400 mt-2">
                Real-time monitoring of all subsystems • Last update: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <Button onClick={fetchHeartbeat} variant="outline" className="border-cyan-400/30">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Global Health Scores */}
          {snapshot && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gray-900 border-cyan-400/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">Infrastructure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-400">
                    {(snapshot.globalHealth.infraHealth * 100).toFixed(0)}%
                  </div>
                  <Progress value={snapshot.globalHealth.infraHealth * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-green-400/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">Economy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">
                    {(snapshot.globalHealth.economyHealth * 100).toFixed(0)}%
                  </div>
                  <Progress value={snapshot.globalHealth.economyHealth * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-blue-400/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">Social</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">
                    {(snapshot.globalHealth.socialHealth * 100).toFixed(0)}%
                  </div>
                  <Progress value={snapshot.globalHealth.socialHealth * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-purple-400/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-400">Dream Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">
                    {(snapshot.globalHealth.dreamPipelineHealth * 100).toFixed(0)}%
                  </div>
                  <Progress value={snapshot.globalHealth.dreamPipelineHealth * 100} className="mt-2" />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Stats Bar */}
          {stats && (
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Uptime:</span>
                <span className="text-cyan-400 font-semibold">{formatUptime(stats.uptime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Subsystems:</span>
                <span className="text-cyan-400 font-semibold">{snapshot?.subsystems.length || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-gray-400">Critical Alerts:</span>
                <span className="text-red-400 font-semibold">{stats.criticalAlerts}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-400">Resolved:</span>
                <span className="text-green-400 font-semibold">{stats.resolvedAlerts}</span>
              </div>
            </div>
          )}
        </div>

        <Tabs defaultValue="subsystems" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900">
            <TabsTrigger value="subsystems">Subsystems</TabsTrigger>
            <TabsTrigger value="alerts">
              Alerts
              {alerts.length > 0 && (
                <Badge className="ml-2 bg-red-500">{alerts.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="recovery">
              Recovery
              {recovery.length > 0 && (
                <Badge className="ml-2 bg-yellow-500">{recovery.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subsystems" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {snapshot?.subsystems.map((subsystem) => (
                <Card key={subsystem.name} className={`bg-gray-900 ${getStatusBg(subsystem.status)}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">{subsystem.name}</CardTitle>
                      <Badge className={getStatusColor(subsystem.status)}>
                        {subsystem.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {subsystem.details && (
                      <p className="text-xs text-gray-400 mb-2">{subsystem.details}</p>
                    )}
                    {subsystem.lastUpdatedAt && (
                      <p className="text-xs text-gray-500">
                        Updated: {new Date(subsystem.lastUpdatedAt).toLocaleTimeString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="mt-6">
            {alerts.length === 0 ? (
              <Card className="bg-gray-900 border-green-500/30">
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-400">No active alerts</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <Card key={alert.id} className={`bg-gray-900 ${
                    alert.severity === 'critical' ? 'border-red-500/30' :
                    alert.severity === 'warning' ? 'border-yellow-500/30' :
                    'border-blue-500/30'
                  }`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <AlertTriangle className={`w-4 h-4 ${
                            alert.severity === 'critical' ? 'text-red-400' :
                            alert.severity === 'warning' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`} />
                          {alert.subsystem || 'System'}
                        </CardTitle>
                        <Badge className={
                          alert.severity === 'critical' ? 'bg-red-500' :
                          alert.severity === 'warning' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            {trends.length === 0 ? (
              <Card className="bg-gray-900 border-gray-500/30">
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-400">No trend data available</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {trends.map((trend, idx) => (
                  <Card key={idx} className="bg-gray-900 border-gray-500/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{trend.subsystem}</CardTitle>
                        <div className="flex items-center gap-2">
                          {trend.trend === 'improving' && <TrendingUp className="w-4 h-4 text-green-400" />}
                          {trend.trend === 'degrading' && <TrendingDown className="w-4 h-4 text-yellow-400" />}
                          {trend.trend === 'critical' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                          <Badge className={
                            trend.trend === 'improving' ? 'bg-green-500' :
                            trend.trend === 'critical' ? 'bg-red-500' :
                            trend.trend === 'degrading' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }>
                            {trend.trend.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300">
                        Change rate: {trend.changeRate.toFixed(1)}% per hour
                      </p>
                      {trend.predictedFailure && (
                        <p className="text-xs text-red-400 mt-2">
                          Predicted failure: {new Date(trend.predictedFailure).toLocaleString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recovery" className="mt-6">
            {recovery.length === 0 ? (
              <Card className="bg-gray-900 border-green-500/30">
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-400">No recovery actions needed</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {recovery.map((action) => (
                  <Card key={action.id} className="bg-gray-900 border-yellow-500/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-yellow-400" />
                          {action.subsystem}
                        </CardTitle>
                        <Badge className={
                          action.priority === 'critical' ? 'bg-red-500' :
                          action.priority === 'high' ? 'bg-orange-500' :
                          'bg-yellow-500'
                        }>
                          {action.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300 mb-2">{action.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Action: {action.action}</span>
                        <span>Risk: {action.risk}</span>
                        <span>Est. time: {action.estimatedTime}ms</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

