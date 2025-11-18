/**
 * /system/spider - Spider Web Dashboard
 * Phase 1 - Eyes: See what DreamNet sees
 */

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Network, Activity, Eye, Zap } from "lucide-react";

async function fetchSpiderWeb() {
  const res = await fetch("/api/heartbeat");
  const data = await res.json();
  return data.spiderWeb;
}

export default function SystemSpiderPage() {
  const { data: spider, isLoading } = useQuery({
    queryKey: ["spider-web"],
    queryFn: fetchSpiderWeb,
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Spider Web</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Spider Web</h1>
        <p className="text-gray-400">Nervous system status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Threads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{spider?.threadCount || 0}</div>
            <p className="text-sm text-gray-400 mt-1">Total threads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">{spider?.activeThreadCount || 0}</div>
            <p className="text-sm text-gray-400 mt-1">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Flies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{spider?.flyCount || 0}</div>
            <p className="text-sm text-gray-400 mt-1">Pattern signals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Sensors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{spider?.sensorCount || 0}</div>
            <p className="text-sm text-gray-400 mt-1">Active sensors</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>Spider Web operational status</CardDescription>
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
                <TableCell>Total Threads</TableCell>
                <TableCell>{spider?.threadCount || 0}</TableCell>
                <TableCell>
                  <Badge variant={spider?.threadCount > 0 ? "default" : "secondary"}>
                    {spider?.threadCount > 0 ? "Active" : "Idle"}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Active Threads</TableCell>
                <TableCell>{spider?.activeThreadCount || 0}</TableCell>
                <TableCell>
                  <Badge variant="outline">Processing</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Flies Caught</TableCell>
                <TableCell>{spider?.flyCount || 0}</TableCell>
                <TableCell>
                  <Badge variant="outline">Patterns</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sensors</TableCell>
                <TableCell>{spider?.sensorCount || 0}</TableCell>
                <TableCell>
                  <Badge variant="outline">Monitoring</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last Run</TableCell>
                <TableCell>
                  {spider?.lastRunAt ? new Date(spider.lastRunAt).toLocaleString() : "Never"}
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

