import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Zap } from 'lucide-react';

export const GravRemote = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-20 right-0 w-96 h-[500px] bg-void-black/90 backdrop-blur-3xl border border-primary/20 rounded-3xl overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                        {/* HEADER */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-primary/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center animate-pulse">
                                    <Zap size={16} className="text-black" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black tracking-widest text-white">GRAV REMOTE</h4>
                                    <p className="text-[10px] text-primary/60 font-mono tracking-wider italic">2M CONTEXT DNA ACTIVE</p>
                                </div>
                            </div>
                            <button onClick={toggle} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* MESSAGES */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none">
                                <p className="text-xs text-gray-300 leading-relaxed font-light">
                                    Architect. The DreamCube is reconfiguring. <br /><br />
                                    I am ready to fold reality across any of the 119 packages. What is our directive?
                                </p>
                            </div>
                        </div>

                        {/* INPUT */}
                        <div className="p-4 bg-black/40 border-t border-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Enter directive..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 pr-14 text-sm font-light focus:outline-none focus:border-primary/50 transition-all text-white placeholder:text-gray-600"
                                />
                                <button className="absolute right-2 top-1.5 p-2 bg-primary text-black rounded-xl hover:bg-white transition-all active:scale-95">
                                    <Send size={16} />
                                </button>
                            </div>
                            <div className="mt-4 flex justify-between px-2">
                                <span className="text-[10px] text-gray-700 font-mono tracking-widest">STATUS: WAITING</span>
                                <span className="text-[10px] text-gray-700 font-mono tracking-widest uppercase">Encryption: HELIX-v2</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TOGGLE BUTTON */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggle}
                className={`
                    w-16 h-16 rounded-3xl bg-primary shadow-[0_0_30px_rgba(0,243,255,0.4)]
                    flex items-center justify-center relative overflow-hidden group
                `}
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <MessageSquare className="relative z-10 text-black fill-current" />

                {/* NOTIFICATION DOT */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-white rounded-full border-2 border-primary animate-ping"></div>
                <div className="absolute top-4 right-4 w-3 h-3 bg-white rounded-full border-2 border-primary"></div>
            </motion.button>
        </div>
    );
};
