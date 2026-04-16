import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Zap, Activity, Eye, Settings } from "lucide-react";
import type { DreamCore } from "@shared/schema";

export default function Cores() {
  const { data: cores, isLoading, error } = useQuery<DreamCore[]>({
    queryKey: ["/api/cores"],
  });

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load dream cores. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      resonance: "bg-purple-400/10 text-purple-400",
      energy: "bg-yellow-400/10 text-yellow-400",
      memory: "bg-blue-400/10 text-blue-400",
      lucidity: "bg-green-400/10 text-green-400",
      nightmare: "bg-red-400/10 text-red-400"
    };
    
    return (
      <Badge variant="secondary" className={colors[type as keyof typeof colors] || "bg-gray-400/10 text-gray-400"}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 80) return "text-green-400";
    if (energy >= 50) return "text-yellow-400";
    if (energy >= 20) return "text-orange-400";
    return "text-red-400";
  };

  const getResonanceColor = (resonance: number) => {
    if (resonance >= 80) return "text-purple-400";
    if (resonance >= 50) return "text-blue-400";
    return "text-zinc-400";
  };

  const activeCores = cores?.filter(core => core.isActive) || [];
  const averageEnergy = cores?.length ? Math.round(cores.reduce((acc, core) => acc + core.energy, 0) / cores.length) : 0;
  const averageResonance = cores?.length ? Math.round(cores.reduce((acc, core) => acc + core.resonance, 0) / cores.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Dream Cores Activity</h3>
          <p className="text-sm text-muted-foreground">Track Dream Core energy and resonance</p>
        </div>
        <Button className="bg-purple-500 text-white hover:bg-purple-600 font-medium">
          <Plus className="w-4 h-4 mr-2" />
          New Core
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-400/10">
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">{cores?.length || 0}</h3>
            <p className="text-sm text-muted-foreground">Total Cores</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-400/10">
                <Zap className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">{activeCores.length}</h3>
            <p className="text-sm text-muted-foreground">Active Cores</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-yellow-400/10">
                <Zap className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">{averageEnergy}%</h3>
            <p className="text-sm text-muted-foreground">Avg Energy</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-400/10">
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold">{averageResonance}%</h3>
            <p className="text-sm text-muted-foreground">Avg Resonance</p>
          </CardContent>
        </Card>
      </div>

      {/* Cores Table */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>All Dream Cores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Core ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Energy</TableHead>
                <TableHead>Resonance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading dream cores...
                  </TableCell>
                </TableRow>
              ) : !cores || cores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No dream cores found
                  </TableCell>
                </TableRow>
              ) : (
                cores.map((core) => (
                  <TableRow key={core.id} className="border-border hover:bg-zinc-900/30">
                    <TableCell className="font-mono text-sm">#{core.id.slice(-6)}</TableCell>
                    <TableCell className="font-medium">{core.name}</TableCell>
                    <TableCell>{getTypeBadge(core.type)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Progress value={core.energy} className="w-16" />
                        <span className={`text-sm font-medium w-12 ${getEnergyColor(core.energy)}`}>
                          {core.energy}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Progress value={core.resonance} className="w-16" />
                        <span className={`text-sm font-medium w-12 ${getResonanceColor(core.resonance)}`}>
                          {core.resonance}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={core.isActive ? "default" : "secondary"} 
                             className={core.isActive ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}>
                        {core.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">#{core.ownerId.slice(-6)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4 text-electric-cyan" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Settings className="w-4 h-4 text-soft-gold" />
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
