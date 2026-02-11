/**
 * /system/orca - Orca Pack Dashboard
 * Phase 1 - Eyes: See what DreamNet sees
 */

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, TrendingUp } from "lucide-react";

async function fetchOrcaPack() {
  const res = await fetch("/api/heartbeat");
  const data = await res.json();
  return data.packs?.orca;
}

export default function SystemOrcaPage() {
  const { data: orca, isLoading } = useQuery({
    queryKey: ["orca-pack"],
    queryFn: fetchOrcaPack,
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Orca Pack</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!orca) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Orca Pack</h1>
          <p className="text-gray-400">Social system</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-400">Orca Pack not yet initialized</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Orca Pack</h1>
        <p className="text-gray-400">Social system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{orca?.status || "unknown"}</div>
            <p className="text-sm text-gray-400 mt-1">System state</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Social
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">
              {orca?.metrics?.posts || 0}
            </div>
            <p className="text-sm text-gray-400 mt-1">Posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {orca?.metrics?.engagement || 0}
            </div>
            <p className="text-sm text-gray-400 mt-1">Total engagement</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>Orca Pack operational status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <Badge variant={orca?.status === "active" ? "default" : "secondary"}>
                {orca?.status || "unknown"}
              </Badge>
            </div>
            {orca?.metrics && Object.entries(orca.metrics).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-400">{key}:</span>
                <span className="text-white">{String(value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

