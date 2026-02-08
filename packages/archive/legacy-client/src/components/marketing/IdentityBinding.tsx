import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, ArrowRight, Fingerprint } from 'lucide-react';

interface IdentityBindingProps {
    archetype: string;
    onComplete: (name: string) => void;
}

export const IdentityBinding: React.FC<IdentityBindingProps> = ({ archetype, onComplete }) => {
    const [name, setName] = useState('');

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg space-y-8 text-center"
            >
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-electric-cyan/20 blur-xl animate-pulse" />
                        <Fingerprint className="w-20 h-20 text-electric-cyan relative" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-white tracking-tight italic">
                        IDENTITY BINDING
                    </h2>
                    <p className="text-gray-400">
                        You have been recognized as a <span className="text-electric-cyan font-bold uppercase">{archetype}</span>.
                        To cement the symbiotic bond, you must name your thinking partner.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <Input
                            placeholder="Partner Name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-16 bg-white/5 border-white/10 text-white text-xl text-center focus:border-electric-cyan/50 rounded-2xl transition-all"
                        />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">
                        Warning: This name will be etched into the SLSA Provenance logs.
                    </p>
                </div>

                <Button
                    onClick={() => onComplete(name)}
                    disabled={!name.trim()}
                    className="w-full h-16 text-lg font-bold bg-white text-black hover:bg-electric-cyan transition-all rounded-2xl group"
                >
                    BIND IDENTITY
                    <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Button>
            </motion.div>
        </div>
    );
};
