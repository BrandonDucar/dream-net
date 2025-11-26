import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Events & Logs</h2>
        <p className="text-muted-foreground">
          Event stream and system logs
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Events & Logs</CardTitle>
          </div>
          <CardDescription>This page will show event stream and system logs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Event stream and log viewer coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

