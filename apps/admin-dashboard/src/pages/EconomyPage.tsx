import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";

export default function EconomyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Economy & Tokens</h2>
        <p className="text-muted-foreground">
          Economic flows and token metrics
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            <CardTitle>Economy & Tokens</CardTitle>
          </div>
          <CardDescription>This page will show economic flows and token metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Economic monitoring and token analytics coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

