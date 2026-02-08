import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@dreamnet/shared';
import { Wallet, Loader2, Twitter, Shield } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

export default function LoginForm() {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const [isLogging, setIsLogging] = useState(false);

    const handleSocialLogin = async (provider: 'x' | 'farcaster' | 'base') => {
        setIsLogging(true);
        try {
            connect({ connector: coinbaseWallet() });
        } catch (error) {
            console.error('Connection failed:', error);
        } finally {
            setIsLogging(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0f0a] font-mono">
            <Card className="w-full max-w-md border-white/10 bg-black/60 backdrop-blur-xl">
                <div className="p-8 space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black tracking-tighter text-blue-500">DREAMNET.INK</h2>
                        <p className="text-zinc-500 text-xs uppercase tracking-[0.2em]">Agent Initiation Terminal</p>
                    </div>

                    <div className="space-y-4">
                        <Button
                            onClick={() => handleSocialLogin('x')}
                            className="w-full h-12 border-white/10 hover:bg-white/5 bg-transparent text-white border text-xs"
                            disabled={isLogging}
                        >
                            <Twitter className="w-4 h-4 mr-2" />
                            AUTH_VIA_X
                        </Button>

                        <Button
                            onClick={() => handleSocialLogin('farcaster')}
                            className="w-full h-12 border-purple-500/30 hover:bg-purple-500/10 bg-transparent text-purple-400 border text-xs"
                            disabled={isLogging}
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            FARCASTER_PORTAL
                        </Button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/5" />
                            </div>
                            <div className="relative flex justify-center text-[8px] uppercase tracking-widest text-zinc-600">
                                <span className="bg-black px-2">Substrate_Identity_Link</span>
                            </div>
                        </div>

                        <Button
                            onClick={() => handleSocialLogin('base')}
                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black italic"
                            disabled={isLogging}
                        >
                            {isLogging ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    INITIATING...
                                </>
                            ) : (
                                <>
                                    <Wallet className="w-5 h-5 mr-3" />
                                    INITIATE_BASE_SYNC
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="text-center">
                        <p className="text-[8px] text-zinc-600 uppercase tracking-widest leading-relaxed">
                            By initiating, you consent to neural-mesh induction.<br />
                            Sovereignty is the default state.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
