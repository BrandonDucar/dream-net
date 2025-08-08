import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Eye, Edit, Trash2, Check, X, Brain, Zap, Sparkles, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DatabaseStatus } from "@/components/DatabaseStatus";
import { ErrorBoundary, DatabaseErrorFallback } from "@/components/ErrorBoundary";
import DreamCallOptIn from "@/components/DreamCallOptIn";
import type { Dream } from "@shared/schema";

export default function Dreams() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const { toast } = useToast();

  const { data: dreams, isLoading, error } = useQuery<Dream[]>({
    queryKey: ["/api/dreams/static"], // Use static endpoint with no database dependency
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log('Dreams data:', { 
    dreams, 
    loading: isLoading, 
    error: error?.message,
    count: dreams?.length 
  });

  const approveDreamMutation = useMutation({
    mutationFn: async (dreamId: string) => {
      return apiRequest(`/api/dreams/${dreamId}/approve`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dreams"] });
      toast({
        title: "Dream Approved",
        description: "The dream has been successfully approved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve dream. Please try again.",
        variant: "destructive",
      });
    },
  });

  const rejectDreamMutation = useMutation({
    mutationFn: async (dreamId: string) => {
      return apiRequest(`/api/dreams/${dreamId}/reject`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dreams"] });
      toast({
        title: "Dream Rejected",
        description: "The dream has been rejected.",
        variant: "destructive",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject dream. Please try again.",
        variant: "destructive",
      });
    },
  });

  const scoreDreamMutation = useMutation({
    mutationFn: async (dreamId: string) => {
      return apiRequest(`/api/dreams/${dreamId}/score`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dreams"] });
      toast({
        title: "AI Score Calculated",
        description: "Dream has been analyzed and scored.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to calculate AI score. Please try again.",
        variant: "destructive",
      });
    },
  });

  const evolveToCocoonMutation = useMutation({
    mutationFn: async ({ dreamId, notifyCreator }: { dreamId: string; notifyCreator: boolean }) => {
      return apiRequest(`/api/cocoons`, {
        method: "POST",
        body: JSON.stringify({ 
          dreamId, 
          evolutionNotes: [],
          notifyCreator 
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dreams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/cocoons"] });
      toast({
        title: "Dream Evolved! 🐛✨",
        description: "Your dream is evolving into a Cocoon... something beautiful is on the way.",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to evolve dream to cocoon. Please try again.",
        variant: "destructive",
      });
    },
  });

  const dreamScoreMutation = useMutation({
    mutationFn: async (dreamId: string) => {
      return apiRequest(`/api/dreams/${dreamId}/dream-score`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dreams"] });
      toast({
        title: "Dream Score Calculated",
        description: "Dream breakdown score has been analyzed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to calculate dream score. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Only show error if fetch failed and no data is available
  if (error && !dreams && !isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load dreams. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-400/10 text-yellow-400">🟡 Pending</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-green-400/10 text-green-400">🟢 Approved</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-400/10 text-red-400">🔴 Rejected</Badge>;
      case "evolved":
        return <Badge variant="secondary" className="bg-purple-400/10 text-purple-400">🦋 Evolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: number) => {
    const colors = {
      1: "bg-green-400/10 text-green-400",
      2: "bg-blue-400/10 text-blue-400", 
      3: "bg-yellow-400/10 text-yellow-400",
      4: "bg-orange-400/10 text-orange-400",
      5: "bg-red-400/10 text-red-400"
    };
    
    return (
      <Badge variant="secondary" className={colors[urgency as keyof typeof colors] || "bg-gray-400/10 text-gray-400"}>
        Level {urgency}
      </Badge>
    );
  };

  const getAIScoreBadge = (score: number | null | undefined) => {
    if (!score && score !== 0) {
      return (
        <Badge variant="outline" className="text-gray-400 border-gray-400/20">
          ❓ Not Scored
        </Badge>
      );
    }
    
    if (score >= 80) {
      return (
        <Badge className="bg-red-500/10 text-red-400 border-red-400/20">
          🔥 Hot Dream ({score})
        </Badge>
      );
    } else if (score >= 60) {
      return (
        <Badge className="bg-green-500/10 text-green-400 border-green-400/20">
          🌱 Promising ({score})
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-400/20">
          💤 Needs Work ({score})
        </Badge>
      );
    }
  };

  const renderAITags = (aiTags: string[] | null | undefined) => {
    if (!aiTags || aiTags.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {aiTags.slice(0, 3).map((tag, index) => (
          <Badge 
            key={index} 
            variant="outline" 
            className="text-xs px-2 py-0 bg-electric-cyan/5 text-electric-cyan border-electric-cyan/20"
          >
            {tag.replace(/^keyword-/, '').replace(/-/g, ' ')}
          </Badge>
        ))}
        {aiTags.length > 3 && (
          <Badge variant="outline" className="text-xs px-2 py-0 text-muted-foreground">
            +{aiTags.length - 3} more
          </Badge>
        )}
      </div>
    );
  };

  const renderScoreBreakdown = (scoreBreakdown: any, dream: any) => {
    if (!scoreBreakdown) return null;
    
    return (
      <div className="space-y-2 mt-2">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Originality:</span>
            <span className="text-soft-gold font-medium">{scoreBreakdown.originality}/25</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Traction:</span>
            <span className="text-soft-gold font-medium">{scoreBreakdown.traction}/25</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Collaboration:</span>
            <span className="text-soft-gold font-medium">{scoreBreakdown.collaboration}/25</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Updates:</span>
            <span className="text-soft-gold font-medium">{scoreBreakdown.updates}/25</span>
          </div>
        </div>
        
        {/* Contributors display */}
        {dream.contributors && dream.contributors.length > 0 && (
          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground mb-1">Contributors ({dream.contributors.length}):</div>
            <div className="flex flex-wrap gap-1">
              {dream.contributors.slice(0, 2).map((contributor: any, index: number) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs px-2 py-0 bg-purple-400/5 text-purple-400 border-purple-400/20"
                >
                  {contributor.role}
                </Badge>
              ))}
              {dream.contributors.length > 2 && (
                <Badge variant="outline" className="text-xs px-2 py-0 text-muted-foreground">
                  +{dream.contributors.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Engagement metrics */}
        {(dream.views || dream.likes || dream.comments) && (
          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground mb-1">Engagement:</div>
            <div className="flex gap-3 text-xs">
              {dream.views && <span>{dream.views} views</span>}
              {dream.likes && <span>{dream.likes} likes</span>}
              {dream.comments && <span>{dream.comments} comments</span>}
            </div>
          </div>
        )}
      </div>
    );
  };

  const filteredDreams = dreams?.filter(dream => {
    const matchesSearch = (dream.title || dream.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (dream.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || dream.status === statusFilter;
    const matchesUrgency = urgencyFilter === "all" || (dream.urgency || 1).toString() === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  }) || [];

  return (
    <ErrorBoundary fallback={DatabaseErrorFallback}>
      <div className="space-y-6">
        <DatabaseStatus />
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Dreams Management</h3>
            <p className="text-sm text-muted-foreground">Review and manage dream submissions</p>
          </div>
          <Button className="bg-electric-cyan text-black hover:bg-electric-cyan/90 font-medium">
            <Plus className="w-4 h-4 mr-2" />
            New Dream
          </Button>
        </div>

        {/* Dream Call Opt-In Section */}
        <div className="mb-6">
          <DreamCallOptIn />
        </div>

      {/* Filters */}
      <Card className="bg-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value="1">Level 1 - Low</SelectItem>
                <SelectItem value="2">Level 2 - Mild</SelectItem>
                <SelectItem value="3">Level 3 - Medium</SelectItem>
                <SelectItem value="4">Level 4 - High</SelectItem>
                <SelectItem value="5">Level 5 - Critical</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search dreams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dreams Table */}
      <Card className="bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Dream ID</TableHead>
              <TableHead>Title & AI Tags</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead>Dream Score</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  Loading dreams...
                </TableCell>
              </TableRow>
            ) : filteredDreams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No dreams found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredDreams.map((dream) => (
                <TableRow key={dream.id} className="border-border hover:bg-zinc-900/30">
                  <TableCell className="font-mono text-sm">#{dream.id.slice(-6)}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="font-medium truncate">{dream.title || dream.name || 'Untitled Dream'}</div>
                    {renderAITags(dream.aiTags)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{dream.wallet}</TableCell>
                  <TableCell>{getUrgencyBadge(dream.urgency || 1)}</TableCell>
                  <TableCell>{getAIScoreBadge(dream.aiScore)}</TableCell>
                  <TableCell>
                    {dream.dreamScore ? (
                      <div>
                        <Badge variant="secondary" className="bg-soft-gold/10 text-soft-gold border-soft-gold/20 mb-1">
                          {dream.dreamScore}/100
                        </Badge>
                        {renderScoreBreakdown(dream.scoreBreakdown, dream)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not scored</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {dream.origin}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(dream.status || 'pending')}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {dream.createdAt ? new Date(dream.createdAt).toLocaleDateString() : "Unknown"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {(dream.status || 'pending') === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-green-400/10"
                            onClick={() => approveDreamMutation.mutate(dream.id)}
                            disabled={approveDreamMutation.isPending}
                            title="Approve Dream"
                          >
                            <Check className="w-4 h-4 text-green-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-400/10"
                            onClick={() => rejectDreamMutation.mutate(dream.id)}
                            disabled={rejectDreamMutation.isPending}
                            title="Reject Dream"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </Button>
                        </>
                      )}
                      {(dream.status || 'pending') === "approved" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-purple-400/10"
                          onClick={() => evolveToCocoonMutation.mutate({ dreamId: dream.id, notifyCreator: true })}
                          disabled={evolveToCocoonMutation.isPending}
                          title="Evolve to Cocoon"
                        >
                          <Sparkles className="w-4 h-4 text-purple-400" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-electric-cyan/10"
                        onClick={() => scoreDreamMutation.mutate(dream.id)}
                        disabled={scoreDreamMutation.isPending}
                        title="Calculate AI Score"
                      >
                        <Brain className="w-4 h-4 text-electric-cyan" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-soft-gold/10"
                        onClick={() => dreamScoreMutation.mutate(dream.id)}
                        disabled={dreamScoreMutation.isPending}
                        title="Calculate Dream Score"
                      >
                        <Award className="w-4 h-4 text-soft-gold" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4 text-electric-cyan" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4 text-soft-gold" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {!isLoading && filteredDreams.length > 0 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredDreams.length} of {dreams?.length || 0} dreams
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button size="sm" className="bg-electric-cyan text-black">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
