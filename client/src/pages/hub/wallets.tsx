import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Activity, TrendingUp } from "lucide-react";

export default function HubWallets() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Wallets & CoinSensei</h1>
        <p className="text-muted-foreground">
          Wallet management and portfolio analytics
        </p>
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
              <span className="text-sm">Tracked wallets: 89</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Last analysis: 2 minutes ago</span>
            </div>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>Wallet management features coming soon...</p>
      </div>
    </div>
  );
}

