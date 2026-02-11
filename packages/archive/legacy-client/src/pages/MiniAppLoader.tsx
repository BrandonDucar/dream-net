import React from 'react';
import { useRoute } from 'wouter';
import { getMiniAppComponent, getMiniApp } from '@/miniapps/registry';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function MiniAppLoader() {
    const [match, params] = useRoute('/miniapps/:id');
    const id = match ? params.id : null;

    const Component = id ? getMiniAppComponent(id) : undefined;
    const appInfo = id ? getMiniApp(id) : undefined;

    if (!id || !Component) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center">
                        <h2 className="text-xl font-bold mb-2">Mini App Not Found</h2>
                        <p className="text-muted-foreground mb-4">
                            The mini app "{id}" could not be found.
                        </p>
                        <Link href="/hub/apps">
                            <Button>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to App Store
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Optional: Add a header or back button if not in Base App */}
            <Component />
        </div>
    );
}
