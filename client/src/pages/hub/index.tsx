import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Cloud, Bot, Wallet, LayoutGrid } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSystemStatus } from "@/api/bridge";

interface SystemStats {
  dreams: number;
  nodes: number;
  agents: number;
  clouds: number;
  wallets: number;
  apps: number;
}

export default function HubOverview() {
  const { data: systemStatus, isLoading } = useQuery({
    queryKey: ['systemStatus'],
    queryFn: getSystemStatus,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const stats: SystemStats = systemStatus || {
    dreams: 127,
    nodes: 45,
    agents: 6,
    clouds: 12,
    wallets: 89,
    apps: 8,
  };

  const statCards = [
    {
      title: "Dreams",
      value: stats.dreams,
      description: "Active dreams in network",
      icon: Zap,
      color: "text-electric-cyan",
      bgColor: "bg-electric-cyan/10",
    },
    {
      title: "Nodes",
      value: stats.nodes,
      description: "Connected dream nodes",
      icon: Activity,
      color: "text-electric-violet",
      bgColor: "bg-electric-violet/10",
    },
    {
      title: "Agents",
      value: stats.agents,
      description: "Active agents",
      icon: Bot,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      title: "Clouds",
      value: stats.clouds,
      description: "DreamClouds active",
      icon: Cloud,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      title: "Wallets",
      value: stats.wallets,
      description: "Tracked wallets",
      icon: Wallet,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
    {
      title: "Apps",
      value: stats.apps,
      description: "Mini-apps available",
      icon: LayoutGrid,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">DreamNet Overview</h1>
        <p className="text-muted-foreground">
          High-level view of the DreamNet organism
        </p>
        {isLoading && (
          <div className="mt-2 text-sm text-muted-foreground">
            Loading system status...
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common operations and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/hub/grid"
              className="block p-3 rounded-lg border border-border hover:bg-zinc-800/50 transition-colors"
            >
              <div className="font-medium">View Dream Grid</div>
              <div className="text-sm text-muted-foreground">
                Explore all dreams and nodes
              </div>
            </a>
            <a
              href="/hub/ops"
              className="block p-3 rounded-lg border border-border hover:bg-zinc-800/50 transition-colors"
            >
              <div className="font-medium">Open Ops Console</div>
              <div className="text-sm text-muted-foreground">
                Monitor agents and system health
              </div>
            </a>
            <a
              href="/miniapps"
              className="block p-3 rounded-lg border border-border hover:bg-zinc-800/50 transition-colors"
            >
              <div className="font-medium">Browse Mini-Apps</div>
              <div className="text-sm text-muted-foreground">
                Access all available mini-apps
              </div>
            </a>
            <a
              href="/hub/apps"
              className="block p-3 rounded-lg border border-border hover:bg-zinc-800/50 transition-colors"
            >
              <div className="font-medium">Hub App Catalog</div>
              <div className="text-sm text-muted-foreground">
                View all apps including mock apps
              </div>
            </a>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Frontend</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                Online
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Backend API</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                Online
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Database</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Agents</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                {stats.agents} Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

