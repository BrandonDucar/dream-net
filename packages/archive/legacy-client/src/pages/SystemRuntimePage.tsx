import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDreamNetTheme } from '@/contexts/DreamNetThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, AlertCircle } from 'lucide-react';

// Mock telemetry data
const mockTelemetry = {
  totalCycles: 1247,
  lastCycle: {
    cycleId: 1247,
    startedAt: Date.now() - 5000,
    finishedAt: Date.now() - 3000,
    durationMs: 2000,
    error: undefined,
  },
};

const subsystems = [
  'FieldLayer',
  'AgentRegistryCore',
  'EconomicEngineCore',
  'DreamTankCore',
  'InitRitualCore',
  'ZenGardenCore',
  'DreamBetCore',
  'SocialHubCore',
  'DreamShop',
  'DreamVault',
  'LiquidityEngine',
  'CivicPanelCore',
  'DreamNetOSCore',
];

export default function SystemRuntimePage() {
  const { dreamNetMode } = useDreamNetTheme();
  const [telemetry, setTelemetry] = useState(mockTelemetry);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Simulate cycle progression
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % subsystems.length);
      setTelemetry({
        ...mockTelemetry,
        totalCycles: mockTelemetry.totalCycles + 1,
        lastCycle: {
          ...mockTelemetry.lastCycle,
          cycleId: mockTelemetry.lastCycle.cycleId + 1,
          startedAt: Date.now() - 2000,
          finishedAt: Date.now(),
          durationMs: 2000,
        },
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            dreamNetMode ? 'text-electric-cyan' : 'text-foreground'
          }`}>
            Orchestrator Runtime
          </h1>
          <p className="text-xl text-muted-foreground">
            Visual representation of DreamNet's orchestration cycle
          </p>
        </div>

        {/* Telemetry Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : ''}>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Total Cycles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{telemetry.totalCycles}</p>
            </CardContent>
          </Card>

          <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : ''}>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{telemetry.lastCycle.durationMs}ms</p>
            </CardContent>
          </Card>

          <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : ''}>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Last Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {telemetry.lastCycle.error || 'None'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cycle Visualization */}
        <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-black/50' : ''}>
          <CardHeader>
            <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
              Cycle Order Visualization
            </CardTitle>
            <CardDescription>
              The orchestrator runs subsystems in this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-96">
              <svg viewBox="0 0 600 400" className="w-full h-full">
                {/* Draw ring */}
                <circle
                  cx="300"
                  cy="200"
                  r="150"
                  fill="none"
                  stroke={dreamNetMode ? '#00ffff' : '#666'}
                  strokeWidth="2"
                  opacity="0.3"
                />

                {/* Subsystem nodes */}
                {subsystems.map((subsystem, index) => {
                  const angle = (index / subsystems.length) * 2 * Math.PI - Math.PI / 2;
                  const x = 300 + 150 * Math.cos(angle);
                  const y = 200 + 150 * Math.sin(angle);
                  const isActive = index === activeIndex;

                  return (
                    <g key={subsystem}>
                      {/* Connection line */}
                      {index > 0 && (
                        <line
                          x1={300 + 150 * Math.cos(((index - 1) / subsystems.length) * 2 * Math.PI - Math.PI / 2)}
                          y1={200 + 150 * Math.sin(((index - 1) / subsystems.length) * 2 * Math.PI - Math.PI / 2)}
                          x2={x}
                          y2={y}
                          stroke={dreamNetMode ? '#00ffff' : '#666'}
                          strokeWidth="1"
                          opacity={isActive ? 1 : 0.3}
                          className={isActive && dreamNetMode ? 'neural-glow' : ''}
                        />
                      )}
                      {/* Node */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isActive ? 20 : 15}
                        fill={isActive ? (dreamNetMode ? 'rgba(0, 255, 255, 0.3)' : 'rgba(100, 100, 100, 0.3)') : 'rgba(100, 100, 100, 0.1)'}
                        stroke={isActive ? (dreamNetMode ? '#00ffff' : '#999') : '#666'}
                        strokeWidth={isActive ? 3 : 1}
                        className={isActive && dreamNetMode ? 'neural-glow' : ''}
                      />
                      {/* Label */}
                      <text
                        x={x}
                        y={y + (y > 200 ? 35 : -25)}
                        textAnchor="middle"
                        fill={isActive ? (dreamNetMode ? '#00ffff' : '#fff') : '#999'}
                        fontSize="10"
                        fontWeight={isActive ? 'bold' : 'normal'}
                      >
                        {subsystem}
                      </text>
                    </g>
                  );
                })}

                {/* Center indicator */}
                <circle
                  cx="300"
                  cy="200"
                  r="30"
                  fill={dreamNetMode ? 'rgba(0, 255, 255, 0.2)' : 'rgba(100, 100, 100, 0.2)'}
                  stroke={dreamNetMode ? '#00ffff' : '#666'}
                  strokeWidth="2"
                  className={dreamNetMode ? 'neural-glow' : ''}
                />
                <text
                  x="300"
                  y="205"
                  textAnchor="middle"
                  fill={dreamNetMode ? '#00ffff' : '#fff'}
                  fontSize="12"
                  fontWeight="bold"
                >
                  Cycle
                </text>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Last Cycle Info */}
        <Card className={`mt-6 ${dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : ''}`}>
          <CardHeader>
            <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
              Last Cycle Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cycle ID</span>
                <span className="font-mono">{telemetry.lastCycle.cycleId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-mono">{telemetry.lastCycle.durationMs}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Started At</span>
                <span className="font-mono text-xs">
                  {new Date(telemetry.lastCycle.startedAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Finished At</span>
                <span className="font-mono text-xs">
                  {new Date(telemetry.lastCycle.finishedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

