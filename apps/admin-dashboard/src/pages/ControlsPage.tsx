import { useQuery } from "@tanstack/react-query";
import { fetchGovernance } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Shield, Lock, Gavel } from "lucide-react";

export default function ControlsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["governance"],
    queryFn: fetchGovernance,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading governance data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Error loading governance: {String(error)}</div>
      </div>
    );
  }

  if (!data) return null;

  const { divineLaws, coreValues, constraints, rights, balanceRules } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Controls & Governance</h2>
        <p className="text-muted-foreground">
          Divine Laws, Core Values, Constraints, and Rights
        </p>
      </div>

      {/* Divine Laws */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            <CardTitle>Divine Laws</CardTitle>
          </div>
          <CardDescription>
            The 8 core invariants that cannot be violated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {divineLaws.map((law) => (
              <div key={law.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{law.name}</h4>
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                      {law.statement}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">{law.meaning}</p>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    <Shield className="h-3 w-3 mr-1" />
                    Enforced
                  </Badge>
                </div>
                {law.enforcement && law.enforcement.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Enforcement:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {law.enforcement.map((e) => (
                        <Badge key={e} variant="secondary" className="text-xs">
                          {e}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {law.violationConsequences && law.violationConsequences.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Violation Consequences:
                    </p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                      {law.violationConsequences.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Core Values */}
      <Card>
        <CardHeader>
          <CardTitle>Core Values</CardTitle>
          <CardDescription>
            Fundamental values prioritized by DreamNet (sorted by priority)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {coreValues
              .sort((a, b) => a.priority - b.priority)
              .map((value) => (
                <div key={value.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{value.name}</h4>
                        <Badge variant="outline">Priority {value.priority}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {value.description}
                      </p>
                      {value.encoding && value.encoding.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Encoded in:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {value.encoding.map((e) => (
                              <Badge key={e} variant="secondary" className="text-xs">
                                {e}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Constraints */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <CardTitle>Constraints</CardTitle>
          </div>
          <CardDescription>What DreamNet cannot do</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {constraints.map((constraint) => (
              <div
                key={constraint.id}
                className="flex items-start gap-3 p-3 border rounded-lg"
              >
                <Badge
                  variant={
                    constraint.category === "forbidden"
                      ? "destructive"
                      : constraint.category === "limited"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {constraint.category}
                </Badge>
                <p className="text-sm flex-1">{constraint.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rights */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            <CardTitle>Rights</CardTitle>
          </div>
          <CardDescription>What DreamNet has the right to</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rights.map((right) => (
              <div key={right.id} className="border rounded-lg p-4">
                <h4 className="font-semibold">{right.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{right.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Balance Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Balance Rules</CardTitle>
          <CardDescription>Rules for balancing trade-offs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {balanceRules
              .sort((a, b) => a.priority - b.priority)
              .map((rule) => (
                <div key={rule.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-sm flex-1">{rule.description}</p>
                    <Badge variant="outline" className="ml-4">
                      P{rule.priority}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

