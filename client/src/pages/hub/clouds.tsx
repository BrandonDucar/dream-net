import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cloud, Zap, Activity, RefreshCw } from "lucide-react";
import { getAllDreamClouds, DreamCloud } from "@/api/clouds";
import { cn } from "@/lib/utils";

export default function HubClouds() {
  // Fetch real DreamClouds from backend
  const { data: clouds = [], isLoading, refetch } = useQuery({
    queryKey: ['dreamClouds'],
    queryFn: getAllDreamClouds,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">DreamClouds</h1>
          <p className="text-muted-foreground">
            Overview of all DreamCloud lanes and integrations
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

      {isLoading && clouds.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading DreamClouds...</p>
          </div>
        </div>
      ) : clouds.length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-12 text-center">
            <Cloud className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No DreamClouds found</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clouds.map((cloud: DreamCloud) => (
          <Card key={cloud.id} className="border-border hover:border-electric-cyan/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-electric-cyan/10 text-electric-cyan">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle>{cloud.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {cloud.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                  {cloud.status || 'active'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {cloud.dreams !== undefined && (
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{cloud.dreams} dreams</span>
                </div>
              )}
              {cloud.chains && cloud.chains.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cloud.chains.map((chain) => (
                    <Badge key={chain} variant="outline" className="text-xs">
                      {chain}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        </div>
      )}
    </div>
  );
}

