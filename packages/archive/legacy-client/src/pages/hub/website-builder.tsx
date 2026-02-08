import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Download,
  ExternalLink,
  Code
} from "lucide-react";
import { generateWebsiteCode, type WebsiteDesignRequest } from "@/api/websiteDesigner";
import { cn } from "@/lib/utils";

export default function HubWebsiteBuilder() {
  const [description, setDescription] = useState("");
  const [pages, setPages] = useState("");
  const [style, setStyle] = useState("");
  const [features, setFeatures] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  const generateMutation = useMutation({
    mutationFn: (request: WebsiteDesignRequest) => generateWebsiteCode(request),
  });

  const handleGenerate = () => {
    if (!description.trim()) {
      alert("Please provide a website description");
      return;
    }

    const request: WebsiteDesignRequest = {
      description,
      pages: pages.split(',').map(p => p.trim()).filter(Boolean),
      style: style || undefined,
      features: features.split(',').map(f => f.trim()).filter(Boolean),
      targetAudience: targetAudience || undefined,
    };

    generateMutation.mutate(request);
  };

  const downloadCode = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    if (!generateMutation.data?.code) return;
    
    const { html, css, js, instructions } = generateMutation.data.code;
    
    downloadCode('index.html', html, 'text/html');
    setTimeout(() => downloadCode('styles.css', css, 'text/css'), 100);
    setTimeout(() => downloadCode('script.js', js, 'text/javascript'), 200);
    setTimeout(() => downloadCode('DEPLOYMENT.md', instructions, 'text/markdown'), 300);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Website AI Designer</h1>
        <p className="text-muted-foreground">
          Generate professional websites instantly using AI (no Vercel needed)
        </p>
      </div>

      {/* Form */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Website Requirements</CardTitle>
          <CardDescription>
            Describe your website and let AI generate it for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description">Website Description *</Label>
            <Textarea
              id="description"
              placeholder="A modern portfolio website for a freelance designer..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pages">Pages (comma-separated)</Label>
              <Input
                id="pages"
                placeholder="Home, About, Services, Contact"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="style">Style</Label>
              <Input
                id="style"
                placeholder="Modern, Minimalist, Corporate, Creative"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input
                id="features"
                placeholder="Contact form, Blog, Gallery, E-commerce"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="Small businesses, Startups, Freelancers"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!description.trim() || generateMutation.isPending}
            className="w-full"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Website...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Website
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {generateMutation.data && (
        <Card className={cn(
          "border-border",
          generateMutation.data.success && "border-green-500/50"
        )}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {generateMutation.data.success ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span>Website Generated Successfully!</span>
                    </>
                  ) : (
                    <span>Generation Failed</span>
                  )}
                </CardTitle>
                <CardDescription>
                  {generateMutation.data.success 
                    ? "Your website code is ready to deploy"
                    : generateMutation.data.error}
                </CardDescription>
              </div>
              {generateMutation.data.success && generateMutation.data.code && (
                <Button onClick={downloadAll} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download All Files
                </Button>
              )}
            </div>
          </CardHeader>
          
          {generateMutation.data.success && generateMutation.data.code && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Code className="w-4 h-4 mr-2" />
                      HTML
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadCode('index.html', generateMutation.data!.code!.html, 'text/html')}
                      className="w-full"
                    >
                      Download HTML
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Code className="w-4 h-4 mr-2" />
                      CSS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadCode('styles.css', generateMutation.data!.code!.css, 'text/css')}
                      className="w-full"
                    >
                      Download CSS
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Code className="w-4 h-4 mr-2" />
                      JavaScript
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadCode('script.js', generateMutation.data!.code!.js, 'text/javascript')}
                      className="w-full"
                    >
                      Download JS
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-border bg-zinc-900/50">
                <CardHeader>
                  <CardTitle className="text-sm">Deployment Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                    {generateMutation.data.code.instructions}
                  </pre>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                  Ready to Deploy
                </Badge>
                <Badge variant="outline">
                  No Vercel Needed
                </Badge>
                <Badge variant="outline">
                  Pixl Compatible
                </Badge>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}

