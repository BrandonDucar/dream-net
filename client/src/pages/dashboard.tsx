import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoringDashboard } from "@/components/scoring-dashboard";
import { 
  Bed, 
  Circle, 
  Gem, 
  Wallet, 
  Plus, 
  Search, 
  Settings as SettingsIcon, 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardMetrics {
  totalDreams: number;
  activeCocoons: number;
  dreamCores: number;
  totalWallets: number;
}

export default function Dashboard() {
  const { data: metrics, isLoading, error } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load dashboard metrics. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const metricsCards = [
    {
      title: "Total Dreams",
      value: metrics?.totalDreams || 0,
      icon: Bed,
      change: "+12.5%",
      changeType: "positive" as const,
      bgColor: "electric-cyan/10",
      iconColor: "electric-cyan"
    },
    {
      title: "Active Cocoons",
      value: metrics?.activeCocoons || 0,
      icon: Circle,
      change: "+8.2%",
      changeType: "positive" as const,
      bgColor: "soft-gold/10",
      iconColor: "soft-gold"
    },
    {
      title: "Dream Cores",
      value: metrics?.dreamCores || 0,
      icon: Gem,
      change: "+15.7%",
      changeType: "positive" as const,
      bgColor: "purple-500/10",
      iconColor: "purple-400"
    },
    {
      title: "Total Wallets",
      value: metrics?.totalWallets || 0,
      icon: Wallet,
      change: "+22.1%",
      changeType: "positive" as const,
      bgColor: "blue-500/10",
      iconColor: "blue-400"
    }
  ];

  const recentActivity = [
    {
      icon: Bed,
      iconBg: "electric-cyan/10",
      iconColor: "electric-cyan",
      title: "New dream submitted by User #2847",
      time: "2 minutes ago"
    },
    {
      icon: Circle,
      iconBg: "soft-gold/10",
      iconColor: "soft-gold",
      title: "Cocoon #156 entered metamorphosis stage",
      time: "15 minutes ago"
    },
    {
      icon: Gem,
      iconBg: "purple-500/10",
      iconColor: "purple-400",
      title: "Dream Core #432 reached critical resonance",
      time: "1 hour ago"
    }
  ];

  const quickActions = [
    { icon: Plus, label: "Submit Dream", color: "electric-cyan" },
    { icon: Search, label: "Review Pending", color: "soft-gold" },
    { icon: SettingsIcon, label: "Manage Cores", color: "purple-400" },
    { icon: BarChart3, label: "Export Reports", color: "blue-400" }
  ];

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-2 rounded-lg", `bg-${metric.bgColor}`)}>
                    <Icon className={cn("w-5 h-5", `text-${metric.iconColor}`)} />
                  </div>
                  <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    metric.changeType === "positive" 
                      ? "text-green-400 bg-green-400/10" 
                      : "text-red-400 bg-red-400/10"
                  )}>
                    {metric.changeType === "positive" ? (
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 inline mr-1" />
                    )}
                    {metric.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {isLoading ? "..." : metric.value.toLocaleString()}
                </h3>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dream Score Engine Dashboard */}
      <ScoringDashboard />

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dream Activity Chart */}
        <Card className="bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Dream Activity</CardTitle>
              <select className="bg-background border border-border rounded-lg px-3 py-1 text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-zinc-900/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Dream activity chart will be implemented</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-zinc-900/30">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      `bg-${activity.iconBg}`
                    )}>
                      <Icon className={cn("w-4 h-4", `text-${activity.iconColor}`)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button variant="outline" className="w-full mt-4 border-electric-cyan/20 text-electric-cyan hover:bg-electric-cyan/10">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="flex items-center space-x-3 p-4 h-auto justify-start bg-zinc-900/50 hover:bg-zinc-800/50 border-border"
                >
                  <Icon className={cn("w-4 h-4", `text-${action.color}`)} />
                  <span className="font-medium">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
