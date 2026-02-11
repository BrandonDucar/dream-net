/**
 * /system/funding - Wolf Pack Dashboard
 * Phase 1 - Eyes: See what DreamNet sees
 */

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Target, Zap, TrendingUp } from "lucide-react";

async function fetchWolfPack() {
  const res = await fetch("/api/heartbeat");
  const data = await res.json();
  return data.packs?.wolf;
}

export default function SystemFundingPage() {
  const { data: wolf, isLoading } = useQuery({
    queryKey: ["wolf-pack"],
    queryFn: fetchWolfPack,
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Wolf Pack</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Wolf Pack</h1>
        <p className="text-gray-400">Funding discovery system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Active Targets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{wolf?.activeTargets || 0}</div>
            <p className="text-sm text-gray-400 mt-1">Hunting targets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Total Strikes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">{wolf?.totalStrikes || 0}</div>
            <p className="text-sm text-gray-400 mt-1">Successful hunts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Last Strike
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-white">
              {wolf?.lastStrikeAt ? new Date(wolf.lastStrikeAt).toLocaleString() : "Never"}
            </div>
            <p className="text-sm text-gray-400 mt-1">Most recent hunt</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>Wolf Pack operational status</CardDescription>
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
                <TableCell>Active Targets</TableCell>
                <TableCell>{wolf?.activeTargets || 0}</TableCell>
                <TableCell>
                  <Badge variant={wolf?.activeTargets > 0 ? "default" : "secondary"}>
                    {wolf?.activeTargets > 0 ? "Hunting" : "Idle"}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Strikes</TableCell>
                <TableCell>{wolf?.totalStrikes || 0}</TableCell>
                <TableCell>
                  <Badge variant="outline">Success</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last Strike</TableCell>
                <TableCell>
                  {wolf?.lastStrikeAt ? new Date(wolf.lastStrikeAt).toLocaleString() : "Never"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Activity</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

