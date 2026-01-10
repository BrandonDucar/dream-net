import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, TrendingUp, Coins, Gem, Eye, Edit } from "lucide-react";
import type { Wallet } from "@dreamnet/shared/schema";

export default function Wallets() {
  const { data: wallets, isLoading, error } = useQuery<Wallet[]>({
    queryKey: ["/api/wallets"],
  });

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load wallets. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalDreamScore = wallets?.reduce((acc, wallet) => acc + wallet.dreamScore, 0) || 0;
  const totalCocoonTokens = wallets?.reduce((acc, wallet) => acc + wallet.cocoonTokens, 0) || 0;
  const totalCoreFragments = wallets?.reduce((acc, wallet) => acc + wallet.coreFragments, 0) || 0;
  const totalValue = wallets?.reduce((acc, wallet) => acc + wallet.totalValue, 0) || 0;

  const getValueBadge = (value: number) => {
    if (value >= 1000) return "text-purple-400";
    if (value >= 500) return "text-blue-400";
    if (value >= 100) return "text-green-400";
    return "text-gray-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Wallets Score Management</h3>
          <p className="text-sm text-muted-foreground">Manage user wallet scores and rewards</p>
        </div>
        <Button className="bg-blue-500 text-white hover:bg-blue-600 font-medium">
          <Plus className="w-4 h-4 mr-2" />
          New Wallet
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-electric-cyan/10">
                <TrendingUp className="w-4 h-4 text-electric-cyan" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">{totalDreamScore.toLocaleString()}</h3>
            <p className="text-sm text-muted-foreground">Total Dream Score</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-soft-gold/10">
                <Coins className="w-4 h-4 text-soft-gold" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">{totalCocoonTokens.toLocaleString()}</h3>
            <p className="text-sm text-muted-foreground">Cocoon Tokens</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-400/10">
                <Gem className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">{totalCoreFragments.toLocaleString()}</h3>
            <p className="text-sm text-muted-foreground">Core Fragments</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-400/10">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">{totalValue.toLocaleString()}</h3>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Wallets Table */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>All Wallets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Wallet ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Dream Score</TableHead>
                <TableHead>Cocoon Tokens</TableHead>
                <TableHead>Core Fragments</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading wallets...
                  </TableCell>
                </TableRow>
              ) : !wallets || wallets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No wallets found
                  </TableCell>
                </TableRow>
              ) : (
                wallets.map((wallet) => (
                  <TableRow key={wallet.id} className="border-border hover:bg-zinc-900/30">
                    <TableCell className="font-mono text-sm">#{wallet.id.slice(-6)}</TableCell>
                    <TableCell className="font-mono text-sm">#{wallet.userId.slice(-6)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-electric-cyan" />
                        <span className="font-medium">{wallet.dreamScore.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Coins className="w-4 h-4 text-soft-gold" />
                        <span className="font-medium">{wallet.cocoonTokens.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Gem className="w-4 h-4 text-purple-400" />
                        <span className="font-medium">{wallet.coreFragments.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`${getValueBadge(wallet.totalValue)} bg-opacity-10`}>
                        {wallet.totalValue.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {wallet.lastUpdated ? new Date(wallet.lastUpdated).toLocaleDateString() : "Unknown"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4 text-electric-cyan" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4 text-soft-gold" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
