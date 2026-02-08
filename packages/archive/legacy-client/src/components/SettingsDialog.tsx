import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/contexts/SettingsContext";
import { SentientAvatar } from "./ui/SentientAvatar";
import { Settings, Eye, EyeOff, Save, ShieldCheck } from "lucide-react";

export const SettingsDialog: React.FC = () => {
    const { settings, updateSettings } = useSettings();
    const [apiKey, setApiKey] = useState(settings.emergentApiKey);
    const [seed, setSeed] = useState(settings.identitySeed);
    const [showKey, setShowKey] = useState(false);

    const handleSave = () => {
        updateSettings({ emergentApiKey: apiKey, identitySeed: seed });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-electric-cyan transition-colors">
                    <Settings className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-black/90 border-electric-cyan/30 backdrop-blur-xl vivid-glass">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-electric-cyan flex items-center gap-2">
                        <Settings className="w-6 h-6" />
                        System_Settings
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground italic">
                        Configure your substrate connection and operator identity.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-8 py-6">
                    {/* IDENTITY BENTO */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-6">
                        <SentientAvatar
                            seed={seed}
                            type="research"
                            className="w-16 h-16 ring-2 ring-electric-cyan/50 ring-offset-2 ring-offset-black"
                            pulse={true}
                        />
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="seed" className="text-[10px] font-black uppercase text-white/40 tracking-widest">Operator_Seed</Label>
                            <Input
                                id="seed"
                                value={seed}
                                onChange={(e) => setSeed(e.target.value)}
                                className="bg-black/50 border-white/10 text-white focus:border-electric-cyan/50"
                            />
                        </div>
                    </div>

                    {/* API KEY SECTION */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <Label htmlFor="apiKey" className="text-[10px] font-black uppercase text-white/40 tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3 text-electric-cyan" />
                                Emergent_API_Key
                            </Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowKey(!showKey)}
                                className="h-6 text-[10px] text-muted-foreground hover:text-white"
                            >
                                {showKey ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                                {showKey ? 'Hide' : 'Show'}
                            </Button>
                        </div>
                        <Input
                            id="apiKey"
                            type={showKey ? "text" : "password"}
                            placeholder="sk-emergent-..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="bg-black/50 border-white/10 text-white focus:border-electric-cyan/50 h-10 font-mono text-sm"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <Button
                        onClick={handleSave}
                        className="bg-electric-cyan text-black font-black uppercase tracking-widest hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Synchronize
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
