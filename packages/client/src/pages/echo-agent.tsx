import EchoScore from '@/components/EchoScore';
import Head from '@/components/Head';
import { Eye, Shield, Activity, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EchoAgent() {
  return (
    <>
      <Head>
        <title>ECHO Agent - Wallet Mirror | Dream Network</title>
        <meta name="description" content="ECHO Agent provides wallet behavior analysis and trust scoring for the Dream Network platform." />
        <meta property="og:title" content="ECHO Agent - Wallet Mirror | Dream Network" />
        <meta property="og:description" content="Advanced wallet analysis and trust scoring with ECHO Agent." />
        <meta property="og:type" content="website" />
      </Head>
      
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Eye className="h-8 w-8 text-purple-400" />
              <h1 className="text-3xl font-bold">ECHO Agent</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Wallet Mirror & Trust Analysis System
            </p>
          </div>

          <EchoScore />

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border bg-card/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  Trust Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-green-400 mb-2">Security Features</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Real-time wallet behavior monitoring</li>
                      <li>• Cross-chain activity analysis</li>
                      <li>• Risk assessment algorithms</li>
                      <li>• Trust score calculations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-400" />
                  Mirror Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-blue-400 mb-2">Analysis Tools</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Transaction pattern recognition</li>
                      <li>• Wallet reputation tracking</li>
                      <li>• Agent access management</li>
                      <li>• Progressive trust building</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                ECHO Agent Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-400">Wallet Mirroring</h4>
                  <p className="text-sm text-muted-foreground">
                    Creates detailed profiles of wallet behavior patterns for trust assessment.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-400">Trust Scoring</h4>
                  <p className="text-sm text-muted-foreground">
                    Calculates dynamic trust levels based on on-chain and platform activity.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-400">Access Control</h4>
                  <p className="text-sm text-muted-foreground">
                    Manages progressive access to advanced Dream Network agents and features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              ECHO Agent requires Medium trust level (50+ score) for activation.
            </p>
            <p className="mt-1">
              Complete dream submissions and positive platform interactions to increase your trust score.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}