import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Zap, Activity } from "lucide-react";

export default function HubClouds() {
  // Placeholder data - in production, this would come from API
  const clouds = [
    {
      id: "defi-cloud",
      name: "DeFi Cloud",
      description: "Decentralized finance integrations and protocols",
      chains: ["Base", "VeChain"],
      dreams: 23,
      status: "active",
    },
    {
      id: "vechain-lane",
      name: "VeChain Lane",
      description: "Supply chain, NFTs, and IoT integrations",
      chains: ["VeChain"],
      dreams: 12,
      status: "active",
    },
    {
      id: "base-lane",
      name: "Base Lane",
      description: "Base network integrations and protocols",
      chains: ["Base"],
      dreams: 45,
      status: "active",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">DreamClouds</h1>
        <p className="text-muted-foreground">
          Overview of all DreamCloud lanes and integrations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clouds.map((cloud) => (
          <Card key={cloud.id} className="border-border hover:border-electric-cyan/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-electric-cyan/10 text-electric-cyan">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle>{cloud.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {cloud.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                  {cloud.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{cloud.dreams} dreams</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cloud.chains.map((chain) => (
                  <Badge key={chain} variant="outline" className="text-xs">
                    {chain}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

