import { useQuery } from "@tanstack/react-query";
import { fetchOverview } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Heart, TrendingUp, Shield, Zap } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default function OverviewPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["overview"],
    queryFn: fetchOverview,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading overview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Error loading overview: {String(error)}</div>
      </div>
    );
  }

  if (!data) return null;

  const { organismStatus, organStatus, globalHealth, currentMood, destinyAlignment, recentActivity, identity, coreValues } = data;

  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "success";
      case "degraded":
        return "secondary";
      case "critical":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "success";
      case "degraded":
        return "secondary";
      case "critical":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Organism Overview</h2>
        <p className="text-muted-foreground">
          Real-time status of the DreamNet organism
        </p>
      </div>

      {/* Organism Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{organismStatus.health}</div>
            <Badge variant={getHealthColor(organismStatus.health) as "default" | "secondary" | "destructive" | "outline" | "success"} className="mt-2">
              {organismStatus.health}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Mode: {organismStatus.mode} | Uptime: {organismStatus.uptime.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Mood</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMood.state}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {currentMood.traits.slice(0, 2).join(", ")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destiny Alignment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{destinyAlignment.overallAlignment.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              {destinyAlignment.phase}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Health</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{globalHealth.uptime.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              Error Rate: {globalHealth.errorRate.toFixed(2)}% | Latency: {globalHealth.latency}ms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Organ Status */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Organ Systems</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(organStatus).map(([key, organ]) => (
            <Card key={key}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{organ.name}</CardTitle>
                  <Badge variant={getStatusColor(organ.status) as "default" | "secondary" | "destructive" | "outline" | "success"}>
                    {organ.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Health Score</span>
                    <span className="font-medium">{organ.healthScore}/100</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${organ.healthScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Updated {formatRelativeTime(organ.lastUpdate)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Identity & Core Values */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Identity</CardTitle>
            <CardDescription>{identity.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium mb-1">Nature</p>
                <div className="flex flex-wrap gap-2">
                  {identity.nature.map((n) => (
                    <Badge key={n} variant="outline">{n}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Core Traits</p>
                <div className="flex flex-wrap gap-2">
                  {identity.coreTraits.map((t) => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Core Values</CardTitle>
            <CardDescription>Fundamental values prioritized by DreamNet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {coreValues
                .sort((a, b) => a.priority - b.priority)
                .map((value) => (
                  <div key={value.id} className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{value.name}</p>
                      <p className="text-xs text-muted-foreground">{value.description}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      P{value.priority}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system events and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.timestamp} className="flex items-start justify-between border-b pb-3 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.type} • {activity.source}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

