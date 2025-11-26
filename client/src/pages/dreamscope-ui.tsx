import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Brain, 
  Stethoscope, 
  Shield, 
  Dna, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Zap,
  RefreshCw
} from 'lucide-react';
// Mock EvolutionEngine for now - needs proper implementation
const EvolutionEngine = {
  run: () => ({ status: 'Evolution Engine running' }),
  status: () => ({ status: 'Evolution Engine active' }),
  evolve: () => ({ evolved: true }),
};
// Mock imports for now - needs proper implementation
const DREAMKEEPER_CORE = {
  status: () => ({ status: 'DreamKeeper active', health: 95 }),
  run: () => ({ action: 'DreamKeeper cycle completed' }),
  heal: () => ({ healed: true }),
};

const DreamDefenseNet = {
  status: () => ({ status: 'Defense Network active' }),
  threats: () => [],
  spikes: () => [],
};

const SurgeonAgent = {
  diagnose: () => ({ diagnosis: 'System healthy' }),
  operate: () => ({ operation: 'completed' }),
  monitor: () => ({ status: 'monitoring active' }),
};

export default function DreamScopeUI() {
  const [coreStatus, setCoreStatus] = useState(DREAMKEEPER_CORE.getStatus());
  const [surgeonStatus, setSurgeonStatus] = useState(SurgeonAgent.getStatus());
  const [defenseStatus, setDefenseStatus] = useState(DreamDefenseNet.getStatus());
  const [evolutionStatus, setEvolutionStatus] = useState(EvolutionEngine.getStatus());
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    // Initialize all systems
    DREAMKEEPER_CORE.runSelfDiagnostics();
    SurgeonAgent.init();
    DreamDefenseNet.init();
    EvolutionEngine.startCycle();

    // Update all statuses every 15 seconds
    const interval = setInterval(() => {
      setCoreStatus(DREAMKEEPER_CORE.getStatus());
      setSurgeonStatus(SurgeonAgent.getStatus());
      setDefenseStatus(DreamDefenseNet.getStatus());
      setEvolutionStatus(EvolutionEngine.getStatus());
      setLastUpdate(new Date());
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const recentDiagnostics = DREAMKEEPER_CORE.logs.slice(-3);
  const recentUpgrades = evolutionStatus.recentCycles.slice(-3);
  const threats = defenseStatus.threatLog.slice(-3);
  const surgeonTasks = surgeonStatus.taskQueue.slice(-3);

  const refreshAll = () => {
    DREAMKEEPER_CORE.runSelfDiagnostics();
    SurgeonAgent.runDiagnosticSweep();
    EvolutionEngine.forceEvolution();
    
    setTimeout(() => {
      setCoreStatus(DREAMKEEPER_CORE.getStatus());
      setSurgeonStatus(SurgeonAgent.getStatus());
      setDefenseStatus(DreamDefenseNet.getStatus());
      setEvolutionStatus(EvolutionEngine.getStatus());
      setLastUpdate(new Date());
    }, 2000);
  };

  const getSystemHealthColor = () => {
    const criticalThreats = defenseStatus?.activeThreats || 0;
    const surgeonIssues = surgeonStatus?.activeIssues || 0;
    const coreHealth = coreStatus?.networkVitals?.networkHealth || 'unknown';
    
    if (criticalThreats > 2 || surgeonIssues > 5 || coreHealth === 'critical') {
      return 'text-red-400';
    } else if (criticalThreats > 0 || surgeonIssues > 2 || coreHealth === 'degraded') {
      return 'text-yellow-400';
    }
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              DREAMSCOPE INTERFACE
            </h1>
          </div>
          <p className="text-cyan-300 text-lg">Unified Network Intelligence Dashboard</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="outline" className="border-cyan-400 text-cyan-400">
              Last Updated: {lastUpdate.toLocaleTimeString()}
            </Badge>
            <Button 
              onClick={refreshAll}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh All
            </Button>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-cyan-400/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-cyan-400 flex items-center gap-2 text-sm">
                <Brain className="w-4 h-4" />
                DREAMKEEPER Core
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-lg font-bold ${coreStatus?.networkVitals?.networkHealth === 'healthy' ? 'text-green-400' : 'text-yellow-400'}`}>
                {coreStatus?.networkVitals?.networkHealth?.toUpperCase() || 'UNKNOWN'}
              </div>
              <div className="text-xs text-gray-400">
                {coreStatus?.logCount || 0} diagnostics
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-400/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 flex items-center gap-2 text-sm">
                <Stethoscope className="w-4 h-4" />
                AI Surgeon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-lg font-bold ${surgeonStatus?.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                {surgeonStatus?.status?.toUpperCase() || 'UNKNOWN'}
              </div>
              <div className="text-xs text-gray-400">
                {surgeonStatus?.autoFixesApplied || 0} fixes applied
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-red-400/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-red-400 flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" />
                Defense Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-lg font-bold ${defenseStatus?.status === 'armed' ? 'text-green-400' : 'text-yellow-400'}`}>
                {defenseStatus?.status?.toUpperCase() || 'UNKNOWN'}
              </div>
              <div className="text-xs text-gray-400">
                {defenseStatus?.neutralizedThreeat || 0} threats neutralized
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-400/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-400 flex items-center gap-2 text-sm">
                <Dna className="w-4 h-4" />
                Evolution Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-lg font-bold ${evolutionStatus?.isActive ? 'text-green-400' : 'text-yellow-400'}`}>
                {evolutionStatus?.isActive ? 'ACTIVE' : 'PAUSED'}
              </div>
              <div className="text-xs text-gray-400">
                {evolutionStatus?.upgradeCount || 0} cycles complete
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Diagnostics */}
          <Card className="bg-gray-900 border-cyan-400/30">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Recent Diagnostics
              </CardTitle>
              <CardDescription className="text-cyan-300">
                Latest DREAMKEEPER Core analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentDiagnostics.length > 0 ? (
                  recentDiagnostics.map((log, i) => (
                    <div key={i} className="p-3 bg-gray-800 rounded border border-cyan-400/20">
                      <div className="flex items-center justify-between mb-1">
                        <Badge className="bg-cyan-500 text-white text-xs">
                          {log.status}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm text-white">
                        {log.notes && log.notes.length > 0 ? log.notes[0] : 'System diagnostic complete'}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No recent diagnostics</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Surgeon Activity */}
          <Card className="bg-gray-900 border-green-400/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Surgeon Activity
              </CardTitle>
              <CardDescription className="text-cyan-300">
                Recent maintenance and fixes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {surgeonTasks.length > 0 ? (
                  surgeonTasks.map((task, i) => (
                    <div key={i} className="p-3 bg-gray-800 rounded border border-green-400/20">
                      <div className="flex items-center justify-between mb-1">
                        <Badge className={`text-xs ${
                          task.resolved ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
                        }`}>
                          {task.resolved ? 'Fixed' : 'Pending'}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {new Date(task.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm text-white mb-1">{task.dreamId}</div>
                      <div className="text-xs text-gray-300">{task.issue}</div>
                      {task.fixApplied && (
                        <div className="text-xs text-green-300 mt-1">
                          Fix: {task.fixApplied}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No recent surgeon activity</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Evolution Cycles */}
          <Card className="bg-gray-900 border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Dna className="w-5 h-5" />
                Evolution Cycles
              </CardTitle>
              <CardDescription className="text-cyan-300">
                Recent system improvements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recentUpgrades.length > 0 ? (
                  recentUpgrades.map((upgrade, i) => (
                    <div key={i} className="p-3 bg-gray-800 rounded border border-purple-400/20">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-purple-500 text-white text-xs">
                          {upgrade.upgradeID.split('_')[1]}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white font-bold">{upgrade.impact}%</span>
                          <Progress value={upgrade.impact} className="w-12 h-2" />
                        </div>
                      </div>
                      <div className="text-xs text-gray-300 space-y-1">
                        {upgrade.insights.rewriteRules.length > 0 && (
                          <div>Rules: {upgrade.insights.rewriteRules.slice(0, 2).join(', ')}</div>
                        )}
                        {upgrade.insights.removeFlaws.length > 0 && (
                          <div>Flaws: {upgrade.insights.removeFlaws.slice(0, 2).join(', ')}</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No recent evolution cycles</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Threat Detection */}
          <Card className="bg-gray-900 border-red-400/30">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Threat Detection
              </CardTitle>
              <CardDescription className="text-cyan-300">
                Security monitoring and responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {threats.length > 0 ? (
                  threats.map((threat, i) => (
                    <div key={i} className="p-3 bg-gray-800 rounded border border-red-400/20">
                      <div className="flex items-center justify-between mb-1">
                        <Badge className={`text-xs ${
                          threat.severity === 'critical' ? 'bg-red-500 text-white' :
                          threat.severity === 'high' ? 'bg-orange-500 text-white' :
                          threat.severity === 'medium' ? 'bg-yellow-500 text-black' :
                          'bg-blue-500 text-white'
                        }`}>
                          {threat.severity}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {threat.neutralized ? (
                            <CheckCircle className="w-3 h-3 text-green-400" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-red-400" />
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(threat.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-white mb-1">{threat.type.replace(/_/g, ' ')}</div>
                      <div className="text-xs text-gray-300">ID: {threat.id.split('_')[0]}...{threat.id.split('_')[2]}</div>
                      {threat.response && (
                        <div className="text-xs text-green-300 mt-1">
                          Response: {threat.response.substring(0, 50)}...
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No recent threats detected</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Network Health Summary */}
        <Card className="bg-gray-900 border-gray-400/30">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${getSystemHealthColor()}`}>
              <Activity className="w-5 h-5" />
              Network Intelligence Summary
            </CardTitle>
            <CardDescription className="text-cyan-300">
              Overall system coordination and health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-cyan-400">{coreStatus?.networkVitals?.totalDreams || 0}</div>
                <div className="text-xs text-gray-400">Dreams Monitored</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{surgeonStatus?.autoFixesApplied || 0}</div>
                <div className="text-xs text-gray-400">Issues Resolved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{defenseStatus?.neutralizedThreeat || 0}</div>
                <div className="text-xs text-gray-400">Threats Neutralized</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{evolutionStatus?.totalInsights || 0}</div>
                <div className="text-xs text-gray-400">Evolution Insights</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}