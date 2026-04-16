import { useState, useEffect } from "react";
import { mockAgents, Agent } from "../../mocks/agents";
import { getAgentStatus } from "@/api/bridge";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Bot, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Filter,
  RefreshCw,
  Eye,
  Play,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HubOps() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "idle" | "error">("all");
  const [scopeFilter, setScopeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Try to fetch real agent status, fall back to mocks
  const { data: realAgentData } = useQuery({
    queryKey: ['agentStatus'],
    queryFn: getAgentStatus,
    refetchInterval: 30000,
  });

  // Use real data if available, otherwise use mocks
  const agents = realAgentData || mockAgents;

  const filteredAgents = agents.filter((agent) => {
    if (statusFilter !== "all" && agent.status !== statusFilter) return false;
    if (scopeFilter !== "all" && !agent.scope.includes(scopeFilter)) return false;
    if (searchQuery && !agent.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !agent.codename.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusIcon = (status: Agent["status"]) => {
    switch (status) {
      case "online":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "idle":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusBadge = (status: Agent["status"]) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Online</Badge>;
      case "idle":
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Idle</Badge>;
      case "error":
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Error</Badge>;
    }
  };

  const uniqueScopes = Array.from(new Set(agents.flatMap(a => a.scope)));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ops Console</h1>
          <p className="text-muted-foreground">
            Monitor and manage DreamNet agents
          </p>
        </div>
        <Button>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "online" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("online")}
              >
                Online
              </Button>
              <Button
                variant={statusFilter === "idle" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("idle")}
              >
                Idle
              </Button>
              <Button
                variant={statusFilter === "error" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("error")}
              >
                Error
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-md bg-background border border-border text-sm"
              >
                <option value="all">All Scopes</option>
                {uniqueScopes.map((scope) => (
                  <option key={scope} value={scope}>
                    {scope}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => (
          <Card
            key={agent.id}
            className={cn(
              "border-border hover:border-electric-cyan/50 transition-colors cursor-pointer",
              agent.status === "error" && "border-red-500/50"
            )}
            onClick={() => setSelectedAgent(agent)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base font-semibold">{agent.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">{agent.codename}</CardDescription>
                </div>
                {getStatusIcon(agent.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {agent.description}
              </p>
              <div className="flex items-center justify-between">
                {getStatusBadge(agent.status)}
                {agent.errorCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {agent.errorCount} errors
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {agent.scope.map((scope) => (
                  <Badge key={scope} variant="outline" className="text-xs">
                    {scope}
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(agent.lastActionAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="mt-1 truncate">{agent.lastAction}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agent Detail Dialog */}
      <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <DialogContent className="max-w-2xl">
          {selectedAgent && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle>{selectedAgent.name}</DialogTitle>
                    <DialogDescription>{selectedAgent.codename}</DialogDescription>
                  </div>
                  {getStatusBadge(selectedAgent.status)}
                </div>
              </DialogHeader>
              <Tabs defaultValue="overview" className="mt-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="actions">Recent Actions</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {selectedAgent.description}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Scope</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedAgent.scope.map((scope) => (
                          <Badge key={scope} variant="outline">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  {selectedAgent.trustScore && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Trust Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedAgent.trustScore}</div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                <TabsContent value="actions" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Recent Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 rounded-lg bg-zinc-800/50">
                          <Activity className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{selectedAgent.lastAction}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(selectedAgent.lastActionAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="settings" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Eye className="w-4 h-4 mr-2" />
                        View Logs
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Re-scan Environment
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Play className="w-4 h-4 mr-2" />
                        Redeploy Service
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Ping Agent
                      </Button>
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

