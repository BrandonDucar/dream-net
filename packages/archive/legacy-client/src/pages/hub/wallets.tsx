import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, Activity, TrendingUp, RefreshCw } from "lucide-react";
import { getTrackedWalletsSummary } from "@/api/wallets";
import { cn } from "@/lib/utils";

export default function HubWallets() {
  // Fetch wallet summary from backend
  const { data: summary, isLoading, refetch } = useQuery({
    queryKey: ['wallets', 'summary'],
    queryFn: getTrackedWalletsSummary,
    refetchInterval: 60000, // Refetch every minute
  });

  const totalWallets = summary?.totalWallets || 0;
  const totalValue = summary?.totalValue || 0;
  const lastUpdated = summary?.lastUpdated 
    ? new Date(summary.lastUpdated).toLocaleString()
    : 'Never';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Wallets & CoinSensei</h1>
          <p className="text-muted-foreground">
            Wallet management and portfolio analytics
            {isLoading && <span className="ml-2 text-xs">(Loading...)</span>}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>CoinSensei Integration</CardTitle>
          <CardDescription>
            Read-only wallet intelligence and portfolio tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Tracked wallets: {totalWallets}</span>
            </div>
            {totalValue > 0 && (
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Total portfolio value: ${totalValue.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Last analysis: {lastUpdated}</span>
            </div>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Individual wallet tracking and detailed analytics coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

