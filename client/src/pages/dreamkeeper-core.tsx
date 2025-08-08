import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Brain, Eye, Shield, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { DREAMKEEPER_CORE } from '../../../lib/dreamkeeperCore';

export default function DreamKeeperCorePage() {
  const [coreStatus, setCoreStatus] = useState(DREAMKEEPER_CORE.getStatus());
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Initialize DREAMKEEPER Core
    DREAMKEEPER_CORE.init();
    
    // Update status every 30 seconds
    const interval = setInterval(() => {
      setCoreStatus(DREAMKEEPER_CORE.getStatus());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const runDiagnostics = () => {
    setIsScanning(true);
    DREAMKEEPER_CORE.runSelfDiagnostics();
    
    setTimeout(() => {
      setIsScanning(false);
      setCoreStatus(DREAMKEEPER_CORE.getStatus());
    }, 3000);
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'stable': return 'bg-green-500';
      case 'elevated': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              DREAMKEEPER CORE
            </h1>
          </div>
          <p className="text-cyan-300 text-lg">Network Intelligence & Self-Diagnostic System</p>
          <Badge variant="outline" className="mt-2 border-cyan-400 text-cyan-400">
            v{coreStatus.version}
          </Badge>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-cyan-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Network Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getHealthColor(coreStatus.networkHealth)}`}>
                {coreStatus.networkHealth.toUpperCase()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-cyan-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Threat Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getThreatColor(coreStatus.threatLevel)}`}></div>
                <span className="text-white font-bold">{coreStatus.threatLevel.toUpperCase()}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-cyan-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Dreams Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {coreStatus.totalDreams.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-cyan-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Active Cores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {coreStatus.activeCores}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="diagnostics" className="space-y-6">
          <TabsList className="bg-gray-900 border-cyan-400/30">
            <TabsTrigger value="diagnostics" className="data-[state=active]:bg-cyan-400/20">
              Diagnostics
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-cyan-400/20">
              Network Monitor
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-cyan-400/20">
              System Logs
            </TabsTrigger>
            <TabsTrigger value="learning" className="data-[state=active]:bg-cyan-400/20">
              Learning Engine
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagnostics">
            <Card className="bg-gray-900 border-cyan-400/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">System Diagnostics</CardTitle>
                <CardDescription className="text-cyan-300">
                  Run comprehensive system health checks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button 
                  onClick={runDiagnostics}
                  disabled={isScanning}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  {isScanning ? (
                    <>
                      <Activity className="w-4 h-4 mr-2 animate-spin" />
                      Scanning Network...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Run Full Diagnostics
                    </>
                  )}
                </Button>

                {isScanning && (
                  <div className="space-y-3">
                    <Progress value={66} className="bg-gray-800" />
                    <p className="text-cyan-300 text-sm">
                      Analyzing network topology and agent clusters...
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800 rounded-lg border border-cyan-400/20">
                    <h4 className="text-cyan-400 font-semibold mb-2">Agent Clusters</h4>
                    <p className="text-white text-2xl font-bold">{coreStatus.agentClusters}</p>
                    <p className="text-cyan-300 text-sm">clusters responding</p>
                  </div>
                  
                  <div className="p-4 bg-gray-800 rounded-lg border border-cyan-400/20">
                    <h4 className="text-cyan-400 font-semibold mb-2">Last Scan</h4>
                    <p className="text-white text-sm">
                      {coreStatus.lastScan === 'never' ? 'Never' : new Date(coreStatus.lastScan).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring">
            <Card className="bg-gray-900 border-cyan-400/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Network Monitoring</CardTitle>
                <CardDescription className="text-cyan-300">
                  Real-time network status and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-800 rounded-lg">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">
                      {((coreStatus.activeCores / 50) * 100).toFixed(1)}%
                    </div>
                    <p className="text-cyan-300">Core Utilization</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gray-800 rounded-lg">
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      99.8%
                    </div>
                    <p className="text-cyan-300">Uptime</p>
                  </div>
                  
                  <div className="text-center p-6 bg-gray-800 rounded-lg">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {DREAMKEEPER_CORE.scanHistory.length}
                    </div>
                    <p className="text-cyan-300">Scans Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="bg-gray-900 border-cyan-400/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">System Logs</CardTitle>
                <CardDescription className="text-cyan-300">
                  Recent system activity and diagnostic reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {DREAMKEEPER_CORE.logs.length > 0 ? (
                    DREAMKEEPER_CORE.logs.slice(-10).reverse().map((log, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded border border-cyan-400/20">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="border-cyan-400 text-cyan-400">
                            {log.status}
                          </Badge>
                          <span className="text-xs text-cyan-300">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {log.notes.map((note, noteIndex) => (
                            <p key={noteIndex} className="text-sm text-white">{note}</p>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-cyan-300 text-center py-8">No logs available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning">
            <Card className="bg-gray-900 border-cyan-400/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Learning Engine</CardTitle>
                <CardDescription className="text-cyan-300">
                  Adaptive intelligence and continuous improvement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-gray-800 rounded-lg border border-cyan-400/20">
                  <h4 className="text-cyan-400 font-semibold mb-3">Learning Capabilities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white">Remix Failure Analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white">Build Error Detection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white">Security Flag Monitoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white">Performance Optimization</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg border border-cyan-400/20">
                  <h4 className="text-cyan-400 font-semibold mb-2">Adaptation Status</h4>
                  <p className="text-white">
                    Learning engine initialized and ready for feedback integration.
                  </p>
                  <p className="text-cyan-300 text-sm mt-2">
                    System will automatically adapt based on network feedback and performance metrics.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}