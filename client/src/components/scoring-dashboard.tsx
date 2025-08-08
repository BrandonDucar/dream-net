import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Play, Square, Zap, Target, Users, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ScoringStatus {
  running: boolean;
  nextRun?: string;
}

export function ScoringDashboard() {
  const { toast } = useToast();

  // Query for scoring status
  const { data: status, isLoading: statusLoading } = useQuery<ScoringStatus>({
    queryKey: ["/api/scoring/status"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Mutation for updating all scores
  const updateAllMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/scoring/update-all", {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dreams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scoring/status"] });
      toast({
        title: "Scores Updated",
        description: "All dream scores have been recalculated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update dream scores. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mutation for starting scoring
  const startScoringMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/scoring/start", {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scoring/status"] });
      toast({
        title: "Scoring Started",
        description: "Scheduled dream scoring has been started.",
      });
    },
  });

  // Mutation for stopping scoring
  const stopScoringMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/scoring/stop", {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scoring/status"] });
      toast({
        title: "Scoring Stopped",
        description: "Scheduled dream scoring has been stopped.",
      });
    },
  });

  if (statusLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">Loading scoring status...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-electric-cyan" />
          Dream Score Engine
        </CardTitle>
        <CardDescription>
          Automated scoring system analyzing originality, traction, and collaboration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge 
              variant={status?.running ? "default" : "secondary"}
              className={status?.running ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
            >
              {status?.running ? "Running" : "Stopped"}
            </Badge>
            {status?.nextRun && (
              <span className="text-sm text-muted-foreground">
                {status.nextRun}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {status?.running ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => stopScoringMutation.mutate()}
                disabled={stopScoringMutation.isPending}
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => startScoringMutation.mutate()}
                disabled={startScoringMutation.isPending}
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Scoring Components */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Target className="h-8 w-8 mx-auto mb-2 text-purple-400" />
            <h3 className="font-semibold text-sm">Originality</h3>
            <p className="text-xs text-muted-foreground">String similarity analysis</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-400" />
            <h3 className="font-semibold text-sm">Traction</h3>
            <p className="text-xs text-muted-foreground">Views, likes, comments</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Users className="h-8 w-8 mx-auto mb-2 text-green-400" />
            <h3 className="font-semibold text-sm">Collaboration</h3>
            <p className="text-xs text-muted-foreground">Contributor count</p>
          </div>
        </div>

        <Separator />

        {/* Manual Update */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Manual Update</h3>
            <p className="text-sm text-muted-foreground">
              Trigger immediate scoring for all dreams
            </p>
          </div>
          <Button
            onClick={() => updateAllMutation.mutate()}
            disabled={updateAllMutation.isPending}
            className="bg-electric-cyan/10 text-electric-cyan border-electric-cyan/20 hover:bg-electric-cyan/20"
          >
            {updateAllMutation.isPending ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Update All Scores
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}