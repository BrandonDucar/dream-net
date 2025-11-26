import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function OrgansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Organs & Systems</h2>
        <p className="text-muted-foreground">
          Detailed status of all organ systems
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            <CardTitle>Organ Systems</CardTitle>
          </div>
          <CardDescription>This page will show detailed organ system status</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Detailed organ system monitoring coming soon. For now, see the Overview page for organ status.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

