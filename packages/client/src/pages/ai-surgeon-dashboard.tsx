import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Activity,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
  Wrench,
  Clock,
  Target,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { SurgeonAgent } from '@/lib/mock-dreamnet';

export default function AISurgeonDashboard() {
  const [surgeonStatus, setSurgeonStatus] = useState(SurgeonAgent.getStatus());
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [manualDreamId, setManualDreamId] = useState('');
  const [manualIssue, setManualIssue] = useState('');

  useEffect(() => {
    // Initialize AI Surgeon
    SurgeonAgent.init();

    // Update status every 30 seconds
    const interval = setInterval(() => {
      setSurgeonStatus(SurgeonAgent.getStatus());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const runManualDiagnostics = () => {
    setIsRunningDiagnostics(true);
    SurgeonAgent.runDiagnosticSweep();

    setTimeout(() => {
      setIsRunningDiagnostics(false);
      setSurgeonStatus(SurgeonAgent.getStatus());
    }, 3000);
  };

  const submitManualTask = () => {
    if (manualDreamId && manualIssue) {
      SurgeonAgent.manualFix(manualDreamId, manualIssue);
      setSurgeonStatus(SurgeonAgent.getStatus());
      setManualDreamId('');
      setManualIssue('');
    }
  };

  const toggleSurgeonStatus = () => {
    if (surgeonStatus.status === 'active') {
      SurgeonAgent.emergencyStop();
    } else {
      SurgeonAgent.resume();
    }
    setSurgeonStatus(SurgeonAgent.getStatus());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-blue-500';
      case 'maintenance': return 'bg-yellow-500';
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
            <Stethoscope className="w-12 h-12 text-green-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              AI SURGEON DASHBOARD
            </h1>
          </div>
          <p className="text-cyan-300 text-lg">Dr. Dreamfix - Automated Dream Network Maintenance</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="outline" className="border-green-400 text-green-400">
              Agent ID: {surgeonStatus.id}
            </Badge>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(surgeonStatus.status)}`}></div>
              <span className="text-white font-semibold">{surgeonStatus.status.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-green-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Diagnostics Run
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {surgeonStatus.diagnosticsRun}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Fixes Applied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {surgeonStatus.autoFixesApplied}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Active Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {surgeonStatus.activeIssues}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-green-400 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Last Sweep
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-white">
                {surgeonStatus.lastSweep ?
                  new Date(surgeonStatus.lastSweep).toLocaleString() :
                  'Never'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-900 border-green-400/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-400/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="data-[state=active]:bg-green-400/20">
              Diagnostics
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-green-400/20">
              Task Queue
            </TabsTrigger>
            <TabsTrigger value="manual" className="data-[state=active]:bg-green-400/20">
              Manual Control
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-green-400">Agent Performance</CardTitle>
                  <CardDescription className="text-cyan-300">
                    Current operational metrics and efficiency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300">Success Rate</span>
                    <span className="text-white font-bold">98.7%</span>
                  </div>
                  <Progress value={98.7} className="bg-gray-800" />

                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300">Average Fix Time</span>
                    <span className="text-white font-bold">2.3s</span>
                  </div>
                  <Progress value={85} className="bg-gray-800" />
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-green-400">System Health</CardTitle>
                  <CardDescription className="text-cyan-300">
                    Overall network maintenance status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Dream Core Integrity: Optimal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Agent Response Times: Normal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-white">Fusion Chain Links: Monitoring</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="diagnostics">
            <Card className="bg-gray-900 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-green-400">Diagnostic Control</CardTitle>
                <CardDescription className="text-cyan-300">
                  Run manual diagnostics and view system analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Button
                    onClick={runManualDiagnostics}
                    disabled={isRunningDiagnostics}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isRunningDiagnostics ? (
                      <>
                        <Activity className="w-4 h-4 mr-2 animate-spin" />
                        Running Diagnostics...
                      </>
                    ) : (
                      <>
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Run Full Diagnostics
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={toggleSurgeonStatus}
                    variant="outline"
                    className="border-green-400 text-green-400 hover:bg-green-400/20"
                  >
                    {surgeonStatus.status === 'active' ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause Agent
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Resume Agent
                      </>
                    )}
                  </Button>
                </div>

                {isRunningDiagnostics && (
                  <div className="space-y-3">
                    <Progress value={75} className="bg-gray-800" />
                    <p className="text-cyan-300 text-sm">
                      Scanning dream network for anomalies and maintenance needs...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card className="bg-gray-900 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-green-400">Task Queue</CardTitle>
                <CardDescription className="text-cyan-300">
                  Current and resolved maintenance tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {surgeonStatus.taskQueue.length > 0 ? (
                    surgeonStatus.taskQueue.slice().reverse().map((task, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded border border-green-400/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(task.severity)}>
                              {task.severity}
                            </Badge>
                            <span className="text-white font-mono text-sm">{task.dreamId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {task.resolved ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            )}
                            <span className="text-xs text-cyan-300">
                              {new Date(task.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-white text-sm mb-1">{task.issue}</p>
                        {task.fixApplied && (
                          <p className="text-green-300 text-xs">
                            Fix Applied: {task.fixApplied}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-cyan-300 text-center py-8">No tasks in queue</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <Card className="bg-gray-900 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-green-400">Manual Task Submission</CardTitle>
                <CardDescription className="text-cyan-300">
                  Submit custom maintenance tasks for specific dreams
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dreamId" className="text-cyan-300">Dream ID</Label>
                    <Input
                      id="dreamId"
                      value={manualDreamId}
                      onChange={(e) => setManualDreamId(e.target.value)}
                      placeholder="e.g., dream123"
                      className="bg-gray-800 border-green-400/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="issue" className="text-cyan-300">Issue Description</Label>
                    <Input
                      id="issue"
                      value={manualIssue}
                      onChange={(e) => setManualIssue(e.target.value)}
                      placeholder="Describe the issue..."
                      className="bg-gray-800 border-green-400/30 text-white"
                    />
                  </div>
                </div>
                <Button
                  onClick={submitManualTask}
                  disabled={!manualDreamId || !manualIssue}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  Submit Task
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}