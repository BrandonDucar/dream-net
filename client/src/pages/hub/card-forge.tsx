/**
 * Card Forge Pro Page
 * Create and manage cards using Card Forge Pro GPT
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2, XCircle, CreditCard, Download, ExternalLink } from "lucide-react";
import { createCard, type CardCreationRequest, type CardCreationResult } from "@/api/cardForge";
import { useMutation } from "@tanstack/react-query";

export default function HubCardForge() {
  const [cardType, setCardType] = useState<CardCreationRequest['cardType']>('business');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("");
  const [colorScheme, setColorScheme] = useState("");
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState<CardCreationResult | null>(null);

  const createCardMutation = useMutation({
    mutationFn: (request: CardCreationRequest) => createCard(request),
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (error: any) => {
      setResult({ success: false, error: error.message || "An unknown error occurred." });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const request: CardCreationRequest = {
      cardType,
      title: title || undefined,
      description,
      design: {
        style: style || undefined,
        colorScheme: colorScheme || undefined,
      },
      content: {
        name: name || undefined,
        subtitle: subtitle || undefined,
        contactInfo: {
          email: email || undefined,
          phone: phone || undefined,
          website: website || undefined,
        },
        imageUrl: imageUrl || undefined,
      },
    };
    createCardMutation.mutate(request);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Card Forge Pro</h1>
        <p className="text-muted-foreground">
          Create professional cards using AI. Powered by Card Forge Pro GPT.
        </p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Create New Card</CardTitle>
          <CardDescription>Design your card with AI assistance</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="cardType">Card Type <span className="text-red-500">*</span></Label>
              <Select value={cardType} onValueChange={(value: CardCreationRequest['cardType']) => setCardType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business Card</SelectItem>
                  <SelectItem value="trading">Trading Card</SelectItem>
                  <SelectItem value="digital">Digital Card</SelectItem>
                  <SelectItem value="nft">NFT Card</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                placeholder="Describe the card you want to create..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Card title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="style">Style</Label>
                <Input
                  id="style"
                  placeholder="e.g., Modern, Classic, Minimalist"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="colorScheme">Color Scheme</Label>
                <Input
                  id="colorScheme"
                  placeholder="e.g., Blue & White, Dark Mode"
                  value={colorScheme}
                  onChange={(e) => setColorScheme(e.target.value)}
                />
              </div>
            </div>

            {(cardType === 'business' || cardType === 'custom') && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      placeholder="Job title or role"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://example.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={createCardMutation.isPending || !description}>
              {createCardMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <CreditCard className="mr-2 h-4 w-4" />
              Create Card
            </Button>
          </form>

          {result && (
            <div className="mt-6 p-4 border rounded-md">
              <h3 className="text-lg font-semibold mb-2">Creation Result:</h3>
              {result.success ? (
                <div className="space-y-2">
                  <p className="flex items-center text-green-500">
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Card created successfully!
                  </p>
                  {result.cardUrl && (
                    <div className="flex items-center space-x-2">
                      <a href={result.cardUrl} target="_blank" rel="noopener noreferrer" className="text-electric-cyan hover:underline">
                        View Card <ExternalLink className="inline-block ml-1 h-4 w-4" />
                      </a>
                    </div>
                  )}
                  {result.imageUrl && (
                    <div className="mt-4">
                      <img src={result.imageUrl} alt="Generated card" className="max-w-md rounded-lg border border-border" />
                    </div>
                  )}
                  {result.downloadUrl && (
                    <div className="flex items-center space-x-2">
                      <a href={result.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-electric-cyan hover:underline">
                        <Download className="inline-block mr-1 h-4 w-4" />
                        Download Card
                      </a>
                    </div>
                  )}
                  {result.metadata && (
                    <>
                      <p><span className="font-medium">Title:</span> {result.metadata.title}</p>
                      <p><span className="font-medium">Type:</span> {result.metadata.cardType}</p>
                      <p><span className="font-medium">Description:</span> {result.metadata.description}</p>
                    </>
                  )}
                </div>
              ) : (
                <p className="flex items-center text-red-500">
                  <XCircle className="mr-2 h-5 w-5" /> Error: {result.error}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

