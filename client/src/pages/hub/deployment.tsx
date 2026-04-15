/**
 * Deployment Management Page
 * View and manage deployments across all platforms
 */

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, CheckCircle2, XCircle, Loader2, Rocket, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = import.meta.env.VITE_API_URL || "";

interface DeploymentPlatform {
  name: string;
  displayName: string;
  status: "available" | "configured" | "unavailable";
  url?: string;
}

interface DeploymentResult {
  success: boolean;
  deploymentId?: string;
  url?: string;
  platform: string;
  error?: string;
}

export default function HubDeployment() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  // Fetch available platforms
  const { data: platforms, isLoading: platformsLoading } = useQuery<string[]>({
    queryKey: ['deployment-platforms'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/deployment/platforms`);
      if (!response.ok) throw new Error('Failed to fetch platforms');
      const data = await response.json();
      return data.platforms || [];
    },
  });

  // Deploy to a specific platform
  const deployMutation = useMutation({
    mutationFn: async (platform: string) => {
      const response = await fetch(`${API_BASE}/api/deployment/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          projectName: 'dreamnet-hub',
          sourceDirectory: 'client/dist',
          buildCommand: 'pnpm run build',
          outputDirectory: 'dist',
          customDomain: platform === 'dreamnet' ? 'dreamnet.ink' : undefined,
        }),
      });
      if (!response.ok) throw new Error('Deployment failed');
      return await response.json();
    },
  });

  // Deploy to all platforms
  const deployAllMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_BASE}/api/deployment/deploy-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: 'dreamnet-hub',
          sourceDirectory: 'client/dist',
          buildCommand: 'pnpm run build',
          outputDirectory: 'dist',
        }),
      });
      if (!response.ok) throw new Error('Deployment failed');
      return await response.json();
    },
  });

  const platformDisplayNames: Record<string, string> = {
    dreamnet: 'DreamNet Native',
    vercel: 'Vercel',
    netlify: 'Netlify',
    railway: 'Railway',
    'cloudflare-pages': 'Cloudflare Pages',
    render: 'Render',
    'fly-io': 'Fly.io',
    'aws-amplify': 'AWS Amplify',
    'azure-static-web-apps': 'Azure Static Web Apps',
    'github-pages': 'GitHub Pages',
    surge: 'Surge.sh',
    'firebase-hosting': 'Firebase Hosting',
    'digitalocean-app-platform': 'DigitalOcean App Platform',
    heroku: 'Heroku',
    pixl: 'Pixl',
  };

  const getPlatformStatus = (platform: string): "available" | "configured" | "unavailable" => {
    // Check if platform has required env vars
    // For now, mark DreamNet as always available, others as configured if env vars exist
    if (platform === 'dreamnet') return 'available';
    // In a real implementation, check for env vars
    return 'configured';
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Deployment Management</h1>
        <p className="text-muted-foreground">
          Deploy DreamNet Hub to any platform. We ARE the deployment platform!
        </p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Current Deployment</CardTitle>
          <CardDescription>
            Your frontend is in <code className="text-xs bg-zinc-800 px-1 py-0.5 rounded">client/</code> and currently deployed to Vercel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Live URL:</span>
              <a href="https://dreamnet.ink" target="_blank" rel="noopener noreferrer" className="text-electric-cyan hover:underline">
                dreamnet.ink
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Platform:</span>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                Vercel
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Frontend Code:</span>
              <code className="text-xs bg-zinc-800 px-2 py-1 rounded">client/</code>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="platforms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="platforms">Available Platforms</TabsTrigger>
          <TabsTrigger value="deploy">Deploy</TabsTrigger>
          <TabsTrigger value="status">Deployment Status</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>15+ Deployment Platforms</CardTitle>
              <CardDescription>
                Deploy to any platform or use DreamNet's native platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {platformsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(platforms || []).map((platform) => {
                    const status = getPlatformStatus(platform);
                    const isDreamNet = platform === 'dreamnet';
                    
                    return (
                      <Card
                        key={platform}
                        className={cn(
                          "border-border hover:border-electric-cyan/50 transition-colors cursor-pointer",
                          isDreamNet && "border-electric-cyan/30 bg-electric-cyan/5"
                        )}
                        onClick={() => setSelectedPlatform(platform)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm font-medium">
                              {platformDisplayNames[platform] || platform}
                            </CardTitle>
                            {isDreamNet && (
                              <Badge className="bg-electric-cyan/10 text-electric-cyan border-electric-cyan/20">
                                Native
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {status === 'available' && (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            )}
                            {status === 'configured' && (
                              <Globe className="w-4 h-4 text-blue-400" />
                            )}
                            {status === 'unavailable' && (
                              <XCircle className="w-4 h-4 text-red-400" />
                            )}
                            <span className="text-xs text-muted-foreground capitalize">
                              {status}
                            </span>
                          </div>
                          {isDreamNet && (
                            <p className="text-xs text-muted-foreground">
                              No external dependencies required
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deploy DreamNet Hub</CardTitle>
              <CardDescription>
                Deploy your frontend (<code className="text-xs bg-zinc-800 px-1 py-0.5 rounded">client/</code>) to any platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Deploy to Single Platform</h3>
                <div className="flex flex-wrap gap-2">
                  {platforms?.slice(0, 6).map((platform) => (
                    <Button
                      key={platform}
                      variant="outline"
                      size="sm"
                      onClick={() => deployMutation.mutate(platform)}
                      disabled={deployMutation.isPending}
                    >
                      {deployMutation.isPending && deployMutation.variables === platform ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Rocket className="mr-2 h-4 w-4" />
                      )}
                      {platformDisplayNames[platform] || platform}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold mb-2">Deploy to All Platforms</h3>
                <Button
                  variant="default"
                  onClick={() => deployAllMutation.mutate()}
                  disabled={deployAllMutation.isPending}
                  className="w-full"
                >
                  {deployAllMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Rocket className="mr-2 h-4 w-4" />
                      )}
                  Deploy to All {platforms?.length || 0} Platforms
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Deploys to all available platforms simultaneously for redundancy
                </p>
              </div>

              {deployMutation.isSuccess && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-green-400">
                        Deployment successful!
                      </p>
                      {deployMutation.data?.result?.url && (
                        <a
                          href={deployMutation.data.result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-electric-cyan hover:underline mt-1 block"
                        >
                          {deployMutation.data.result.url}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {deployMutation.isError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <p className="text-sm text-red-400">
                      Deployment failed: {deployMutation.error?.message || 'Unknown error'}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Status</CardTitle>
              <CardDescription>
                Monitor deployments across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Deployment status tracking coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

