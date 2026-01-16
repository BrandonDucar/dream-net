import React, { useEffect } from 'react';
import { useRoute, useLocation } from "wouter";
// import Head from 'next/head'; // Removed Next.js dependency
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Link as LinkIcon, AlertTriangle } from 'lucide-react';

// Simple Head replacement for SPA (updates title, ignores meta for now as they require SSG/Helmet)
const Head = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        // Basic title update
        React.Children.forEach(children, child => {
            if (React.isValidElement(child) && child.type === 'title') {
                document.title = String(child.props.children);
            }
        });
    }, [children]);
    return null;
};

export default function OharaWrapper() {
    // Wouter replacement for Next.js router
    const [match, params] = useRoute("/miniapps/ohara/:id");
    const [_location, setLocation] = useLocation();
    const id = match ? params?.id : null;

    const [loading, setLoading] = React.useState(true);
    const [manualUrl, setManualUrl] = React.useState('');

    // Mock app data for now (since we don't have the registry import here yet likely)
    const app = { name: 'Ohara App', description: 'Sovereign App powered by DreamNet.' };

    // Determine if ID is a valid UUID (Neural Link) or a Placeholder Slug
    const isUUID = id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id.toString());

    // If user provides a manual URL, use that ID
    const handleManualLink = () => {
        if (!manualUrl) return;
        const match = manualUrl.match(/mini-apps\/([a-z0-9-]+)/i);
        if (match) {
            setLocation(`/miniapps/ohara/${match[1]}`); // Wouter navigation
        }
    };

    if (!id) return null;

    const oharaUrl = `https://ohara.ai/mini-apps/${id}`;

    return (
        <div className="min-h-screen bg-black flex flex-col text-white">
            <Head>
                <title>{app ? `${app.name} | Built on Base` : `DreamNet x Ohara | ${id}`}</title>
                {/* Meta tags are commented out as they don't work in SPA Head component without Helmet */}
                {/* <meta name="description" content={app?.description || "Sovereign App powered by DreamNet. Fully on-chain."} /> */}
            </Head>

            {/* Navigation Header */}
            <div className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900/50 backdrop-blur">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => setLocation('/miniapps')} className="hover:text-electric-cyan">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Hub
                    </Button>
                    <div className="h-4 w-px bg-gray-700" />
                    <span className="text-sm font-mono text-gray-400">ID: {id?.toString().slice(0, 12)}...</span>
                </div>

                {isUUID && (
                    <div className="flex items-center gap-2">
                        <a href={oharaUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="border-electric-cyan/20 hover:bg-electric-cyan/10">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open Original
                            </Button>
                        </a>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 relative flex flex-col">
                {isUUID ? (
                    <>
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-cyan"></div>
                                    <div className="text-electric-cyan animate-pulse">Establishing Neural Link...</div>
                                </div>
                            </div>
                        )}
                        <iframe
                            src={oharaUrl}
                            className="w-full h-full border-0 flex-1"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            onLoad={() => setLoading(false)}
                        />
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/50 to-black">
                        <Card className="max-w-md w-full border-electric-cyan/30 bg-black/80 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-electric-cyan">
                                    <AlertTriangle className="w-5 h-5" />
                                    Neural Link Required
                                </CardTitle>
                                <CardDescription>
                                    This Sovereign App is registered on DreamNet but lacks a direct neural link to its Ohara core.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md text-sm text-yellow-200">
                                    <strong>Status:</strong> Mapped & Manifested. Waiting for downlink.
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase tracking-widest">Manual Link Override</label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Paste Ohara URL (e.g. https://ohara.ai/mini-apps/...)"
                                            className="bg-gray-900 border-gray-700 font-mono text-xs"
                                            value={manualUrl}
                                            onChange={(e) => setManualUrl(e.target.value)}
                                        />
                                        <Button size="sm" onClick={handleManualLink} disabled={!manualUrl}>
                                            <LinkIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-gray-500">
                                        This will locally patch the connection for this session.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
