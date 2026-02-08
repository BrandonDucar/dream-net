import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useDreamNetTheme } from '@/contexts/DreamNetThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, CheckCircle2, AlertCircle, XCircle, HelpCircle } from 'lucide-react';

// Mock data structure matching DreamNetOSCore and CivicPanelCore
const mockOSSnapshot = {
  version: {
    major: 0,
    minor: 4,
    patch: 0,
    label: 'Tier IV Scaffold',
  },
  heartbeatAt: Date.now(),
  globalHealth: {
    infraHealth: 0.85,
    economyHealth: 0.75,
    socialHealth: 0.90,
    dreamPipelineHealth: 0.80,
  },
  subsystems: [
    { name: 'DreamVault', status: 'ok', details: 'Items=5' },
    { name: 'DreamShop', status: 'ok', details: 'Offers=4' },
    { name: 'FieldLayer', status: 'ok', details: 'Samples=120' },
    { name: 'DreamBetCore', status: 'ok', details: 'Games=2, Rounds=10' },
    { name: 'ZenGardenCore', status: 'ok', details: 'Sessions=1, Rewards=1' },
    { name: 'DreamTankCore', status: 'ok', details: 'Dreams=1, Evaluations=0' },
    { name: 'LiquidityEngine', status: 'ok', details: 'Pools=3, Planned=3, Active=0' },
    { name: 'SocialHubCore', status: 'ok', details: 'Posts=2, Comments=0' },
    { name: 'EconomicEngineCore', status: 'ok', details: 'Tokens=6, Balances=1, Rewards=1' },
    { name: 'AgentRegistryCore', status: 'ok', details: 'Agents=10, Errors=0' },
    { name: 'InitRitualCore', status: 'ok', details: 'Active=1, Completed=0' },
  ],
};

const mockDashboard = {
  widgets: [
    { id: 'widget:dream-vault', title: 'Dream Vault', metrics: [{ label: 'Items', value: 5 }] },
    { id: 'widget:economic-engine', title: 'Economic Engine', metrics: [{ label: 'Tokens', value: 6 }, { label: 'Balances', value: 1 }] },
    { id: 'widget:agent-registry', title: 'Agent Registry', metrics: [{ label: 'Agents', value: 10 }, { label: 'Errors', value: 0 }] },
  ],
};

function getStatusIcon(status: string) {
  switch (status) {
    case 'ok':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'warn':
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case 'error':
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <HelpCircle className="w-5 h-5 text-gray-500" />;
  }
}

export default function SystemOsStatusPage() {
  const { dreamNetMode } = useDreamNetTheme();
  const [snapshot, setSnapshot] = useState(mockOSSnapshot);

  useEffect(() => {
    const refreshSnapshot = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
        const response = await fetch(`${apiUrl}/api/ops/organism-status`);
        const data = await response.json();

        if (data.success) {
          setSnapshot({
            version: mockOSSnapshot.version,
            heartbeatAt: data.timestamp || Date.now(),
            globalHealth: {
              infraHealth: 0.95, // TODO: Get from metrics
              economyHealth: data.economy?.balanceCount > 0 ? 0.9 : 0.5,
              socialHealth: data.social?.accounts?.length > 0 ? 0.95 : 0.5,
              dreamPipelineHealth: 0.85,
            },
            subsystems: [
              { name: 'DreamVault', status: 'ok', details: 'Active' },
              { name: 'EconomicEngineCore', status: 'ok', details: `Tokens=${data.economy?.tokenCount || 0}, Balances=${data.economy?.balanceCount || 0}` },
              { name: 'SocialHubCore', status: 'ok', details: `Accounts=${data.social?.accounts?.length || 0}` },
              { name: 'WolfPackFundingCore', status: 'ok', details: `Leads=${data.funding?.leadCount || 0}` },
              { name: 'QuantumAnticipation', status: 'ok', details: `Predictions=${data.quantum?.lastPredictionsCount || 0}` },
              { name: 'DreamSnailCore', status: 'ok', details: `Trails=${data.privacy?.totalTrails || 0}` },
            ],
          });
        }
      } catch (err) {
        console.error('[OsStatusPage] Sync Error:', err);
      }
    };

    refreshSnapshot();
    const interval = setInterval(refreshSnapshot, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${dreamNetMode ? 'text-electric-cyan' : 'text-foreground'
            }`}>
            OS Status
          </h1>
          <p className="text-xl text-muted-foreground">
            DreamNet OS Core & Civic Panel Dashboard
          </p>
        </div>

        {/* Version Info */}
        <Card className={`mb-6 ${dreamNetMode ? 'border-electric-cyan/30 bg-black/50' : ''}`}>
          <CardHeader>
            <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
              Version Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {snapshot.version.major}.{snapshot.version.minor}.{snapshot.version.patch} — {snapshot.version.label}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last heartbeat: {new Date(snapshot.heartbeatAt).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        {/* Global Health Scores */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : ''}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Infra Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{(snapshot.globalHealth.infraHealth * 100).toFixed(0)}%</span>
                </div>
                <Progress value={snapshot.globalHealth.infraHealth * 100} />
              </div>
            </CardContent>
          </Card>

          <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : ''}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Economy Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{(snapshot.globalHealth.economyHealth * 100).toFixed(0)}%</span>
                </div>
                <Progress value={snapshot.globalHealth.economyHealth * 100} />
              </div>
            </CardContent>
          </Card>

          <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : ''}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Social Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{(snapshot.globalHealth.socialHealth * 100).toFixed(0)}%</span>
                </div>
                <Progress value={snapshot.globalHealth.socialHealth * 100} />
              </div>
            </CardContent>
          </Card>

          <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : ''}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Dream Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{(snapshot.globalHealth.dreamPipelineHealth * 100).toFixed(0)}%</span>
                </div>
                <Progress value={snapshot.globalHealth.dreamPipelineHealth * 100} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subsystem Table */}
        <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-black/50' : ''}>
          <CardHeader>
            <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
              Subsystem Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.subsystems.map((subsystem) => (
                    <tr key={subsystem.name} className="border-b">
                      <td className="p-2 font-medium">{subsystem.name}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(subsystem.status)}
                          <span className="capitalize">{subsystem.status}</span>
                        </div>
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">{subsystem.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Civic Panel Widgets */}
        <div className="mt-12">
          <h2 className={`text-2xl font-semibold mb-6 ${dreamNetMode ? 'text-electric-cyan' : ''}`}>
            Civic Panel Widgets
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {mockDashboard.widgets.map((widget) => (
              <Card key={widget.id} className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : ''}>
                <CardHeader>
                  <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                    {widget.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {widget.metrics.map((metric) => (
                      <div key={metric.label} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{metric.label}</span>
                        <span className="text-lg font-semibold">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

