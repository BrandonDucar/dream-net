import { useState } from "react";
import { Dream } from "@/components/DreamNodeCard";
import mockDreams from "@/data/mockDreams";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Zap, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HubGrid() {
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const filteredDreams = mockDreams.filter((dream) => {
    if (filter === "all") return true;
    if (filter === "high") return dream.healthScore >= 80;
    if (filter === "medium") return dream.healthScore >= 50 && dream.healthScore < 80;
    if (filter === "low") return dream.healthScore < 50;
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
          </p>
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDreams.map((dream) => (
          <Card
            key={dream.dreamId}
            className="border-border hover:border-electric-cyan/50 transition-colors cursor-pointer"
            onClick={() => setSelectedDream(dream)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm font-medium line-clamp-2">
                  {dream.dreamId}
                </CardTitle>
                <Badge
                  className={cn(
                    "shrink-0 ml-2",
                    getHealthColor(dream.healthScore)
                  )}
                >
                  {dream.healthScore}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Activity className="w-3 h-3" />
                  <span>{dream.metrics.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{dream.metrics.remixes} remixes</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {dream.remixLineage.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {dream.remixLineage.length} lineage
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  Gen {dream.evolutionPath.generationLevel}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedDream} onOpenChange={() => setSelectedDream(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedDream && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDream.dreamId}</DialogTitle>
                <DialogDescription>
                  Dream details and metadata
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="health" className="mt-4">
                <TabsList>
                  <TabsTrigger value="health">Health</TabsTrigger>
                  <TabsTrigger value="flows">Flows</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="agents">Agents</TabsTrigger>
                </TabsList>
                <TabsContent value="health" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Health Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedDream.healthScore}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Engagement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedDream.engagementScore}</div>
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
                        <span className="font-medium">{selectedDream.metrics.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Likes</span>
                        <span className="font-medium">{selectedDream.metrics.likes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Remixes</span>
                        <span className="font-medium">{selectedDream.metrics.remixes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Shares</span>
                        <span className="font-medium">{selectedDream.metrics.shares}</span>
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
                        <span className="font-medium">{selectedDream.evolutionPath.generationLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Branching Factor</span>
                        <span className="font-medium">{selectedDream.evolutionPath.branchingFactor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Divergence Score</span>
                        <span className="font-medium">{(selectedDream.evolutionPath.divergenceScore * 100).toFixed(1)}%</span>
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
                        {selectedDream.remixLineage.map((lineage, idx) => (
                          <div key={idx} className="flex items-center space-x-2 p-2 rounded-lg bg-zinc-800/50">
                            <span className="text-sm font-medium">{lineage.title}</span>
                            <Badge variant="outline" className="text-xs">{lineage.id}</Badge>
                          </div>
                        ))}
                      </div>
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

