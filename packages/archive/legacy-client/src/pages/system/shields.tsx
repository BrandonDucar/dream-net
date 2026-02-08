/**
 * /system/shields - Shield Core Dashboard
 * Phase 1 - Eyes: See what DreamNet sees
 */

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Layers, AlertTriangle, Zap } from "lucide-react";

async function fetchShield() {
  const res = await fetch("/api/heartbeat");
  const data = await res.json();
  return data.shield;
}

export default function SystemShieldsPage() {
  const { data: shield, isLoading } = useQuery({
    queryKey: ["shield-core"],
    queryFn: fetchShield,
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Shield Core</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "armed": return "text-green-400";
      case "standby": return "text-yellow-400";
      case "disarmed": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Shield Core</h1>
        <p className="text-gray-400">Defense system status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(shield?.status || "unknown")}`}>
              {shield?.status?.toUpperCase() || "UNKNOWN"}
            </div>
            <p className="text-sm text-gray-400 mt-1">Shield state</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Layers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{shield?.layerCount || 0}</div>
            <p className="text-sm text-gray-400 mt-1">Active layers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Threats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{shield?.activeThreats || 0}</div>
            <p className="text-sm text-gray-400 mt-1">Active threats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Spikes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">{shield?.spikesFired || 0}</div>
            <p className="text-sm text-gray-400 mt-1">Offensive spikes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>Shield Core operational status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Shield Status</TableCell>
                <TableCell>{shield?.status || "unknown"}</TableCell>
                <TableCell>
                  <Badge variant={shield?.status === "armed" ? "default" : "secondary"}>
                    {shield?.status === "armed" ? "Armed" : shield?.status === "standby" ? "Standby" : "Disarmed"}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Active Layers</TableCell>
                <TableCell>{shield?.layerCount || 0}</TableCell>
                <TableCell>
                  <Badge variant="outline">Defense</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Active Threats</TableCell>
                <TableCell>{shield?.activeThreats || 0}</TableCell>
                <TableCell>
                  <Badge variant={shield?.activeThreats > 0 ? "destructive" : "default"}>
                    {shield?.activeThreats > 0 ? "Alert" : "Clear"}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Neutralized</TableCell>
                <TableCell>{shield?.neutralizedThreats || 0}</TableCell>
                <TableCell>
                  <Badge variant="outline">Defended</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Spikes Fired</TableCell>
                <TableCell>{shield?.spikesFired || 0}</TableCell>
                <TableCell>
                  <Badge variant="outline">Offensive</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last Run</TableCell>
                <TableCell>
                  {shield?.lastRunAt ? new Date(shield.lastRunAt).toLocaleString() : "Never"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">System</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

