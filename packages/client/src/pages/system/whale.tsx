/**
 * /system/whale - Whale Pack Dashboard
 * Phase 1 - Eyes: See what DreamNet sees
 */

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

async function fetchWhalePack() {
  const res = await fetch("/api/heartbeat");
  const data = await res.json();
  return data.packs?.whale;
}

export default function SystemWhalePage() {
  const { data: whale, isLoading } = useQuery({
    queryKey: ["whale-pack"],
    queryFn: fetchWhalePack,
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Whale Pack</h1>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!whale) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Whale Pack</h1>
          <p className="text-gray-400">Commerce system</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-400">Whale Pack not yet initialized</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Whale Pack</h1>
        <p className="text-gray-400">Commerce system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{whale?.status || "unknown"}</div>
            <p className="text-sm text-gray-400 mt-1">System state</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Commerce
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {whale?.metrics?.transactions || 0}
            </div>
            <p className="text-sm text-gray-400 mt-1">Transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">
              {whale?.metrics?.revenue || 0}
            </div>
            <p className="text-sm text-gray-400 mt-1">Revenue</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>Whale Pack operational status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <Badge variant={whale?.status === "active" ? "default" : "secondary"}>
                {whale?.status || "unknown"}
              </Badge>
            </div>
            {whale?.metrics && Object.entries(whale.metrics).map(([key, value]) => (
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

