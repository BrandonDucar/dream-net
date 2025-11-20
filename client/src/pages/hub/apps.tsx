import { useState } from "react";
import { mockApps, MiniApp } from "../../mocks/apps";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  LayoutGrid, 
  Filter,
  ExternalLink,
  Sparkles,
  Lock,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HubApps() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApps = mockApps.filter((app) => {
    if (categoryFilter !== "all" && app.category !== categoryFilter) return false;
    if (statusFilter !== "all" && app.status !== statusFilter) return false;
    if (searchQuery && !app.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !app.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const categories = ["all", "identity", "vault", "bounty", "remix", "governance", "analytics", "creative", "other"];
  const statuses = ["all", "stable", "beta", "alpha", "coming-soon"];

  const getStatusBadge = (status: MiniApp["status"]) => {
    switch (status) {
      case "stable":
        return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Stable</Badge>;
      case "beta":
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Beta</Badge>;
      case "alpha":
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Alpha</Badge>;
      case "coming-soon":
        return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20">Coming Soon</Badge>;
    }
  };

  const getCategoryIcon = (category: MiniApp["category"]) => {
    switch (category) {
      case "identity":
        return <Lock className="w-5 h-5" />;
      case "vault":
        return <Zap className="w-5 h-5" />;
      case "bounty":
        return <Sparkles className="w-5 h-5" />;
      default:
        return <LayoutGrid className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Mini-App Catalog</h1>
        <p className="text-muted-foreground">
          Browse and access all available DreamNet mini-apps
        </p>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-md bg-background border border-border text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-md bg-background border border-border text-sm"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApps.map((app) => (
          <Card
            key={app.id}
            className="border-border hover:border-electric-cyan/50 transition-colors cursor-pointer group"
            onClick={() => {
              if (app.status !== "coming-soon") {
                window.location.href = app.route;
              }
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-electric-cyan/10 text-electric-cyan">
                    {getCategoryIcon(app.category)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold">{app.name}</CardTitle>
                    <CardDescription className="text-xs mt-1 capitalize">
                      {app.category}
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(app.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {app.description}
              </p>
              {app.pricingHint && (
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3" />
                  <span>{app.pricingHint}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                {app.status === "coming-soon" ? (
                  <Badge variant="outline" className="text-xs">
                    Coming Soon
                  </Badge>
                ) : (
                  <div className="flex items-center space-x-2 text-xs text-electric-cyan group-hover:underline">
                    <span>Open App</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <LayoutGrid className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No apps found matching your filters.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

