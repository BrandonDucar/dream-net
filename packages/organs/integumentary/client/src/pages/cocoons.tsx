import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, ExternalLink, FileText, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Cocoon } from "@dreamnet/shared/schema";
import { ContributorManagement } from "@/components/contributor-management";

function getStageBadge(stage: string) {
  switch (stage) {
    case "seedling":
      return { emoji: "🌱", label: "Seedling", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" };
    case "incubating":
      return { emoji: "🐣", label: "Incubating", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" };
    case "hatched":
      return { emoji: "🦋", label: "Hatched", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" };
    default:
      return { emoji: "❓", label: "Unknown", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300" };
  }
}

function MetadataViewer({ cocoonId }: { cocoonId: string }) {
  const { data: metadata, isLoading } = useQuery({
    queryKey: ["/api/cocoons", cocoonId, "metadata"],
    queryFn: async () => {
      const response = await fetch(`/api/cocoons/${cocoonId}/metadata`);
      if (!response.ok) throw new Error('Failed to fetch metadata');
      return response.json();
    }
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading metadata...</div>;
  }

  if (!metadata) {
    return <div className="text-muted-foreground">No metadata available</div>;
  }

  const downloadMetadata = () => {
    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cocoon-${cocoonId}-metadata.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">NFT Metadata</h3>
        <Button onClick={downloadMetadata} size="sm" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download JSON
        </Button>
      </div>
      
      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Name</label>
          <p className="text-sm bg-muted/50 p-2 rounded">{metadata.name}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground">Description</label>
          <p className="text-sm bg-muted/50 p-2 rounded">{metadata.description}</p>
        </div>
        
        {metadata.image && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Image URI</label>
            <p className="text-sm bg-muted/50 p-2 rounded font-mono break-all">{metadata.image}</p>
          </div>
        )}
        
        <div>
          <label className="text-sm font-medium text-muted-foreground">Attributes</label>
          <div className="space-y-2 mt-2">
            {metadata.attributes?.map((attr: any, index: number) => (
              <div key={index} className="flex justify-between items-center bg-muted/30 p-2 rounded">
                <span className="text-sm font-medium">{attr.trait_type}</span>
                <Badge variant="secondary" className="bg-electric-cyan/10 text-electric-cyan border-electric-cyan/20">
                  {attr.value}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CocoonsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: cocoons = [], isLoading } = useQuery<Cocoon[]>({
    queryKey: ["/api/cocoons"],
  });

  const filteredCocoons = cocoons.filter(cocoon =>
    cocoon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cocoon.creatorWallet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
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
          <h1 className="text-3xl font-bold text-gradient">Dream Cocoons</h1>
          <p className="text-muted-foreground mt-2">
            Watch dreams evolve into beautiful creations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search cocoons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </div>

      <Separator />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <div>
                <p className="text-sm text-muted-foreground">Seedlings</p>
                <p className="text-2xl font-bold">{cocoons.filter(c => c.stage === "seedling").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐣</span>
              <div>
                <p className="text-sm text-muted-foreground">Incubating</p>
                <p className="text-2xl font-bold">{cocoons.filter(c => c.stage === "incubating").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦋</span>
              <div>
                <p className="text-sm text-muted-foreground">Hatched</p>
                <p className="text-2xl font-bold">{cocoons.filter(c => c.stage === "hatched").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cocoons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCocoons.map((cocoon) => {
          const stageBadge = getStageBadge(cocoon.stage);
          
          return (
            <Card key={cocoon.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{cocoon.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      by {cocoon.creatorWallet.slice(0, 6)}...{cocoon.creatorWallet.slice(-4)}
                    </CardDescription>
                  </div>
                  <Badge className={stageBadge.color}>
                    {stageBadge.emoji} {stageBadge.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {cocoon.description}
                </p>

                {/* Evolution Notes */}
                {cocoon.evolutionNotes && cocoon.evolutionNotes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Evolution Notes:</p>
                    <div className="flex flex-wrap gap-1">
                      {cocoon.evolutionNotes.slice(0, 3).map((note, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {note}
                        </Badge>
                      ))}
                      {cocoon.evolutionNotes.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{cocoon.evolutionNotes.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Created {formatDistanceToNow(new Date(cocoon.createdAt))} ago
                  </p>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" asChild className="flex-1">
                      <Link href={`/dreams?id=${cocoon.dreamId}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Dream
                      </Link>
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          NFT Data
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Cocoon NFT Metadata</DialogTitle>
                          <DialogDescription>
                            View and download the NFT metadata for this cocoon
                          </DialogDescription>
                        </DialogHeader>
                        <MetadataViewer cocoonId={cocoon.id} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCocoons.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐛</div>
          <h3 className="text-lg font-semibold mb-2">No cocoons found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms" : "Dreams will evolve into cocoons here"}
          </p>
        </div>
      )}
    </div>
  );
}