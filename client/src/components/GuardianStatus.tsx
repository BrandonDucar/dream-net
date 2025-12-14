/**
 * Guardian Framework Status Component
 * Displays 3-layer defense system status with drone dome visualization
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Activity, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { useDreamNetTheme } from '@/contexts/DreamNetThemeContext';

interface GuardianStatus {
  shields: {
    groundArmor: { integrity: number; strength: number; threatsBlocked: number; active: boolean };
    containment: { integrity: number; strength: number; threatsBlocked: number; active: boolean };
    dreamFabricStability: { integrity: number; strength: number; threatsBlocked: number; active: boolean };
    overallIntegrity: number;
  };
  droneDome: {
    ring1: { totalDrones: number; activeDrones: number; threatsDetected: number; anomaliesFound: number };
    ring2: { totalDrones: number; activeDrones: number; threatsDetected: number; anomaliesFound: number };
    ring3: { totalDrones: number; activeDrones: number; threatsDetected: number; anomaliesFound: number };
    totalDrones: number;
    activeDrones: number;
    threatsDetected: number;
    anomaliesFound: number;
  };
  aegisFleet: {
    commandNodes: number;
    analysisNodes: number;
    coordinationNodes: number;
    stabilizationActions: number;
    realmStability: number;
    active: boolean;
  };
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  lastUpdate: number;
}

export function GuardianStatus() {
  const { dreamNetMode } = useDreamNetTheme();
  const [status, setStatus] = useState<GuardianStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/guardian/status');
        if (!response.ok) throw new Error('Failed to fetch Guardian status');
        const data = await response.json();
        if (data.ok && data.status) {
          setStatus(data.status);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : ''}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-electric-cyan" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !status) {
    return (
      <Card className={dreamNetMode ? 'border-red-500/30 bg-red-500/5' : ''}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span>Guardian Framework unavailable</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const threatColors = {
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="space-y-4">
      {/* Overall Status */}
      <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className={`w-6 h-6 ${dreamNetMode ? 'text-electric-cyan' : 'text-primary'}`} />
              <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>
                Guardian Framework
              </CardTitle>
            </div>
            <Badge className={threatColors[status.threatLevel]}>
              {status.threatLevel.toUpperCase()}
            </Badge>
          </div>
          <CardDescription>
            Overall Integrity: {(status.shields.overallIntegrity * 100).toFixed(1)}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-electric-cyan">{status.droneDome.totalDrones}</div>
              <div className="text-xs text-muted-foreground">Total Drones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{status.droneDome.activeDrones}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{status.droneDome.threatsDetected}</div>
              <div className="text-xs text-muted-foreground">Threats</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shield Layers */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className={dreamNetMode ? 'border-electric-cyan/20 bg-black/50' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Ground Armor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Integrity</span>
                <span className="font-semibold">{(status.shields.groundArmor.integrity * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-electric-cyan transition-all"
                  style={{ width: `${status.shields.groundArmor.integrity * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {status.shields.groundArmor.threatsBlocked} threats blocked
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={dreamNetMode ? 'border-electric-cyan/20 bg-black/50' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Containment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Integrity</span>
                <span className="font-semibold">{(status.shields.containment.integrity * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-electric-violet transition-all"
                  style={{ width: `${status.shields.containment.integrity * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {status.shields.containment.threatsBlocked} threats blocked
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={dreamNetMode ? 'border-electric-cyan/20 bg-black/50' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Dream Fabric</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Stability</span>
                <span className="font-semibold">{(status.shields.dreamFabricStability.integrity * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400 transition-all"
                  style={{ width: `${status.shields.dreamFabricStability.integrity * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {status.shields.dreamFabricStability.threatsBlocked} threats blocked
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drone Dome Rings */}
      <Card className={dreamNetMode ? 'border-electric-cyan/30 bg-electric-cyan/5' : ''}>
        <CardHeader>
          <CardTitle className={dreamNetMode ? 'text-electric-cyan' : ''}>Golden Drone Dome</CardTitle>
          <CardDescription>3-ring sensory halo with personal agent drones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { ring: status.droneDome.ring1, name: 'Ring 1 - Inner (Core Telemetry)', color: 'electric-cyan' },
              { ring: status.droneDome.ring2, name: 'Ring 2 - Middle (Logistics & Data)', color: 'electric-violet' },
              { ring: status.droneDome.ring3, name: 'Ring 3 - Outer (Long-Range Scanning)', color: 'green-400' },
            ].map(({ ring, name, color }) => (
              <div key={name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{name}</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {ring.activeDrones}/{ring.totalDrones} active
                    </Badge>
                    {ring.threatsDetected > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {ring.threatsDetected} threats
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Drones: </span>
                    <span className="font-semibold">{ring.totalDrones}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Threats: </span>
                    <span className="font-semibold text-orange-400">{ring.threatsDetected}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Anomalies: </span>
                    <span className="font-semibold text-yellow-400">{ring.anomaliesFound}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Aegis Fleet */}
      <Card className={dreamNetMode ? 'border-electric-violet/30 bg-electric-violet/5' : ''}>
        <CardHeader>
          <CardTitle className={dreamNetMode ? 'text-electric-violet' : ''}>Aegis Fleet</CardTitle>
          <CardDescription>Strategic Command Cluster</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-electric-violet">{status.aegisFleet.commandNodes}</div>
              <div className="text-xs text-muted-foreground">Command</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-electric-cyan">{status.aegisFleet.analysisNodes}</div>
              <div className="text-xs text-muted-foreground">Analysis</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{status.aegisFleet.coordinationNodes}</div>
              <div className="text-xs text-muted-foreground">Coordination</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400">
                {(status.aegisFleet.realmStability * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Stability</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

