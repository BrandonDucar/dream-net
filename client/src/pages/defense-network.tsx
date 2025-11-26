import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Zap,
  Eye,
  Lock,
  TrendingUp,
  Clock,
  Target,
  Database,
  AlertCircle
} from 'lucide-react';
import { ShieldCore } from '@dreamnet/shield-core';

export default function DefenseNetworkDashboard() {
  const [defenseStatus, setDefenseStatus] = useState(DreamDefenseNet.getStatus());
  const [analytics, setAnalytics] = useState(DreamDefenseNet.getThreatAnalytics());
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Initialize Defense Network
    DreamDefenseNet.init();
    
    // Update status every 15 seconds
    const interval = setInterval(() => {
      setDefenseStatus(DreamDefenseNet.getStatus());
      setAnalytics(DreamDefenseNet.getThreatAnalytics());
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const runManualScan = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      setDefenseStatus(DreamDefenseNet.getStatus());
      setAnalytics(DreamDefenseNet.getThreatAnalytics());
    }, 3000);
  };

  const changeDefenseLevel = (level: "armed" | "standby" | "maintenance") => {
    DreamDefenseNet.setDefenseLevel(level);
    setDefenseStatus(DreamDefenseNet.getStatus());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'armed': return 'bg-green-500';
      case 'standby': return 'bg-yellow-500';
      case 'maintenance': return 'bg-blue-500';
      case 'compromised': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-red-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              DREAM DEFENSE NETWORK
            </h1>
          </div>
          <p className="text-cyan-300 text-lg">Automated Threat Detection & Network Protection</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className={`w-4 h-4 rounded-full ${getStatusColor(defenseStatus.status)}`}></div>
            <span className="text-white font-bold text-lg">{defenseStatus.status.toUpperCase()}</span>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-red-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Active Threats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {defenseStatus.activeThreats}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-red-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-400 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Neutralized
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {defenseStatus.neutralizedThreeat}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-red-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {analytics.successRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-red-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Last Scan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-white">
                {defenseStatus.lastScan ? 
                  new Date(defenseStatus.lastScan).toLocaleString() : 
                  'Never'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-900 border-red-400/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-red-400/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="threats" className="data-[state=active]:bg-red-400/20">
              Threat Log
            </TabsTrigger>
            <TabsTrigger value="patterns" className="data-[state=active]:bg-red-400/20">
              Pattern Analysis
            </TabsTrigger>
            <TabsTrigger value="control" className="data-[state=active]:bg-red-400/20">
              Defense Control
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-red-400/30">
                <CardHeader>
                  <CardTitle className="text-red-400">Network Security Status</CardTitle>
                  <CardDescription className="text-cyan-300">
                    Real-time protection metrics and system health
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300">Threat Detection</span>
                    <span className="text-white font-bold">ACTIVE</span>
                  </div>
                  <Progress value={95} className="bg-gray-800" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300">Pattern Recognition</span>
                    <span className="text-white font-bold">OPTIMAL</span>
                  </div>
                  <Progress value={88} className="bg-gray-800" />
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-red-400/30">
                <CardHeader>
                  <CardTitle className="text-red-400">Threat Severity Breakdown</CardTitle>
                  <CardDescription className="text-cyan-300">
                    Distribution of detected threats by severity level
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-red-500"></div>
                      <span className="text-white">Critical</span>
                    </div>
                    <span className="text-white font-bold">{analytics.severityBreakdown.critical}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-orange-500"></div>
                      <span className="text-white">High</span>
                    </div>
                    <span className="text-white font-bold">{analytics.severityBreakdown.high}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-yellow-500"></div>
                      <span className="text-white">Medium</span>
                    </div>
                    <span className="text-white font-bold">{analytics.severityBreakdown.medium}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-500"></div>
                      <span className="text-white">Low</span>
                    </div>
                    <span className="text-white font-bold">{analytics.severityBreakdown.low}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="threats">
            <Card className="bg-gray-900 border-red-400/30">
              <CardHeader>
                <CardTitle className="text-red-400">Real-Time Threat Log</CardTitle>
                <CardDescription className="text-cyan-300">
                  Recent security incidents and responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {defenseStatus.threatLog.length > 0 ? (
                    defenseStatus.threatLog.slice().reverse().slice(0, 20).map((threat, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded border border-red-400/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(threat.severity)}>
                              {threat.severity}
                            </Badge>
                            <span className="text-white font-mono text-sm">{threat.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {threat.neutralized ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                            )}
                            <span className="text-xs text-cyan-300">
                              {new Date(threat.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm space-y-1">
                          <p className="text-white">ID: {threat.id}</p>
                          {threat.source && (
                            <p className="text-cyan-300">Source: {threat.source}</p>
                          )}
                          {threat.response && (
                            <p className="text-green-300">Response: {threat.response}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-cyan-300 text-center py-8">No threats detected</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns">
            <Card className="bg-gray-900 border-red-400/30">
              <CardHeader>
                <CardTitle className="text-red-400">Threat Pattern Database</CardTitle>
                <CardDescription className="text-cyan-300">
                  Learned patterns and attack vectors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analytics.topThreats.map((pattern, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded border border-red-400/20">
                        <h4 className="text-red-400 font-semibold mb-2">{pattern.type}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-cyan-300">Frequency:</span>
                            <span className="text-white">{pattern.frequency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cyan-300">Risk Level:</span>
                            <span className="text-white">{(pattern.riskLevel * 100).toFixed(0)}%</span>
                          </div>
                          <div className="mt-2">
                            <Progress value={pattern.riskLevel * 100} className="bg-gray-700" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {defenseStatus.patterns.length === 0 && (
                    <p className="text-cyan-300 text-center py-8">No patterns learned yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="control">
            <div className="space-y-6">
              <Card className="bg-gray-900 border-red-400/30">
                <CardHeader>
                  <CardTitle className="text-red-400">Defense Controls</CardTitle>
                  <CardDescription className="text-cyan-300">
                    Manage defense system status and operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 flex-wrap">
                    <Button 
                      onClick={runManualScan}
                      disabled={isScanning}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isScanning ? (
                        <>
                          <Activity className="w-4 h-4 mr-2 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Manual Scan
                        </>
                      )}
                    </Button>

                    <Button 
                      onClick={() => changeDefenseLevel('armed')}
                      variant={defenseStatus.status === 'armed' ? 'default' : 'outline'}
                      className={defenseStatus.status === 'armed' ? 
                        'bg-green-600 hover:bg-green-700' : 
                        'border-green-400 text-green-400 hover:bg-green-400/20'
                      }
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Armed
                    </Button>

                    <Button 
                      onClick={() => changeDefenseLevel('standby')}
                      variant={defenseStatus.status === 'standby' ? 'default' : 'outline'}
                      className={defenseStatus.status === 'standby' ? 
                        'bg-yellow-600 hover:bg-yellow-700' : 
                        'border-yellow-400 text-yellow-400 hover:bg-yellow-400/20'
                      }
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Standby
                    </Button>

                    <Button 
                      onClick={() => DreamDefenseNet.emergencyLockdown()}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500/20"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Emergency Lockdown
                    </Button>
                  </div>

                  {isScanning && (
                    <div className="space-y-3">
                      <Progress value={75} className="bg-gray-800" />
                      <p className="text-cyan-300 text-sm">
                        Deep scanning network for threats and vulnerabilities...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-red-400/30">
                <CardHeader>
                  <CardTitle className="text-red-400">System Integration</CardTitle>
                  <CardDescription className="text-cyan-300">
                    Coordination with other network intelligence systems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded">
                      <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                      <span className="text-white">DREAMKEEPER Core</span>
                      <Badge variant="outline" className="border-cyan-400 text-cyan-400 ml-auto">
                        Connected
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <span className="text-white">AI Surgeon</span>
                      <Badge variant="outline" className="border-green-400 text-green-400 ml-auto">
                        Connected
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}