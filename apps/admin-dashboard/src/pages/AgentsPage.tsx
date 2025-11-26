import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Agents & Workforces</h2>
        <p className="text-muted-foreground">
          Agent activity and workforce management
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Agents & Workforces</CardTitle>
          </div>
          <CardDescription>This page will show agent activity and workforce status</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Agent monitoring and workforce management coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

