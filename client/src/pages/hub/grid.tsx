import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dream, getAllDreams } from "@/api/dreams";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Zap, Users, TrendingUp, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HubGrid() {
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");

  // Fetch real dreams from backend
  const { data: dreams = [], isLoading, refetch } = useQuery({
    queryKey: ['dreams', 'grid'],
    queryFn: getAllDreams,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Calculate health score from dream data (fallback to 50 if not provided)
  const getHealthScore = (dream: Dream): number => {
    if (dream.healthScore !== undefined) return dream.healthScore;
    // Calculate from metrics if available
    if (dream.metrics) {
      const { views = 0, likes = 0, remixes = 0 } = dream.metrics;
      return Math.min(100, Math.floor((views * 0.1 + likes * 2 + remixes * 5) / 10));
    }
    return 50; // Default
  };

  const filteredDreams = dreams.filter((dream) => {
    const healthScore = getHealthScore(dream);
    if (filter === "all") return true;
    if (filter === "high") return healthScore >= 80;
    if (filter === "medium") return healthScore >= 50 && healthScore < 80;
    if (filter === "low") return healthScore < 50;
    return true;
  });

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-400 bg-green-400/10 border-green-400/20";
    if (score >= 50) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    return "text-red-400 bg-red-400/10 border-red-400/20";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dream Grid</h1>
          <p className="text-muted-foreground">
            Explore all dreams and nodes in the network
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
        <div className="flex items-center space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "high" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("high")}
          >
            High Health
          </Button>
          <Button
            variant={filter === "medium" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("medium")}
          >
            Medium
          </Button>
          <Button
            variant={filter === "low" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("low")}
          >
            Low Health
          </Button>
        </div>
      </div>

      {/* Grid */}
      {isLoading && dreams.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading dreams...</p>
          </div>
        </div>
      ) : filteredDreams.length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No dreams found</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => refetch()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDreams.map((dream) => {
            const dreamId = dream.dreamId || dream.id || 'unknown';
            const healthScore = getHealthScore(dream);
            const metrics = dream.metrics || { views: 0, likes: 0, remixes: 0, shares: 0 };
            const evolutionPath = dream.evolutionPath || { generationLevel: 0, branchingFactor: 0, divergenceScore: 0 };
            const remixLineage = dream.remixLineage || [];
            
            return (
              <Card
                key={dreamId}
                className="border-border hover:border-electric-cyan/50 transition-colors cursor-pointer"
                onClick={() => setSelectedDream(dream)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium line-clamp-2">
                      {dream.title || dreamId}
                    </CardTitle>
                    <Badge
                      className={cn(
                        "shrink-0 ml-2",
                        getHealthColor(healthScore)
                      )}
                    >
                      {healthScore}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Activity className="w-3 h-3" />
                      <span>{metrics.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{metrics.remixes} remixes</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {remixLineage.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {remixLineage.length} lineage
                      </Badge>
                    )}
                    {evolutionPath.generationLevel > 0 && (
                      <Badge variant="outline" className="text-xs">
                        Gen {evolutionPath.generationLevel}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedDream} onOpenChange={() => setSelectedDream(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedDream && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDream.title || selectedDream.dreamId || selectedDream.id}</DialogTitle>
                <DialogDescription>
                  Dream details and metadata
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="health" className="mt-4">
                <TabsList>
                  <TabsTrigger value="health">Health</TabsTrigger>
                  <TabsTrigger value="flows">Flows</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="health" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Health Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{getHealthScore(selectedDream)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Engagement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedDream.engagementScore || 'N/A'}</div>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Views</span>
                        <span className="font-medium">{selectedDream.metrics?.views || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Likes</span>
                        <span className="font-medium">{selectedDream.metrics?.likes || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Remixes</span>
                        <span className="font-medium">{selectedDream.metrics?.remixes || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Shares</span>
                        <span className="font-medium">{selectedDream.metrics?.shares || 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="flows" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Evolution Path</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Generation Level</span>
                        <span className="font-medium">{selectedDream.evolutionPath?.generationLevel || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Branching Factor</span>
                        <span className="font-medium">{selectedDream.evolutionPath?.branchingFactor || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Divergence Score</span>
                        <span className="font-medium">
                          {selectedDream.evolutionPath?.divergenceScore 
                            ? `${(selectedDream.evolutionPath.divergenceScore * 100).toFixed(1)}%`
                            : 'N/A'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="history" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Remix Lineage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedDream.remixLineage && selectedDream.remixLineage.length > 0 ? (
                          selectedDream.remixLineage.map((lineage, idx) => (
                            <div key={idx} className="flex items-center space-x-2 p-2 rounded-lg bg-zinc-800/50">
                              <span className="text-sm font-medium">{lineage.title || lineage.id}</span>
                              <Badge variant="outline" className="text-xs">{lineage.id}</Badge>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No remix lineage</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="details" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Dream Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">ID</span>
                        <span className="font-mono text-xs">{selectedDream.id || selectedDream.dreamId || 'N/A'}</span>
                      </div>
                      {selectedDream.wallet && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Wallet</span>
                          <span className="font-mono text-xs">{selectedDream.wallet}</span>
                        </div>
                      )}
                      {selectedDream.createdAt && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Created</span>
                          <span className="text-xs">{new Date(selectedDream.createdAt).toLocaleString()}</span>
                        </div>
                      )}
                      {selectedDream.content && (
                        <div className="mt-4">
                          <span className="text-sm text-muted-foreground">Content</span>
                          <p className="text-sm mt-2 p-3 rounded-lg bg-zinc-800/50">
                            {selectedDream.content.substring(0, 500)}
                            {selectedDream.content.length > 500 && '...'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="agents" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Attached Agents</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        Agent information will be displayed here.
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

