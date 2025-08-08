import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Users, History, Award, Calendar } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface ContributorManagementProps {
  cocoonId: string;
}

type ContributorRole = "Builder" | "Artist" | "Coder" | "Visionary" | "Promoter";

interface CocoonContributor {
  wallet: string;
  role: ContributorRole;
  joinedAt: string;
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
    Builder: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Artist: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Coder: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Visionary: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Promoter: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  };
  return styles[role] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
}

export function ContributorManagement({ cocoonId }: ContributorManagementProps) {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [newContributor, setNewContributor] = useState({
    wallet: "",
    role: "" as ContributorRole,
  });

  // Query for contributors
  const { data: contributors = [], isLoading } = useQuery<CocoonContributor[]>({
    queryKey: ["/api/cocoons", cocoonId, "contributors"],
  });

  // Query for contributor log
  const { data: contributorLog = [] } = useQuery<ContributorLog[]>({
    queryKey: ["/api/contributors/log", cocoonId],
    queryFn: async () => {
      const response = await fetch(`/api/contributors/log?cocoonId=${cocoonId}`);
      if (!response.ok) throw new Error('Failed to fetch contributor log');
      return response.json();
    },
  });

  // Add contributor mutation
  const addContributorMutation = useMutation({
    mutationFn: async ({ wallet, role }: { wallet: string; role: ContributorRole }) => {
      return apiRequest(`/api/cocoons/${cocoonId}/contributors`, {
        method: "POST",
        body: JSON.stringify({
          wallet,
          role,
          adminWallet: "0x123456789abcdef", // Admin wallet from session
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cocoons", cocoonId, "contributors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contributors/log"] });
      setShowAddDialog(false);
      setNewContributor({ wallet: "", role: "" as ContributorRole });
      toast({
        title: "Contributor Added",
        description: `Successfully added ${newContributor.wallet} as ${newContributor.role}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add contributor",
        variant: "destructive",
      });
    },
  });

  // Remove contributor mutation
  const removeContributorMutation = useMutation({
    mutationFn: async (walletAddress: string) => {
      return apiRequest(`/api/cocoons/${cocoonId}/contributors/${walletAddress}`, {
        method: "DELETE",
        body: JSON.stringify({
          adminWallet: "0x123456789abcdef", // Admin wallet from session
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cocoons", cocoonId, "contributors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contributors/log"] });
      toast({
        title: "Contributor Removed",
        description: "Successfully removed contributor",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove contributor",
        variant: "destructive",
      });
    },
  });

  const handleAddContributor = () => {
    if (!newContributor.wallet || !newContributor.role) {
      toast({
        title: "Validation Error",
        description: "Please provide both wallet address and role",
        variant: "destructive",
      });
      return;
    }
    addContributorMutation.mutate(newContributor);
  };

  const handleRemoveContributor = (walletAddress: string) => {
    removeContributorMutation.mutate(walletAddress);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Contributors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Loading contributors...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Contributors ({contributors.length})
            </CardTitle>
            <CardDescription>
              Manage contributors for this cocoon project
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <History className="w-4 h-4 mr-2" />
                  View Log
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Contributor Activity Log</DialogTitle>
                  <DialogDescription>
                    All contributor changes for this cocoon
                  </DialogDescription>
                </DialogHeader>
                <div className="h-96 overflow-y-auto">
                  <div className="space-y-3">
                    {Array.isArray(contributorLog) && contributorLog.map((log: ContributorLog) => (
                      <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${log.actionType === 'added' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <div>
                            <p className="text-sm font-medium">
                              {log.actionType === 'added' ? 'Added' : 'Removed'} {log.walletAddress}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              as {log.role} by {log.performedBy}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                    ))}
                    {(!Array.isArray(contributorLog) || contributorLog.length === 0) && (
                      <div className="text-center text-muted-foreground py-8">
                        No activity recorded yet
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contributor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Contributor</DialogTitle>
                  <DialogDescription>
                    Add a new contributor to this cocoon project
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="wallet">Wallet Address</Label>
                    <Input
                      id="wallet"
                      placeholder="0x..."
                      value={newContributor.wallet}
                      onChange={(e) => setNewContributor(prev => ({ ...prev, wallet: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select onValueChange={(value) => setNewContributor(prev => ({ ...prev, role: value as ContributorRole }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Builder">Builder</SelectItem>
                        <SelectItem value="Artist">Artist</SelectItem>
                        <SelectItem value="Coder">Coder</SelectItem>
                        <SelectItem value="Visionary">Visionary</SelectItem>
                        <SelectItem value="Promoter">Promoter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddContributor}
                      disabled={addContributorMutation.isPending}
                    >
                      {addContributorMutation.isPending ? "Adding..." : "Add Contributor"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {contributors.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No contributors yet</p>
            <p className="text-sm">Add contributors to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contributors.map((contributor) => (
              <div key={`${contributor.wallet}-${contributor.role}`} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{contributor.wallet}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={getRoleBadge(contributor.role)}>
                        {contributor.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(contributor.joinedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveContributor(contributor.wallet)}
                  disabled={removeContributorMutation.isPending}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}