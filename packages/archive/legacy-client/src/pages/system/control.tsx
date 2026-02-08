/**
 * /system/control - Control Plane Dashboard
 * Phase 1 - Eyes: See what DreamNet sees
 */

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings, Power, Gauge, AlertCircle } from "lucide-react";

async function fetchControl() {
  const res = await fetch("/api/heartbeat");
  const data = await res.json();
  return data.control;
}

export default function SystemControlPage() {
  const { data: control, isLoading } = useQuery({
    queryKey: ["control-plane"],
    queryFn: fetchControl,
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Control Plane</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Control Plane</h1>
        <p className="text-gray-400">Global control and rate limiting</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Power className="h-5 w-5" />
              Kill Switch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${control?.globalKillSwitch ? "text-red-400" : "text-green-400"}`}>
              {control?.globalKillSwitch ? "ON" : "OFF"}
            </div>
            <p className="text-sm text-gray-400 mt-1">Global state</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Clusters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{control?.clusterStates || 0}</div>
            <p className="text-sm text-gray-400 mt-1">Managed clusters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Rate Limits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{control?.rateLimits || 0}</div>
            <p className="text-sm text-gray-400 mt-1">Active limits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Circuit Breakers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{control?.circuitBreakers || 0}</div>
            <p className="text-sm text-gray-400 mt-1">Protection circuits</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>Control Plane operational status</CardDescription>
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
                <TableCell>Global Kill Switch</TableCell>
                <TableCell>{control?.globalKillSwitch ? "ENABLED" : "DISABLED"}</TableCell>
                <TableCell>
                  <Badge variant={control?.globalKillSwitch ? "destructive" : "default"}>
                    {control?.globalKillSwitch ? "ON" : "OFF"}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Clusters</TableCell>
                <TableCell>{control?.clusterStates || 0}</TableCell>
                <TableCell>
                  <Badge variant="outline">Managed</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Rate Limits</TableCell>
                <TableCell>{control?.rateLimits || 0}</TableCell>
                <TableCell>
                  <Badge variant="outline">Active</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Circuit Breakers</TableCell>
                <TableCell>{control?.circuitBreakers || 0}</TableCell>
                <TableCell>
                  <Badge variant="outline">Protection</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last Updated</TableCell>
                <TableCell>
                  {control?.lastUpdatedAt ? new Date(control.lastUpdatedAt).toLocaleString() : "Never"}
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

