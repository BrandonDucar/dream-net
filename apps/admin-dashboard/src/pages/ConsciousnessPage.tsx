import { useQuery } from "@tanstack/react-query";
import { fetchConsciousness } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Eye, Zap, TrendingUp } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default function ConsciousnessPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["consciousness"],
    queryFn: fetchConsciousness,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading consciousness data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Error loading consciousness: {String(error)}</div>
      </div>
    );
  }

  if (!data) return null;

  const { attention, reasonDecisions, reflexEvents, valueTradeOffs, learning, perception } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Consciousness & Decisions</h2>
        <p className="text-muted-foreground">
          How DreamNet perceives, thinks, and decides
        </p>
      </div>

      {/* Attention Focus */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            <CardTitle>Attention Focus</CardTitle>
          </div>
          <CardDescription>
            Salience Score: {attention.salienceScore.toFixed(1)}/10
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attention.focusAreas.map((area) => (
              <div key={area.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{area.name}</span>
                  <span className="text-muted-foreground">{area.percentage}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${area.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Perception Sources */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            <CardTitle>Perception Sources</CardTitle>
          </div>
          <CardDescription>Active input channels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {perception.sources.map((source) => (
              <div
                key={source.name}
                className="flex items-center justify-between p-2 rounded border"
              >
                <div>
                  <p className="text-sm font-medium">{source.name}</p>
                  <p className="text-xs text-muted-foreground">{source.type}</p>
                </div>
                <Badge variant={(source.active ? "success" : "secondary") as "default" | "secondary" | "destructive" | "outline" | "success"}>
                  {source.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reason Decisions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <CardTitle>Recent Reason Decisions</CardTitle>
          </div>
          <CardDescription>Deliberate decisions made through the Reason Engine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reasonDecisions.map((decision) => (
              <div key={decision.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{decision.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">{decision.type}</p>
                    {decision.cursorAnalysis && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        {decision.cursorAnalysis}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={
                      (decision.status === "approved"
                        ? "success"
                        : decision.status === "rejected"
                        ? "destructive"
                        : "secondary") as "default" | "secondary" | "destructive" | "outline" | "success"
                    }
                  >
                    {decision.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {decision.values.map((v) => (
                    <Badge key={v} variant="outline">{v}</Badge>
                  ))}
                </div>
                {decision.outcome && (
                  <p className="text-sm text-muted-foreground">
                    Outcome: {decision.outcome}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(decision.timestamp)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reflex Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <CardTitle>Recent Reflex Events</CardTitle>
          </div>
          <CardDescription>Fast-path automatic responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reflexEvents.map((event) => (
              <div key={event.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.type} • Latency: {event.latency}ms
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Outcome: {event.outcome}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(event.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Value Trade-offs */}
      <Card>
        <CardHeader>
          <CardTitle>Value Trade-offs</CardTitle>
          <CardDescription>Recent decisions showing value prioritization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {valueTradeOffs.map((tradeoff) => (
              <div key={tradeoff.decisionId} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Chose: {tradeoff.chosen.value}</p>
                    <p className="text-xs text-muted-foreground">
                      Impact: {tradeoff.chosen.impact > 0 ? "+" : ""}
                      {tradeoff.chosen.impact}
                    </p>
                  </div>
                  <div className="text-muted-foreground">→</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sacrificed: {tradeoff.sacrificed.value}</p>
                    <p className="text-xs text-muted-foreground">
                      Impact: {tradeoff.sacrificed.impact}
                    </p>
                  </div>
                </div>
                {tradeoff.neutral.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <span className="text-xs text-muted-foreground">Neutral:</span>
                    {tradeoff.neutral.map((v) => (
                      <Badge key={v} variant="outline" className="text-xs">
                        {v}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patterns Learned</CardTitle>
            <CardDescription>Recently learned patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {learning.patternsLearned.map((pattern) => (
                <div key={pattern.id} className="border rounded p-2">
                  <p className="text-sm font-medium">{pattern.name}</p>
                  <p className="text-xs text-muted-foreground">{pattern.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Learned {formatRelativeTime(pattern.learnedAt)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strategies Updated</CardTitle>
            <CardDescription>Recently updated strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {learning.strategiesUpdated.map((strategy) => (
                <div key={strategy.id} className="border rounded p-2">
                  <p className="text-sm font-medium">{strategy.name}</p>
                  <p className="text-xs text-muted-foreground">{strategy.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Updated {formatRelativeTime(strategy.updatedAt)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

