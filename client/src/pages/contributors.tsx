import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Star, TrendingUp, Calendar, Wallet } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type ContributorRole = "Builder" | "Artist" | "Coder" | "Visionary" | "Promoter";

interface TopContributor {
  wallet: string;
  role: ContributorRole;
  contributionCount: number;
  cocoons: string[];
}

interface ContributorLog {
  id: string;
  cocoonId: string;
  walletAddress: string;
  role: ContributorRole;
  actionType: "added" | "removed";
  timestamp: string;
  performedBy: string;
}

function getRoleBadge(role: ContributorRole) {
  const styles = {
    Builder: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300", icon: "🔨" },
    Artist: { color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300", icon: "🎨" },
    Coder: { color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", icon: "⚡" },
    Visionary: { color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300", icon: "🔮" },
    Promoter: { color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300", icon: "📢" },
  };
  return styles[role] || { color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300", icon: "👤" };
}

function getTierBadge(rank: number) {
  if (rank === 1) return { emoji: "🥇", label: "Gold", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" };
  if (rank === 2) return { emoji: "🥈", label: "Silver", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" };
  if (rank === 3) return { emoji: "🥉", label: "Bronze", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" };
  if (rank <= 10) return { emoji: "⭐", label: "Elite", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" };
  return { emoji: "🌟", label: "Rising", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" };
}

export default function ContributorsPage() {
  // Query for top contributors
  const { data: topContributors = [], isLoading: loadingTop } = useQuery<TopContributor[]>({
    queryKey: ["/api/contributors/top"],
  });

  // Query for contributor activity log
  const { data: contributorLog = [], isLoading: loadingLog } = useQuery<ContributorLog[]>({
    queryKey: ["/api/contributors/log"],
    queryFn: async () => {
      const response = await fetch("/api/contributors/log");
      if (!response.ok) throw new Error('Failed to fetch contributor log');
      return response.json();
    },
  });

  const roleStats = topContributors.reduce((acc, contributor) => {
    acc[contributor.role] = (acc[contributor.role] || 0) + 1;
    return acc;
  }, {} as Record<ContributorRole, number>);

  const totalContributions = topContributors.reduce((sum, c) => sum + c.contributionCount, 0);
  const uniqueContributors = topContributors.length;
  const activeContributors = topContributors.filter(c => c.contributionCount > 0).length;

  if (loadingTop) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Contributors Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Track and recognize top contributors across all cocoon projects
          </p>
        </div>
      </div>

      <Separator />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Contributors</p>
                <p className="text-2xl font-bold">{uniqueContributors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Contributors</p>
                <p className="text-2xl font-bold">{activeContributors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Contributions</p>
                <p className="text-2xl font-bold">{totalContributions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Top Contributor</p>
                <p className="text-lg font-bold">
                  {topContributors[0] ? `${topContributors[0].contributionCount} cocoons` : "None yet"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leaderboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="roles">By Role</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Top Contributors Leaderboard
              </CardTitle>
              <CardDescription>
                Contributors ranked by total cocoon participation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topContributors.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No contributors yet</p>
                  <p className="text-sm">Add contributors to cocoons to see the leaderboard</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topContributors.map((contributor, index) => {
                    const rank = index + 1;
                    const tier = getTierBadge(rank);
                    const roleBadge = getRoleBadge(contributor.role);
                    
                    return (
                      <div key={contributor.wallet} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-muted-foreground w-8">
                              #{rank}
                            </span>
                            <Badge className={tier.color}>
                              {tier.emoji} {tier.label}
                            </Badge>
                          </div>
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              <Wallet className="w-4 h-4" />
                              {contributor.wallet.slice(0, 6)}...{contributor.wallet.slice(-4)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className={roleBadge.color}>
                                {roleBadge.icon} {contributor.role}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {contributor.contributionCount} cocoon{contributor.contributionCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{contributor.contributionCount}</p>
                          <p className="text-xs text-muted-foreground">contributions</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(roleStats).map(([role, count]) => {
              const roleBadge = getRoleBadge(role as ContributorRole);
              const roleContributors = topContributors.filter(c => c.role === role);
              
              return (
                <Card key={role}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{roleBadge.icon}</span>
                      {role}
                    </CardTitle>
                    <CardDescription>
                      {count} contributor{count !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {roleContributors.slice(0, 3).map((contributor, index) => (
                        <div key={contributor.wallet} className="flex items-center justify-between text-sm">
                          <span>
                            {contributor.wallet.slice(0, 6)}...{contributor.wallet.slice(-4)}
                          </span>
                          <span className="text-muted-foreground">
                            {contributor.contributionCount} cocoons
                          </span>
                        </div>
                      ))}
                      {roleContributors.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center pt-2">
                          +{roleContributors.length - 3} more
                        </p>
                      )}
                      {roleContributors.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No {role.toLowerCase()}s yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Contributor Activity
              </CardTitle>
              <CardDescription>
                Latest contributor additions and removals across all cocoons
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingLog ? (
                <div className="animate-pulse text-center py-8">Loading activity...</div>
              ) : contributorLog.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No activity recorded yet</p>
                  <p className="text-sm">Contributor changes will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contributorLog.slice(0, 20).map((log) => {
                    const roleBadge = getRoleBadge(log.role);
                    
                    return (
                      <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${log.actionType === 'added' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <div>
                            <p className="text-sm font-medium">
                              {log.actionType === 'added' ? 'Added' : 'Removed'} {log.walletAddress.slice(0, 6)}...{log.walletAddress.slice(-4)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className={roleBadge.color}>
                                {roleBadge.icon} {log.role}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                by {log.performedBy.slice(0, 6)}...{log.performedBy.slice(-4)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}