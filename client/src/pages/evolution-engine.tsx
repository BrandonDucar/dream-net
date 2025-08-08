import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dna, 
  TrendingUp, 
  Zap, 
  Activity,
  Clock,
  Target,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  BarChart3,
  Lightbulb,
  Shield,
  Wrench,
  Trash2
} from 'lucide-react';
import { EvolutionEngine } from '../../../lib/evolutionEngine';

export default function EvolutionEnginePage() {
  const [engineStatus, setEngineStatus] = useState(EvolutionEngine.getStatus());
  const [analytics, setAnalytics] = useState(EvolutionEngine.getEvolutionAnalytics());
  const [isEvolving, setIsEvolving] = useState(false);

  useEffect(() => {
    // Initialize Evolution Engine
    EvolutionEngine.startCycle();
    
    // Update status every 30 seconds
    const interval = setInterval(() => {
      setEngineStatus(EvolutionEngine.getStatus());
      setAnalytics(EvolutionEngine.getEvolutionAnalytics());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const forceEvolution = () => {
    setIsEvolving(true);
    EvolutionEngine.forceEvolution();
    
    setTimeout(() => {
      setIsEvolving(false);
      setEngineStatus(EvolutionEngine.getStatus());
      setAnalytics(EvolutionEngine.getEvolutionAnalytics());
    }, 3000);
  };

  const toggleEngine = () => {
    if (engineStatus.isActive) {
      EvolutionEngine.pause();
    } else {
      EvolutionEngine.resume();
    }
    setEngineStatus(EvolutionEngine.getStatus());
  };

  const changeEvolutionRate = (rate: "hourly" | "daily" | "weekly" | "monthly") => {
    EvolutionEngine.setEvolutionRate(rate);
    setEngineStatus(EvolutionEngine.getStatus());
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'rewriteRules': return <Wrench className="w-4 h-4" />;
      case 'removeFlaws': return <Trash2 className="w-4 h-4" />;
      case 'optimizations': return <Zap className="w-4 h-4" />;
      case 'securityEnhancements': return <Shield className="w-4 h-4" />;
      case 'performanceBoosts': return <TrendingUp className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'rewriteRules': return 'text-blue-400';
      case 'removeFlaws': return 'text-red-400';
      case 'optimizations': return 'text-yellow-400';
      case 'securityEnhancements': return 'text-green-400';
      case 'performanceBoosts': return 'text-purple-400';
      default: return 'text-cyan-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dna className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              EVOLUTION ENGINE
            </h1>
          </div>
          <p className="text-cyan-300 text-lg">Adaptive Network Intelligence & System Evolution</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className={`w-4 h-4 rounded-full ${engineStatus.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-white font-bold text-lg">
              {engineStatus.isActive ? 'ACTIVE' : 'PAUSED'}
            </span>
            <Badge variant="outline" className="border-purple-400 text-purple-400 ml-2">
              {engineStatus.evolutionRate.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-purple-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Evolution Cycles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {engineStatus.upgradeCount}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Avg Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {engineStatus.averageImpact.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Total Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {engineStatus.totalInsights}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-400/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-400 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Last Evolution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-white">
                {engineStatus.lastCycle ? 
                  new Date(engineStatus.lastCycle).toLocaleString() : 
                  'Never'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-900 border-purple-400/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-400/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="cycles" className="data-[state=active]:bg-purple-400/20">
              Evolution Cycles
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-purple-400/20">
              Insights Analysis
            </TabsTrigger>
            <TabsTrigger value="control" className="data-[state=active]:bg-purple-400/20">
              Engine Control
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">Evolution Performance</CardTitle>
                  <CardDescription className="text-cyan-300">
                    System learning and adaptation metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300">Learning Rate</span>
                    <span className="text-white font-bold">Optimal</span>
                  </div>
                  <Progress value={92} className="bg-gray-800" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300">Adaptation Speed</span>
                    <span className="text-white font-bold">High</span>
                  </div>
                  <Progress value={78} className="bg-gray-800" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300">System Integration</span>
                    <span className="text-white font-bold">Complete</span>
                  </div>
                  <Progress value={100} className="bg-gray-800" />
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">Insight Categories</CardTitle>
                  <CardDescription className="text-cyan-300">
                    Distribution of evolutionary insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-white">Security</span>
                    </div>
                    <span className="text-white font-bold">{analytics.insightBreakdown.securityEnhancements}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-white">Optimizations</span>
                    </div>
                    <span className="text-white font-bold">{analytics.insightBreakdown.optimizations}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <span className="text-white">Performance</span>
                    </div>
                    <span className="text-white font-bold">{analytics.insightBreakdown.performanceBoosts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-blue-400" />
                      <span className="text-white">Rules</span>
                    </div>
                    <span className="text-white font-bold">{analytics.insightBreakdown.rewriteRules}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cycles">
            <Card className="bg-gray-900 border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-purple-400">Recent Evolution Cycles</CardTitle>
                <CardDescription className="text-cyan-300">
                  Latest system evolution and learning cycles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {engineStatus.recentCycles.length > 0 ? (
                    engineStatus.recentCycles.slice().reverse().map((cycle, index) => (
                      <div key={index} className="p-4 bg-gray-800 rounded border border-purple-400/20">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-purple-500 text-white">
                              Cycle {cycle.upgradeID.split('_')[1]}
                            </Badge>
                            <span className="text-xs text-cyan-300">
                              {new Date(cycle.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">{cycle.impact}% Impact</span>
                            <div className="w-16">
                              <Progress value={cycle.impact} className="bg-gray-700 h-2" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                          <div className="text-center">
                            <div className="text-blue-400 font-bold">{cycle.insights.rewriteRules.length}</div>
                            <div className="text-gray-400">Rules</div>
                          </div>
                          <div className="text-center">
                            <div className="text-red-400 font-bold">{cycle.insights.removeFlaws.length}</div>
                            <div className="text-gray-400">Flaws</div>
                          </div>
                          <div className="text-center">
                            <div className="text-yellow-400 font-bold">{cycle.insights.optimizations.length}</div>
                            <div className="text-gray-400">Opts</div>
                          </div>
                          <div className="text-center">
                            <div className="text-green-400 font-bold">{cycle.insights.securityEnhancements.length}</div>
                            <div className="text-gray-400">Security</div>
                          </div>
                          <div className="text-center">
                            <div className="text-purple-400 font-bold">{cycle.insights.performanceBoosts.length}</div>
                            <div className="text-gray-400">Perf</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-cyan-300 text-center py-8">No evolution cycles yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card className="bg-gray-900 border-purple-400/30">
              <CardHeader>
                <CardTitle className="text-purple-400">Evolutionary Insights</CardTitle>
                <CardDescription className="text-cyan-300">
                  Latest system improvements and optimizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {engineStatus.recentCycles.length > 0 && engineStatus.recentCycles[engineStatus.recentCycles.length - 1] && (
                    <div className="space-y-4">
                      {Object.entries(engineStatus.recentCycles[engineStatus.recentCycles.length - 1].insights).map(([category, insights]) => (
                        insights.length > 0 && (
                          <div key={category} className="space-y-2">
                            <h4 className={`font-semibold flex items-center gap-2 ${getInsightColor(category)}`}>
                              {getInsightIcon(category)}
                              {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              <Badge variant="outline" className="text-xs">
                                {insights.length}
                              </Badge>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {insights.map((insight, idx) => (
                                <div key={idx} className="p-2 bg-gray-800 rounded text-sm text-gray-300">
                                  {insight.replace(/_/g, ' ')}
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                  
                  {engineStatus.recentCycles.length === 0 && (
                    <p className="text-cyan-300 text-center py-8">No insights available yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="control">
            <div className="space-y-6">
              <Card className="bg-gray-900 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">Evolution Controls</CardTitle>
                  <CardDescription className="text-cyan-300">
                    Manage evolution engine settings and operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 flex-wrap">
                    <Button 
                      onClick={forceEvolution}
                      disabled={isEvolving}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {isEvolving ? (
                        <>
                          <Activity className="w-4 h-4 mr-2 animate-spin" />
                          Evolving...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Force Evolution
                        </>
                      )}
                    </Button>

                    <Button 
                      onClick={toggleEngine}
                      variant="outline"
                      className={engineStatus.isActive ? 
                        'border-red-400 text-red-400 hover:bg-red-400/20' : 
                        'border-green-400 text-green-400 hover:bg-green-400/20'
                      }
                    >
                      {engineStatus.isActive ? (
                        <>
                          <PauseCircle className="w-4 h-4 mr-2" />
                          Pause Engine
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Resume Engine
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-cyan-300">Evolution Rate</label>
                    <Select 
                      value={engineStatus.evolutionRate}
                      onValueChange={(value) => changeEvolutionRate(value as any)}
                    >
                      <SelectTrigger className="bg-gray-800 border-purple-400/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-purple-400/30">
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {isEvolving && (
                    <div className="space-y-3">
                      <Progress value={65} className="bg-gray-800" />
                      <p className="text-cyan-300 text-sm">
                        Analyzing network data and generating evolutionary insights...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">System Integration Status</CardTitle>
                  <CardDescription className="text-cyan-300">
                    Connection status with other intelligence systems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <span className="text-white">Defense Network</span>
                      <Badge variant="outline" className="border-red-400 text-red-400 ml-auto">
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