/**
 * Inbox² Mini-App
 * AI-powered communication copilot for intelligent email outreach
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, Sparkles, TrendingUp, MapPin, Brain, CheckCircle2 } from 'lucide-react';

interface EmailDraft {
  id: string;
  toEmail: string;
  subject: string;
  body: string;
  html?: string;
  variants?: Array<{ id: string; type: string; value: string }>;
  research?: {
    facts: Array<{ fact: string; source: string; credibility: string }>;
  };
  topics?: {
    trendingKeywords: string[];
    relevanceScore: number;
  };
  geoContext?: {
    location?: string;
    timezone?: string;
  };
  gmailDraftId?: string;
  createdAt: number;
}

interface LearningPattern {
  patternType: string;
  patternValue: string;
  successRate: number;
  sampleSize: number;
}

export function InboxSquaredMini() {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientCompany, setRecipientCompany] = useState('');
  const [tone, setTone] = useState<'casual' | 'consultative' | 'executive'>('consultative');
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<EmailDraft | null>(null);
  const [patterns, setPatterns] = useState<LearningPattern[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('generate');

  useEffect(() => {
    loadStatus();
    loadPatterns();
  }, []);

  const loadStatus = async () => {
    try {
      const res = await fetch('/api/inbox-squared/status');
      const data = await res.json();
      if (data.ok) {
        setStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };

  const loadPatterns = async () => {
    try {
      const res = await fetch('/api/inbox-squared/learning-patterns');
      const data = await res.json();
      if (data.ok) {
        setPatterns(data.patterns || []);
      }
    } catch (error) {
      console.error('Failed to load patterns:', error);
    }
  };

  const generateDraft = async () => {
    if (!recipientEmail) {
      alert('Please enter recipient email');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/inbox-squared/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail,
          recipientName: recipientName || undefined,
          recipientCompany: recipientCompany || undefined,
          options: {
            fromName: 'DreamNet Team',
            fromEmail: 'dreamnetgmo@gmail.com',
            tone,
            includeOptOut: true,
            generateVariants: true,
          },
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setDraft(data.draft);
        setActiveTab('preview');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to generate draft:', error);
      alert('Failed to generate draft');
    } finally {
      setLoading(false);
    }
  };

  const createGmailDraft = async () => {
    if (!draft) return;

    setLoading(true);
    try {
      const res = await fetch('/api/inbox-squared/create-gmail-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft }),
      });

      const data = await res.json();
      if (data.ok) {
        setDraft({ ...draft, gmailDraftId: data.gmailDraftId });
        alert('Draft created in Gmail! Check your drafts folder.');
      } else {
        alert(`Error: ${data.error || 'Failed to create Gmail draft'}`);
      }
    } catch (error) {
      console.error('Failed to create Gmail draft:', error);
      alert('Failed to create Gmail draft. Make sure Gmail API is configured.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Inbox² - AI Communication Copilot
          </CardTitle>
          <CardDescription>
            Four intelligent layers: Research, Relevance, Geo Awareness, Learning Loop
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status && (
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant={status.gmailApiConfigured ? 'default' : 'secondary'}>
                Gmail API: {status.gmailApiConfigured ? 'Configured' : 'Not Configured'}
              </Badge>
              <Badge variant="default">Research: Enabled</Badge>
              <Badge variant="default">Relevance: Enabled</Badge>
              <Badge variant="default">Geo: Enabled</Badge>
              <Badge variant="default">Learning: {status.patternsCount} patterns</Badge>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Recipient Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="investor@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="name">Recipient Name (optional)</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="company">Company (optional)</Label>
                  <Input
                    id="company"
                    placeholder="Acme Ventures"
                    value={recipientCompany}
                    onChange={(e) => setRecipientCompany(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tone">Tone</Label>
                  <select
                    id="tone"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={tone}
                    onChange={(e) => setTone(e.target.value as any)}
                  >
                    <option value="casual">Casual</option>
                    <option value="consultative">Consultative</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                <Button onClick={generateDraft} disabled={loading || !recipientEmail}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Draft
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              {draft ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <Label>Subject</Label>
                      <div className="mt-1 rounded-md border p-3 font-medium">
                        {draft.subject}
                      </div>
                    </div>

                    <div>
                      <Label>Body</Label>
                      <div className="mt-1 rounded-md border p-3 whitespace-pre-wrap text-sm">
                        {draft.body}
                      </div>
                    </div>

                    {draft.research && draft.research.facts.length > 0 && (
                      <div>
                        <Label className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Research Facts
                        </Label>
                        <div className="mt-1 space-y-2">
                          {draft.research.facts.map((fact, idx) => (
                            <div key={idx} className="rounded-md border p-2 text-sm">
                              <div className="font-medium">{fact.fact}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Source: {fact.source} ({fact.credibility})
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {draft.topics && (
                      <div>
                        <Label className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Trending Topics
                        </Label>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {draft.topics.trendingKeywords.map((keyword, idx) => (
                            <Badge key={idx} variant="secondary">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          Relevance Score: {draft.topics.relevanceScore}%
                        </div>
                      </div>
                    )}

                    {draft.geoContext && (
                      <div>
                        <Label className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Geo Context
                        </Label>
                        <div className="mt-1 text-sm">
                          {draft.geoContext.location && (
                            <div>Location: {draft.geoContext.location}</div>
                          )}
                          {draft.geoContext.timezone && (
                            <div>Timezone: {draft.geoContext.timezone}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {draft.variants && draft.variants.length > 0 && (
                      <div>
                        <Label>A/B Variants</Label>
                        <div className="mt-1 space-y-2">
                          {draft.variants.map((variant) => (
                            <div key={variant.id} className="rounded-md border p-2 text-sm">
                              <Badge variant="outline" className="mr-2">
                                {variant.type}
                              </Badge>
                              {variant.value}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={createGmailDraft} disabled={loading || !!draft.gmailDraftId}>
                      {draft.gmailDraftId ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Draft Created in Gmail
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Create Draft in Gmail
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDraft(null);
                        setActiveTab('generate');
                      }}
                    >
                      New Draft
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Generate a draft to see preview
                </div>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-4">
                  <Brain className="h-4 w-4" />
                  Learning Patterns
                </Label>
                {patterns.length > 0 ? (
                  <div className="space-y-2">
                    {patterns.map((pattern, idx) => (
                      <div key={idx} className="rounded-md border p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Badge variant="outline" className="mr-2">
                              {pattern.patternType}
                            </Badge>
                            <span className="text-sm font-medium">{pattern.patternValue}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {Math.round(pattern.successRate * 100)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {pattern.sampleSize} samples
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No learning patterns yet. Generate and track emails to build insights.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

