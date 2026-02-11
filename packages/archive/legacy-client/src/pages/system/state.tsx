/**
 * /system/state - Dream State Dashboard
 * Phase 1 - Eyes: See what DreamNet sees
 */

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Users, FileText, Activity } from "lucide-react";

async function fetchDreamState() {
  const res = await fetch("/api/heartbeat");
  const data = await res.json();
  return data.dreamState;
}

export default function SystemStatePage() {
  const { data: state, isLoading } = useQuery({
    queryKey: ["dream-state"],
    queryFn: fetchDreamState,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Dream State</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dream State</h1>
        <p className="text-gray-400">Government layer status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Passports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{state?.passportCount || 0}</div>
            <p className="text-sm text-gray-400 mt-1">Total citizens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{state?.departmentCount || 0}</div>
            <p className="text-sm text-gray-400 mt-1">Government offices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Proposals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{state?.proposalCount || 0}</div>
            <p className="text-sm text-gray-400 mt-1">Governance proposals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{state?.recentActionCount || 0}</div>
            <p className="text-sm text-gray-400 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>Dream State operational status</CardDescription>
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
                <TableCell>Passports Issued</TableCell>
                <TableCell>{state?.passportCount || 0}</TableCell>
                <TableCell>
                  <Badge variant={state?.passportCount > 0 ? "default" : "secondary"}>
                    {state?.passportCount > 0 ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Departments</TableCell>
                <TableCell>{state?.departmentCount || 0}</TableCell>
                <TableCell>
                  <Badge variant={state?.departmentCount > 0 ? "default" : "secondary"}>
                    {state?.departmentCount > 0 ? "Operational" : "None"}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Proposals</TableCell>
                <TableCell>{state?.proposalCount || 0}</TableCell>
                <TableCell>
                  <Badge variant="outline">Governance</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Last Run</TableCell>
                <TableCell>
                  {state?.lastRunAt ? new Date(state.lastRunAt).toLocaleString() : "Never"}
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

